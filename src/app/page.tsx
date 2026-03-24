"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ShieldCheck, Clock, TrendingUp, Zap, Lock,
  ChevronDown, MessageCircle, CheckCircle2,
  Users, DollarSign, Activity, TrendingDown,
  Star, Globe, Cpu, Award
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  PLANS, TELEGRAM_BOT_LINK,
  SITE_NAME, SITE_SHORT
} from "@/lib/constants";
import Link from "next/link";

import { useCountUp, MiniChart, ParticleBackground } from "@/components/Effects";

function useLiveCounter(base: number, variance: number, interval = 3000, decimals = 0) {
  const [val, setVal] = useState(base);
  
  useEffect(() => {
    const t = setInterval(() => {
      setVal(v => {
        const increment = Math.random() * variance;
        return v + increment;
      });
    }, interval);
    return () => clearInterval(t);
  }, [variance, interval]);

  return val;
}

// ─── Animated Trading Chart ───────────────────────────────
function TradingChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    // Generate ascending path with volatility
    const points: { x: number; y: number }[] = [];
    const count = 60;
    let base = H * 0.75;
    for (let i = 0; i < count; i++) {
      base -= (Math.random() * 6 - 1.5); // mostly ascending
      base = Math.max(H * 0.2, Math.min(H * 0.85, base));
      points.push({ x: (i / (count - 1)) * W, y: base });
    }

    let frame = 0;
    const totalFrames = 120;

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, W, H);

      const progress = Math.min(frame / totalFrames, 1);
      const visibleCount = Math.floor(progress * points.length);
      if (visibleCount < 2) { frame++; animRef.current = requestAnimationFrame(draw); return; }

      const visible = points.slice(0, visibleCount);

      // Gradient fill
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "rgba(255,215,0,0.25)");
      grad.addColorStop(1, "rgba(255,215,0,0)");

      ctx.beginPath();
      ctx.moveTo(visible[0].x, visible[0].y);
      for (let i = 1; i < visible.length; i++) {
        const cp1x = (visible[i - 1].x + visible[i].x) / 2;
        ctx.bezierCurveTo(cp1x, visible[i - 1].y, cp1x, visible[i].y, visible[i].x, visible[i].y);
      }
      ctx.lineTo(visible[visible.length - 1].x, H);
      ctx.lineTo(visible[0].x, H);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.moveTo(visible[0].x, visible[0].y);
      for (let i = 1; i < visible.length; i++) {
        const cp1x = (visible[i - 1].x + visible[i].x) / 2;
        ctx.bezierCurveTo(cp1x, visible[i - 1].y, cp1x, visible[i].y, visible[i].x, visible[i].y);
      }
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 10;
      ctx.stroke();

      // Dot at end
      const last = visible[visible.length - 1];
      ctx.beginPath();
      ctx.arc(last.x, last.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#FFD700";
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#FFD700";
      ctx.fill();
      ctx.shadowBlur = 0;

      frame++;
      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

// ─── FAQ Component ─────────────────────────────────────────
const FAQS = [
  { q: "¿Cuánto tarda en activarse mi inversión?", a: "La verificación blockchain es automática. En menos de 2 minutos desde enviar tu TXID, el sistema valida la transacción y activa tu plan." },
  { q: "¿Puedo retirar mis ganancias en cualquier momento?", a: "Sí. Una vez completado el ciclo de 24 horas, tu balance está disponible para retiro o reinversión inmediata." },
  { q: "¿Qué pasa si envío el monto incorrecto?", a: "El sistema rechazará automáticamente la transacción por no coincidir con el plan seleccionado. Deberás enviar el monto exacto según el plan." },
  { q: "¿El sistema es completamente automático?", a: "Sí. La verificación, activación y pago de ganancias son 100% automáticos mediante blockchain y sin intervención humana." },
  { q: "¿Solo se acepta la red TRON (TRC20)?", a: "Sí, únicamente USDT en la red TRON (TRC20). No aceptamos BEP20, ERC20 ni ninguna otra red." },
  { q: "¿Cómo funciona el sistema de referidos?", a: "Al invitar a otras personas con tu enlace único, recibes una comisión de 0.30 USDT por cada inversión aprobada de tus referidos." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border overflow-hidden cursor-pointer transition-all mb-3`}
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: open ? "#FFD700" : "rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)"
      }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <p className="font-bold text-sm text-white">{q}</p>
        <ChevronDown className={`w-4 h-4 text-yellow-400 transition-transform shrink-0 ml-4 ${open ? "rotate-180" : ""}`} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <p className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Live Activity Feed ────────────────────────────────────
function LiveActivity() {
  const [activities, setActivities] = useState([
    { id: 1, type: 'DEPOSIT', user: 'User_***45', amount: 30, time: '2m ago' },
    { id: 2, type: 'WITHDRAW', user: 'Admin_***22', amount: 15.5, time: '5m ago' },
    { id: 3, type: 'DEPOSIT', user: 'Crypto_***99', amount: 100, time: '12m ago' },
    { id: 4, type: 'WITHDRAW', user: 'Rich_***07', amount: 45, time: '15m ago' },
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      setActivities(prev => [{
        id: Date.now(),
        type: Math.random() > 0.4 ? 'DEPOSIT' : 'WITHDRAW',
        user: `User_***${Math.floor(Math.random() * 99)}`,
        amount: [30, 50, 100, 200][Math.floor(Math.random() * 4)],
        time: 'Just now'
      }, ...prev.slice(0, 3)]);
    }, 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {activities.map((a) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center justify-between p-4 rounded-2xl border"
            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${a.type === 'DEPOSIT' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                {a.type === 'DEPOSIT' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{a.user}</p>
                <p className="text-[10px] text-gray-500 uppercase">{a.time}</p>
              </div>
            </div>
            <p className={`text-sm font-bold ${a.type === 'DEPOSIT' ? 'text-green-400' : 'text-yellow-400'}`}>
              {a.type === 'DEPOSIT' ? '+' : '-'}{a.amount} USDT
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────
function StatCard({ icon: Icon, label, base, suffix = "", sub, decimals = 0, isLive = false }: { 
  icon: React.ComponentType<{ size?: number; className?: string }>, 
  label: string, 
  base: number, 
  suffix?: string, 
  sub: string,
  decimals?: number,
  isLive?: boolean
}) {
  const { val, ref } = useCountUp(base, 2200, decimals);
  const displayVal = isLive ? base : val;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative p-6 rounded-3xl border flex flex-col gap-4 overflow-hidden group hover:-translate-y-1 transition-transform"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        borderColor: isLive ? "rgba(0,255,136,0.3)" : "rgba(255,215,0,0.15)",
        boxShadow: isLive ? "0 0 40px rgba(0,255,136,0.06)" : "0 0 40px rgba(255,215,0,0.04)"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {isLive && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
      )}

      <div className="p-3 rounded-2xl w-fit" style={{ background: isLive ? "rgba(0,255,136,0.1)" : "rgba(255,215,0,0.1)" }}>
        <Icon size={20} className={isLive ? "text-green-400" : "text-yellow-400"} />
      </div>
      <div>
        <p className="text-[10px] font-black text-yellow-400/60 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-3xl font-black text-white tracking-tight transition-all duration-700 ${isLive ? 'drop-shadow-[0_0_10px_rgba(0,255,136,0.3)]' : ''}`}>
          <span ref={isLive ? null : ref}>
            {displayVal.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
          </span>
          {suffix}
        </p>
        <p className={`text-[10px] font-bold flex items-center gap-1 mt-1 ${isLive ? 'text-green-400' : 'text-green-400/80'}`}>
          <Activity size={10} className={isLive ? 'animate-pulse' : ''} /> {sub}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Plan Card ───────────────────────────────────────────
const FEATURED_PLANS = [
  {
    key: "starter", name: "STARTER", investment: 30, profit: 15, roi: "50%",
    color: "#10b981", glow: "rgba(16,185,129,0.2)",
    features: ["Retiro automático en 24h", "Verificación blockchain", "Soporte 24/7", "Red TRC20 nativa"],
    featured: false
  },
  {
    key: "silver", name: "SILVER", investment: 50, profit: 20, roi: "40%",
    color: "#94a3b8", glow: "rgba(148,163,184,0.2)",
    features: ["Retiro automático en 24h", "Verificación blockchain", "Soporte 24/7", "Panel de ganancias", "Comisión de referidos"],
    featured: false
  },
  {
    key: "gold", name: "GOLD", investment: 100, profit: 50, roi: "50%",
    color: "#FFD700", glow: "rgba(255,215,0,0.35)",
    badge: "🔥 MÁS POPULAR",
    features: ["Retiro automático en 24h", "Verificación blockchain", "Soporte VIP 24/7", "Panel de ganancias", "Comisión de referidos", "Activación prioritaria"],
    featured: true
  }
];

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

function PlanCard({ plan, index }: { plan: typeof FEATURED_PLANS[0]; index: number }) {
  const { val: invVal, ref: invRef } = useCountUp(plan.investment, 2000);
  const { val: profitVal, ref: profitRef } = useCountUp(plan.profit, 2500);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex flex-col rounded-3xl overflow-hidden group cursor-pointer transition-all duration-500"
      style={{
        background: plan.featured
          ? "linear-gradient(145deg, rgba(255,215,0,0.08) 0%, rgba(0,0,0,0.95) 100%)"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${plan.featured ? plan.color : "rgba(255,255,255,0.08)"}`,
        boxShadow: plan.featured ? `0 0 60px ${plan.glow}, 0 0 120px rgba(255,215,0,0.05)` : "none",
        transform: plan.featured ? "scale(1.04)" : "scale(1)"
      }}
    >
      {/* Mini Chart Background */}
      <MiniChart />

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 rounded-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${plan.glow} 0%, transparent 70%)` }}
      />

      {/* Featured badge */}
      {plan.badge && (
        <div
          className="absolute -top-0 left-1/2 -translate-x-1/2 px-4 py-1.5 font-black text-[10px] uppercase tracking-widest text-black rounded-b-2xl z-10"
          style={{ background: plan.color }}
        >
          {plan.badge}
        </div>
      )}

      <div className="relative z-10 p-8 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mt-2 mb-2">
          <h3 
            className={`text-lg md:text-xl font-extrabold uppercase tracking-wider bg-clip-text text-transparent ${
              plan.featured 
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

        {/* ROI display */}
        <div className="mb-6">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">ROI en 24 horas</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-black text-white">+{plan.roi}</span>
            <span className="text-green-400 font-bold text-sm mb-1">diario</span>
          </div>
        </div>

        {/* Investment / Profit */}
        <div className="p-4 rounded-2xl mb-6" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-gray-500 font-bold uppercase">Inversión</span>
            <span className="text-sm font-black text-white" ref={invRef}>${invVal.toLocaleString()} USDT</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-bold uppercase">Ganancia neta</span>
            <span className="text-sm font-black text-green-400" ref={profitRef}>+${profitVal.toLocaleString()} USDT</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-8 flex-1">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
              <CheckCircle2 size={15} style={{ color: plan.color }} className="shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <a
          href={`${TELEGRAM_BOT_LINK}?start=plan_${plan.key}`}
          className="w-full py-4 rounded-2xl font-black uppercase text-sm tracking-widest text-center transition-all duration-300 hover:scale-105 hover:opacity-90"
          style={{
            background: plan.featured
              ? `linear-gradient(135deg, ${plan.color} 0%, #B8960C 100%)`
              : `${plan.color}18`,
            color: plan.featured ? "#000" : plan.color,
            border: plan.featured ? "none" : `1px solid ${plan.color}40`,
            boxShadow: plan.featured ? `0 8px 30px ${plan.glow}` : "none"
          }}
        >
          INVERTIR AHORA →
        </a>
      </div>
    </motion.div>
  );
}

// ─── Main Landing Page ─────────────────────────────────────
export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const fallbackStats = { users: 1247, paid: 63787.23, deposits: 346 };
  const activeUsers = useLiveCounter(fallbackStats.users, 2, 8000);
  const totalPaid = useLiveCounter(fallbackStats.paid, 4.85, 3000, 2);
  const todayDeposit = useLiveCounter(fallbackStats.deposits, 1, 10000);

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
    } catch (err) { console.error(err); }
  }, [user, router]);

  return (
    <main className="min-h-screen bg-black overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      {/* ─── PARTICLE BACKGROUND ── */}
      <ParticleBackground />

      {/* ─── BACKGROUND GLOW ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(255,215,0,0.18) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-1/3 right-0 w-[500px] h-[400px]"
          style={{ background: "radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="relative z-10 pt-20">

        {/* ═══ HERO ═══════════════════════════════════════════ */}
        <section className="min-h-[90vh] flex flex-col justify-center max-w-7xl mx-auto px-6 text-center items-center relative">

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8 max-w-5xl">

            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.25em] text-yellow-400"
              style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Sistema activo · AlphaTrade Capital 2026
            </span>

            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black text-white leading-none tracking-tighter">
              INVIERTE <span className="text-yellow-400">USDT</span><br />& GANA DIARIO
            </h1>

            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Genera rendimientos automáticos en la red TRC20 con ciclos de 24 horas.
              Seguridad total, transparencia absoluta y retiros instantáneos.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/login"
                className="px-10 py-5 font-black uppercase text-sm rounded-2xl transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #FFD700 0%, #B8960C 100%)", color: "#000", boxShadow: "0 8px 40px rgba(255,215,0,0.3)" }}
              >
                EMPEZAR AHORA →
              </Link>
              <Link
                href="/plans"
                className="px-10 py-5 font-black uppercase text-sm rounded-2xl text-white border border-white/10 backdrop-blur-xl transition-all hover:bg-white/5 hover:border-yellow-400/40"
              >
                VER PLANES
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ═══ METRICS (GLASSMORPHISM CARDS) ═════════════════ */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={Users} label="Usuarios activos" base={activeUsers} sub="Real-time flow" />
            <StatCard icon={DollarSign} label="USDT pagados" base={totalPaid} suffix=" USDT" sub="+$120 en los últimos minutos" decimals={2} isLive={true} />
            <StatCard icon={Activity} label="Depósitos hoy" base={todayDeposit} sub="TRC20 activado" />
          </div>
        </section>

        {/* ═══ ANIMATED CHART ══════════════════════════════════ */}
        <section className="py-16 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,215,0,0.12)",
              backdropFilter: "blur(16px)"
            }}
          >
            {/* Chart header */}
            <div className="flex items-center justify-between px-8 pt-6 pb-4">
              <div>
                <p className="text-[10px] font-black text-yellow-400/60 uppercase tracking-widest mb-1">Rendimiento del sistema</p>
                <p className="text-xl font-black text-white">Curva de crecimiento ATC</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(0,255,100,0.08)", border: "1px solid rgba(0,255,100,0.2)" }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-[11px] font-black uppercase tracking-wider">Live</span>
              </div>
            </div>
            <div style={{ height: "200px", padding: "0 16px 16px" }}>
              <TradingChart />
            </div>
          </motion.div>
        </section>

        {/* ═══ PLANS ═══════════════════════════════════════════ */}
        <section id="planes" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-yellow-400 font-black uppercase tracking-[0.25em] text-[10px]">Oportunidades</span>
              <h2 className="text-5xl md:text-7xl font-black text-white mt-2 tracking-tighter">PLANES DE INVERSIÓN</h2>
              <p className="text-gray-500 mt-4 text-sm font-bold uppercase tracking-widest">Ciclos automáticos de 24h garantizados por infraestructura blockchain</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {FEATURED_PLANS.map((plan, i) => (
              <PlanCard key={plan.key} plan={plan} index={i} />
            ))}
          </div>

          {/* More plans link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/plans" className="text-sm font-bold text-yellow-400/70 hover:text-yellow-400 uppercase tracking-widest transition-colors">
              Ver todos los planes disponibles →
            </Link>
          </motion.div>
        </section>

        {/* ═══ TRUST BADGES ════════════════════════════════════ */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-10 md:p-14"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,215,0,0.1)",
              backdropFilter: "blur(20px)"
            }}
          >
            <p className="text-center text-[10px] font-black text-yellow-400/60 uppercase tracking-[0.3em] mb-10">¿Por qué confiar en nosotros?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Activity, title: "Sistema activo", desc: "Plataforma operando 24/7 sin interrupciones" },
                { icon: Cpu, title: "Verificación blockchain", desc: "Cada TX validada en la red TRON en tiempo real" },
                { icon: DollarSign, title: "Pagos reales", desc: "Miles de retiros procesados y verificables" },
                { icon: ShieldCheck, title: "Infraestructura segura", desc: "Datos cifrados y protección anti-fraude activa" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center gap-4 group"
                >
                  <div className="p-4 rounded-2xl transition-all group-hover:scale-110"
                    style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.15)" }}>
                    <item.icon size={24} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-black text-white text-sm uppercase tracking-tight">{item.title}</p>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ═══ LIVE FEED + FEATURES ═══════════════════════════ */}
        <section className="py-24 max-w-7xl mx-auto px-6 border-t border-white/5">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div>
                <span className="text-yellow-400 font-bold uppercase tracking-[0.2em] text-[10px]">Ecosistema</span>
                <h2 className="text-4xl md:text-6xl font-black text-white mt-4 tracking-tighter italic">LIVE FEED</h2>
                <p className="text-gray-400 text-lg mt-6 leading-relaxed">
                  Transparencia total en cada ciclo. Monitorea las operaciones en tiempo real procesadas por nuestra infraestructura USDT.
                </p>
              </div>
              <LiveActivity />
            </div>
            <div className="grid gap-5">
              {[
                { i: ShieldCheck, t: "Seguridad Blockchain", d: "Cada transacción es verificada mediante el hash oficial en la red TRON." },
                { i: Clock, t: "Pagos Automáticos", d: "El sistema liquida tus ganancias exactamente 24 horas tras la activación." },
                { i: Zap, t: "Fricción Cero", d: "Envía tu TXID y el sistema activa tu capital de forma inmediata." }
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 p-7 rounded-3xl border transition-all group hover:border-yellow-400/30"
                  style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
                >
                  <div className="p-3 rounded-2xl shrink-0 transition-all group-hover:scale-110"
                    style={{ background: "rgba(255,215,0,0.1)" }}>
                    <f.i className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white uppercase tracking-tight">{f.t}</h4>
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">{f.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA SECTION ═════════════════════════════════════ */}
        <section className="py-16 mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative px-6 py-10 md:py-12 rounded-2xl text-center overflow-hidden bg-gradient-to-br from-[#FFD700] to-[#FFC300] shadow-[0_0_40px_rgba(255,215,0,0.2)]"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle at 30% 20%, rgba(0,0,0,0.5), transparent 60%)" }} />
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-black tracking-tight">
                ¿LISTO PARA EL PROGRESO?
              </h2>
              <p className="text-black/80 text-sm md:text-base max-w-xl mx-auto font-bold uppercase tracking-tight">
                Únete ahora a la mayor red de inversores USDT. Seguridad, rapidez y transparencia total.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                <Link href="/login" className="px-6 py-3 bg-black text-white font-black uppercase text-sm rounded-xl shadow-lg transition-all hover:scale-105">
                  CREAR CUENTA
                </Link>
                <a href={TELEGRAM_BOT_LINK} target="_blank" className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-black font-black uppercase text-sm rounded-xl transition-all flex items-center justify-center gap-2">
                  <MessageCircle size={18} /> SOPORTE 24/7
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ═══ FAQ ═════════════════════════════════════════════ */}
        <section className="py-24 max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-yellow-400 font-bold uppercase tracking-[0.2em] text-[10px]">Centro de Ayuda</span>
            <h2 className="text-4xl font-black text-white mt-4 italic tracking-tighter">PREGUNTAS FRECUENTES</h2>
          </div>
          <div>
            {FAQS.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </section>

        {/* ═══ FOOTER ══════════════════════════════════════════ */}
        <footer className="py-24 border-t border-white/5" style={{ background: "#050505" }}>
          <div className="max-w-7xl mx-auto px-6 grid gap-16 md:grid-cols-2">
            <div className="space-y-8">
              <Link href="/" className="flex items-center gap-4 group">
                <div className="p-2 rounded-xl group-hover:rotate-12 transition-transform" style={{ background: "#FFD700" }}>
                  <TrendingUp size={28} className="text-black" />
                </div>
                <span className="font-black text-2xl tracking-tighter uppercase text-white">{SITE_NAME}</span>
              </Link>
              <p className="text-gray-500 max-w-sm text-base font-medium leading-relaxed italic">
                Innovación financiera aplicada al crecimiento de capital mediante protocolos TRC20.
              </p>
              <div className="flex gap-3">
                {[Zap, ShieldCheck, Lock].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl flex items-center justify-center text-yellow-400 border border-white/10 hover:border-yellow-400 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <Icon size={20} />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-5">
                <h5 className="text-white text-xs font-black tracking-widest uppercase">Plataforma</h5>
                <ul className="space-y-3">
                  <li><Link href="/plans" className="text-gray-500 hover:text-yellow-400 font-bold uppercase text-[10px] tracking-widest transition-all">Planes Activos</Link></li>
                  <li><a href="/login" className="text-gray-500 hover:text-yellow-400 font-bold uppercase text-[10px] tracking-widest transition-all">Dashboard</a></li>
                  <li><a href="/reglas" className="text-gray-500 hover:text-yellow-400 font-bold uppercase text-[10px] tracking-widest transition-all">Reglas</a></li>
                </ul>
              </div>
              <div className="space-y-5 text-right">
                <h5 className="text-white text-xs font-black tracking-widest uppercase">Estatus</h5>
                <div className="flex flex-col gap-2">
                  <span className="text-green-400 font-black text-[10px] uppercase tracking-widest flex items-center justify-end gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Network Online
                  </span>
                  <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">TRC20 Native Infrastructure</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.5em]">
              © 2026 {SITE_NAME} · PROTOCOLOS BLOCKCHAIN USDT
            </p>
          </div>
        </footer>

      </div>
    </main>
  );
}
