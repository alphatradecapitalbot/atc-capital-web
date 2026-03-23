import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// This endpoint runs the payout engine for all matured 24h investments
// Call it from a cron job (e.g., Vercel Cron, GitHub Actions, or cron-job.org)
// Protect with CRON_SECRET to prevent unauthorized calls

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();

    // Find all active investments that have expired
    const { data: matured } = await supabase
      .from("investments")
      .select("*, users(telegram_id, first_name)")
      .eq("status", "active")
      .lte("expires_at", new Date().toISOString());

    if (!matured || matured.length === 0) {
      return NextResponse.json({ processed: 0, message: "No matured investments." });
    }

    let processed = 0;
    const token = process.env.TELEGRAM_BOT_TOKEN!;

    for (const inv of matured) {
      const payout = inv.amount + inv.profit;

      // Credit balance
      const { error } = await supabase.rpc("increment_user_balance", {
        p_user_id: inv.user_id,
        p_amount: payout,
      });

      // Fallback: direct update
      if (error) {
        const { data: u } = await supabase.from("users").select("balance").eq("id", inv.user_id).single();
        await supabase.from("users").update({ balance: (u?.balance || 0) + payout }).eq("id", inv.user_id);
      }

      // Mark completed
      await supabase.from("investments").update({ status: "completed" }).eq("id", inv.id);

      // Notify via Telegram
      const tgId = inv.users?.telegram_id;
      if (tgId) {
        const msg =
          `🎉 *¡Pago Recibido!*\n\n` +
          `Tu inversión ha completado el ciclo de 24 horas.\n\n` +
          `💰 *Capital:* ${inv.amount} USDT\n` +
          `📈 *Ganancia:* +${inv.profit} USDT\n` +
          `💵 *Total acreditado:* ${payout} USDT\n\n` +
          `_Los fondos están disponibles en tu balance._\n\n` +
          `🔄 ¿Deseas reinvertir? Visita la plataforma.\n\n` +
          `🤖 *AlphaTrade Capital*`;

        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: tgId, text: msg, parse_mode: "Markdown" }),
        });
      }

      processed++;
    }

    return NextResponse.json({ processed, message: `Procesadas ${processed} inversiones maturas.` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
