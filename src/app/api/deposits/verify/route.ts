import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { verifyTRC20Transaction, isValidTxid } from "@/lib/verifyTRC20";
import { PLANS } from "@/lib/constants";

const BOT_WALLET = process.env.NEXT_PUBLIC_BOT_WALLET!;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

async function sendTelegramMessage(chatId: string, text: string) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
  } catch (e) {
    console.error("Telegram send error:", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { txid, user_id, telegram_id, plan_key, amount } = await req.json();

    // 1. Basic validations
    if (!txid || !isValidTxid(txid)) {
      return NextResponse.json({ error: "Formato de TXID inválido (debe ser 64 caracteres hexadecimales)." }, { status: 400 });
    }

    const plan = PLANS.find(p => p.key === plan_key);
    if (!plan) {
      return NextResponse.json({ error: "Plan de inversión inválido." }, { status: 400 });
    }

    const expectedAmount = amount || plan.investment;
    const supabase = await createClient();

    // 2. Check duplicate TXID
    const { data: existingDeposit } = await supabase
      .from("deposits")
      .select("id, status")
      .eq("txid", txid.trim())
      .single();

    if (existingDeposit) {
      if (existingDeposit.status === "approved") {
        return NextResponse.json({ error: "Este TXID ya fue usado y está aprobado." }, { status: 400 });
      }
      // If pending, we can re-verify it
    }

    // 3. Log pending deposit (if not already logged)
    let depositId = existingDeposit?.id;
    if (!depositId) {
      const { data: newDeposit, error: depositError } = await supabase
        .from("deposits")
        .insert({
          user_id,
          amount: expectedAmount,
          txid: txid.trim(),
          status: "pending",
        })
        .select()
        .single();

      if (depositError) {
        console.error("Deposit insert error:", depositError);
        return NextResponse.json({ error: "Error al registrar depósito." }, { status: 500 });
      }
      depositId = newDeposit.id;
    }

    // 4. Verify on blockchain (TronScan API, with 3 retries)
    const verification = await verifyTRC20Transaction(txid.trim(), expectedAmount, BOT_WALLET, 3);

    if (!verification.success) {
      // Log failed attempt but keep deposit as pending for retry
      console.log(`[VERIFY FAIL] txid=${txid} reason=${verification.error}`);
      return NextResponse.json({ 
        verified: false, 
        error: verification.error 
      }, { status: 200 });
    }

    // 5. All good — activate investment automatically
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Run all DB updates in a batch
    const [depositUpdate, investmentInsert] = await Promise.all([
      // Mark deposit approved
      supabase
        .from("deposits")
        .update({ status: "approved" })
        .eq("id", depositId),

      // Create investment record
      supabase
        .from("investments")
        .insert({
          user_id,
          plan: plan.name,
          amount: verification.txData!.amount,
          profit: plan.profit,
          status: "active",
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single(),
    ]);

    // Increment total_invested separately
    const { error: rpcError } = await supabase.rpc("increment_user_stats", {
      p_user_id: user_id,
      p_invested: verification.txData!.amount,
    });

    if (rpcError) {
      console.error("RPC Error:", rpcError);
      // Fallback if RPC doesn't exist: manual update
      const { data } = await supabase
        .from("users")
        .select("total_invested")
        .eq("id", user_id)
        .single();
        
      await supabase
        .from("users")
        .update({ total_invested: (data?.total_invested || 0) + verification.txData!.amount })
        .eq("id", user_id);
    }

    // 6. Send Telegram notification
    if (telegram_id) {
      const msg = 
        `✅ *¡Depósito Verificado Automáticamente!*\n\n` +
        `🔗 Transacción confirmada en blockchain.\n\n` +
        `💰 *Monto:* ${verification.txData!.amount} USDT\n` +
        `📈 *Plan:* ${plan.name}\n` +
        `💵 *Ganancia esperada:* +${plan.profit} USDT\n` +
        `⏱️ *Pago:* en 24 horas\n\n` +
        `_Tu inversión está activa y generando rendimientos._\n\n` +
        `🤖 *AlphaTrade Capital*`;

      await sendTelegramMessage(telegram_id.toString(), msg);
    }

    console.log(`[VERIFY OK] txid=${txid} amount=${verification.txData!.amount} user=${user_id}`);

    return NextResponse.json({
      verified: true,
      deposit: { id: depositId, status: "approved" },
      investment: {
        plan: plan.name,
        amount: verification.txData!.amount,
        profit: plan.profit,
        expires_at: expiresAt.toISOString(),
      },
    });

  } catch (e: any) {
    console.error("[VERIFY ERROR]", e);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
