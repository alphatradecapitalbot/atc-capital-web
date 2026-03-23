import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { type, id, action } = await req.json();
    // type = 'deposit' | 'withdrawal'
    // action = 'approve' | 'reject'

    const supabase = createServiceClient();
    const status = action === "approve" ? "approved" : "rejected";

    if (type === "deposit") {
      // Update deposit status
      const { data: deposit, error } = await supabase
        .from("deposits")
        .update({ status })
        .eq("id", id)
        .select("*, users(telegram_id, first_name)")
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      // If approved, send Telegram notification
      if (action === "approve" && deposit?.users?.telegram_id) {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = deposit.users.telegram_id;
        const name = deposit.users.first_name || "Usuario";
        const msg = `✅ *¡Inversión Aprobada!*\n\nHola ${name}, tu depósito de *${deposit.amount} USDT* ha sido verificado y tu inversión está activa.\n\n⏱️ Recibirás tus ganancias en 24 horas.\n\n💰 *AlphaTrade Capital*`;

        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "Markdown" }),
        });
      }

      return NextResponse.json({ success: true, deposit });
    }

    if (type === "withdrawal") {
      const { data: withdrawal, error } = await supabase
        .from("withdrawals")
        .update({ status: action === "approve" ? "paid" : "rejected" })
        .eq("id", id)
        .select("*, users(telegram_id, first_name)")
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      if (action === "approve" && withdrawal?.users?.telegram_id) {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = withdrawal.users.telegram_id;
        const msg = `💸 *¡Retiro Procesado!*\n\nHola, tu solicitud de retiro de *${withdrawal.amount} USDT* ha sido aprobada y enviada a tu wallet.\n\n💰 *AlphaTrade Capital*`;
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "Markdown" }),
        });
      }

      return NextResponse.json({ success: true, withdrawal });
    }

    return NextResponse.json({ error: "Tipo inválido." }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
