import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { amount, txid, plan } = await req.json();

    if (!txid || txid.length < 10) {
      return NextResponse.json({ error: "TXID inválido." }, { status: 400 });
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

    // Check for duplicate TXID
    const { data: existing } = await supabase
      .from("deposits")
      .select("id")
      .eq("txid", txid)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Este TXID ya fue registrado." }, { status: 400 });
    }

    // Insert deposit — status: pending
    const { data: deposit, error } = await supabase
      .from("deposits")
      .insert({
        user_id: userData.id,
        amount,
        txid,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
       console.error("Deposit insert error:", error);
      return NextResponse.json({ error: "Error al registrar depósito." }, { status: 500 });
    }

    return NextResponse.json({ deposit });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("deposits")
    .select("*, users(telegram_id, username, first_name)")
    .order("created_at", { ascending: false });

  return NextResponse.json({ deposits: data });
}
