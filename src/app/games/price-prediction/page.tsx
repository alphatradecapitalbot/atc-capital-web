'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  Zap,
  Activity,
  Trophy,
  History,
  ShieldCheck,
  Users,
  Timer,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// ─── UTILS ────────────────────────────────────────────────────────
const firstNames = ["Carlos", "Luis", "Andrés", "José", "Miguel", "Juan", "Pedro", "Diego", "Fernando", "Javier", "Alex", "Daniel", "Kevin", "Marco", "Raúl"];
const lastNames = ["García", "Martínez", "López", "Rodríguez", "Hernández", "Pérez", "Sánchez", "Ramírez", "Torres", "Flores", "Rivera", "Gómez"];

const generateUniqueName = () => {
  const name = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  const number = Math.floor(Math.random() * 999);
  return `${name}${last}${number}`;
};

// ─── COMPONENTS ───────────────────────────────────────────────────

function StatBadge({ icon: Icon, label, value, colorClass = "text-gold" }: any) {
  return (
    <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md">
      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{label}</p>
        <p className="text-sm font-black text-white italic">{value}</p>
      </div>
    </div>
  );
}

function LiveWinnerNotification({ winner }: { winner: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-[#0f0f0f] border border-green-500/30 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_20px_rgba(0,255,136,0.1)] mb-3"
    >
      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
        <Trophy className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-white/40">🔥 Reciente Ganador</p>
        <p className="text-xs font-bold text-white">
          <span className="text-gold">{winner.user}</span> ganó <span className="text-green-500">${winner.amount}</span>
        </p>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────

export default function PricePredictionPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  
  // Hydration Fix
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState('10');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Game States
  const [chartData, setChartData] = useState<number[]>([]);
  const [predictionTimer, setPredictionTimer] = useState(0);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predChoice, setPredChoice] = useState<'up' | 'down' | ''>('');
  
  // FOMO States
  const [usersOnline, setUsersOnline] = useState(128);
  const [liveActivity, setLiveActivity] = useState<any[]>([]);
  const [recentWinner, setRecentWinner] = useState<any>(null);

  // Audio Engine (initialized on client)
  const audioRef = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    setMounted(true);
    // Initialize data on client only to avoid hydration mismatch
    setChartData(Array.from({length: 40}, () => 40 + Math.random() * 20));
    setLiveActivity(Array.from({ length: 6 }, (_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      user: generateUniqueName(),
      win: Math.random() > 0.45,
      amount: (Math.random() * 100 + 10).toFixed(2),
      time: `${i + 1}m`
    })));

    // Setup Audio
    ['click', 'win', 'lose', 'tick'].forEach(sound => {
      audioRef.current[sound] = new Audio(`/sounds/${sound}.mp3`);
      audioRef.current[sound].volume = 0.5;
    });

    // Realistic Counter Updates
    const counterInt = setInterval(() => {
      setUsersOnline(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 5000);

    const winnerInt = setInterval(() => {
      const winner = {
        user: generateUniqueName(),
        amount: (Math.random() * 100 + 10).toFixed(2)
      };
      setRecentWinner(winner);
      setTimeout(() => setRecentWinner(null), 4000);
    }, 8000);

    // Live Activity Generator
    const activityInt = setInterval(() => {
       const newAct = {
          id: Math.random().toString(36).substr(2, 9),
          user: generateUniqueName(),
          win: Math.random() > 0.4,
          amount: (Math.random() * 150 + 5).toFixed(2),
          time: 'En vivo'
       };
       setLiveActivity(prev => [newAct, ...prev].slice(0, 10));
    }, 4000);

    return () => {
      clearInterval(counterInt);
      clearInterval(winnerInt);
      clearInterval(activityInt);
    };
  }, []);

  useEffect(() => {
    if (user) {
      const b = typeof user.game_balance === 'string' ? parseFloat(user.game_balance) : (user.game_balance || 0);
      setBalance(b);
    }
  }, [user]);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      if (!isPredicting) {
        setChartData(prev => {
          const last = prev[prev.length - 1] || 50;
          const next = Math.max(10, Math.min(90, last + (Math.random() - 0.5) * 4));
          return [...prev.slice(1), next];
        });
      }
    }, 200);
    return () => clearInterval(interval);
  }, [isPredicting, mounted]);

  const playSound = (sound: string) => {
    if (audioRef.current[sound]) {
      audioRef.current[sound].currentTime = 0;
      audioRef.current[sound].play().catch(() => {});
    }
  };

  const handlePlay = async (choice: 'up' | 'down') => {
    if (isProcessing || isPredicting) return;
    const betVal = parseFloat(bet);
    if (!betVal || betVal < 1) return setError('Ingresa un monto válido');
    if (betVal > balance) return setError('Fondos insuficientes');

    playSound('click');
    setPredChoice(choice);
    setIsProcessing(true);
    setIsPredicting(true);
    setError('');
    setSuccess('');

    const duration = 5;
    setPredictionTimer(duration);

    const timerInt = setInterval(() => {
      setPredictionTimer(prev => {
        if (prev <= 1) { clearInterval(timerInt); return 0; }
        playSound('tick');
        return prev - 1;
      });
    }, 1000);

    try {
      const token = localStorage.getItem('atc_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/games/play`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: 'price-prediction', bet: betVal, choice })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setTimeout(() => {
        setIsPredicting(false);
        setIsProcessing(false);
        if (data.win) {
          playSound('win');
          setSuccess(`🔥 ¡ÉXITO! Ganaste $${data.winAmount.toFixed(2)}`);
        } else {
          playSound('lose');
          setError(`❌ FALLIDO. -$${betVal.toFixed(2)}`);
        }
        refreshUser();
      }, duration * 1000);

    } catch (err: any) {
      clearInterval(timerInt);
      setError(err.message || 'Error de red');
      setIsProcessing(false);
      setIsPredicting(false);
    }
  };

  if (!mounted) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
       <div className="w-12 h-12 rounded-full border-t-2 border-gold animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 bg-[#050505] font-sans selection:bg-gold selection:text-black overflow-hidden relative">
      
      {/* Background FX */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => router.push('/games')} 
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-black transition-all group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">PRICE <span className="text-gold">PREDICTION</span></h1>
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Sincronización Blockchain en tiempo real</p>
                </div>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <StatBadge icon={Users} label="LIVE PLAYERS" value={`${usersOnline}`} colorClass="text-green-500" />
              <div className="bg-white/[0.03] border border-white/10 px-8 py-4 rounded-3xl backdrop-blur-md text-right min-w-[180px]">
                 <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Tu Wallet</p>
                 <div className="text-2xl font-black text-white italic">
                    <span className="text-gold mr-1">$</span>
                    <AnimatedCounter value={balance} />
                 </div>
              </div>
           </div>
        </div>

        {/* LEFT COLUMN: THE CORE GAME */}
        <div className="lg:col-span-8 space-y-6">
           
           <div className="p-[2px] rounded-[3rem] bg-gradient-to-br from-white/20 to-transparent shadow-2xl overflow-hidden">
              <div className="bg-[#050505] rounded-[2.9rem] p-8 md:p-12 space-y-10 relative overflow-hidden">
                 
                 {/* Chart Terminal */}
                 <div className="relative h-64 md:h-80 w-full rounded-[2rem] overflow-hidden bg-white/[0.02] border border-white/5">
                    <RealTimeChart data={chartData} isPredicting={isPredicting} />
                    
                    {/* Timer Loop */}
                    <AnimatePresence>
                       {predictionTimer > 0 && (
                          <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-20"
                          >
                             <div className="text-center">
                                <motion.div 
                                  key={predictionTimer}
                                  initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                  className="text-8xl font-black italic text-gold drop-shadow-[0_0_40px_rgba(255,215,0,0.5)]"
                                >
                                  {predictionTimer}s
                                </motion.div>
                                <div className="mt-4 flex flex-col items-center gap-2">
                                   <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-gold animate-ping" />
                                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Operación en proceso</p>
                                   </div>
                                   <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: '100%' }} animate={{ width: '0%' }}
                                        transition={{ duration: 5, ease: 'linear' }}
                                        className="h-full bg-gold"
                                      />
                                   </div>
                                </div>
                             </div>
                          </motion.div>
                       )}
                    </AnimatePresence>

                    {/* Feedback Popup */}
                    <AnimatePresence>
                       {(error || success) && !isPredicting && (
                          <motion.div 
                            initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
                            className={`absolute top-8 left-1/2 -translate-x-1/2 px-12 py-5 rounded-full border-2 font-black uppercase italic text-xs tracking-widest z-30 shadow-2xl ${
                              success ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-red-500/20 border-red-500 text-red-500'
                            }`}
                          >
                             {success || error}
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </div>

                 {/* Trading Controls */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Inversión por Operación</label>
                       <div className="relative group">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gold group-hover:scale-110 transition-transform">
                             <DollarSign className="w-7 h-7" />
                          </div>
                          <input 
                            type="number" value={bet} onChange={e=>setBet(e.target.value)}
                            className="w-full bg-white/[0.04] border border-white/10 rounded-3xl py-7 pl-16 pr-8 text-3xl font-black text-white focus:border-gold focus:glow-gold transition-all outline-none"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <PredictButton type="up" active={predChoice === 'up'} disabled={isPredicting || isProcessing} onClick={() => handlePlay('up')} />
                       <PredictButton type="down" active={predChoice === 'down'} disabled={isPredicting || isProcessing} onClick={() => handlePlay('down')} />
                    </div>
                 </div>

              </div>
           </div>

           {/* FOMO Metrics */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <MetricBox icon={Timer} title="CUPOS LIMITADOS" value="Solo 3 Disponibles" urgent />
              <MetricBox icon={ShieldCheck} title="SEGURIDAD" value="Auditoría TRC20" />
              <MetricBox icon={Sparkles} title="BONIFICACIÓN" value="+20% Profit VIP" highlight />
           </div>

        </div>

        {/* RIGHT COLUMN: SOCIAL & PROOF */}
        <div className="lg:col-span-4 space-y-6">
           
           <div className="card p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] relative overflow-hidden min-h-[460px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-gold" />
                    <h2 className="text-sm font-black uppercase italic tracking-widest text-white">LIVE ACTIVITY</h2>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black text-white/30 uppercase">Sincronizado</span>
                 </div>
              </div>

              <div className="space-y-3 flex-1">
                 <AnimatePresence mode="popLayout">
                    {liveActivity.map((item) => (
                       <motion.div 
                         key={item.id}
                         initial={{ opacity: 0, scale: 0.9, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.8 }}
                         className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors group"
                       >
                          <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black ${item.win ? 'bg-green-500/20 text-green-500' : 'bg-red-500/10 text-red-500/40'}`}>
                                {item.win ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                             </div>
                             <div>
                                <p className="text-xs font-bold text-white/80 group-hover:text-gold transition-colors">{item.user}</p>
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-tighter">{item.win ? 'Predicción Exitosa' : 'Operación Fallida'}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className={`text-xs font-black italic ${item.win ? 'text-green-500' : 'text-white/20'}`}>
                                {item.win ? `+$${item.amount}` : `-$${item.amount}`}
                             </p>
                             <p className="text-[7px] font-black text-white/10 uppercase tracking-[0.2em]">{item.time}</p>
                          </div>
                       </motion.div>
                    ))}
                 </AnimatePresence>
              </div>

              {/* Instant winner toast */}
              <div className="absolute top-2 right-2 pointer-events-none">
                <AnimatePresence>
                  {recentWinner && <LiveWinnerNotification winner={recentWinner} />}
                </AnimatePresence>
              </div>
           </div>

           {/* QUICK RULES */}
           <div className="card p-8 bg-gold/[0.02] border border-gold/10 rounded-[2.5rem] space-y-6">
              <h2 className="text-[10px] font-black text-gold uppercase tracking-[0.3em] flex items-center gap-2">
                 <Info className="w-3 h-3" /> CÓMO OPERAR
              </h2>
              <ul className="space-y-4">
                 <li className="flex gap-4 items-start">
                    <span className="text-gold font-black italic text-sm">01.</span>
                    <p className="text-[11px] font-bold text-white/60 leading-tight">Analiza la tendencia del mercado en el gráfico superior.</p>
                 </li>
                 <li className="flex gap-4 items-start border-t border-white/5 pt-4">
                    <span className="text-gold font-black italic text-sm">02.</span>
                    <p className="text-[11px] font-bold text-white/60 leading-tight">Selecciona SUBE o BAJA según tu predicción técnica.</p>
                 </li>
                 <li className="flex gap-4 items-start border-t border-white/5 pt-4">
                    <span className="text-gold font-black italic text-sm">03.</span>
                    <p className="text-[11px] font-bold text-white/60 leading-tight">Confirma y espera 5 segundos por el resultado final.</p>
                 </li>
              </ul>
           </div>

        </div>

      </div>
    </div>
  );
}

// ─── HELPER COMPONENTS ───────────────────────────────────────────

function MetricBox({ icon: Icon, title, value, urgent = false, highlight = false }: any) {
  return (
    <div className={`card p-6 border-white/5 bg-white/[0.01] flex items-center justify-between transition-all hover:bg-white/[0.03] ${highlight ? 'border-gold/20' : ''}`}>
       <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${urgent ? 'bg-red-500/10 text-red-500' : highlight ? 'bg-gold/10 text-gold' : 'bg-white/5 text-white/40'}`}>
             <Icon className="w-5 h-5" />
          </div>
          <div>
             <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">{title}</p>
             <p className={`text-sm font-black italic ${urgent ? 'text-red-500 animate-pulse' : highlight ? 'text-gold' : 'text-white'}`}>{value}</p>
          </div>
       </div>
    </div>
  );
}

function RealTimeChart({ data, isPredicting }: { data: number[], isPredicting: boolean }) {
  return (
    <div className="relative w-full h-full p-6 flex items-end gap-[4px]">
       {data.map((val, i) => (
          <motion.div 
            key={i}
            initial={{ height: 0 }}
            animate={{ 
              height: `${val}%`,
              backgroundColor: i === data.length - 1 
                ? (isPredicting ? '#FFD700' : (data[i] > (data[i-1] || 0) ? '#00FF88' : '#FF4444'))
                : 'rgba(255,255,255,0.06)'
            }}
            transition={{ duration: 0.2 }}
            className={`flex-1 rounded-t-sm ${i === data.length - 1 ? 'shadow-[0_0_15px_currentColor]' : ''}`}
          />
       ))}
       <div className="absolute top-[30%] left-0 w-full h-[1px] bg-white/5 border-dashed border-b" />
       <div className="absolute top-[60%] left-0 w-full h-[1px] bg-white/5 border-dashed border-b" />
    </div>
  );
}

function PredictButton({ type, active, disabled, onClick }: { type: 'up' | 'down', active: boolean, disabled: boolean, onClick: () => void }) {
  const isUp = type === 'up';
  const colorClass = isUp 
    ? (active ? 'bg-green-500 border-white text-black shadow-[0_0_40px_rgba(34,197,94,0.4)]' : 'bg-green-500/5 border-green-500/20 text-green-500 hover:bg-green-500/10') 
    : (active ? 'bg-red-500 border-white text-black shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 'bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500/10');

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05, y: -4 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      disabled={disabled}
      onClick={onClick}
      className={`relative h-full py-9 rounded-[2.8rem] border-2 flex flex-col items-center justify-center gap-3 transition-all ${colorClass} group overflow-hidden`}
    >
       {/* Highlight glow */}
       <div className={`absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'hidden' : ''}`} />
       
       <div className={`p-3 rounded-2xl ${active ? 'bg-black/20' : 'bg-white/5'} transition-colors`}>
         {isUp ? <TrendingUp className="w-7 h-7" /> : <TrendingDown className="w-7 h-7" />}
       </div>
       <span className="text-xl font-black uppercase italic tracking-tighter">{isUp ? 'SUBE' : 'BAJA'}</span>
       
       <div className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${active ? 'bg-black text-white border-white/20' : 'bg-white/5 border-white/5 opacity-40'}`}>
          Paga 2.0x
       </div>
    </motion.button>
  );
}

function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    let start = prevValue.current;
    const end = value;
    const diff = end - start;
    if (Math.abs(diff) < 0.01) return;

    const duration = 1200;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = start + diff * (1 - Math.pow(2, -10 * progress));
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValue.current = value;
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
}
