import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { amount, wallet, mode } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Monto inválido." }, { status: 400 });
    }

    // Fetch DB user record
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .or(`supabase_id.eq.${authUser.id},email.eq.${authUser.email}`)
      .single();

    if (!userData) {
      return NextResponse.json({ error: "Usuario no encontrado en base de datos." }, { status: 404 });
    }

    const { data: withdrawal, error } = await supabase
      .from("withdrawals")
      .insert({
        user_id: userData.id,
        amount,
        wallet: wallet || "REINVESTMENT",
        status: "pending",
      })
      .select()
      .single();

    if (error) {
       console.error("Withdrawal insert error:", error);
      return NextResponse.json({ error: "Error al registrar solicitud." }, { status: 500 });
    }

    return NextResponse.json({ withdrawal });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("withdrawals")
    .select("*, users(telegram_id, username, first_name)")
    .order("created_at", { ascending: false });

  return NextResponse.json({ withdrawals: data });
}
