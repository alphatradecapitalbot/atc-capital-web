"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { PLANS, TELEGRAM_BOT_LINK } from "@/lib/constants";
// (Link available if needed for future internal routing)
import { useCountUp, MiniChart, ParticleBackground } from "@/components/Effects";
import { CheckCircle2, Clock, Globe, Zap, TrendingUp } from "lucide-react";

const accentGreen = "#00FF88";

// ─── Plan Badge ───────────────────────────────────────────
function PlanBadge({ badge }: { badge: string }) {
  const colors: Record<string, { bg: string; text: string; glow: string }> = {
    POPULAR:      { bg: "#00FF88", text: "#000", glow: "rgba(0,255,136,0.6)" },
    RECOMENDADO:  { bg: "#FFD700", text: "#000", glow: "rgba(255,215,0,0.6)" },
    VIP:          { bg: "#c084fc", text: "#000", glow: "rgba(192,132,252,0.6)" },
  };
  const c = colors[badge] ?? { bg: "#00FF88", text: "#000", glow: "rgba(0,255,136,0.5)" };
  return (
    <div
      className="absolute -top-0 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-b-2xl text-[10px] font-black uppercase tracking-[0.25em] z-20 whitespace-nowrap"
      style={{ background: c.bg, color: c.text, boxShadow: `0 4px 20px ${c.glow}` }}
    >
      {badge}
    </div>
  );
}

// ─── Plan Card ───────────────────────────────────────────
function PlanCard({ plan, i, user }: { plan: typeof PLANS[0]; i: number; user: unknown }) {
  const { val: invVal, ref: invRef }     = useCountUp(plan.investment, 2000);
  const { val: profitVal, ref: profitRef } = useCountUp(plan.profit, 2500);
  const { val: totalVal, ref: totalRef } = useCountUp(plan.investment + plan.profit, 2200);

  const isFeatured = !!plan.badge;
  const accentGreen = "#00FF88";
  const accentYellow = "#FFD700";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07, duration: 0.5 }}
      whileHover={{ scale: 1.04, y: -6 }}
      className="relative flex flex-col rounded-[20px] overflow-hidden cursor-pointer group"
      style={{
        background: "#0B0B0B",
        border: isFeatured
          ? `1.5px solid ${accentGreen}`
          : "1.5px solid rgba(0,255,136,0.12)",
        boxShadow: isFeatured
          ? "0 0 32px rgba(0,255,136,0.22), 0 0 80px rgba(0,255,136,0.06)"
          : "0 0 20px rgba(0,255,136,0.08)",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Featured badge */}
      {plan.badge && <PlanBadge badge={plan.badge} />}

      {/* Animated mini chart at top */}
      <MiniChart />

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[20px]"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,255,136,0.07) 0%, transparent 70%)" }}
      />

      {/* Card Body */}
      <div className={`relative z-10 flex flex-col flex-1 p-7 ${plan.badge ? "pt-10" : ""}`}>

        {/* Plan Name */}
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-xl font-black uppercase tracking-[0.2em]"
            style={{ color: accentGreen }}
          >
            {plan.name}
          </h3>
          <span
            className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: "rgba(0,255,136,0.08)", color: accentGreen, border: "1px solid rgba(0,255,136,0.2)" }}
          >
            ACTIVO
          </span>
        </div>

        {/* Price / Investment */}
        <div className="mb-5">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Inversión</p>
          <p className="text-4xl font-bold tracking-tight" style={{ color: accentGreen }}>
            <span ref={invRef}>${invVal.toLocaleString()}</span>{" "}
            <span className="text-base font-medium text-gray-500">USDT</span>
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px mb-5" style={{ background: "rgba(0,255,136,0.08)" }} />

        {/* Details Grid */}
        <div className="space-y-3 mb-6 text-sm">
          {/* Ganancia */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium flex items-center gap-1.5">
              <TrendingUp size={13} className="text-green-400" /> Ganancia neta
            </span>
            <span className="font-black text-green-400" ref={profitRef}>
              +${profitVal.toLocaleString()} USDT
            </span>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Total retiro</span>
            <span className="font-semibold text-yellow-400" ref={totalRef}>
              ${totalVal.toLocaleString()} USDT
            </span>
          </div>

          {/* ROI */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium flex items-center gap-1.5">
              <Zap size={13} className="text-yellow-400" /> ROI
            </span>
            <span className="font-black text-white">{plan.roi} diario</span>
          </div>

          {/* Duración */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium flex items-center gap-1.5">
              <Clock size={13} className="text-gray-400" /> Duración
            </span>
            <span className="font-bold text-white">{plan.duration}</span>
          </div>

          {/* Red */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium flex items-center gap-1.5">
              <Globe size={13} className="text-gray-400" /> Red
            </span>
            <span className="font-bold text-white">TRC20 (USDT)</span>
          </div>

          {/* Verificación */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-green-400" /> Verificación
            </span>
            <span className="font-bold text-green-400">Automática</span>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href={`${TELEGRAM_BOT_LINK}?start=plan_${plan.key}`}
          className="w-full py-4 rounded-xl font-black uppercase text-sm tracking-widest text-center text-black transition-all duration-300 hover:scale-105 mt-auto"
          style={{
            background: `linear-gradient(135deg, ${accentYellow} 0%, #B8960C 100%)`,
            boxShadow: "0 6px 24px rgba(255,215,0,0.25)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(255,215,0,0.5)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 24px rgba(255,215,0,0.25)";
          }}
        >
          INVERTIR AHORA →
        </a>
      </div>
    </motion.div>
  );
}

// ─── Plans Page ──────────────────────────────────────────
export default function PlansPage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-black pt-28 pb-20 relative overflow-x-hidden">
      {/* Particle bg */}
      <ParticleBackground />

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(0,255,136,0.07) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.25em]"
              style={{ background: "rgba(0,255,136,0.07)", border: "1px solid rgba(0,255,136,0.18)", color: accentGreen }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Sistema activo · AlphaTrade Capital
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">
              Planes de <span style={{ color: "#00FF88" }}>Inversión</span>
            </h1>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest max-w-xl mx-auto">
              Ciclos automáticos de 24h · Verificación blockchain · Red TRC20
            </p>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.key} plan={plan} i={i} user={user} />
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center space-y-4"
        >
          <p className="text-gray-600 text-xs uppercase tracking-widest font-bold">
            ¿Dudas? Contacta soporte antes de invertir
          </p>
          <a
            href={TELEGRAM_BOT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-black uppercase text-xs tracking-wider transition-all hover:scale-105"
            style={{
              background: "rgba(0,255,136,0.07)",
              border: "1px solid rgba(0,255,136,0.2)",
              color: "#00FF88",
            }}
          >
            SOPORTE EN TELEGRAM →
          </a>
        </motion.div>
      </div>
    </main>
  );
}


