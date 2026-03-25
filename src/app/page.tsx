"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ParticleBackground } from "@/components/Effects";
import Link from "next/link";
import { Users, DollarSign, TrendingUp, ArrowDownToLine } from "lucide-react";
import Counter from "@/components/Counter";
import { SITE_NAME } from "@/lib/constants";

// Random Live Stats Hook
function useLiveCounter(base: number, variance: number, interval = 8000) {
  const [val, setVal] = useState(base);
  useEffect(() => {
    const t = setInterval(() => setVal(v => v + Math.floor(Math.random() * variance)), interval);
    return () => clearInterval(t);
  }, []);
  return val;
}

// Stats Cards Definitions
const STATS = [
  { label: "Active Users", base: 14250, variance: 15, icon: Users },
  { label: "Total Deposits", base: 3450200, variance: 500, icon: DollarSign, isCurrency: true },
  { label: "Daily Earnings", base: 142300, variance: 80, icon: TrendingUp, isCurrency: true },
  { label: "Withdrawals", base: 2840500, variance: 300, icon: ArrowDownToLine, isCurrency: true }
];

// SaaS Plans Definitions
const ELITE_PLANS = [
  { name: "BASIC", roi: "2.5%", duration: "24 HOURS", min: "$50 USDT", color: "from-blue-600 to-blue-400", border: "border-white/10 opacity-80", badge: null },
  { name: "PRO", badge: "⭐ POPULAR", roi: "5.0%", duration: "24 HOURS", min: "$200 USDT", color: "from-yellow-600 to-yellow-400", border: "border-gold scale-105 shadow-[0_0_40px_rgba(255,215,0,0.15)] z-10 block-glow" },
  { name: "ELITE", roi: "8.0%", duration: "24 HOURS", min: "$1000 USDT", color: "from-purple-600 to-purple-400", border: "border-white/10 opacity-80", badge: null }
];

const SOCIAL_PROOFS = [
  "🔥 John from USA invested $500",
  "💸 Maria from Spain withdrew $1,200",
  "🔥 Liam from UK invested $250",
  "💸 Emma from Canada withdrew $800",
  "🔥 Noah from AUS invested $1,500"
];

function SocialProofFeed() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SOCIAL_PROOFS.length), 5000);
    return () => clearInterval(t);
  }, []);
  
  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none hidden md:block">
      <AnimatePresence mode="wait">
        <motion.div
           key={idx}
           initial={{ opacity: 0, y: 20, scale: 0.9 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           exit={{ opacity: 0, y: -20, scale: 0.9 }}
           className="bg-[#12121A]/80 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl"
        >
           <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
           <span className="text-xs font-bold text-white tracking-wide">{SOCIAL_PROOFS[idx]}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const user_id = params.get('user_id');

      if (user_id) {
        localStorage.setItem('user_id', user_id);
        router.push('/dashboard');
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

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-32 px-6 z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-10 relative z-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-gold mx-auto backdrop-blur-md shadow-xl shadow-gold/5">
              <span className="w-2 h-2 rounded-full bg-profit animate-pulse" />
              Verificable en Blockchain
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
              INVEST IN USDT.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-glow">
                EARN DAILY.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto font-medium leading-relaxed">
              Automated blockchain investment system with real-time verification and daily yield.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/login" className="bg-gold hover:bg-yellow-300 text-black px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] hover:-translate-y-1">
              START NOW
            </Link>
            <a href="#plans" className="bg-transparent border border-white/20 hover:bg-white/5 text-white px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all hover:border-white/50 backdrop-blur-sm">
              VIEW PLANS
            </a>
          </motion.div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="relative z-20 py-10 border-y border-white/5 bg-[#12121A]/50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_rgba(41,98,255,0.2)] transition-all duration-300 border border-white/5">
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-3xl font-black tracking-tighter text-white">
                    {s.isCurrency && "$"}
                    <Counter value={statValues[i]} />
                  </h4>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SaaS Plans */}
      <section id="plans" className="py-32 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[200px] pointer-events-none rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Choose Your <span className="text-gold">Tier</span></h2>
            <p className="text-muted text-lg max-w-xl mx-auto">Select the investment plan that fits your financial goals. Instant blockchain activation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center lg:px-10">
            {ELITE_PLANS.map((plan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: plan.name === 'PRO' ? -15 : -10 }}
                className={`bg-[#12121A] rounded-[2rem] p-10 border relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${plan.border}`}
              >
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${plan.color} opacity-[0.15] blur-3xl`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <h3 className="text-3xl font-black uppercase tracking-tighter">{plan.name}</h3>
                    {plan.badge && (
                      <span className="bg-gold text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full inline-block animate-pulse-gold shadow-lg shadow-gold/30">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mb-12">
                    <p className="text-sm font-bold text-muted uppercase tracking-widest">Daily ROI</p>
                    <p className="text-7xl font-black tracking-tighter text-white">{plan.roi}</p>
                  </div>

                  <div className="space-y-5 mb-12">
                    <div className="flex justify-between items-center py-4 border-b border-white/5">
                      <span className="text-xs font-bold text-muted uppercase tracking-widest">Duration</span>
                      <span className="font-black text-sm">{plan.duration}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-white/5">
                      <span className="text-xs font-bold text-muted uppercase tracking-widest">Min Deposit</span>
                      <span className="font-black text-profit text-base">{plan.min}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/login"
                  className={`w-full py-5 rounded-2xl text-center text-sm font-black uppercase tracking-[0.2em] transition-all relative z-10 ${
                    plan.name === 'PRO' 
                    ? 'bg-gold text-black hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]' 
                    : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  INVEST NOW
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#08080A] text-center relative z-10">
         <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
           © 2026 {SITE_NAME}. SECURE BLOCKCHAIN SYSTEM.
         </p>
      </footer>

    </main>
  );
}
