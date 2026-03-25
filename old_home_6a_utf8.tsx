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

// ÔöÇÔöÇÔöÇ Live Stats (simulated realistic counters) ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
function useLiveCounter(base: number, variance: number, interval = 8000) {
  const [val, setVal] = useState(base);
  useEffect(() => {
    const t = setInterval(() => setVal(v => v + Math.floor(Math.random() * variance)), interval);
    return () => clearInterval(t);
  }, []);
  return val;
}

// ÔöÇÔöÇÔöÇ FAQ Accordion ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
const FAQS = [
  { q: "┬┐Cu├ínto tarda en activarse mi inversi├│n?", a: "La verificaci├│n blockchain es autom├ítica. En menos de 2 minutos desde enviar tu TXID, el sistema valida la transacci├│n y activa tu plan." },
  { q: "┬┐Puedo retirar mis ganancias en cualquier momento?", a: "S├¡. Una vez completado el ciclo de 24 horas, tu balance est├í disponible para retiro o reinversi├│n inmediata." },
  { q: "┬┐Qu├® pasa si env├¡o el monto incorrecto?", a: "El sistema rechazar├í autom├íticamente la transacci├│n por no coincidir con el plan seleccionado. Deber├ís enviar el monto exacto seg├║n el plan." },
  { q: "┬┐El sistema es completamente autom├ítico?", a: "S├¡. La verificaci├│n, activaci├│n y pago de ganancias son 100% autom├íticos mediante blockchain y sin intervenci├│n humana." },
  { q: "┬┐Solo se acepta la red TRON (TRC20)?", a: "S├¡, ├║nicamente USDT en la red TRON (TRC20). No aceptamos BEP20, ERC20 ni ninguna otra red." },
  { q: "┬┐C├│mo funciona el sistema de referidos?", a: "Al invitar a otras personas con tu enlace ├║nico, recibes una comisi├│n de 0.30 USDT por cada inversi├│n aprobada de tus referidos." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`card overflow-hidden cursor-pointer transition-all ${open ? "border-gold/30 bg-white/[0.04]" : "bg-white/[0.02] border-white/5"}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-6 py-5 gap-4">
        <p className="font-bold text-sm pr-4 italic uppercase tracking-tight">{q}</p>
        <ChevronDown className={`w-4 h-4 text-gold shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
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
            <p className="px-6 pb-6 text-muted text-sm leading-relaxed font-medium">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ÔöÇÔöÇÔöÇ Section Header ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
function SectionHeader({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div className="text-center space-y-4 mb-20">
      <div className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-gold border border-gold/20 bg-gold/5 px-5 py-2 rounded-full italic">
        {label}
      </div>
      <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">{title}</h2>
      <div className="w-20 h-1 bg-gold mx-auto rounded-full mt-6" />
      {sub && <p className="text-muted text-lg max-w-2xl mx-auto mt-8 leading-relaxed font-medium">{sub}</p>}
    </div>
  );
}

// ÔöÇÔöÇÔöÇ Live Activity ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
function LiveActivity() {
  const [activities, setActivities] = useState([
    { id: 1, type: 'DEPOSIT', user: 'User_***45', amount: 30, time: 'Hace 2 min' },
    { id: 2, type: 'WITHDRAW', user: 'Admin_***22', amount: 15.5, time: 'Hace 5 min' },
    { id: 3, type: 'DEPOSIT', user: 'Crypto_***99', amount: 100, time: 'Hace 12 min' },
    { id: 4, type: 'WITHDRAW', user: 'Rich_***07', amount: 45, time: 'Hace 15 min' },
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      setActivities(prev => [
        { 
          id: Date.now(), 
          type: Math.random() > 0.4 ? 'DEPOSIT' : 'WITHDRAW', 
          user: `User_***${Math.floor(Math.random() * 99)}`, 
          amount: [30, 50, 100, 150, 200, 400][Math.floor(Math.random() * 6)], 
          time: 'Justo ahora' 
        },
        ...prev.slice(0, 3)
      ]);
    }, 15000);
    return () => clearInterval(t);
  }, []);

  return (
     <div className="space-y-4">
        <AnimatePresence mode="popLayout">
           {activities.map((a) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.95 }}
                className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group"
              >
                 <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${a.type === 'DEPOSIT' ? 'bg-profit/10 text-profit' : 'bg-gold/10 text-gold'}`}>
                       {a.type === 'DEPOSIT' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                    </div>
                    <div>
                       <p className="font-black text-base uppercase tracking-tight">{a.user}</p>
                       <p className="text-[10px] text-muted font-black uppercase tracking-widest italic">{a.time}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className={`font-black text-xl italic ${a.type === 'DEPOSIT' ? 'text-profit' : 'text-gold'}`}>
                       {a.type === 'DEPOSIT' ? '+' : '-'}{a.amount} USDT
                    </p>
                    <p className="text-[9px] text-muted font-black tracking-[0.3em] uppercase">NETWORK VERIFIED</p>
                 </div>
              </motion.div>
           ))}
        </AnimatePresence>
     </div>
  );
}

// ÔöÇÔöÇÔöÇ Main Content ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const fallbackStats = { users: 1247, paid: 89510, deposits: 346 };
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
    } catch (err) { console.error(err); }
  }, [user, router]);

  const SectionWrapper = ({ children, className = "", id = "" }: { children: React.ReactNode, className?: string, id?: string }) => (
    <section id={id} className={className}>{children}</section>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-gold selection:text-black overflow-x-hidden antialiased">

      {/* 1. HERO */}
      <SectionWrapper className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gold/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-profit/5 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-10">
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.4em] text-gold italic">
                <span className="w-2.5 h-2.5 rounded-full bg-profit animate-pulse" />
                SISTEMA OPERACIONAL 2026
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.85] tracking-tighter">
                Invierte USDT <br />
                <span className="text-gold">Gana Capital</span> <br />
                al Instante
              </h1>
              <p className="text-xl text-muted leading-relaxed max-w-xl font-medium">
                La plataforma l├¡der en crecimiento de USDT bajo red TRON (TRC20). Seguridad institucional y retornos autom├íticos cada 24 horas.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <Link href="/login" className="bg-gold hover:bg-yellow-300 text-black px-12 py-6 rounded-[2rem] text-xl font-black uppercase tracking-widest transition-all hover:scale-105 shadow-2xl shadow-gold/20 flex items-center justify-center">
                  EMPEZAR AHORA
                </Link>
                <a href="#planes" className="bg-white/5 hover:bg-white/10 border border-white/10 px-12 py-6 rounded-[2rem] text-xl font-black uppercase tracking-widest transition-all flex items-center justify-center">
                  VER PLANES
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="hidden lg:flex justify-end">
               <div className="card p-12 bg-white/[0.04] backdrop-blur-3xl rounded-[3.5rem] border-white/10 w-full max-w-sm relative">
                  <div className="flex justify-between items-start mb-12">
                     <p className="text-[10px] font-black italic text-muted uppercase tracking-[0.5em]">STATUS: SECURE</p>
                     <TrendingUp className="w-10 h-10 text-gold" />
                  </div>
                  <div className="space-y-12">
                     <div>
                        <p className="text-muted text-xs font-black uppercase tracking-widest mb-4">Daily Growth</p>
                        <p className="text-7xl font-black italic tracking-tighter">+50%</p>
                     </div>
                     <div className="h-32 flex items-end gap-2 px-2">
                        {[40, 70, 50, 90, 60, 110, 80, 130].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-gold/10 to-gold rounded-t-xl" style={{ height: `${h}%`, opacity: 0.3 + (h / 130) * 0.7 }} />
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* 2. STATS */}
      <SectionWrapper className="py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            {[
              { icon: Users, label: "Inversores Activos", val: activeUsers.toLocaleString(), color: "text-blue-400" },
              { icon: DollarSign, label: "USDT Pagados", val: totalPaid.toLocaleString(), color: "text-gold" },
              { icon: Activity, label: "Operaciones Exitosas", val: todayDeposit.toLocaleString(), color: "text-profit" },
            ].map((s, i) => (
              <div key={i} className="space-y-6">
                <div className={`w-20 h-20 mx-auto rounded-[2rem] bg-white/5 flex items-center justify-center ${s.color} border border-white/5`}>
                  <s.icon className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-2">{s.val}</h4>
                  <p className="text-[11px] font-black uppercase tracking-[0.5em] text-muted italic">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 3. PLANES */}
      <SectionWrapper id="planes" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <SectionHeader label="Inversi├│n" title="­ƒÄ» ESTRUCTURA DE PLANES" sub="Cada plan est├í dise├▒ado para maximizar tu capital en ciclos exactos de 24 horas." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(PLANS ?? []).map((plan, i) => (
              <motion.div key={i} whileHover={{ y: -20 }} className="card p-12 bg-white/[0.03] border-white/5 rounded-[3rem] flex flex-col justify-between group transition-all">
                <div>
                  <div className="flex justify-between items-start mb-12">
                    <p className="text-xs font-black uppercase tracking-[0.4em] italic" style={{ color: plan.accent }}>{plan.name}</p>
                    {plan.badge && <span className="bg-gold text-black text-[10px] font-black px-4 py-2 rounded-xl italic">{plan.badge}</span>}
                  </div>
                  <div className="mb-12">
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em] mb-4">Capital</p>
                    <p className="text-7xl font-black tracking-tighter italic">${plan.investment}</p>
                    <p className="text-profit text-2xl font-black italic mt-4">+{plan.profit} USDT ROI</p>
                  </div>
                </div>
                <a href={`${TELEGRAM_BOT_LINK}?start=plan_${plan.price}`} target="_blank" className="w-full bg-gold hover:bg-yellow-300 text-black py-6 rounded-2xl text-lg font-black uppercase tracking-widest transition-all shadow-xl shadow-gold/10 text-center">
                  INVERTIR
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 4. ACTIVITY */}
      <SectionWrapper className="bg-white/[0.01] border-y border-white/5">
         <div className="max-w-7xl mx-auto px-4 py-24 md:py-40">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div className="space-y-12">
                  <div>
                    <span className="text-profit text-[11px] font-black uppercase tracking-[0.5em] italic bg-profit/10 px-4 py-2 rounded-lg">LIVE ACTIVITY</span>
                    <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mt-8">PLATAFORMA EN <span className="text-profit">VIVO</span></h3>
                    <p className="text-muted text-lg font-medium mt-8 leading-relaxed italic">Monitorea cada dep├│sito y retiro procesado por nuestro nodo central en tiempo real.</p>
                  </div>
                  <LiveActivity />
               </div>
               <div className="space-y-12 bg-white/[0.02] p-12 rounded-[4rem] border border-white/5">
                  {[
                    { Icon: ShieldCheck, t: "Verificaci├│n Autom├ítica", d: "Validamos cada hash (TXID) directamente en TronScan para asegurar la operaci├│n." },
                    { Icon: Clock, t: "Ciclos de 24 Horas", d: "Tu inversi├│n se libera con ganancias exactamente 24 horas despu├®s de la activaci├│n." },
                    { Icon: Zap, t: "Pagos Instant├íneos", d: "Retiros habilitados de forma inmediata tras completar el ciclo de inversi├│n." },
                  ].map((f, i) => (
                    <div key={i} className="flex gap-8 group">
                       <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-gold group-hover:bg-gold/10 transition-all shrink-0"><f.Icon className="w-8 h-8" /></div>
                       <div>
                          <h4 className="text-xl font-black uppercase tracking-tight italic">{f.t}</h4>
                          <p className="text-muted font-medium mt-2 leading-relaxed">{f.d}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </SectionWrapper>

      {/* 5. CTA */}
      <SectionWrapper className="py-24 md:py-40 relative">
         <div className="max-w-5xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="card p-20 md:p-32 rounded-[4rem] bg-gradient-to-br from-white/[0.03] to-gold/5 border-white/10 text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl -z-10" />
               <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]">┬┐LISTO PARA TU <br /><span className="text-gold">PROGRESO?</span></h2>
               <p className="text-muted text-xl max-w-xl mx-auto mt-12 italic font-medium">├Ünete a la mayor red de inversores USDT en 2026. Seguridad, rapidez y transparencia total.</p>
               <div className="flex flex-col sm:flex-row justify-center gap-8 mt-16 pt-4">
                  <Link href="/login" className="bg-gold hover:bg-yellow-300 text-black px-16 py-7 rounded-[2rem] text-2xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-gold/30">CREAR CUENTA</Link>
                  <a href={TELEGRAM_BOT_LINK} target="_blank" className="bg-white/5 hover:bg-white/10 border border-white/10 px-16 py-7 rounded-[2rem] text-2xl font-black uppercase tracking-widest transition-all flex items-center gap-4 justify-center"><MessageCircle className="w-8 h-8" /> SOPORTE</a>
               </div>
            </motion.div>
         </div>
      </SectionWrapper>

      {/* 6. FAQ */}
      <SectionWrapper className="py-24 border-t border-white/5">
         <div className="max-w-4xl mx-auto px-4">
            <SectionHeader label="Ayuda" title="Preguntas Frecuentes" />
            <div className="space-y-6">
              {FAQS.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
            </div>
         </div>
      </SectionWrapper>

      {/* 7. FOOTER */}
      <footer className="py-24 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24 items-center">
            <div className="space-y-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gold rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-gold/20"><TrendingUp className="text-black w-8 h-8" /></div>
                <div className="space-y-1">
                   <h3 className="font-black text-4xl uppercase tracking-tighter leading-none">{SITE_NAME}</h3>
                   <p className="text-[10px] text-muted font-black uppercase tracking-[0.6em] italic">Premium Capital Systems</p>
                </div>
              </div>
              <p className="text-muted text-lg font-medium leading-relaxed italic opacity-70 italic max-w-sm">Innovaci├│n blockchain aplicada al crecimiento financiero cotidiano.</p>
            </div>
            <div className="grid grid-cols-2 gap-16">
               <div className="space-y-10 font-black italic uppercase tracking-widest">
                  <h5 className="text-[11px] text-white border-l-2 border-gold pl-4 italic">ACCESOS</h5>
                  <ul className="space-y-4 text-sm text-muted">
                    <li><a href="#planes" className="hover:text-gold">PLANES</a></li>
                    <li><a href="/login" className="hover:text-gold">DASHBOARD</a></li>
                    <li><a href="/reglas" className="hover:text-gold">REGLAS</a></li>
                  </ul>
               </div>
               <div className="space-y-10 font-black italic uppercase tracking-widest text-right">
                  <p className="text-[10px] text-profit italic">SISTEMA ONLINE</p>
                  <p className="text-white text-base">TRC20 NATIVE</p>
                  <p className="text-muted text-[10px]">VERIFIED 2026</p>
               </div>
            </div>
          </div>
          <div className="pt-16 border-t border-white/10 text-center">
             <p className="text-[11px] font-black uppercase tracking-[0.5em] text-muted italic">┬® 2026 {SITE_NAME} ┬À INFRAESTRUCTURA USDT TRC20</p>
          </div>
        </div>
      </footer>

    </main>
  );
}
