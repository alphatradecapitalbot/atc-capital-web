"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ParticleBackground } from "@/components/Effects";
import Link from "next/link";
import {
  Users, DollarSign, TrendingUp, ArrowDownToLine,
  ShieldCheck, Zap, Lock, CheckCircle2, Star,
  ChevronRight
} from "lucide-react";
import Counter from "@/components/Counter";
import { SITE_NAME, SITE_SHORT } from "@/lib/constants";

// ─── Live counters ─────────────────────────────────────────────
function useLiveCounter(base: number, variance: number, interval = 8000) {
  const [val, setVal] = useState(base);
  useEffect(() => {
    const t = setInterval(() => setVal(v => v + Math.floor(Math.random() * variance)), interval);
    return () => clearInterval(t);
  }, []);
  return val;
}

// ─── Stats config ──────────────────────────────────────────────
const STATS = [
  { label: "Active Users",    base: 14250,   variance: 15,  icon: Users,           isCurrency: false, color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   glow: "shadow-[0_0_30px_rgba(59,130,246,0.15)]" },
  { label: "Total Invested",  base: 3450200, variance: 500, icon: DollarSign,      isCurrency: true,  color: "text-gold",       bg: "bg-gold/10",        border: "border-gold/20",        glow: "shadow-[0_0_30px_rgba(255,215,0,0.12)]" },
  { label: "Daily Profit",    base: 142300,  variance: 80,  icon: TrendingUp,      isCurrency: true,  color: "text-profit",     bg: "bg-profit/10",      border: "border-profit/20",      glow: "shadow-[0_0_30px_rgba(0,255,136,0.12)]" },
  { label: "Withdrawals",     base: 2840500, variance: 300, icon: ArrowDownToLine, isCurrency: true,  color: "text-purple-400", bg: "bg-purple-500/10",  border: "border-purple-500/20",  glow: "" },
];

// ─── Plans config ──────────────────────────────────────────────
const PLANS = [
  {
    name: "STARTER", badge: null,
    roi: "2.5%", duration: "24 HOURS", min: "$50 USDT",
    color: "from-blue-700 to-blue-500",
    border: "border-white/8",
    btnClass: "bg-white/8 text-white border border-white/10 hover:bg-white/15",
    features: ["Automated daily payouts", "Blockchain verification", "24/7 support", "No lock-up period"],
  },
  {
    name: "PRO", badge: "⭐ MOST POPULAR",
    roi: "5.0%", duration: "24 HOURS", min: "$200 USDT",
    color: "from-yellow-700 to-yellow-400",
    border: "border-gold/40 shadow-[0_0_50px_rgba(255,215,0,0.18)]",
    btnClass: "bg-gold text-black hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]",
    features: ["All Starter benefits", "Priority processing", "Reinvestment tools", "Referral bonuses"],
  },
  {
    name: "ELITE", badge: null,
    roi: "8.0%", duration: "24 HOURS", min: "$1,000 USDT",
    color: "from-purple-700 to-purple-500",
    border: "border-white/8",
    btnClass: "bg-white/8 text-white border border-white/10 hover:bg-white/15",
    features: ["All Pro benefits", "Dedicated account manager", "Express withdrawals", "VIP trading signals"],
  },
];

// ─── Trust badges ──────────────────────────────────────────────
const TRUST = [
  { icon: ShieldCheck, label: "SSL Secured" },
  { icon: Lock,        label: "TRC20 Network" },
  { icon: Zap,         label: "Auto-Verified" },
  { icon: Star,        label: "10,000+ Investors" },
];

// ─── Social proof notifications ────────────────────────────────
const SOCIAL_PROOFS = [
  "🔥 John from USA invested $500",
  "💸 Maria from Spain withdrew $1,200",
  "🔥 Liam from UK invested $250",
  "💸 Emma from Canada withdrew $800",
  "🔥 Noah from AUS invested $1,500",
  "💸 Sofia from Italy withdrew $2,100",
];

