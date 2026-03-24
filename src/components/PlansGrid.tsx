"use client";

import { motion } from "framer-motion";
import { PLANS, TELEGRAM_BOT_LINK } from "@/lib/constants";
import { useCountUp, ParticleBackground } from "@/components/Effects";

// ─── Badge config ─────────────────────────────────────────
const BADGES: Record<string, { label: string; bg: string; glow: string }> = {
  POPULAR:     { label: "🔥 POPULAR",     bg: "#00FF88", glow: "rgba(0,255,136,0.7)" },
  RECOMENDADO: { label: "⭐ RECOMENDADO", bg: "#FFD700", glow: "rgba(255,215,0,0.7)" },
  VIP:         { label: "💎 VIP",         bg: "#c084fc", glow: "rgba(192,132,252,0.7)" },
};

// ─── Sparkline (contained, non-overflowing) ───────────────
function SparkLine() {
  return (
    <div className="w-full flex-shrink-0 overflow-hidden" style={{ height: "40px" }}>
      <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none" style={{ display: "block" }} aria-hidden>
        <defs>
          <linearGradient id={`sg`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00FF88" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 32 C 20 28,35 36,55 24 C 75 10,90 18,110 10 C 130 2,150 6,170 3 C 185 1,195 2,200 1 L 200 40 L 0 40 Z" fill="url(#sg)" />
        <path d="M0 32 C 20 28,35 36,55 24 C 75 10,90 18,110 10 C 130 2,150 6,170 3 C 185 1,195 2,200 1"
          fill="none" stroke="#00FF88" strokeWidth="1.5"
          style={{ filter: "drop-shadow(0 0 3px rgba(0,255,136,0.55))" }} />
        <circle cx="200" cy="1" r="2.5" fill="#00FF88" opacity="0.85" />
      </svg>
    </div>
  );
}

// ─── Plan Card ────────────────────────────────────────────
function PlanCard({ plan, index }: { plan: typeof PLANS[0]; index: number }) {
  const { val: invVal,    ref: invRef    } = useCountUp(plan.investment, 1600);
  const { val: profitVal, ref: profitRef } = useCountUp(plan.profit,     2000);
  const { val: totalVal,  ref: totalRef  } = useCountUp(plan.investment + plan.profit, 1800);

  const badge    = (plan as { badge?: string }).badge;
  const featured = !!badge;
  const bc       = badge ? BADGES[badge] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      /* min-w-0 + w-full prevent CSS grid cell blowout */
      className="min-w-0 w-full max-w-sm mx-auto relative flex flex-col rounded-2xl overflow-hidden group"
      style={{
        background: "linear-gradient(160deg, #0d0d0d 0%, #050505 100%)",
        border: featured ? "1.5px solid rgba(0,255,136,0.5)" : "1.5px solid rgba(0,255,136,0.12)",
        boxShadow: featured
          ? "0 0 28px rgba(0,255,136,0.2), 0 0 70px rgba(0,255,136,0.05)"
          : "0 0 18px rgba(0,255,136,0.09)",
        cursor: "pointer",
        transform: featured ? "scale(1.02)" : "scale(1)",
      }}
      whileHover={{
        scale: featured ? 1.05 : 1.03,
        y: -5,
        boxShadow: "0 0 40px rgba(0,255,136,0.4)",
        transition: { duration: 0.2 },
      }}
    >
      {/* Badge */}
      {bc && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-20 px-4 py-1 rounded-b-xl text-[8px] font-black uppercase tracking-[0.22em] whitespace-nowrap text-black"
          style={{ background: bc.bg, boxShadow: `0 4px 14px ${bc.glow}` }}
        >
          {bc.label}
        </div>
      )}

      {/* Hover ambient glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,255,136,0.05) 0%, transparent 60%)" }} />

      {/* Sparkline */}
      <div className={featured ? "mt-5" : ""}>
        <SparkLine />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-4 px-5 pb-5 pt-2">

        {/* Name + status */}
        <div className="flex items-center justify-between">
          <h3 className="text-[12px] font-black uppercase tracking-[0.18em] text-green-400">{plan.name}</h3>
          <span className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.18)", color: "#00FF88" }}>
            ACTIVO
          </span>
        </div>

        {/* Price */}
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-600 mb-1">Inversión</p>
          <p className="text-3xl font-extrabold leading-none tracking-tight text-[#00FF88]">
            $<span ref={invRef}>{invVal.toLocaleString()}</span>
            <span className="text-xs font-normal text-gray-600 ml-1">USDT</span>
          </p>
        </div>

        <div className="h-px w-full" style={{ background: "rgba(0,255,136,0.07)" }} />

        {/* Returns */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs">Ganancia neta</span>
            <span className="text-green-400 text-xs font-black">
              +$<span ref={profitRef}>{profitVal.toLocaleString()}</span> USDT
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs">Total a recibir</span>
            <span className="text-yellow-400 text-xs font-semibold">
              $<span ref={totalRef}>{totalVal.toLocaleString()}</span> USDT
            </span>
          </div>
        </div>

        <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.04)" }} />

        {/* Details */}
        <ul className="space-y-1.5">
          {[
            { label: "ROI",          value: `${plan.roi} diario`,   cls: "text-white" },
            { label: "Duración",     value: plan.duration,           cls: "text-white" },
            { label: "Red",          value: "USDT TRC20",            cls: "text-white" },
            { label: "Verificación", value: "Automática",            cls: "text-green-400" },
          ].map(({ label, value, cls }) => (
            <li key={label} className="flex items-center justify-between border-b border-white/5 pb-1.5 last:border-none last:pb-0">
              <span className="text-gray-500 text-xs">{label}</span>
              <span className={`text-xs font-bold ${cls}`}>{value}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={`${TELEGRAM_BOT_LINK}?start=plan_${plan.key}`}
          className="mt-auto block w-full text-center py-2.5 rounded-xl text-black font-semibold text-[10px] uppercase tracking-widest transition-all duration-200 hover:brightness-110"
          style={{
            background: "linear-gradient(90deg, #FFD700 0%, #FFC300 100%)",
            boxShadow: "0 4px 16px rgba(255,215,0,0.18)",
            textDecoration: "none",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 22px rgba(255,215,0,0.5)"}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(255,215,0,0.18)"}
        >
          INVERTIR AHORA →
        </a>
      </div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────
export default function PlansGrid() {
  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      <ParticleBackground />

      {/* Subtle top glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(0,255,136,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-28">

        {/* Compact header */}
        <div className="text-center mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-green-400 mb-3">
            Sistema activo · AlphaTrade Capital
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">
            Planes de <span className="text-green-400">Inversión</span>
          </h2>
          <p className="text-gray-600 text-xs uppercase tracking-widest mt-2">
            Ciclos automáticos 24h · Blockchain TRC20 · Retiro instantáneo
          </p>
        </div>

        {/* ── THE GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.key} plan={plan} index={i} />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <a
            href={TELEGRAM_BOT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105"
            style={{
              background: "rgba(0,255,136,0.06)",
              border: "1px solid rgba(0,255,136,0.2)",
              color: "#00FF88",
              textDecoration: "none",
            }}
          >
            ¿Dudas? Soporte en Telegram →
          </a>
        </div>
      </div>
    </div>
  );
}
