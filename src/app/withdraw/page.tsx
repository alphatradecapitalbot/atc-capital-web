"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ArrowDownRight, RefreshCw } from "lucide-react";

export default function WithdrawPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"withdraw" | "reinvest">("withdraw");
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError("Ingresa un monto válido."); return; }
    if (mode === "withdraw" && !wallet) { setError("Ingresa tu dirección de wallet USDT (TRC20)."); return; }
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user?.id, amount: amt, wallet: mode === "reinvest" ? "REINVESTMENT" : wallet, mode }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); } else { setDone(true); }
    } catch { setError("Error al enviar solicitud."); }
    setSubmitting(false);
  };

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-24">
        <div className="card p-12 text-center max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-profit/10 flex items-center justify-center mx-auto">
            <ArrowDownRight className="w-8 h-8 text-profit" />
          </div>
          <h2 className="text-2xl font-black uppercase italic text-profit">¡Solicitud Enviada!</h2>
          <p className="text-muted">El administrador procesará tu {mode === "reinvest" ? "reinversión" : "retiro"} y recibirás una confirmación en Telegram.</p>
          <button onClick={() => router.push("/dashboard")} className="btn-gold w-full">Ir al Panel</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-16">
      <div className="max-w-xl mx-auto px-6 space-y-8">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Retiro / Reinversión</h1>
          <p className="text-muted text-sm mt-1">Balance disponible: <span className="text-profit font-bold">{user?.balance?.toFixed(2) || "0.00"} USDT</span></p>
        </motion.div>

        {/* Mode Toggle */}
        <div className="card p-2 flex gap-2">
          {[
            { key: "withdraw", label: "Retirar", icon: ArrowDownRight },
            { key: "reinvest", label: "Reinvertir", icon: RefreshCw },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key as any)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${mode === m.key ? "bg-gold text-black" : "text-muted hover:text-white"}`}
            >
              <m.icon className="w-3.5 h-3.5" />
              {m.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Monto (USDT)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="1"
              max={user?.balance}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-2xl font-black text-white placeholder:text-muted focus:outline-none focus:border-yellow-400/40 transition-colors"
            />
          </div>

          {mode === "withdraw" && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Tu Wallet USDT (TRC20)</label>
              <input
                type="text"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="T..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:text-muted focus:outline-none focus:border-yellow-400/40 transition-colors"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-xs font-bold">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-gold w-full">
            {submitting ? "Enviando..." : mode === "reinvest" ? "Solicitar Reinversión →" : "Solicitar Retiro →"}
          </button>
        </form>

        <p className="text-center text-muted text-xs">Las solicitudes son procesadas por el administrador en menos de 24 horas.</p>
      </div>
    </main>
  );
}
