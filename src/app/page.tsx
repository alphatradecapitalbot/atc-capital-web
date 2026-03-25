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
import Counter from "@/components/Counter";

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

  // Fallback Data
  const fallbackStats = {
    users: 1247,
    paid: 89510,
    deposits: 346
  };

  const activeUsers  = useLiveCounter(fallbackStats.users, 3, 9000);
  const totalPaid    = useLiveCounter(fallbackStats.paid, 150, 7000);
  const todayDeposit = useLiveCounter(fallbackStats.deposits, 5, 11000);

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
      console.error("Error in auth redirect:", err);
    }
  }, [user, router]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-gold selection:text-black overflow-x-hidden">

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-profit/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gold">
                <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
                Sistema Activo · Verificación Blockchain
              </div>

              <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-[0.9] tracking-tighter">
                Invierte en USDT y genera{" "}
                <span className="text-gold">ingresos automáticos</span>{" "}
                con {SITE_SHORT}
              </h1>

              <p className="text-lg text-muted leading-relaxed max-w-xl">
                Plataforma automatizada de inversión con verificación blockchain en tiempo real y rendimientos garantizados cada 24 horas.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  href="/login" 
                  className="bg-gold hover:bg-yellow-300 text-black px-10 py-5 rounded-2xl text-lg font-black uppercase tracking-wider transition-all hover:scale-[1.05] active:scale-95 shadow-xl shadow-gold/20"
                >
                  EMPEZAR AHORA
                </Link>
                <a href="#planes" className="bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-5 rounded-2xl text-lg font-black uppercase tracking-wider transition-all">
                  VER PLANES →
                </a>
              </div>
            </motion.div>

            {/* RIGHT — floating card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex justify-end"
            >
              <div className="card glow-gold w-full max-w-md p-10 animate-float border-white/10 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem]">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-2">PLATAFORMA ACTIVA</p>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">{SITE_SHORT} CAPITAL</h3>
                  </div>
                  <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20">
                    <TrendingUp className="w-6 h-6 text-black" />
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-3">Rendimiento Estimado</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-black tracking-tighter">USDT</span>
                      <span className="text-profit text-4xl font-black">+50%</span>
                      <span className="text-muted text-sm font-bold ml-auto">DAILY</span>
                    </div>
                  </div>

                  {/* Bar Chart Representation */}
                  <div className="h-24 flex items-end gap-1.5 px-2">
                    {[35, 60, 45, 80, 55, 90, 70, 100, 82, 115, 95].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                        className="flex-1 rounded-t-lg bg-gradient-to-t from-gold/40 to-gold"
                        style={{ opacity: 0.3 + (h / 115) * 0.7 }}
                      />
                    ))}
                  </div>

                  {/* Trusted Badges */}
                  <div className="flex items-center justify-between pt-8 border-t border-white/10">
                    <div className="flex items-center gap-2.5 text-profit text-[11px] font-black uppercase tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
                      OPERACIONAL
                    </div>
                    <div className="text-[10px] text-muted font-black uppercase tracking-[0.2em]">
                      TRC20 · SECURE
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ STATS (Standalone) ════════════════════════ */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { icon: Users, label: "Usuarios Inviertiendo", val: <Counter value={activeUsers} />, color: "text-blue-400" },
              { icon: DollarSign, label: "USDT Pagados a Miembros", val: <Counter value={totalPaid} />, color: "text-gold" },
              { icon: Activity, label: "Operaciones Exitosas Hoy", val: <Counter value={todayDeposit} />, color: "text-profit" },
            ].map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className={`w-14 h-14 mx-auto rounded-3xl bg-white/5 flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-4xl font-black tracking-tighter text-white mb-1 group-hover:scale-110 transition-transform">
                    {s.val}
                  </h4>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ PLANES ════════════════════════ */}
      <section id="planes" className="py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            label="Inversión" 
            title="🎯 PLANES DE ALTO RENDIMIENTO" 
            sub="Capital de trabajo + ganancia garantizada procesada automáticamente en 24 horas." 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PLANS.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className={`card p-10 relative overflow-hidden flex flex-col justify-between group transition-all duration-500 rounded-[2.5rem] border-white/5 bg-white/[0.02] hover:bg-white/[0.04] ${
                  plan.badge === "POPULAR" ? "border-gold/30 shadow-[0_0_50px_rgba(250,204,21,0.1)] scale-[1.02]" : ""
                }`}
              >
                {/* Visual Flair */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} blur-[60px] opacity-20 transition-opacity group-hover:opacity-40`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em]" style={{ color: plan.accent }}>
                      {plan.name}
                    </p>
                    {plan.badge && (
                      <div className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest bg-gold text-black rounded-full leading-none animate-pulse-slow shadow-lg shadow-gold/20">
                        {plan.badge}
                      </div>
                    )}
                  </div>

                  <div className="mb-10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-7xl font-black tracking-tighter text-white">
                        ${plan.investment}
                      </span>
                      <span className="text-xl font-bold text-muted uppercase italic">usdt</span>
                    </div>
                    <div className="mt-4 flex flex-col gap-1">
                      <p className="text-profit text-lg font-black italic uppercase tracking-tight">+{plan.profit} USDT GANANCIA</p>
                      <p className="text-muted/60 text-xs font-bold tracking-widest uppercase">RECIBES EN TOTAL: ${plan.price}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10 text-sm">
                    {[
                      ["ROI TOTAL", plan.roi],
                      ["DURACIÓN", "24 HORAS"],
                      ["RED NATIVA", "TRON (TRC20)"],
                      ["PAGO", "AUTOMÁTICO"],
                    ].map(([k, v], j) => (
                      <div key={j} className="flex justify-between items-center py-3 border-t border-white/5">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{k}</span>
                        <span className={`font-black tracking-tight ${k === "ROI TOTAL" ? "text-profit" : "text-white"}`}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a 
                  href={`${TELEGRAM_BOT_LINK}?start=plan_${plan.price}`} 
                  target="_blank"
                  className="relative z-10 w-full text-center bg-gold hover:bg-yellow-300 text-black py-5 rounded-2xl text-base font-black uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_30px_rgba(250,204,21,0.3)]"
                >
                  INVERTIR YA
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ CTA / GET STARTED ════════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card p-16 md:p-24 rounded-[3rem] bg-gradient-to-br from-gold/20 via-white/[0.02] to-profit/10 border-white/10 text-center space-y-10 relative overflow-hidden"
          >
             {/* Background Effects */}
             <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl -z-10" />
             <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[100px] rounded-full" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-profit/10 blur-[100px] rounded-full" />

             <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
               ¿LISTO PARA TU PRIMERA <span className="text-gold">GANANCIA?</span>
             </h2>
             <p className="text-muted text-lg max-w-2xl mx-auto font-medium">
               Únete a los miles de inversores que ya están generando USDT de forma pasiva y segura mediante nuestra infraestructura blockchain avanzada.
             </p>
             <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                <Link href="/login" className="bg-gold hover:bg-yellow-300 text-black px-12 py-6 rounded-2xl text-xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-gold/30">
                  CREAR MI CUENTA
                </Link>
                <a 
                  href={TELEGRAM_BOT_LINK} 
                  target="_blank"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 px-12 py-6 rounded-2xl text-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-6 h-6" /> SOPORTE
                </a>
             </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════ EXTRA CONTENT SECTIONS ════════════════════════ */}
      <GamesSection />

      <section id="como-funciona" className="py-32 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader label="Proceso" title="¿Cómo Funciona?" sub="En 6 pasos simples, tu inversión estará activa y generando rendimientos." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { n: "01", icon: TrendingUp, title: "Elige tu Plan", desc: "Selecciona el monto que deseas invertir según nuestras opciones disponibles." },
              { n: "02", icon: DollarSign, title: "Envía USDT", desc: "Transfiere a nuestra wallet oficial en la red TRON (TRC20) únicamente." },
              { n: "03", icon: Activity, title: "Envía el TXID", desc: "El bot validará tu hash de transacción directamente en el explorador." },
              { n: "04", icon: ShieldCheck, title: "Verificación", desc: "El sistema valida la Red, el Monto y el Destinatario automáticamente." },
              { n: "05", icon: Zap, title: "Activación", desc: "Tu inversión se marca como ACTIVA al instante tras la confirmación." },
              { n: "06", icon: Clock, title: "Recibe Pagos", desc: "En 24 horas tu balance se actualiza con el capital + la ganancia." },
            ].map((s, i) => (
              <div key={i} className="card p-10 space-y-6 group bg-white/[0.02] border-white/5 hover:border-gold/20 transition-all rounded-[2rem]">
                 <div className="flex justify-between items-center text-gold">
                    <s.icon className="w-10 h-10" />
                    <span className="text-4xl font-black opacity-10">{s.n}</span>
                 </div>
                 <h3 className="text-xl font-black uppercase tracking-tight">{s.title}</h3>
                 <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeader label="Soporte" title="Preguntas Frecuentes" sub="Resolvemos tus dudas sobre el sistema y los pagos." />
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ FOOTER ════════════════════════ */}
      <footer className="py-20 border-t border-white/5 bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="space-y-6 max-w-sm">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20">
                  <TrendingUp className="text-black w-6 h-6" />
                </div>
                <span className="font-black text-2xl uppercase tracking-tighter">{SITE_NAME}</span>
              </Link>
              <p className="text-muted text-sm leading-relaxed">
                La plataforma líder de inversión automatizada en USDT TRC20. Seguridad blockchain garantizada y rendimientos diarios estables.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Plataforma</h5>
                <ul className="space-y-3 text-sm text-muted">
                  <li><a href="#planes" className="hover:text-gold transition-colors">Planes</a></li>
                  <li><a href="#como-funciona" className="hover:text-gold transition-colors">Proceso</a></li>
                  <li><a href="#juegos" className="hover:text-gold transition-colors">Juegos</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Soporte</h5>
                <ul className="space-y-3 text-sm text-muted">
                  <li><a href="/login" className="hover:text-gold transition-colors">Dashboard</a></li>
                  <li><a href="/reglas" className="hover:text-gold transition-colors">Reglas</a></li>
                  <li><a href={TELEGRAM_BOT_LINK} className="hover:text-gold transition-colors">Telegram</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              © 2026 {SITE_NAME}. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-8">
               <span className="text-[10px] font-black uppercase tracking-widest text-profit">Red TRC20 Only</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-gold italic">Alpha Verified</span>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
