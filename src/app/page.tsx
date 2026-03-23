"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Clock, TrendingUp, Zap, Lock,
  ChevronDown, MessageCircle,
  Users, DollarSign, Activity, TrendingDown
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  PLANS, TELEGRAM_BOT_LINK,
  SITE_NAME, SITE_SHORT
} from "@/lib/constants";
import Link from "next/link";

// ─── Live Stats Hook ───────────────────
function useLiveCounter(base: number, variance: number, interval = 8000) {
  const [val, setVal] = useState(base);
  useEffect(() => {
    const t = setInterval(() => setVal(v => v + Math.floor(Math.random() * variance)), interval);
    return () => clearInterval(t);
  }, []);
  return val;
}

// ─── FAQ Component ───────────────────
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
      className={`bg-[#111] rounded-2xl border ${open ? "border-yellow-400" : "border-yellow-500/10"} overflow-hidden cursor-pointer transition-all mb-4`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <p className="font-bold text-sm uppercase text-white">{q}</p>
        <ChevronDown className={`w-4 h-4 text-yellow-400 transition-transform ${open ? "rotate-180" : ""}`} />
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

// ─── Live Activity Feed ───────────────────
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
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {activities.map((a) => (
          <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex items-center justify-between p-5 bg-[#111] border border-yellow-500/10 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${a.type === 'DEPOSIT' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                {a.type === 'DEPOSIT' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{a.user}</p>
                <p className="text-[10px] text-gray-500 uppercase">{a.time}</p>
              </div>
            </div>
            <p className={`text-base font-bold ${a.type === 'DEPOSIT' ? 'text-green-500' : 'text-yellow-500'}`}>
              {a.type === 'DEPOSIT' ? '+' : '-'}{a.amount} USDT
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Landing Page ───────────────────
export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const fallbackStats = { users: 1247, paid: 89510, deposits: 346 };
  const activeUsers = useLiveCounter(fallbackStats.users, 2);
  const totalPaid = useLiveCounter(fallbackStats.paid, 50);
  const todayDeposit = useLiveCounter(fallbackStats.deposits, 1);

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

  console.log("HOMEPAGE RENDERING - PREMIUM UI ACTIVE");

  return (
    <main className="min-h-screen bg-black overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      <div className="relative pt-20">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-6 relative z-10">
          <div className="space-y-8 max-w-4xl">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
               <span className="text-yellow-400 font-black uppercase tracking-[0.3em] text-xs mb-4 block animate-pulse">AlphaTrade Capital · 2026</span>
               <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter">
                 INVIERTE <br />
                 <span className="text-yellow-400 italic">USDT</span> & GANA
               </h1>
               <p className="text-gray-400 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
                 Genera rendimientos automáticos en la red TRC20 con ciclos de 24 horas. 
                 Seguridad total, transparencia absoluta y retiros instantáneos.
               </p>
               
               <div className="flex flex-wrap gap-4 mt-10">
                 <Link href="/login" className="px-10 py-5 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase text-sm rounded-2xl shadow-2xl shadow-yellow-400/20 transition-all hover:scale-105">
                   EMPEZAR AHORA
                 </Link>
                 <a href="#planes" className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-sm rounded-2xl border border-white/10 backdrop-blur-xl transition-all">
                   VER PLANES
                 </a>
               </div>
             </motion.div>

             {/* STATS SECTION (PREMIUM CARDS) */}
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-20 p-8 bg-[#111]/80 backdrop-blur-2xl rounded-[32px] border border-yellow-500/10">
               {[
                 { l: "USUARIOS ACTIVOS", v: activeUsers.toLocaleString(), s: "Real-time" },
                 { l: "USDT PAGADOS", v: totalPaid.toLocaleString(), s: "+$50/min" },
                 { l: "DEPÓSITOS HOY", v: todayDeposit.toLocaleString(), s: "TRC20 Native" }
               ].map((s, i) => (
                 <div key={i} className="space-y-1">
                   <p className="text-[10px] font-black text-yellow-400/50 tracking-widest">{s.l}</p>
                   <p className="text-3xl font-black text-white tracking-tighter">{s.v}</p>
                   <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">
                     <Activity size={10} /> {s.s}
                   </p>
                 </div>
               ))}
             </motion.div>
          </div>
        </section>

        {/* 3. PLANS SECTION (PREMIUM CARDS) */}
        <section id="planes" className="py-32 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-yellow-400 font-bold uppercase tracking-[0.2em] text-[10px]">Oportunidades</span>
              <h2 className="text-4xl md:text-6xl font-black text-white mt-2 tracking-tighter">PLANES DE INVERSIÓN</h2>
            </div>
            <p className="text-gray-500 max-w-xs text-sm font-bold uppercase tracking-widest leading-relaxed">Ciclos automáticos de 24 horas garantizados por smart-contract backend.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(PLANS || []).map((plan) => (
              <div
                key={plan.name}
                className="group relative bg-[#111] p-8 rounded-[32px] border border-yellow-500/10 hover:border-yellow-400 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between overflow-hidden"
              >
                {/* Decorative gradient */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-400/5 blur-[100px] group-hover:bg-yellow-400/10 transition-colors" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <h3 className="text-2xl font-black text-yellow-400 uppercase tracking-tighter italic">
                      {plan.name}
                    </h3>
                    <div className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full">
                      <span className="text-[10px] font-black text-yellow-400">ACTIVE</span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-8">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Retorno 24h</p>
                    <p className="text-5xl font-black text-white tracking-tighter italic">
                      {plan.roi}
                    </p>
                  </div>

                  <div className="p-6 bg-black/50 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-bold uppercase">Inversión</span>
                      <span className="text-white font-black">${plan.investment} USDT</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-bold uppercase">Ganancia Neta</span>
                      <span className="text-green-500 font-black">+{plan.profit} USDT</span>
                    </div>
                  </div>
                </div>

                <a 
                  href={`${TELEGRAM_BOT_LINK}?start=plan_${plan.price}`} 
                  className="relative z-10 mt-10 w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-all text-center shadow-xl shadow-white/5 group-hover:shadow-yellow-400/20"
                >
                  Activar Plan
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* 4. ACTIVITY SECTION (PREMIUM) */}
        <section className="py-32 max-w-7xl mx-auto px-6 border-t border-white/5">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div>
                <span className="text-yellow-400 font-bold uppercase tracking-[0.2em] text-[10px]">Ecosistema</span>
                <h2 className="text-4xl md:text-6xl font-black text-white mt-4 tracking-tighter italic">LIVE FEED</h2>
                <p className="text-gray-400 text-lg mt-6 leading-relaxed">
                  Transparencia total en cada ciclo. Monitorea las operaciones en tiempo real procesadas por nuestra infraestructura USDT.
                </p>
              </div>
              <LiveActivity />
            </div>
            <div className="grid gap-6">
              {[
                { i: ShieldCheck, t: "Seguridad Blockchain", d: "Cada transacción es verificada mediante el hash oficial en la red TRON." },
                { i: Clock, t: "Pagos Automáticos", d: "El sistema liquida tus ganancias exactamente 24 horas tras la activación." },
                { i: Zap, t: "Fricción Cero", d: "Envía tu TXID y el sistema activa tu capital de forma inmediata." }
              ].map((f, i) => (
                <div key={i} className="flex gap-8 p-8 bg-[#111] border border-white/5 rounded-[32px] hover:border-yellow-400 transition-all group">
                   <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                     <f.i className="w-8 h-8" />
                   </div>
                   <div>
                      <h4 className="text-xl font-bold text-white uppercase italic tracking-tight">{f.t}</h4>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">{f.d}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CTA SECTION (ULTRA PREMIUM) */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="bg-yellow-400 p-12 md:p-24 rounded-[48px] text-center relative overflow-hidden group">
             {/* Decorative patterns */}
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent" />
             
             <div className="relative z-10">
               <h2 className="text-5xl md:text-8xl font-black leading-none italic text-black tracking-tighter">
                ¿LISTO PARA <br />
                EL PROGRESO?
               </h2>
               <p className="text-black/60 text-lg md:text-xl mt-8 max-w-xl mx-auto font-bold uppercase tracking-tight">Únete ahora a la mayor red de inversores USDT. Seguridad, rapidez y transparencia total.</p>
               <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
                  <Link href="/login" className="px-14 py-6 bg-black text-white font-black uppercase text-sm rounded-2xl shadow-2xl transition-all hover:scale-105">CREAR CUENTA</Link>
                  <a href={TELEGRAM_BOT_LINK} target="_blank" className="px-14 py-6 bg-white/20 hover:bg-white/30 backdrop-blur-md text-black font-black uppercase text-sm rounded-2xl transition-all flex items-center justify-center gap-3">
                     <MessageCircle size={20} /> SOPORTE 24/7
                  </a>
               </div>
             </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-32 max-w-4xl mx-auto px-6">
           <div className="text-center mb-16">
             <span className="text-yellow-400 font-bold uppercase tracking-[0.2em] text-[10px]">Centro de Ayuda</span>
             <h2 className="text-4xl font-black text-white mt-4 italic tracking-tighter">PREGUNTAS FRECUENTES</h2>
           </div>
           <div className="space-y-4">
            {FAQS.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
           </div>
        </section>

        {/* 6. FOOTER (PREMIUM) */}
        <footer className="py-32 border-t border-white/5 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-6 grid gap-20 md:grid-cols-2">
            <div className="space-y-10">
              <Link href="/" className="flex items-center gap-4 group">
                 <div className="p-2 bg-yellow-400 rounded-xl group-hover:rotate-12 transition-transform">
                   <TrendingUp size={32} className="text-black" />
                 </div>
                 <span className="font-black text-3xl tracking-tighter uppercase text-white">{SITE_NAME}</span>
              </Link>
              <p className="text-gray-500 max-w-sm text-lg font-medium leading-relaxed italic">Innovación financiera aplicada al crecimiento de capital mediante protocolos TRC20.</p>
              <div className="flex gap-4">
                 {[Zap, ShieldCheck, Lock].map((Icon, i) => (
                   <div key={i} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-yellow-400 border border-white/10 hover:border-yellow-400 transition-colors">
                     <Icon size={24} />
                   </div>
                 ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-12">
               <div className="space-y-6">
                  <h5 className="text-white text-xs font-black tracking-widest uppercase">Plataforma</h5>
                  <ul className="space-y-4">
                    <li><a href="#planes" className="text-gray-500 hover:text-yellow-400 font-bold uppercase text-[10px] tracking-widest transition-all">Planes Activos</a></li>
                    <li><a href="/login" className="text-gray-500 hover:text-yellow-400 font-bold uppercase text-[10px] tracking-widest transition-all">Dashboard</a></li>
                  </ul>
               </div>
               <div className="space-y-6 text-right">
                  <h5 className="text-white text-xs font-black tracking-widest uppercase">Estatus</h5>
                  <div className="flex flex-col gap-2">
                     <span className="text-green-500 font-black text-[10px] uppercase tracking-widest flex items-center justify-end gap-2">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                       Network Online
                     </span>
                     <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">TRC20 Native Infrastructure</span>
                  </div>
               </div>
            </div>
          </div>
          <div className="mt-32 pt-12 border-t border-white/5 text-center">
             <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.5em]">
               © 2026 {SITE_NAME} · PROTOCOLOS BLOCKCHAIN USDT
             </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
