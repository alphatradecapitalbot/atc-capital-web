"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Copy, CheckCircle2, XCircle, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { BOT_WALLET, PLANS } from "@/lib/constants";
import DashboardLayout from "@/components/DashboardLayout";

type VerifyStatus = "idle" | "verifying" | "success" | "failed";

export default function DepositPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[2]);
  const [txid, setTxid] = useState("");
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [investmentResult, setInvestmentResult] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const copyWallet = () => {
    navigator.clipboard.writeText(BOT_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleVerify = async (isRetry = false) => {
    if (!txid.trim()) { setStatusMsg("Please enter your transaction TXID."); return; }
    if (!/^[a-fA-F0-9]{64}$/.test(txid.trim())) {
      setStatus("failed");
      setStatusMsg("Invalid TXID. Must be exactly 64 hex characters.");
      return;
    }
    setStatus("verifying");
    setStatusMsg(isRetry ? "Retrying verification..." : "Connecting to blockchain...");
    if (isRetry) setRetryCount(c => c + 1);
    try {
      const res = await fetch("/api/deposits/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txid: txid.trim(), user_id: user?.id, telegram_id: user?.telegram_id, plan_key: selectedPlan.key, amount: selectedPlan.investment }),
      });
      const data = await res.json();
      if (data.verified) {
        setStatus("success");
        setInvestmentResult(data.investment);
        setStatusMsg("Transaction verified on blockchain!");
      } else {
        setStatus("failed");
        setStatusMsg(data.error || "Verification failed. Check your TXID.");
      }
    } catch {
      setStatus("failed");
      setStatusMsg("Network error. Please try again.");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "success" && investmentResult) {
    return (
      <DashboardLayout>
        <div className="min-h-[80vh] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#12121A] border border-profit/20 rounded-3xl p-12 text-center max-w-md w-full space-y-6 shadow-[0_0_50px_rgba(0,255,136,0.08)]">
            <div className="w-20 h-20 rounded-full bg-profit/10 border border-profit/20 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-10 h-10 text-profit" />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-profit">Investment Active!</h2>
              <p className="text-muted text-sm mt-2">Your deposit was verified automatically on the blockchain.</p>
            </div>
            <div className="bg-black/40 rounded-2xl p-6 space-y-4 text-sm text-left border border-white/5">
              {[["Plan", investmentResult.plan], ["Invested", `${investmentResult.amount} USDT`], ["Profit", `+${investmentResult.profit} USDT`], ["Pays in", "24 hours"]].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted">{k}</span>
                  <span className={`font-black ${k === "Profit" ? "text-profit" : k === "Plan" ? "text-gold" : "text-white"}`}>{v}</span>
                </div>
              ))}
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
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black uppercase tracking-tighter">Make a Deposit</h1>
          <p className="text-muted text-sm mt-1">Automatic blockchain verification · No manual approval.</p>
        </div>

        {/* Step 1: Plan selector */}
        <div className="bg-[#12121A] border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">STEP 1 · Select Your Plan</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PLANS.map((plan) => (
              <button key={plan.key}
                onClick={() => { setSelectedPlan(plan); setStatus("idle"); setStatusMsg(""); }}
                className={`p-4 rounded-2xl border text-left transition-all ${selectedPlan.key === plan.key ? "border-gold/50 bg-gold/5 shadow-[0_0_20px_rgba(255,215,0,0.08)]" : "border-white/5 hover:border-white/10 bg-white/[0.02]"}`}
              >
                <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: plan.accent }}>{plan.name}</div>
                <div className="text-2xl font-black text-white">${plan.investment}</div>
                <div className="text-[10px] text-profit font-bold mt-1">→ +${plan.profit} USDT</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Wallet */}
        <div className="bg-[#12121A] border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">STEP 2 · Send USDT (TRC20)</h2>
          <p className="text-sm text-muted">Send exactly <span className="text-white font-black">{selectedPlan.investment} USDT</span> to:</p>
          
          <button onClick={copyWallet} className="w-full bg-black/30 border border-white/10 hover:border-white/20 rounded-2xl p-5 flex items-center justify-between gap-4 transition-all group">
            <code className="text-sm text-profit font-mono break-all text-left">{BOT_WALLET}</code>
            <div className="shrink-0 w-10 h-10 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-all">
              {copied ? <CheckCircle2 className="w-5 h-5 text-profit" /> : <Copy className="w-5 h-5 text-muted" />}
            </div>
          </button>

          <div className="flex items-start gap-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-400/80">Use <strong>TRON (TRC20) network exclusively</strong>. Any other network will result in permanent loss of funds.</p>
          </div>
        </div>

        {/* Step 3: TXID */}
        <div className="bg-[#12121A] border border-white/5 rounded-2xl p-6 space-y-5">
          <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">STEP 3 · Enter TXID & Verify</h2>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">Transaction Hash (TXID)</label>
            <input
              type="text"
              value={txid}
              onChange={(e) => { setTxid(e.target.value); setStatus("idle"); setStatusMsg(""); }}
              placeholder="e.g. a1b2c3d4e5f6... (64 characters)"
              disabled={status === "verifying"}
              className="w-full bg-black/30 border border-white/10 focus:border-gold/40 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:text-muted/50 focus:outline-none transition-colors disabled:opacity-50"
            />
            {txid.trim().length > 0 && <p className="text-[10px] text-muted">{txid.trim().length}/64 chars</p>}
          </div>

          <AnimatePresence mode="wait">
            {status === "verifying" && (
              <motion.div key="v" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl p-4">
                <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                <div>
                  <p className="text-xs font-bold text-primary">Verifying on blockchain...</p>
                  <p className="text-[10px] text-muted mt-0.5">{statusMsg}</p>
                </div>
              </motion.div>
            )}
            {status === "failed" && (
              <motion.div key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-red-400">Verification failed</p>
                    <p className="text-[10px] text-muted mt-1">{statusMsg}</p>
                  </div>
                </div>
                <button onClick={() => handleVerify(true)} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-black uppercase tracking-widest transition-all">
                  🔄 Retry {retryCount > 0 ? `(${retryCount})` : ""}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {status !== "verifying" && status !== "failed" && (
            <button onClick={() => handleVerify(false)} disabled={!txid.trim()}
              className="w-full py-4 bg-gold hover:bg-yellow-300 text-black rounded-2xl font-black uppercase tracking-widest text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              🔍 Verify on Blockchain →
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
