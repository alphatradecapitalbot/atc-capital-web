import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { user_id, amount, wallet, mode } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Monto inválido." }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: withdrawal, error } = await supabase
      .from("withdrawals")
      .insert({
        user_id,
        amount,
        wallet: wallet || "REINVESTMENT",
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Error al registrar solicitud." }, { status: 500 });
    }

    return NextResponse.json({ withdrawal });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("withdrawals")
    .select("*, users(telegram_id, username, first_name)")
    .order("created_at", { ascending: false });

  return NextResponse.json({ withdrawals: data });
}
