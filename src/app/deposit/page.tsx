"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Copy, CheckCircle2, XCircle, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { BOT_WALLET, PLANS } from "@/lib/constants";

// Status types for the UI state machine
type VerifyStatus = "idle" | "verifying" | "success" | "failed" | "retry";

export default function DepositPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[2]); // Gold default
  const [txid, setTxid] = useState("");
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [investmentResult, setInvestmentResult] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  const copyWallet = () => {
    navigator.clipboard.writeText(BOT_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async (isRetry = false) => {
    if (!txid.trim()) {
      setStatusMsg("Por favor ingresa el TXID de tu transacción.");
      return;
    }

    // Basic format check before hitting the API
    if (!/^[a-fA-F0-9]{64}$/.test(txid.trim())) {
      setStatus("failed");
      setStatusMsg("TXID inválido. Debe ser 64 caracteres hexadecimales. Verifica que lo copiaste completo.");
      return;
    }

    setStatus("verifying");
    setStatusMsg(isRetry ? "Reintentando verificación..." : "Conectando con la blockchain...");
    if (isRetry) setRetryCount(c => c + 1);

    try {
      const res = await fetch("/api/deposits/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txid: txid.trim(),
          user_id: user?.id,
          telegram_id: user?.telegram_id,
          plan_key: selectedPlan.key,
          amount: selectedPlan.investment,
        }),
      });

      const data = await res.json();

      if (data.verified) {
        setStatus("success");
        setInvestmentResult(data.investment);
        setStatusMsg("¡Transacción verificada en blockchain!");
      } else {
        setStatus("failed");
        setStatusMsg(data.error || "Verificación fallida. Verifica tu TXID e intenta de nuevo.");
      }
    } catch {
      setStatus("failed");
      setStatusMsg("Error de conexión. Por favor intenta de nuevo.");
    }
  };

  if (status === "success" && investmentResult) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-12 text-center max-w-md w-full space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-profit/10 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-10 h-10 text-profit" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase italic text-profit">¡Inversión Activa!</h2>
            <p className="text-muted text-sm mt-2">Tu depósito fue verificado automáticamente en la blockchain.</p>
          </div>

          <div className="bg-black/40 rounded-2xl p-6 space-y-3 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-muted">Plan</span>
              <span className="font-bold text-gold">{investmentResult.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Invertido</span>
              <span className="font-bold">{investmentResult.amount} USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Ganancia</span>
              <span className="font-bold text-profit">+{investmentResult.profit} USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Pago en</span>
              <span className="font-bold">24 horas</span>
            </div>
          </div>

          <p className="text-xs text-muted">Has recibido una confirmación en Telegram. 📱</p>

          <button onClick={() => router.push("/dashboard")} className="btn-gold w-full">
            Ver mi Panel →
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-16">
      <div className="max-w-2xl mx-auto px-6 space-y-6">

        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Realizar Depósito</h1>
          <p className="text-muted text-sm mt-1">Verificación automática en blockchain · Sin aprobación manual.</p>
        </motion.div>

        {/* Step 1: Plan selection */}
        <div className="card p-6 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">PASO 1 · Selecciona tu Plan</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PLANS.map((plan) => (
              <button
                key={plan.key}
                onClick={() => { setSelectedPlan(plan); setStatus("idle"); setStatusMsg(""); }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedPlan.key === plan.key
                    ? "border-yellow-400/50 bg-yellow-400/10"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: plan.accent }}>
                  {plan.name}
                </div>
                <div className="text-xl font-black text-white mt-1">${plan.investment}</div>
                <div className="text-[9px] text-muted">→ +${plan.profit} USDT</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Wallet */}
        <div className="card p-6 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">PASO 2 · Enviar USDT (TRC20)</h2>
          <p className="text-sm text-muted">
            Envía exactamente{" "}
            <span className="text-white font-black">{selectedPlan.investment} USDT</span> a:
          </p>

          <button
            onClick={copyWallet}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-white/20 transition-colors group"
          >
            <code className="text-[11px] text-profit font-mono break-all text-left">{BOT_WALLET}</code>
            <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
              {copied ? <CheckCircle2 className="w-4 h-4 text-profit" /> : <Copy className="w-4 h-4 text-muted" />}
            </div>
          </button>

          <div className="flex items-start gap-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-400/80">
              Usar <strong>exclusivamente la red TRON (TRC20)</strong>. Cualquier otra red resultará en pérdida de fondos sin posibilidad de recuperación.
            </p>
          </div>
        </div>

        {/* Step 3: TXID + Auto Verify */}
        <div className="card p-6 space-y-5">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">PASO 3 · Pegar TXID y Verificar</h2>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">
              Hash de la Transacción (TXID)
            </label>
            <input
              type="text"
              value={txid}
              onChange={(e) => { setTxid(e.target.value); setStatus("idle"); setStatusMsg(""); }}
              placeholder="Ej: a1b2c3d4e5f6...  (64 caracteres)"
              disabled={status === "verifying"}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:text-muted focus:outline-none focus:border-yellow-400/40 transition-colors disabled:opacity-50"
            />
            <p className="text-[10px] text-muted">
              {txid.trim().length > 0 && `${txid.trim().length}/64 caracteres`}
            </p>
          </div>

          {/* Verification status feedback */}
          <AnimatePresence mode="wait">
            {status === "verifying" && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4"
              >
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
                <div>
                  <p className="text-xs font-bold text-blue-400">Verificando en blockchain...</p>
                  <p className="text-[10px] text-muted mt-0.5">{statusMsg}</p>
                </div>
              </motion.div>
            )}

            {status === "failed" && (
              <motion.div
                key="failed"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-3"
              >
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-red-400">Verificación fallida</p>
                    <p className="text-[10px] text-muted mt-1">{statusMsg}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleVerify(true)}
                  className="w-full btn-ghost text-center"
                >
                  🔄 Reintentar Verificación {retryCount > 0 ? `(${retryCount})` : ""}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {status !== "verifying" && status !== "failed" && (
            <button
              onClick={() => handleVerify(false)}
              disabled={!txid.trim()}
              className="btn-gold w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🔍 Verificar en Blockchain →
            </button>
          )}
        </div>

        {/* How verification works */}
        <div className="card p-6 space-y-4 bg-white/[0.01]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">¿Cómo funciona la verificación?</h3>
          <div className="space-y-3">
            {[
              { n: "1", t: "Ingresa tu TXID", d: "El hash de transacción de tu wallet (64 caracteres)." },
              { n: "2", t: "Verificación blockchain", d: "Consultamos TronScan para confirmar la transacción." },
              { n: "3", t: "Validación automática", d: "Verificamos monto, dirección y confirmaciones." },
              { n: "4", t: "Inversión activa", d: "Tu plan se activa instantáneamente y recibes notificación en Telegram." },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-400/10 flex items-center justify-center text-gold text-[10px] font-black shrink-0">
                  {step.n}
                </div>
                <div>
                  <p className="text-xs font-bold">{step.t}</p>
                  <p className="text-[10px] text-muted">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
