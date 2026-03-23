"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Clock, TrendingUp, Zap, Lock,
  CheckCircle2, ChevronDown, Phone, MessageCircle,
  Users, DollarSign, Activity, Gift, PieChart
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  PLANS, TELEGRAM_BOT_LINK, WHATSAPP_1, WHATSAPP_2,
  YOUTUBE_CHANNEL, YOUTUBE_EMBED,
  SITE_NAME, SITE_SHORT
} from "@/lib/constants";
import Link from "next/link";

// ─── Live Stats (simulated realistic counters) ───────────────────
function useLiveCounter(base: number, variance: number, interval = 8000) {
  const [val, setVal] = useState(base);
  useEffect(() => {
    const t = setInterval(() => setVal(v => v + Math.floor(Math.random() * variance)), interval);
    return () => clearInterval(t);
  }, []);
  return val;
}

// ─── FAQ Accordion ────────────────────────────────────────────────
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
      className={`card overflow-hidden cursor-pointer transition-all ${open ? "border-yellow-400/20" : ""}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-6 py-5 gap-4">
        <p className="font-bold text-sm pr-4">{q}</p>
        <ChevronDown className={`w-4 h-4 text-muted shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-muted text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────
function SectionHeader({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div className="text-center space-y-4 mb-16">
      <div className="inline-block text-[9px] font-black uppercase tracking-[0.25em] text-gold border border-gold/20 bg-gold/5 px-4 py-1.5 rounded-full">
        {label}
      </div>
      <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">{title}</h2>
      <div className="w-12 h-0.5 bg-gold mx-auto rounded-full" />
      {sub && <p className="text-muted text-sm max-w-xl mx-auto">{sub}</p>}
    </div>
  );
}

// ─── Games Section ────────────────────────────────────────────────
function GamesSection() {
  const games = [
    {
      id: 'reward-box',
      name: '🎁 REWARD BOX',
      desc: 'Abre cajas misteriosas y gana hasta x3 tu inversión.',
      icon: Gift,
      color: 'from-yellow-400/20 to-transparent',
      shadow: 'shadow-yellow-400/10'
    },
    {
      id: 'market-spin',
      name: '🎯 MARKET SPIN',
      desc: 'Elige un color y multiplica tu dinero al instante.',
      icon: PieChart,
      color: 'from-profit/20 to-transparent',
      shadow: 'shadow-profit/10'
    },
    {
      id: 'price-prediction',
      name: '📈 PRICE PREDICTION',
      desc: 'Predice si el mercado sube o baja y gana en segundos.',
      icon: TrendingUp,
      color: 'from-blue-500/20 to-transparent',
      shadow: 'shadow-blue-500/10'
    }
  ];

  return (
    <section id="juegos" className="py-32 border-t border-white/5 relative overflow-hidden">
       {/* Background Glows */}
       <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
       <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-profit/5 blur-[120px] rounded-full pointer-events-none" />

       <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            label="Diversión y Ganancias" 
            title="🎮 GANA MÁS CON NUESTROS JUEGOS" 
            sub="Multiplica tu inversión en segundos con nuestros juegos interactivos en tiempo real." 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
             {games.map((g, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`card p-10 border-white/5 hover:border-gold/30 transition-all group relative overflow-hidden ${g.shadow}`}
                >
                   <div className={`absolute inset-0 bg-gradient-to-br ${g.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                   
                   <div className="relative z-10 space-y-6">
                      <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-gold group-hover:scale-110 transition-transform shadow-inner">
                         <g.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black italic uppercase tracking-tighter">{g.name}</h3>
                      <p className="text-muted text-sm leading-relaxed">{g.desc}</p>
                      <Link 
                        href={`/games/${g.id}`}
                        className="inline-flex items-center gap-2 text-gold text-[10px] font-black uppercase tracking-[0.3em] group-hover:gap-4 transition-all"
                      >
                         👉 JUGAR AHORA
                      </Link>
                   </div>
                </motion.div>
             ))}
          </div>

          {/* Conversion Footer */}
          <div className="flex flex-wrap justify-center items-center gap-10 py-10 border-t border-white/5">
             <div className="flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <span className="text-sm font-black text-white italic uppercase tracking-tighter">+1,200 usuarios ganando ahora mismo</span>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-2xl">💰</span>
                <span className="text-sm font-black text-white italic uppercase tracking-tighter">Retornos en tiempo real</span>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <span className="text-sm font-black text-white italic uppercase tracking-tighter">Resultados en segundos</span>
             </div>
          </div>
       </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const activeUsers  = useLiveCounter(1247, 3, 9000);
  const totalPaid    = useLiveCounter(89420, 150, 7000);
  const todayDeposit = useLiveCounter(342, 5, 11000);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const user_id = params.get('user_id')

    if (user_id) {
      localStorage.setItem('user_id', user_id)
      router.push('/dashboard')
    } else if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <main className="min-h-screen">

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 min-h-screen flex items-center pt-28 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full">

          {/* LEFT */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-gold">
              <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse-slow" />
              Sistema Activo · Verificación Blockchain
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold uppercase italic leading-tight tracking-tighter">
              Invierte en USDT y genera{" "}
              <span className="text-gold">ingresos automáticos</span>{" "}
              con {SITE_SHORT}
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed max-w-md">
              Plataforma automatizada con verificación blockchain real y rendimientos diarios. Sin complicaciones, sin demoras.
            </p>

            <div id="login" className="flex flex-col sm:flex-row gap-4 items-start">
              <Link 
                href="/login" 
                className="btn-gold px-8 py-4 text-lg font-bold"
              >
                Login
              </Link>
              <a href="#planes" className="btn-ghost px-8 py-4 text-lg font-bold border border-white/10">Ver Planes →</a>
            </div>

            {/* Live stats bar */}
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: Users, label: "Usuarios Activos", val: activeUsers.toLocaleString() },
                { icon: DollarSign, label: "USDT Pagados", val: `${totalPaid.toLocaleString()}` },
                { icon: Activity, label: "Depósitos Hoy", val: todayDeposit.toLocaleString() },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <s.icon className="w-4 h-4 text-gold" />
                  <div>
                    <p className="text-lg font-black text-white leading-none">{s.val}</p>
                    <p className="text-[9px] uppercase tracking-widest text-muted">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — floating card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center md:justify-end"
          >
            <div className="card glow-green w-full max-w-sm p-8 animate-float">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted">PLATAFORMA ACTIVA</p>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mt-1">{SITE_SHORT}</h3>
                </div>
                <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-gold" />
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[9px] font-bold text-muted uppercase tracking-widest">Rendimiento 24h</p>
                <div className="text-4xl font-black mt-1">
                  USDT <span className="text-profit text-2xl">+50%</span>
                </div>
              </div>

              {/* Bar mini-chart */}
              <div className="h-20 flex items-end gap-1 mb-6">
                {[35, 60, 45, 80, 55, 90, 70, 100, 82, 115].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                    className="flex-1 rounded-t-sm"
                    style={{ background: `rgba(0,255,136,${0.1 + (h / 115) * 0.4})` }}
                  />
                ))}
              </div>

              {/* Plan preview */}
              <div className="space-y-2">
                {PLANS.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex justify-between items-center text-[11px] border-t border-white/5 pt-2">
                    <span className="font-bold" style={{ color: p.accent }}>{p.name}</span>
                    <span className="text-muted">${p.investment} → <span className="text-white font-bold">${p.price}</span></span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-profit text-[10px] font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse-slow" />
                  Operacional
                </div>
                <span className="text-[9px] text-muted uppercase font-bold">TRC20 · Seguro</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* ════════════════════════ GAMES SECTION ════════════════════════ */}
      <GamesSection />

      {/* ════════════════════════ HOW IT WORKS ════════════════════════ */}
      <section id="como-funciona" className="py-32 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="Proceso" title="¿Cómo Funciona?" sub="En 6 pasos simples, tu inversión estará activa y generando rendimientos." />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { n: "01", icon: TrendingUp, title: "Elige tu Plan", desc: "Selecciona entre Starter ($30), Silver ($50) o Gold ($100) según tu capacidad de inversión." },
              { n: "02", icon: DollarSign, title: "Envía USDT", desc: "Transfiere el monto exacto a nuestra wallet oficial en la red TRON (TRC20)." },
              { n: "03", icon: Activity, title: "Copia el TXID", desc: "Obtén el hash de transacción de tu wallet o explorador blockchain." },
              { n: "04", icon: ShieldCheck, title: "Verificación Automática", desc: "El sistema consulta TronScan, valida monto, wallet y confirmaciones en segundos." },
              { n: "05", icon: Zap, title: "Inversión Activa", desc: "Tu plan se activa instantáneamente. Recibes confirmación en Telegram al instante." },
              { n: "06", icon: Clock, title: "Cobras en 24h", desc: "Transcurridas las 24 horas, tu capital + ganancia se acredita automáticamente." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-7 space-y-4 group hover:border-yellow-400/20 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 flex items-center justify-center text-gold group-hover:bg-yellow-400/20 transition-colors">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black text-muted tracking-widest">{s.n}</span>
                </div>
                <h3 className="text-base font-black uppercase tracking-tight">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ SECURITY ════════════════════════ */}
      <section id="seguridad" className="py-32 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="Seguridad" title="Sistema 100% Seguro" sub="Toda transacción es verificada directamente en la blockchain. Sin intermediarios." />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { icon: ShieldCheck, title: "Verificación Blockchain Real", desc: "Consultamos directamente la API de TronScan para validar cada TXID en la red TRON." },
              { icon: Lock, title: "Anti-Fraude Automático", desc: "El sistema detecta y rechaza TXIDs duplicados, montos incorrectos y wallets inválidas." },
              { icon: Activity, title: "Sin Intervención Humana", desc: "Todo el proceso de verificación y activación es 100% automático. Sin errores humanos." },
              { icon: Zap, title: "Infraestructura VPS Segura", desc: "Servidor dedicado con acceso restringido, monitoreo 24/7 y backups automáticos." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-7 flex gap-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 flex items-center justify-center text-gold shrink-0">
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight mb-2">{s.title}</h3>
                  <p className="text-muted text-sm">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Wallet address intentionally hidden from public pages — shown only on authenticated deposit page */}
        </div>
      </section>

      {/* ════════════════════════ PLANS ════════════════════════ */}
      <section id="planes" className="py-32 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader label="Inversión" title="Planes de Inversión" sub="Capital de trabajo + ganancia garantizada en 24 horas." />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PLANS.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: plan.badge === "POPULAR" ? 1.08 : 1.05 }}
                className={`card p-8 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 rounded-2xl border-gray-700 hover:shadow-xl ${
                  plan.badge === "POPULAR" ? "border-gold/50 shadow-[0_0_30px_rgba(250,204,21,0.15)] scale-105" : ""
                }`}
              >
                {/* Background Accent */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: plan.accent }}>
                      PLAN {plan.name.toUpperCase()}
                    </p>
                    {plan.badge && (
                      <div className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full leading-none ${
                        plan.badge === "POPULAR" ? "bg-yellow-400 text-black animate-pulse" : "bg-white/10 text-white"
                      }`}>
                        {plan.badge}
                      </div>
                    )}
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-extrabold tracking-tighter text-green-400">
                        ${plan.investment}
                      </span>
                      <span className="text-xl font-bold text-muted uppercase">usdt</span>
                    </div>
                    <div className="mt-4 space-y-1">
                      <p className="text-green-400 text-base font-bold">+{plan.profit} USDT ganancia</p>
                      <p className="text-gold text-sm font-black uppercase tracking-widest opacity-80">Total: ${plan.price}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 text-base">
                    {[
                      ["ROI", plan.roi],
                      ["Duración", "24h"],
                      ["Red", "TRC20"],
                      ["Verificación", "Automática"],
                    ].map(([k, v], j) => (
                      <div key={j} className="flex justify-between border-t border-white/5 pt-3">
                        <span className="text-muted/60">{k}</span>
                        <span className={`font-bold ${v === "Automática" || k === "ROI" ? "text-green-400" : "text-white"}`}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a 
                  href={`${TELEGRAM_BOT_LINK}?start=plan_${plan.price}`} 
                  className="relative z-10 w-full text-center bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-xl text-lg font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-yellow-400/20"
                >
                  INVERTIR AHORA
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ EDUCACIÓN Y RESULTADOS ════════════════════════ */}
      <section id="educacion" className="py-32 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader 
            label="Educación y Resultados" 
            title="Aprende cómo generar ingresos con nosotros" 
            sub="Mira resultados reales, estrategias y educación financiera directamente desde nuestro canal." 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: "Ihmyq9UqUus", title: "Como gane en 20 minutos más de $400 dólares" },
              { id: "CeqnJLdH-pw", title: "2 PAGINA PARA GENERAR INGRESOS GANA 3 DOLA" },
              { id: "W8_CnsWa1y4", title: "Como ganar dinero con Copy trading" },
            ].map((video, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="card overflow-hidden aspect-video relative mb-4 border-white/5 group-hover:border-gold/30 transition-all">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`${YOUTUBE_EMBED}${video.id}?autoplay=0`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full relative z-10"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors z-20 pointer-events-none flex items-center justify-center">
                    <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform shadow-lg shadow-gold/20">
                      <Zap className="w-6 h-6 text-black fill-current" />
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-bold leading-tight group-hover:text-gold transition-colors">{video.title}</h3>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex items-center gap-2"
            >
              Ver más en YouTube
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════ TRANSPARENCIA Y COMUNIDAD ════════════════════════ */}
      <section className="py-32 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader 
            label="Confianza" 
            title="Transparencia y Comunidad" 
            sub="Nuestra prioridad es que inviertas con total seguridad y conocimiento." 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Contenido educativo diario", desc: "Subimos videos y tutoriales para que entiendas el mercado y nuestra estrategia." },
              { title: "Resultados compartidos públicamente", desc: "Mostramos retiros, depósitos y operativas reales para total transparencia." },
              { title: "Comunidad en crecimiento", desc: "Miles de inversores confían en nuestra metodología y soporte personalizado." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-8 text-center space-y-4 border-white/5 bg-white/[0.02]"
              >
                <div className="w-12 h-12 bg-profit/10 rounded-2xl flex items-center justify-center mx-auto text-profit">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg uppercase tracking-tight">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════ FAQ ════════════════════════ */}
      <section id="faq" className="py-32 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeader label="FAQ" title="Preguntas Frecuentes" />

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <FAQItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ SUPPORT ════════════════════════ */}
      <section id="soporte" className="py-32 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeader label="Contacto" title="Soporte 24/7" sub="Nuestro equipo está disponible en todo momento para ayudarte." />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href={TELEGRAM_BOT_LINK}
              target="_blank"
              className="card card-hover p-8 text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto text-blue-400">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="font-black text-lg uppercase italic">Telegram</h3>
              <p className="text-muted text-sm">Soporte oficial del bot</p>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Contactar →</p>
            </a>

            <a
              href={`https://wa.me/${WHATSAPP_1.replace(/\D/g, "")}`}
              target="_blank"
              className="card card-hover p-8 text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto text-green-400">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="font-black text-lg uppercase italic">WhatsApp 1</h3>
              <p className="text-muted text-sm">{WHATSAPP_1}</p>
              <p className="text-green-400 text-[10px] font-black uppercase tracking-widest">Escribir →</p>
            </a>

            <a
              href={`https://wa.me/${WHATSAPP_2.replace(/\D/g, "")}`}
              target="_blank"
              className="card card-hover p-8 text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto text-green-400">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="font-black text-lg uppercase italic">WhatsApp 2</h3>
              <p className="text-muted text-sm">{WHATSAPP_2}</p>
              <p className="text-green-400 text-[10px] font-black uppercase tracking-widest">Escribir →</p>
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════ FOOTER ════════════════════════ */}
      <footer className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
              <TrendingUp className="text-black w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-sm uppercase tracking-tight block">{SITE_NAME}</span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-muted">Platforma de Inversión Automatizada</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[10px]">
            {["#como-funciona", "#planes", "#educacion", "#seguridad", "/reglas", "#faq"].map((href, i) => (
              <a key={i} href={href} className="nav-link">
                {["Cómo Funciona", "Planes", "YouTube", "Seguridad", "Reglas", "FAQ"][i]}
              </a>
            ))}
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] text-muted text-center">
            © 2026 {SITE_NAME}. TRC20 · Blockchain Verified.
          </p>
        </div>
      </footer>

    </main>
  );
}
