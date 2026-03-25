"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ArrowDownRight, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

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
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError("Please enter a valid amount."); return; }
    if (mode === "withdraw" && !wallet.trim()) { setError("Please enter your USDT (TRC20) wallet address."); return; }
    if (amt > (user?.balance || 0)) { setError("Insufficient balance."); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user?.id, amount: amt, wallet: mode === "reinvest" ? "REINVESTMENT" : wallet, mode }),
      });
      const data = await res.json();
      if (data.error) setError(data.error); else setDone(true);
    } catch { setError("Network error. Please try again."); }
    setSubmitting(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (done) {
    return (
      <DashboardLayout>
        <div className="min-h-[80vh] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#12121A] border border-profit/20 rounded-3xl p-12 text-center max-w-md w-full space-y-6 shadow-[0_0_50px_rgba(0,255,136,0.08)]">
            <div className="w-20 h-20 rounded-full bg-profit/10 border border-profit/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-profit" />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-profit">Request Sent!</h2>
              <p className="text-muted text-sm mt-2">The admin will process your {mode === "reinvest" ? "reinvestment" : "withdrawal"} within 24 hours. Check Telegram for confirmation.</p>
            </div>
            <button onClick={() => router.push("/dashboard")} className="w-full py-4 bg-gold text-black rounded-2xl font-black uppercase tracking-widest">
              Back to Dashboard →
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black uppercase tracking-tighter">Withdraw / Reinvest</h1>
          <p className="text-muted text-sm mt-1">
            Available: <span className="text-profit font-black">${user.balance?.toFixed(2) || "0.00"} USDT</span>
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-[#12121A] border border-white/5 rounded-2xl p-1.5 flex gap-2">
          {[
            { key: "withdraw", label: "Withdraw", icon: ArrowDownRight },
            { key: "reinvest", label: "Reinvest", icon: RefreshCw },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key as "withdraw" | "reinvest")}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                mode === m.key
                  ? "bg-gold text-black shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                  : "text-muted hover:text-white"
              }`}
            >
              <m.icon className="w-3.5 h-3.5" />
              {m.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#12121A] border border-white/5 rounded-2xl p-6 space-y-6">
          {/* Amount */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">Amount (USDT)</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="1"
                max={user.balance}
                className="w-full bg-black/30 border border-white/10 focus:border-gold/40 rounded-2xl px-5 py-5 text-3xl font-black text-white placeholder:text-muted/30 focus:outline-none transition-colors"
              />
              <button type="button" onClick={() => setAmount(String(user.balance?.toFixed(2) || "0"))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gold uppercase tracking-widest border border-gold/20 px-2 py-1 rounded-lg hover:bg-gold/10 transition-all">
                MAX
              </button>
            </div>
            {user.balance && amount && parseFloat(amount) > user.balance && (
              <p className="text-red-400 text-xs font-bold">⚠ Exceeds available balance</p>
            )}
          </div>

          {/* Wallet Address (only for withdraw) */}
          <AnimatePresence>
            {mode === "withdraw" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">Your USDT Wallet (TRC20)</label>
                <input
                  type="text"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="T... (TRON address)"
                  className="w-full bg-black/30 border border-white/10 focus:border-gold/40 rounded-2xl px-5 py-4 text-sm font-mono text-white placeholder:text-muted/50 focus:outline-none transition-colors"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-xs text-red-400 font-bold bg-red-400/5 border border-red-400/20 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-5 bg-gold hover:bg-yellow-300 disabled:opacity-50 text-black rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]"
          >
            {submitting ? "Submitting..." : mode === "reinvest" ? "Submit Reinvestment →" : "Submit Withdrawal →"}
          </button>
        </form>

        <p className="text-center text-muted text-xs">Requests are processed by the admin within 24 hours.</p>
      </div>
    </DashboardLayout>
  );
}
