"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { PLANS, TELEGRAM_BOT_LINK } from "@/lib/constants";
import { useCountUp, ParticleBackground, MiniChart } from "@/components/Effects";

// ─── Plan Card ────────────────────────────────────────────
const getPlanIcon = (name: string) => {
  const n = name.toUpperCase();
  if (n.includes('STARTER')) return '🚀';
  if (n.includes('SILVER')) return '🪙';
  if (n.includes('GOLD')) return '🥇';
  if (n.includes('DIAMOND')) return '💎';
  if (n.includes('PRO')) return '⚡';
  if (n.includes('ELITE')) return '🔥';
  if (n.includes('PREMIER')) return '👑';
  return '🏦';
};

function PlanCard({ plan, index }: { plan: typeof PLANS[0]; index: number }) {
  const { val: invVal,    ref: invRef    } = useCountUp(plan.investment, 1600);
  const { val: profitVal, ref: profitRef } = useCountUp(plan.profit,     2000);

  const isFeatured = plan.name?.toUpperCase() === "GOLD";
  const glow = isFeatured ? "rgba(255,215,0,0.35)" : "rgba(0,255,136,0.15)";
  const color = isFeatured ? "#FFD700" : "#00FF88";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      // Estilo general pedido: bg-gradient, rounded, padding, hover scale y shadow suave verde
      className="relative flex flex-col rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 bg-gradient-to-b from-[#0B0B0B] to-[#050505] p-5 md:p-6 w-full max-w-sm mx-auto min-w-0 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,255,136,0.15)]"
      style={{
        border: isFeatured ? "1px solid rgba(255,215,0,0.5)" : "1px solid rgba(255,255,255,0.05)",
        boxShadow: isFeatured ? "0 0 40px rgba(255,215,0,0.15)" : "none",
        transform: isFeatured ? "scale(1.05)" : "scale(1)",
        transformOrigin: "center center",
      }}
    >
      {/* Glow Hover Inject */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: isFeatured ? "0 0 60px rgba(255,215,0,0.3)" : "none",
          border: isFeatured ? "1px solid #FFD700" : "1px solid rgba(0,255,136,0.2)"
        }}
      />

      {/* Featured badge - 🔥 MÁS POPULAR */}
      {isFeatured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 font-black text-[10px] uppercase tracking-widest text-black rounded-b-2xl z-20 bg-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.4)]">
          🔥 MÁS POPULAR
        </div>
      )}

      {/* 1. HEADER */}
      <div className="relative z-10 flex items-center justify-between mb-2 mt-2">
        <h3 
          className={`text-lg md:text-xl font-extrabold uppercase tracking-wider bg-clip-text text-transparent ${
            isFeatured 
              ? 'bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-[0_0_12px_rgba(255,215,0,0.5)]' 
              : 'bg-gradient-to-r from-[#00FFB2] to-[#00D1FF] drop-shadow-[0_0_10px_rgba(0,255,178,0.3)]'
          }`}
        >
          <span className="mr-2 inline-block filter-none drop-shadow-none text-white">{getPlanIcon(plan.name)}</span>
          {plan.name}
        </h3>
        <div className="bg-green-500/10 text-green-400 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-green-500/20">
          ACTIVO
        </div>
      </div>

      {/* 2. BLOQUE PRINCIPAL: ROI en 24 horas y número grande */}
      <div className="relative z-10 mb-6">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">ROI en 24 horas</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-black text-white">+{plan.roi}</span>
          <span className="text-green-400 font-bold text-sm mb-1.5">diario</span>
        </div>
      </div>

      {/* 3. BLOQUE DE DATOS: bgcolor #111 */}
      <div className="relative z-10 p-4 rounded-xl mb-6 bg-[#111] border border-white/5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-gray-400 font-bold uppercase">Inversión</span>
          <span className="text-sm font-black text-white" ref={invRef}>${invVal.toLocaleString()} USDT</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400 font-bold uppercase">Ganancia neta</span>
          <span className="text-sm font-black text-green-400" ref={profitRef}>+${profitVal.toLocaleString()} USDT</span>
        </div>
      </div>

      {/* 4. LISTA DE BENEFICIOS */}
      <ul className="relative z-10 space-y-3 mb-8 flex-1">
        {[
          "Retiro automático en 24h",
          "Verificación blockchain",
          "Soporte 24/7",
          "Red TRC20"
        ].map((item, idx) => (
          <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
            <CheckCircle2 size={16} className={isFeatured ? "text-yellow-400" : "text-green-400"} />
            {item}
          </li>
        ))}
      </ul>

      {/* 5. BOTÓN: Integrado */}
      <div className="relative z-10">
        <a
          href={`${TELEGRAM_BOT_LINK}?start=plan_${plan.key}`}
          className="block w-full text-center py-4 rounded-xl font-black uppercase text-sm tracking-widest text-black transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
          style={{
            background: isFeatured 
              ? "linear-gradient(135deg, #FFD700 0%, #B8960C 100%)" 
              : "linear-gradient(135deg, #FFD700 0%, #FFC300 100%)",
            boxShadow: isFeatured ? "0 8px 30px rgba(255,215,0,0.3)" : "none"
          }}
        >
          INVERTIR AHORA →
        </a>
      </div>

    </motion.div>
  );
}

// ─── Main Grid Component ──────────────────────────────────
export default function PlansGrid() {
  return (
    <div className="relative min-h-screen bg-[#020202] overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      
      <ParticleBackground />

      {/* Subtle Ambient Light */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-center">
        <div className="w-[800px] h-[400px] rounded-full opacity-30 mt-[-100px]"
             style={{ background: "radial-gradient(ellipse, rgba(0,255,136,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-32 pb-16">
        
        {/* ── HEADER DE LA PÁGINA ── */}
        <div className="flex flex-col items-center text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#00FF88]">
              SISTEMA ACTIVO • ALPHATRADE CAPITAL
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            PLANES DE INVERSIÓN
          </h2>

          <p className="text-gray-400 text-sm font-medium tracking-wide">
            Ciclos automáticos 24H · Blockchain TRC20 · Retiro instantáneo
          </p>
        </div>

        {/* ── GRID DE CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.key} plan={plan} index={i} />
          ))}
        </div>

      </div>
    </div>
  );
}

