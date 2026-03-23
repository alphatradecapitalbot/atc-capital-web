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

  return (
    <main className="bg-black text-white min-h-screen selection:bg-yellow-500 selection:text-black antialiased">
      
      {/* GLOBAL BACKGROUND DEPTH */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-black via-[#050505] to-black">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-yellow-500 blur-[150px] opacity-10 rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500 blur-[150px] opacity-10 rounded-full" />
      </div>

      <div className="relative">
        
        {/* 1. HERO SECTION (FULL SCREEN) */}
        <section className="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl space-y-6">
            <div className="inline-block px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
              Powered by Tron Network (TRC20)
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
              Invierte USDT y Gana <span className="text-yellow-400">Capital</span> en 24 Horas
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl">
              La plataforma de inversión automatizada más segura y transparente. 
              Verificación directa en blockchain con retornos garantizados.
            </p>
            <div className="flex gap-4 mt-6">
              <Link href="/login" className="bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20">
                EMPEZAR AHORA
              </Link>
              <a href="#planes" className="bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-4 rounded-xl font-bold transition-all">
                VER PLANES
              </a>
            </div>
          </motion.div>

          {/* 2. STATS SECTION (CARD) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-3 gap-6 mt-12 bg-[#111] p-6 rounded-2xl border border-yellow-500/10">
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl md:text-3xl font-bold text-yellow-400">{(activeUsers || fallbackStats.users).toLocaleString()}</span>
              <span className="text-[10px] md:text-sm text-gray-400 uppercase font-bold text-center">Usuarios Activos</span>
            </div>
            <div className="flex flex-col items-center justify-center border-x border-white/5">
              <span className="text-2xl md:text-3xl font-bold text-yellow-400">${(totalPaid || fallbackStats.paid).toLocaleString()}</span>
              <span className="text-[10px] md:text-sm text-gray-400 uppercase font-bold text-center">USDT Pagados</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl md:text-3xl font-bold text-yellow-400">{(todayDeposit || fallbackStats.deposits).toLocaleString()}</span>
              <span className="text-[10px] md:text-sm text-gray-400 uppercase font-bold text-center">Operaciones Hoy</span>
            </div>
          </motion.div>
        </section>

        {/* 3. PLANS SECTION (CARDS) */}
        <section id="planes" className="py-20 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-white">
            Planes de inversión
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {(PLANS || []).map((plan) => (
              <div
                key={plan.name}
                className="bg-[#111] p-6 rounded-2xl border border-yellow-500/10 hover:border-yellow-400 transition hover:scale-105 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-yellow-400">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 mt-2">
                    ROI: {plan.roi}
                  </p>
                  <p className="text-white text-3xl font-bold mt-4">
                    ${plan.investment}
                  </p>
                  <p className="text-green-500 text-sm font-bold mt-1">
                    +{plan.profit} USDT ROI
                  </p>
                </div>
                <a href={`${TELEGRAM_BOT_LINK}?start=plan_${plan.price}`} className="mt-6 w-full bg-yellow-400 text-black py-2 rounded-lg font-bold hover:bg-yellow-300 transition text-center">
                  Invertir
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* 4. ACTIVITY SECTION (CARDS) */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Plataforma</span>
                <h2 className="text-4xl font-bold mt-4 text-white">Actividad en Vivo</h2>
                <p className="text-gray-400 text-lg mt-4 leading-relaxed">
                  Monitorea las operaciones en tiempo real de nuestra plataforma. Transparencia total en cada ciclo de inversión.
                </p>
              </div>
              <LiveActivity />
            </div>
            <div className="grid gap-6">
              {[
                { i: ShieldCheck, t: "Transacciones Seguras", d: "Cada hash de transacción es validado contra la blockchain oficial de TRON." },
                { i: Clock, t: "Ciclos Precisos", d: "Nuestro sistema procesa pagos exactamente 24 horas después de la activación." },
                { i: Zap, t: "Activación Instantánea", d: "Nada más enviar tu TXID, el capital empieza a trabajar para ti." }
              ].map((f, i) => (
                <div key={i} className="flex gap-6 p-6 bg-[#111] border border-yellow-500/10 rounded-2xl hover:border-yellow-400 transition-all group">
                   <f.i className="w-10 h-10 text-yellow-400" />
                   <div>
                      <h4 className="text-lg font-bold text-white">{f.t}</h4>
                      <p className="text-gray-400 text-sm mt-1">{f.d}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CTA SECTION (CARDS) */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="bg-[#111] p-12 md:p-20 rounded-2xl border border-yellow-500/10 text-center relative overflow-hidden">
             <h2 className="text-4xl md:text-5xl font-bold leading-tight uppercase italic text-white flex flex-col md:flex-row justify-center gap-2">
                ¿LISTO PARA TU <span className="text-yellow-400">PROGRESO?</span>
             </h2>
             <p className="text-gray-400 text-lg mt-6 max-w-xl mx-auto">Únete ahora a la mayor red de inversores USDT. Seguridad, rapidez y transparencia total.</p>
             <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
                <Link href="/login" className="px-12 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold uppercase rounded-xl shadow-lg shadow-yellow-500/20 transition-all hover:scale-105">CREAR CUENTA</Link>
                <a href={TELEGRAM_BOT_LINK} target="_blank" className="px-12 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-2">
                   <MessageCircle size={20} /> SOPORTE
                </a>
             </div>
          </div>
        </section>

        {/* FAQ SECTION (CARDS) */}
        <section className="py-20 max-w-4xl mx-auto px-6">
           <h2 className="text-3xl font-bold mb-10 text-center text-white">Preguntas Frecuentes</h2>
           {FAQS.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
        </section>

        {/* 6. FOOTER */}
        <footer className="py-20 border-t border-yellow-500/10">
          <div className="max-w-7xl mx-auto px-6 grid gap-16 md:grid-cols-2">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-3">
                 <TrendingUp size={28} className="text-yellow-400" />
                 <span className="font-bold text-2xl tracking-tighter uppercase text-white">{SITE_NAME}</span>
              </Link>
              <p className="text-gray-400 max-w-sm text-sm leading-relaxed">Innovación financiera aplicada al crecimiento de capital diario.</p>
              <div className="flex gap-4">
                 <div className="w-10 h-10 bg-[#111] rounded-xl flex items-center justify-center text-yellow-400 border border-yellow-500/10"><Zap size={20} /></div>
                 <div className="w-10 h-10 bg-[#111] rounded-xl flex items-center justify-center text-yellow-400 border border-yellow-500/10"><ShieldCheck size={20} /></div>
                 <div className="w-10 h-10 bg-[#111] rounded-xl flex items-center justify-center text-yellow-400 border border-yellow-500/10"><Lock size={20} /></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm uppercase font-bold">
               <div className="space-y-4">
                  <h5 className="text-gray-500 text-[10px] tracking-widest">Plataforma</h5>
                  <ul className="space-y-3">
                    <li><a href="#planes" className="text-gray-400 hover:text-yellow-400 transition-all">Planes</a></li>
                    <li><a href="/login" className="text-gray-400 hover:text-yellow-400 transition-all">Dashboard</a></li>
                  </ul>
               </div>
               <div className="space-y-4 text-right">
                  <h5 className="text-gray-500 text-[10px] tracking-widest">Sistema</h5>
                  <div className="flex flex-col gap-1">
                     <span className="text-green-500">Online Now</span>
                     <span className="text-gray-400">TRC20 Native</span>
                  </div>
               </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 text-center text-[10px] text-gray-600 uppercase font-bold tracking-widest">
             © 2026 {SITE_NAME} · INFRAESTRUCTURA USDT TRC20
          </div>
        </footer>

      </div>
    </main>
  );
}
