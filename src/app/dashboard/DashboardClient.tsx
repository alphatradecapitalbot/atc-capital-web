"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  TrendingUp, DollarSign, Activity, Zap,
  CheckCircle2, AlertCircle, PlayCircle, Target
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// Mock growth data for chart
const CHART_DATA = [
  { day: "Mon", balance: 50 },
  { day: "Tue", balance: 62 },
  { day: "Wed", balance: 58 },
  { day: "Thu", balance: 89 },
  { day: "Fri", balance: 102 },
  { day: "Sat", balance: 145 },
  { day: "Sun", balance: 178 },
];

const SOCIAL_PROOFS = [
  "🔥 John from USA invested $500",
  "💸 Maria from Spain withdrew $1,200",
  "🔥 Liam from UK invested $250",
  "💸 Emma from Canada withdrew $800",
  "🔥 Noah from AUS invested $1,500",
];

function LiveNotification() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SOCIAL_PROOFS.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={idx}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        className="flex items-center gap-2 text-xs text-muted"
      >
        <span className="w-2 h-2 rounded-full bg-profit animate-pulse shrink-0" />
        {SOCIAL_PROOFS[idx]}
      </motion.div>
    </AnimatePresence>
  );
}

export default function DashboardClient() {
  const { user, refreshUser, loading } = useAuth();
  const router = useRouter();

  const [adsToday, setAdsToday] = useState(0);
  const [adsWatched, setAdsWatched] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [systemCooldown, setSystemCooldown] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const MAX_DAILY_ADS = 20;
  const REWARD_AMOUNT = 0.004;

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (systemCooldown > 0) {
      const t = setTimeout(() => setSystemCooldown(s => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [systemCooldown]);

  useEffect(() => {
    if (cooldownTime > 0) {
      const t = setTimeout(() => setCooldownTime(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldownTime]);

  useEffect(() => {
    if (isWatching && cooldownTime === 0) claimReward();
  }, [cooldownTime, isWatching]);

  const handleStartWatch = () => {
    if (!user) { showNotif("Login required", "error"); return; }
    if (adsToday >= MAX_DAILY_ADS) { showNotif("Daily limit reached", "error"); return; }
    if (systemCooldown > 0) return;
    window.open("https://bit.ly/example-ad-url", "_blank");
    setIsWatching(true);
    setCooldownTime(15);
  };

  const claimReward = async () => {
    setIsWatching(false);
    setIsLoading(true);
    try {
      const res = await fetch("/api/reward", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setAdsToday(data.adsToday);
        setAdsWatched(data.adsWatched);
        showNotif("Reward added to your balance!", "success");
        setSystemCooldown(30);
        refreshUser();
      } else {
        showNotif(data.error || "Error claiming reward", "error");
      }
    } catch {
      showNotif("Network error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotif = (msg: string, type: "success" | "error") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  const progressPct = Math.min((adsToday / MAX_DAILY_ADS) * 100, 100);
  const totalEarned = (adsWatched * REWARD_AMOUNT).toFixed(4);

  return (
    <DashboardLayout>
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-3 border backdrop-blur-xl"
            style={{
              backgroundColor: notification.type === "success" ? "rgba(0,255,136,0.08)" : "rgba(239,68,68,0.08)",
              borderColor: notification.type === "success" ? "rgba(0,255,136,0.25)" : "rgba(239,68,68,0.25)",
              color: notification.type === "success" ? "#00FF88" : "#EF4444",
            }}
          >
            {notification.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {notification.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
            Welcome, <span className="text-gold">{user.first_name || "Investor"}</span>
          </h1>
          <LiveNotification />
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[
          { icon: DollarSign, label: "Total Balance", value: `$${user.balance?.toFixed(2) || "0.00"}`, unit: "USDT", color: "text-gold", bg: "bg-gold/10 border-gold/20", glow: "shadow-[0_0_24px_rgba(255,215,0,0.08)]" },
          { icon: TrendingUp, label: "Total Earned", value: `$${user.total_earned?.toFixed(2) || "0.00"}`, unit: "USDT", color: "text-profit", bg: "bg-profit/10 border-profit/20", glow: "shadow-[0_0_24px_rgba(0,255,136,0.08)]" },
          { icon: Activity, label: "Active Plans", value: String(user.active_investments || 0), unit: "Investments", color: "text-primary", bg: "bg-primary/10 border-primary/20", glow: "shadow-[0_0_24px_rgba(41,98,255,0.08)]" },
          { icon: Zap, label: "Ads Today", value: `${adsToday}/${MAX_DAILY_ADS}`, unit: "Completed", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", glow: "" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`bg-[#12121A] border rounded-2xl p-6 ${s.bg} ${s.glow} flex items-start justify-between`}
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">{s.label}</p>
              <p className={`text-3xl font-black tracking-tighter ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted mt-1">{s.unit}</p>
            </div>
            <div className={`w-11 h-11 rounded-2xl ${s.bg} flex items-center justify-center ${s.color} border`}>
              <s.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart + Ad Player */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Balance Growth Chart */}
        <div className="lg:col-span-2 bg-[#12121A] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted">Balance Growth</p>
              <p className="text-xl font-black tracking-tight">This Week</p>
            </div>
            <div className="text-profit text-sm font-black flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +24.5%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#888899", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#888899", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#12121A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "8px 14px" }}
                labelStyle={{ color: "#888899", fontSize: 10 }}
                itemStyle={{ color: "#FFD700", fontWeight: 700 }}
              />
              <Area type="monotone" dataKey="balance" stroke="#FFD700" strokeWidth={2} fill="url(#goldGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Ad Player Card */}
        <div className="bg-[#12121A] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">Earn Rewards</p>
            <h3 className="text-xl font-black tracking-tight">Watch & Earn</h3>
            <p className="text-xs text-muted mt-1 mb-6">+$0.004 USDT per ad viewed</p>

            {/* Progress */}
            <div className="mb-6 space-y-2">
              <div className="flex justify-between text-xs text-muted font-bold">
                <span><Target className="w-3 h-3 inline mr-1" />Today's Progress</span>
                <span>{adsToday}/{MAX_DAILY_ADS}</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleStartWatch}
              disabled={isWatching || isLoading || systemCooldown > 0 || adsToday >= MAX_DAILY_ADS}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: (isWatching || isLoading || systemCooldown > 0 || adsToday >= MAX_DAILY_ADS)
                  ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #00FF88 0%, #00CC6A 100%)",
                color: (isWatching || isLoading || systemCooldown > 0 || adsToday >= MAX_DAILY_ADS) ? "#888" : "#000",
                boxShadow: (isWatching || systemCooldown > 0) ? "none" : "0 0 20px rgba(0,255,136,0.25)",
              }}
            >
              <PlayCircle className="w-4 h-4" />
              {isLoading ? "Processing..." :
                isWatching ? `Watching ${cooldownTime}s...` :
                systemCooldown > 0 ? `Wait ${systemCooldown}s` :
                adsToday >= MAX_DAILY_ADS ? "Daily Limit" : "Watch Ad"}
            </button>
            <div className="flex justify-between text-xs text-muted">
              <span>Total earned:</span>
              <span className="text-profit font-black">+${totalEarned} USDT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Missions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Bronze Mission", target: 10, color: "from-blue-600 to-blue-400", textColor: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
          { title: "Silver Mission", target: 20, color: "from-purple-600 to-purple-400", textColor: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={`bg-[#12121A] border rounded-2xl p-6 ${m.bg}`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className={`font-black text-lg uppercase tracking-tight ${m.textColor}`}>{m.title}</h3>
              <span className="text-[10px] font-black text-muted uppercase">{Math.min(adsToday, m.target)}/{m.target} ads</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((adsToday / m.target) * 100, 100)}%` }}
                className={`h-full rounded-full bg-gradient-to-r ${m.color}`}
              />
            </div>
            <button
              disabled={adsToday < m.target}
              className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${adsToday >= m.target ? `bg-gradient-to-r ${m.color} text-white` : "bg-white/5 text-muted cursor-not-allowed"}`}
            >
              {adsToday >= m.target ? "Claim Bonus!" : "Goal not reached"}
            </button>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