function SocialProofFeed() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SOCIAL_PROOFS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none hidden md:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.92 }}
          className="bg-[#12121A]/90 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl"
        >
          <div className="w-2 h-2 rounded-full bg-profit animate-pulse shrink-0" />
          <span className="text-xs font-bold text-white tracking-wide">{SOCIAL_PROOFS[idx]}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const user_id = params.get("user_id");
      if (user_id) {
        localStorage.setItem("user_id", user_id);
        router.push("/dashboard");
      } else if (user) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  }, [user, router]);

  const statValues = [
    useLiveCounter(STATS[0].base, STATS[0].variance, 5000),
    useLiveCounter(STATS[1].base, STATS[1].variance, 8000),
    useLiveCounter(STATS[2].base, STATS[2].variance, 6000),
    useLiveCounter(STATS[3].base, STATS[3].variance, 12000),
  ];

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white overflow-hidden relative selection:bg-gold selection:text-black">
      <ParticleBackground />
      <SocialProofFeed />

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-28 pb-20 px-6 z-10">
        {/* Ambient glow layers */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/15 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/8 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-10 relative z-20">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] text-gold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              🔒 VERIFIED ON BLOCKCHAIN
            </div>
          </motion.div>

          {/* Hero Title */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8 }} className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.88]">
              INVEST IN USDT<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#7B5CFF] to-primary-glow">
                AND EARN DAILY
              </span><br />
              <span className="text-gold text-4xl sm:text-5xl md:text-6xl">PASSIVE INCOME</span>
            </h1>

            <p className="text-base md:text-xl text-muted max-w-2xl mx-auto font-medium leading-relaxed mt-6">
              Automated trading system with real-time blockchain verification<br className="hidden md:inline" /> and guaranteed daily returns.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <Link
              href="/login"
              className="group relative overflow-hidden bg-gold text-black px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-[0_0_24px_rgba(255,215,0,0.3)] hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] hover:-translate-y-1.5 flex items-center gap-3"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
              <Zap className="w-4 h-4" />
              START INVESTING
            </Link>
            <a
              href="#plans"
              className="border border-white/20 hover:border-white/40 text-white px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all hover:bg-white/5 backdrop-blur-sm flex items-center gap-2 group"
            >
              VIEW PLANS
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Trust badges row */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="flex flex-wrap justify-center gap-6 pt-6">
            {TRUST.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-muted text-xs font-bold">
                <t.icon className="w-4 h-4 text-gold" />
                {t.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════ LIVE STATS CARDS ════════ */}
      <section className="relative z-20 py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className={`bg-[#12121A]/80 backdrop-blur-xl border ${s.border} rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 ${s.glow} cursor-default group`}
              >
                <div className={`w-11 h-11 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-3xl md:text-4xl font-black tracking-tighter ${s.color}`}>
                    {s.isCurrency && "$"}
                    <Counter value={statValues[i]} />
                  </h4>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mt-1">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ INVESTMENT PLANS ════════ */}
      <section id="plans" className="py-32 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gold/5 blur-[200px] pointer-events-none rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-4 mb-20">
            <div className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-gold border border-gold/20 bg-gold/5 px-4 py-1.5 rounded-full">
              Investment Plans
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              Choose Your <span className="text-gold">Plan</span>
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Select the investment tier that fits your financial goals. Instant blockchain activation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {PLANS.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ y: plan.name === "PRO" ? -16 : -10 }}
                className={`bg-[#12121A] rounded-[2rem] p-10 border relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${plan.border} ${plan.name === "PRO" ? "scale-105 z-10" : ""}`}
              >
                {/* Corner glow blob */}
                <div className={`absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-bl ${plan.color} opacity-[0.18] blur-3xl pointer-events-none`} />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-10">
                    <h3 className="text-3xl font-black uppercase tracking-tighter">{plan.name}</h3>
                    {plan.badge && (
                      <span className="bg-gold text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-gold/30 animate-pulse-gold">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  {/* ROI */}
                  <div className="mb-10">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Daily ROI</p>
                    <p className="text-7xl font-black tracking-tighter text-white leading-none">{plan.roi}</p>
                  </div>

                  {/* Specs */}
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-xs font-bold text-muted uppercase tracking-widest">Duration</span>
                      <span className="font-black text-sm">{plan.duration}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-xs font-bold text-muted uppercase tracking-widest">Min Deposit</span>
                      <span className={`font-black text-base ${plan.name === "PRO" ? "text-gold" : "text-profit"}`}>{plan.min}</span>
                    </div>
                  </div>

                  {/* Benefits list */}
                  <ul className="space-y-2.5 mb-10">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-muted">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${plan.name === "PRO" ? "text-gold" : "text-profit"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/login"
                  className={`relative z-10 w-full py-5 rounded-2xl text-center text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 ${plan.btnClass}`}
                >
                  INVEST NOW →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section className="py-24 border-t border-white/5 relative z-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-16">
            How It <span className="text-gold">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "01", title: "Choose a Plan", desc: "Select STARTER, PRO, or ELITE based on your investment capacity." },
              { n: "02", title: "Send USDT", desc: "Transfer the exact plan amount to our TRC20 wallet and submit your TXID." },
              { n: "03", title: "Earn Daily", desc: "Receive your principal + profit automatically within 24 hours." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="bg-[#12121A]/60 backdrop-blur-sm border border-white/5 rounded-2xl p-8 space-y-4 text-left hover:border-gold/20 transition-all"
              >
                <span className="text-6xl font-black text-white/5">{s.n}</span>
                <h3 className="text-xl font-black uppercase tracking-tight">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA FINAL ════════ */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-gradient-to-br from-gold/15 via-[#12121A] to-primary/10 border border-gold/20 rounded-[2.5rem] p-14 text-center space-y-8"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xl -z-10" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/15 blur-[100px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/15 blur-[100px] rounded-full" />

            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight relative z-10">
              Ready to Start<br /><span className="text-gold">Earning Daily?</span>
            </h2>
            <p className="text-muted max-w-xl mx-auto relative z-10">
              Join thousands of investors already generating passive USDT income every single day.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link href="/login" className="bg-gold hover:bg-yellow-300 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] hover:-translate-y-1">
                CREATE ACCOUNT →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="py-12 border-t border-white/5 bg-[#08080A] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gold rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-black" />
            </div>
            <span className="font-black uppercase tracking-tighter">{SITE_NAME}</span>
          </div>
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
            © 2026 {SITE_NAME}. Secure Blockchain System.
          </p>
          <div className="flex items-center gap-6 text-[10px] font-bold text-muted uppercase tracking-widest">
            <span className="text-profit">TRC20 Only</span>
            <a href="#plans" className="hover:text-gold transition-colors">Plans</a>
            <Link href="/login" className="hover:text-gold transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
