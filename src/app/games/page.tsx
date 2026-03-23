'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Zap, 
  TrendingUp, 
  Wallet, 
  Trophy,
  History,
  AlertCircle,
  Activity,
  Box,
  LineChart,
  BarChart4,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  Layers,
  Cpu,
  ShieldCheck,
  ChevronRight,
  Users,
  Eye,
  ArrowRightLeft,
  ArrowDownToLine,
  Volume2,
  VolumeX,
  Crown,
  Sparkles,
  Info,
  Shield,
  Coins,
  Search,
  Lock,
  Gift,
  Target,
  Gamepad2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GAMES_DATA } from './gameData';

const firstNames = ["Carlos", "Luis", "Andrés", "José", "Miguel", "Juan", "Pedro", "Diego", "Fernando", "Javier", "Alex", "Daniel", "Kevin", "Marco", "Raúl"];
const lastNames = ["García", "Martínez", "López", "Rodríguez", "Hernández", "Pérez", "Sánchez", "Ramírez", "Torres", "Flores", "Rivera", "Gómez"];

const generateUniqueName = () => {
    const name = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const number = Math.floor(Math.random() * 999);
    return `${name}${last}${number}`;
};

export default function GamesPage() {
  const { user, refreshUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [prevBalance, setPrevBalance] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [ranking] = useState<any[]>([
    { username: 'AlphaElite', profit: '12,450.50' },
    { username: 'TraderMVP', profit: '8,920.00' },
    { username: 'BitHunter', profit: '5,400.25' },
    { username: 'CryptoKing', profit: '3,200.10' },
    { username: 'OmegaProfit', profit: '2,100.00' },
  ]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Experience States
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depTxid, setDepTxid] = useState('');
  const [withAmount, setWithAmount] = useState('');
  const [withWallet, setWithWallet] = useState('');
  const [verifying, setVerifying] = useState(false);


  useEffect(() => {
    if (user) {
      setPrevBalance(balance);
      const newBal = typeof user.game_balance === 'string' ? parseFloat(user.game_balance) : (user.game_balance || 0);
      setBalance(newBal);
      fetchHistory();
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      const isWin = Math.random() > 0.45;
      const amount = (Math.random() * 100 + 10).toFixed(2);
      const gameNames = ['Reward Box', 'Market Spin', 'Price Prediction'];
      const newAction = {
        id: Math.random().toString(36).substr(2, 9),
        user: generateUniqueName(),
        game: gameNames[Math.floor(Math.random() * gameNames.length)],
        amount,
        isWin
      };
      setLiveFeed(prev => [newAction, ...prev].slice(0, 10));
    }, Math.floor(Math.random() * 3000) + 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('atc_token');
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${api}/api/games/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setHistory(data.history || []);
    } catch (e) { console.error(e); }
  };


  const verifyGameDeposit = async () => {
    if (!depTxid) return setError('Ingresa el TXID');
    setVerifying(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('atc_token');
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${api}/api/deposits/verify-game`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ txid: depTxid })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`+$${data.amount} USDT Acreditados.`);
        setDepTxid('');
        setShowDeposit(false);
        refreshUser();
      } else setError(data.error);
    } catch (e) { setError('Error de Red'); } finally { setVerifying(false); }
  };

  const requestWithdraw = async () => {
    const amt = parseFloat(withAmount);
    if (!amt || amt < 50) return setError('El retiro mínimo es de 50 USDT');
    if (amt > balance) return setError('Fondos insuficientes');
    if (!withWallet) return setError('Ingresa tu dirección de billetera');

    setVerifying(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('atc_token');
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${api}/api/withdrawals/request`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: amt, wallet: withWallet, type: 'game_balance' })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('SOLICITUD ENVIADA: Pendiente de aprobación.');
        setWithAmount('');
        setShowWithdraw(false);
        await refreshUser();
      } else setError(data.error || 'Error al solicitar el retiro');
    } catch (e) { setError('Error de Red'); } finally { setVerifying(false); }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-[#050505] font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Visual */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Zona de Juegos Interactiva</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white italic leading-[0.8]">
                ELITE <span className="text-gold">CORE</span>
              </h1>
           </div>

           <div className="flex flex-col items-end gap-1">
              <p className="text-[10px] font-black uppercase text-gold/60 tracking-widest opacity-60">Balance disponible:</p>
              <div className="flex items-baseline gap-1 text-white italic font-black">
                 <span className="text-4xl md:text-6xl">$</span>
                 <AnimateBalance value={balance} />
              </div>
           </div>
        </div>

        <AnimatePresence>
           {(error || success) && (
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-5 rounded-[2rem] border-2 backdrop-blur-3xl shadow-2xl flex items-center gap-5 ${success ? 'bg-profit/10 border-profit/40 text-profit' : 'bg-red-500/10 border-red-500/40 text-red-500'}`}>
                {success ? <Trophy className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                <span className="text-sm font-black uppercase italic tracking-widest">{success || error}</span>
             </motion.div>
           )}
        </AnimatePresence>

        {/* Dashboard Actions & Ranking */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
           <div className="md:col-span-5 bg-white/[0.03] rounded-[2.5rem] border border-white/10 p-8">
              <div className="flex items-center gap-4 mb-8 text-gold">
                 <Crown className="w-5 h-5" />
                 <h3 className="text-xl font-black uppercase italic text-white tracking-tighter">Ranking Global</h3>
              </div>
              <div className="space-y-4">
                 {ranking.map((r, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 hover:bg-white/5 px-3 rounded-xl transition-all">
                       <span className="text-xs font-bold text-white/80">{r.username}</span>
                       <span className="text-xs font-black text-profit italic">+${r.profit}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="md:col-span-4 flex flex-col gap-4">
              <button onClick={() => setShowDeposit(!showDeposit)} className="p-8 rounded-[2.5rem] border border-gold/20 bg-gold/[0.03] flex items-center justify-between hover:bg-gold/10 transition-all text-left">
                  <span className="text-2xl font-black text-white italic uppercase tracking-tighter">Depositar USDT</span>
                  <Zap className="w-8 h-8 text-gold" />
              </button>
              <AnimatePresence>
                {showDeposit && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-[#0a0a0a] border border-gold/40 rounded-3xl p-6 space-y-4">
                      <code className="text-[10px] text-white break-all font-mono font-bold block bg-white/5 p-4 rounded-xl">TAW8oK1fKhXzkfptvxcqsh24JRpLnyp77X</code>
                      <input value={depTxid} onChange={e=>setDepTxid(e.target.value)} type="text" placeholder="TXID de la operación" className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-black text-white w-full outline-none" />
                      <button onClick={verifyGameDeposit} disabled={verifying} className="w-full py-4 rounded-xl bg-gold text-black font-black uppercase text-[11px]">Verificar Depósito</button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button onClick={() => setShowWithdraw(!showWithdraw)} className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex items-center justify-between hover:bg-white/5 transition-all text-left">
                  <span className="text-2xl font-black text-white italic uppercase tracking-tighter">Retirar Fondos</span>
                  <ArrowDownToLine className="w-8 h-8 text-white/20" />
              </button>
              <AnimatePresence>
                {showWithdraw && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 space-y-4">
                      <input value={withAmount} onChange={e=>setWithAmount(e.target.value)} type="number" placeholder="Monto (Min 50 USDT)" className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-black text-white w-full outline-none" />
                      <input value={withWallet} onChange={e=>setWithWallet(e.target.value)} type="text" placeholder="Billetera TRC20" className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-black text-white w-full outline-none" />
                      <button onClick={requestWithdraw} disabled={verifying} className="w-full py-4 rounded-xl bg-white text-black font-black uppercase text-[11px]">Solicitar Retiro</button>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           <div className="md:col-span-3 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between">
              <div className="flex items-center gap-3 opacity-40 mb-6">
                 <Activity className="w-3 h-3 text-gold" />
                 <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">Actividad</span>
              </div>
              <div className="space-y-4">
                 <AnimatePresence mode="popLayout">
                    {liveFeed.map((item) => (
                      <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-white/80">{item.user}</span>
                        <span className={item.isWin ? 'text-profit' : 'text-red-500/40'}>{item.isWin ? `+$${item.amount}` : `-$${item.amount}`}</span>
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>
        </div>

        {/* GAMES LIST GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
           {Object.values(GAMES_DATA).map((game) => (
             <motion.div
               key={game.id}
               whileHover={{ y: -8 }}
               className="p-10 rounded-[3.5rem] bg-white/[0.03] border border-white/5 flex flex-col justify-between items-start gap-8 backdrop-blur-3xl relative overflow-hidden group transition-all hover:bg-white/[0.05]"
             >
                <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:scale-125 group-hover:opacity-[0.1] transition-all">
                   <game.icon className="w-32 h-32 text-gold" />
                </div>
                
                <div className="space-y-4 relative z-10">
                   <div className="w-16 h-16 rounded-[2rem] bg-gold/10 flex items-center justify-center text-gold border border-gold/10">
                      <game.icon className="w-8 h-8" />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{game.name}</h3>
                      <p className="text-xs text-[#E5E5E5] font-bold opacity-60 leading-relaxed mt-2">{game.desc}</p>
                   </div>
                </div>

                <div className="w-full space-y-6 relative z-10">
                   <div className="flex justify-between items-center px-2">
                      <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Yield {game.payout}</span>
                      <ShieldCheck className="w-4 h-4 text-white/20" />
                   </div>
                   <Link href={`/games/${game.id}`} className="block w-full py-5 rounded-[1.5rem] bg-white text-black font-black uppercase text-xs text-center tracking-widest hover:bg-gold transition-colors">
                      🎮 Jugar
                   </Link>
                </div>
             </motion.div>
           ))}
        </div>

        {/* History Log */}
        <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 space-y-10">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center text-gold">
                 <History className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Registry Log</h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-[10px] font-black uppercase text-white/20 tracking-widest border-b border-white/5">
                       <th className="px-6 py-6">Operación</th>
                       <th className="px-6 py-6 text-center">Monto</th>
                       <th className="px-6 py-6 text-center">Resultado</th>
                       <th className="px-6 py-6 text-right">Tiempo</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/[0.03]">
                    {history.slice(0, 10).map((h) => (
                       <tr key={h.id}>
                          <td className="px-6 py-6 font-black text-sm uppercase italic text-white/80">{h.game_name.replace('_', ' ')}</td>
                          <td className="px-6 py-6 text-center text-xs font-bold text-white/30">${parseFloat(h.bet_amount).toFixed(2)}</td>
                          <td className="px-6 py-6 text-center">
                             <span className={h.result === 'won' ? 'text-profit font-black uppercase text-xs' : 'text-red-500/20 text-xs font-black'}>
                                {h.result === 'won' ? `🎉 +$${parseFloat(h.win_amount).toFixed(2)}` : 'PERDIDA'}
                             </span>
                          </td>
                          <td className="px-6 py-6 text-right text-[10px] text-white/20 font-bold">{new Date(h.created_at).toLocaleTimeString()}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Education Module */}
        <section className="py-20 border-t border-white/5">
           <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter">¿CÓMO <span className="text-gold">FUNCIONAN?</span></h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoCard icon={<Cpu className="w-6 h-6"/>} title="Sistema de Juego" text="Algoritmos de probabilidades optimizados que simulan entornos de mercado reales para cada operación." />
              <InfoCard icon={<Shield className="w-6 h-6"/>} title="Balance Seguro" text="El saldo de juegos es independiente del capital de inversión, asegurando un control absoluto de tus activos." />
              <InfoCard icon={<TrendingUp className="w-6 h-6"/>} title="Rendimientos" text="Multiplica tus activos desde 1.3x hasta 5.0x dependiendo de tu estrategia y nivel de riesgo." />
           </div>
        </section>

      </div>
    </div>
  );
}

function InfoCard({ icon, title, text }: any) {
  return (
    <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 space-y-6">
       <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">{icon}</div>
       <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">{title}</h4>
       <p className="text-sm font-bold text-[#E5E5E5] leading-relaxed opacity-60">{text}</p>
    </div>
  );
}

function AnimateBalance({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);
  useEffect(() => {
    let start = prevValue.current;
    const end = value;
    const diff = end - start;
    if (diff === 0) return;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = start + diff * (1 - Math.pow(2, -10 * progress));
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(animate);
      else { prevValue.current = value; setDisplayValue(value); }
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span className={value > prevValue.current ? 'text-profit' : value < prevValue.current ? 'text-red-500' : 'text-white'}>{displayValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
}
