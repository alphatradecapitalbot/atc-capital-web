import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { user_id, telegram_id, amount, txid, plan } = await req.json();

    if (!txid || txid.length < 10) {
      return NextResponse.json({ error: "TXID inválido." }, { status: 400 });
    }

    const supabase = createServiceClient();

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
        user_id,
        amount,
        txid,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Error al registrar depósito." }, { status: 500 });
    }

    return NextResponse.json({ deposit });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("deposits")
    .select("*, users(telegram_id, username, first_name)")
    .order("created_at", { ascending: false });

  return NextResponse.json({ deposits: data });
}
