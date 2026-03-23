'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  AlertCircle,
  ChevronLeft,
  Volume2,
  VolumeX,
  Zap,
  Activity,
  ArrowUp,
  ArrowDown,
  ArrowDownLeft,
  PieChart,
  Target,
  BarChart4,
  Box,
  Gift,
  TrendingUp,
  TrendingDown,
  Cpu,
  ShieldCheck,
  Coins,
  History,
  Sparkles,
  ArrowRightLeft,
  Info,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GAMES_DATA } from '../gameData';

// ─── LIVE ACTIVITY ENGINE ──────────────────────────────────
const firstNames = ["Carlos", "Luis", "Andrés", "José", "Miguel", "Juan", "Pedro", "Diego", "Fernando", "Javier", "Alex", "Daniel", "Kevin", "Marco", "Raúl"];
const lastNames = ["García", "Martínez", "López", "Rodríguez", "Hernández", "Pérez", "Sánchez", "Ramírez", "Torres", "Flores", "Rivera", "Gómez"];
const usedNames = new Set<string>();

const generateUniqueName = () => {
  let newName;
  let attempts = 0;
  do {
    const name = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const number = Math.floor(Math.random() * 999);
    newName = `${name}${last}${number}`;
    attempts++;
  } while (usedNames.has(newName) && attempts < 100);
  usedNames.add(newName);
  return newName;
};

// ─── AUDIO ENGINE ───────────────────────────────────────────
let currentAudio: HTMLAudioElement | null = null;
const playSound = (type: 'click' | 'win' | 'lose' | 'spin' | 'tick') => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentAudio = new Audio(`/sounds/${type}.mp3`);
  currentAudio.volume = 0.5;
  if (type === 'spin') currentAudio.loop = true;
  currentAudio.play().catch(() => {});
};

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.game as string;
  const game = GAMES_DATA[gameId];

  const { user, refreshUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<{win: boolean, amount: number, multiplier?: number} | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Game Specific States
  const [spinChoice, setSpinChoice] = useState<'red' | 'green' | 'black' | ''>('');
  const [rushTarget, setRushTarget] = useState('1.50');
  const [riskTier, setRiskTier] = useState<'low' | 'medium' | 'high' | ''>('');
  const [candleChoice, setCandleChoice] = useState<'red' | 'green' | ''>('');

  // Market Spin Specific
  const [selectedColor, setSelectedColor] = useState<'red' | 'black' | 'green' | ''>('');
  const [rotation, setRotation] = useState(0);
  const [spinHistory, setSpinHistory] = useState<('red' | 'black' | 'green')[]>(['red', 'black', 'red', 'green', 'black', 'black']);
  const [isSpinning, setIsSpinning] = useState(false);
  const rotationValue = useRef(0);
  const lastTickAngle = useRef(0);

  // Price Prediction Specific
  const [chartData, setChartData] = useState<number[]>(Array.from({length: 40}, () => 50 + Math.random() * 10));
  const [predictionTimer, setPredictionTimer] = useState(0);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predHistory, setPredHistory] = useState<('up' | 'down')[]>(['up', 'up', 'down', 'up', 'down']);
  const [predChoice, setPredChoice] = useState<'up' | 'down' | ''>('');

  // Live Chart Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPredicting) {
        setChartData(prev => {
          const last = prev[prev.length - 1];
          const next = Math.max(10, Math.min(90, last + (Math.random() - 0.5) * 4));
          return [...prev.slice(1), next];
        });
      }
    }, 200);
    return () => clearInterval(interval);
  }, [isPredicting]);

  // Trigger tick sounds as the wheel rotates
  const handleRotationUpdate = (latest: any) => {
    const currentAngle = typeof latest === 'number' ? latest : parseFloat(latest);
    const diff = Math.abs(currentAngle - lastTickAngle.current);
    if (diff >= (360 / 37)) {
      playSound('click'); // Using click as tick
      lastTickAngle.current = currentAngle;
    }
    rotationValue.current = currentAngle;
  };

  // Reward Box Specific
  const [boxesEnabled, setBoxesEnabled] = useState(false);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [revealResult, setRevealResult] = useState<any>(null);
  const [streakCount, setStreakCount] = useState(0);
  const [showFloating, setShowFloating] = useState<{show: boolean, amount: number, win: boolean} | null>(null);

  // Live Activity state
  const [liveActivity, setLiveActivity] = useState<{user: string, amount: number, win: boolean, time: string}[]>([]);

  useEffect(() => {
    // Initialize with 5 entries
    const initial = Array.from({ length: 5 }, (_, i) => ({
      user: generateUniqueName(),
      win: Math.random() > 0.4,
      amount: parseFloat((Math.random() * 50 + 5).toFixed(2)),
      time: `Hace ${i + 1}m`
    }));
    setLiveActivity(initial);

    let timeoutId: NodeJS.Timeout;
    const spawnActivity = () => {
      const delay = Math.floor(Math.random() * (5000 - 2000 + 1) + 2000);
      timeoutId = setTimeout(() => {
        setLiveActivity(prev => {
          const newAct = {
            user: generateUniqueName(),
            win: Math.random() > 0.45,
            amount: parseFloat((Math.random() * 150 + 10).toFixed(2)),
            time: 'En vivo'
          };
          return [newAct, ...prev].slice(0, 10);
        });
        spawnActivity();
      }, delay);
    };

    spawnActivity();
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (user) {
      const b = typeof user.game_balance === 'string' ? parseFloat(user.game_balance) : (user.game_balance || 0);
      setBalance(b);
    }
  }, [user]);

  if (!game) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-black uppercase tracking-widest">Juego no encontrado</div>;

  const triggerSound = (key: 'click' | 'win' | 'lose' | 'spin') => {
    if (soundEnabled) playSound(key);
  };

  const handleSpin = () => {
    if (isSpinning || isProcessing) return;
    play();
  };

  const play = async (choice?: string) => {
    if (cooldown || isProcessing) return;
    const betVal = parseFloat(bet);
    if (!betVal || betVal <= 0) return setError('Ingresa un monto válido');
    if (betVal > balance) return setError('Fondos insuficientes');

    // Validate choices based on game
    const finalChoice = choice || '';
    if (gameId === 'market-spin' && !selectedColor) return setError('Selecciona un color');
    if (gameId === 'price-prediction' && !finalChoice) return setError('Selecciona tendencia');
    if (gameId === 'quick-trade' && !riskTier) return setError('Selecciona nivel de riesgo');
    if (gameId === 'candle-challenge' && !candleChoice) return setError('Selecciona una vela');

    const choiceToSubmit = choice || spinChoice || rushTarget || riskTier || candleChoice || 'open';

    // ─── MARKET SPIN LOGIC ──────────────────────────────────────
    if (gameId === 'market-spin') {
      if (!selectedColor) return setError('Selecciona un color');
      setIsProcessing(true);
      setError(''); setSuccess('');
      setIsSpinning(true);
      triggerSound('spin'); // Using specialized spin loop

      try {
        const token = localStorage.getItem('atc_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/games/play`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ game: 'market-spin', bet: betVal, choice: selectedColor })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        
        const winningColor = data.result; 

        // Calculate rotation to land on winningColor
        const redSlots = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
        let targetSlot = 0;
        if (winningColor === 'red') targetSlot = redSlots[Math.floor(Math.random() * redSlots.length)];
        else if (winningColor === 'black') targetSlot = Array.from({length: 36}, (_, i) => i + 1).filter(n => !redSlots.includes(n) && n !== 0)[Math.floor(Math.random() * 18)];
        else targetSlot = 0; // Green is 0

        const degreesPerSlot = 360 / 37;
        const baseRotation = 360 * (5 + Math.floor(Math.random() * 3));
        const finalRotation = baseRotation + (360 - (targetSlot * degreesPerSlot));

        setRotation(prev => {
          const currentTotal = prev % 360;
          return prev + (360 - currentTotal) + finalRotation;
        });

        setTimeout(() => {
          setIsSpinning(false);
          const multiplier = winningColor === 'green' ? 5 : 2;
          setLastResult({
            win: data.win,
            amount: data.win ? data.winAmount : betVal,
            multiplier: data.win ? multiplier : undefined
          });
          if (data.win) playSound('win'); else playSound('lose');
          setSpinHistory(prev => [winningColor as 'red' | 'green' | 'black', ...prev].slice(0, 10));
          setIsProcessing(false);
          refreshUser();
          setCooldown(false);
        }, 5000);

      } catch (err: any) {
        setError(err.message);
        setIsProcessing(false);
        setIsSpinning(false);
        setCooldown(false);
      }
      return;
    }

    // ─── PRICE PREDICTION LOGIC ────────────────────────────────
    if (gameId === 'price-prediction') {
      if (!choice) return setError('Selecciona una tendencia');
      setIsProcessing(true); setIsPredicting(true);
      setError(''); setSuccess('');

      const duration = 5; // Fixed 5s for simplicity, can be random 5-10
      setPredictionTimer(duration);

      const timerInt = setInterval(() => {
        setPredictionTimer(prev => {
          if (prev <= 1) { clearInterval(timerInt); return 0; }
          playSound('tick'); // Specialized timer sound
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

        const finalTrend = data.result;

        // Wait for timer to finish before showing result
        setTimeout(() => {
          setIsPredicting(false);
          setLastResult({ win: data.win, amount: data.win ? data.winAmount : betVal });
          if (data.win) playSound('win'); else playSound('lose');
          setPredHistory(prev => [finalTrend as 'up' | 'down', ...prev].slice(0, 5));
          setIsProcessing(false);
          refreshUser();
          setCooldown(false);
        }, duration * 1000);

      } catch (err: any) {
        clearInterval(timerInt);
        setError(err.message);
        setIsProcessing(false); setIsPredicting(false);
      }
      return;
    }

    triggerSound('click');
    setError('');
    setSuccess('');
    setIsProcessing(true);
    setLastResult(null);
    setCooldown(true);

    await new Promise(r => setTimeout(r, 1800));

    try {
      const token = localStorage.getItem('atc_token');
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const endpoint = gameId === 'reward-box' ? '/api/games/reward-box' : '/api/games/play';
      const res = await fetch(`${api}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ game: gameId, bet: betVal, choice: choiceToSubmit })
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLastResult({ win: false, amount: betVal });
        playSound('lose');
      } else {
        if (gameId === 'reward-box') {
          setRevealResult(data);
          setBoxesEnabled(true);
          setSuccess('🎁 ¡CAJA LISTA! SELECCIONA UNA PARA REVELAR');
        } else {
          setLastResult({ win: data.win, amount: data.win ? data.winAmount : betVal });
          if (data.win) {
            setSuccess(`🎉 Ganaste +$${data.winAmount.toFixed(2)}`);
            playSound('win');
          } else {
            setError(`❌ Perdiste -$${betVal.toFixed(2)}`);
            playSound('lose');
          }
        }
        await refreshUser();
      }
    } catch (e) {
      setError('Falla de terminal intermitente');
    } finally {
      if (gameId !== 'reward-box') {
        setIsProcessing(false);
        setTimeout(() => setCooldown(false), 2000);
      } else {
        setIsProcessing(false);
      }
    }
  };

  const handleBoxClick = async (index: number) => {
    if (!boxesEnabled || selectedBoxIndex !== null || !revealResult) return;

    setSelectedBoxIndex(index);
    triggerSound('click');
    setCooldown(true);
    setSuccess('');
    setError('');

    // Engagement: Near-Miss Effect (1 in 5 plays have longer delay)
    const isNearMiss = Math.random() < 0.20;
    const delay = isNearMiss ? 2500 : 800;

    await new Promise(r => setTimeout(r, delay));

    const { win, winAmount } = revealResult;
    setLastResult({ win, amount: win ? winAmount : parseFloat(bet) });
    setShowFloating({ show: true, amount: win ? winAmount : parseFloat(bet), win });

    if (win) {
      triggerSound('win');
      setStreakCount(prev => prev + 1);
    } else {
      triggerSound('lose');
      setStreakCount(0);
    }

    // Keep result visible for 4s
    setTimeout(() => {
      setLastResult(null);
      setShowFloating(null);
      setCooldown(false);
      setBoxesEnabled(false);
      setSelectedBoxIndex(null);
      setRevealResult(null);
    }, 4500);
  };

  const FloatingFeedback = ({ win, amount }: { win: boolean; amount: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: -50, scale: 1 }}
      exit={{ opacity: 0, y: -100, scale: 0.5 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-black uppercase tracking-widest text-2xl z-50 ${win ? 'text-profit' : 'text-red-500'}`}
    >
      {win ? `+${amount.toFixed(2)}` : `-${amount.toFixed(2)}`}
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-[#050505] font-sans selection:bg-gold selection:text-black">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Navigation & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
           <div className="space-y-6">
              <button onClick={() => router.push('/games')} className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40 hover:text-gold transition-colors">
                 <ChevronLeft className="w-3 h-3" /> Regresar al listado
              </button>
              <div className="flex items-center gap-5">
                 <div className="w-16 h-16 rounded-[2rem] bg-gold/10 border border-gold/10 flex items-center justify-center text-gold">
                    <game.icon className="w-8 h-8" />
                 </div>
                 <div>
                    <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight">{game.name}</h1>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">{game.desc}</p>
                 </div>
              </div>
           </div>

           <div className="flex flex-col items-end gap-1">
              <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Balance de Juego:</p>
              <div className="text-4xl md:text-5xl font-black text-white italic">
                 <span className="text-gold mr-1">$</span>
                 {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

           {/* Left Column: Game Terminal */}
           <div className="md:col-span-7 space-y-8">

              <motion.div
                animate={{
                  x: lastResult?.win === false ? [0,-5,5,-5,5,0] : 0,
                  borderColor: lastResult?.win ? 'rgba(0,255,100,0.3)' : lastResult?.win === false ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.05)'
                }}
                className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden backdrop-blur-3xl"
              >
                 {isProcessing && (
                   <div className="absolute inset-0 bg-[#050505]/95 z-40 flex flex-col items-center justify-center gap-6">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-16 h-16 rounded-full border-t-2 border-gold" />
                      <p className="text-[10px] font-black text-gold uppercase tracking-[0.4em] animate-pulse">Sincronizando...</p>
                   </div>
                 )}

                  {/* Rendering specific game controls */}
                  <div className="space-y-8 min-h-[300px] flex flex-col justify-center">
                     
                     {gameId === 'price-prediction' && (
                       <div className="space-y-10 py-6">
                          {/* Chart Section */}
                          <div className="relative">
                             <RealTimeChart 
                               data={chartData} 
                               status={lastResult ? (lastResult.win ? (predChoice === 'up' ? 'up' : 'down') : (predChoice === 'up' ? 'down' : 'up')) : 'neutral'} 
                             />
                             
                             {/* Overlay Timer */}
                             {predictionTimer > 0 && (
                               <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-[2rem]">
                                  <div className="text-center">
                                     <div className="text-6xl font-black text-white italic mb-2">{predictionTimer}s</div>
                                     <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div 
                                          initial={{ width: '100%' }}
                                          animate={{ width: '0%' }}
                                          transition={{ duration: predictionTimer, ease: 'linear' }}
                                          className="h-full bg-gold shadow-[0_0_10px_#FFD700]"
                                        />
                                     </div>
                                  </div>
                               </div>
                             )}
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-6 w-full max-w-md mx-auto">
                             <motion.button
                               whileHover={!isPredicting ? { scale: 1.05, boxShadow: '0 0 20px rgba(0,255,136,0.3)' } : {}}
                               whileTap={!isPredicting ? { scale: 0.95 } : {}}
                               disabled={isPredicting || isProcessing}
                               onClick={() => { setPredChoice('up'); play('up'); }}
                               className={`py-8 rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                                 predChoice === 'up' ? 'bg-[#00FF88] border-white text-white' : 'bg-[#00FF88]/10 border-[#00FF88]/30 text-[#00FF88]'
                               } disabled:opacity-50`}
                             >
                                <TrendingUp className="w-8 h-8" />
                                <span className="font-black uppercase tracking-widest text-lg">SUBE</span>
                                <span className="text-[10px] font-black opacity-60">Paga x2</span>
                             </motion.button>

                             <motion.button
                               whileHover={!isPredicting ? { scale: 1.05, boxShadow: '0 0 20px rgba(255,68,68,0.3)' } : {}}
                               whileTap={!isPredicting ? { scale: 0.95 } : {}}
                               disabled={isPredicting || isProcessing}
                               onClick={() => { setPredChoice('down'); play('down'); }}
                               className={`py-8 rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                                 predChoice === 'down' ? 'bg-[#FF4444] border-white text-white' : 'bg-[#FF4444]/10 border-[#FF4444]/30 text-[#FF4444]'
                               } disabled:opacity-50`}
                             >
                                <TrendingDown className="w-8 h-8" />
                                <span className="font-black uppercase tracking-widest text-lg">BAJA</span>
                                <span className="text-[10px] font-black opacity-60">Paga x2</span>
                             </motion.button>
                          </div>

                          {/* History tracker */}
                          <div className="flex gap-4 items-center justify-center bg-white/[0.02] p-5 rounded-[2rem] border border-white/5">
                             <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] mr-4">Tendencias:</span>
                             {predHistory.map((h, i) => (
                               <div key={i} className={`p-2 rounded-lg ${h === 'up' ? 'bg-[#00FF88]/20 text-[#00FF88]' : 'bg-[#FF4444]/20 text-[#FF4444]'}`}>
                                  {h === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                               </div>
                             ))}
                          </div>
                       </div>
                     )}

                     {gameId === 'market-spin' && (
                        <div className="flex flex-col items-center gap-10 py-10 relative">
                           {/* Selection Controls */}
                           <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                              {(['red', 'green', 'black'] as const).map(c => (
                                 <button key={c} onClick={() => setSelectedColor(c)} className={`py-6 rounded-2xl flex flex-col items-center gap-3 border-2 transition-all ${selectedColor === c ? 'bg-gold border-gold text-black' : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10'}`}>
                                    <div className={`w-8 h-8 rounded-full ${c === 'red' ? 'bg-red-500' : c === 'green' ? 'bg-profit' : 'bg-black'} shadow-lg`} />
                                    <span className="text-[10px] font-black uppercase">{c === 'red' ? 'Corto' : c === 'green' ? 'Jackpot' : 'Largo'}</span>
                                 </button>
                              ))}
                           </div>

                           {/* Status Indicator */}
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[180px] z-20">
                              <motion.div 
                                animate={isSpinning ? { y: [0, 5, 0] } : {}}
                                transition={{ repeat: Infinity, duration: 0.2 }}
                              >
                                 <ArrowDown className="w-10 h-10 text-gold drop-shadow-[0_0_15px_#FFD700]" />
                              </motion.div>
                           </div>

                           {/* Roulette Wheel */}
                           <div className="relative w-64 h-64 md:w-80 md:h-80">
                              <div className="absolute inset-[-10px] rounded-full border-[6px] border-gold shadow-[0_0_30px_#FFD700,inset_0_0_20px_#FFD700] opacity-20" />
                              <div className="w-full h-full p-2 bg-[#0f0f0f] rounded-full border-4 border-[#333] shadow-2xl relative overflow-hidden">
                                 <motion.div 
                                   onUpdate={handleRotationUpdate}
                                   animate={{ rotate: rotation }}
                                   transition={{ duration: 5, ease: "easeOut" }}
                                   className="w-full h-full relative"
                                 >
                                    <div className="absolute inset-0 z-0" style={{ 
                                      background: `conic-gradient(#00FF88 0deg 9.72deg, #FF4444 9.72deg 19.44deg, #0f0f0f 19.44deg 29.16deg, #FF4444 29.16deg 38.88deg, #0f0f0f 38.88deg 48.6deg, #FF4444 48.6deg 58.32deg, #0f0f0f 58.32deg 68.04deg, #FF4444 68.04deg 77.76deg, #0f0f0f 77.76deg 87.48deg, #FF4444 87.48deg 97.2deg, #0f0f0f 97.2deg 106.92deg, #0f0f0f 106.92deg 116.64deg, #FF4444 116.64deg 126.36deg, #0f0f0f 126.36deg 136.08deg, #FF4444 136.08deg 145.8deg, #0f0f0f 145.8deg 155.52deg, #FF4444 155.52deg 165.24deg, #0f0f0f 165.24deg 174.96deg, #FF4444 174.96deg 184.68deg, #FF4444 184.68deg 194.4deg, #0f0f0f 194.4deg 204.12deg, #FF4444 204.12deg 213.84deg, #0f0f0f 213.84deg 223.56deg, #FF4444 223.56deg 233.28deg, #0f0f0f 233.28deg 243deg, #FF4444 243deg 252.72deg, #0f0f0f 252.72deg 262.44deg, #FF4444 262.44deg 272.16deg, #0f0f0f 272.16deg 281.88deg, #0f0f0f 281.88deg 291.6deg, #FF4444 291.6deg 301.32deg, #0f0f0f 301.32deg 311.04deg, #FF4444 311.04deg 320.76deg, #0f0f0f 320.76deg 330.48deg, #FF4444 330.48deg 340.2deg, #0f0f0f 340.2deg 349.92deg, #FF4444 349.92deg 360deg)` 
                                    }} />
                                    {[...Array(37)].map((_, i) => (
                                      <div key={i} className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-gold/20 origin-bottom" style={{ transform: `rotate(${i * (360/37)}deg) translateX(-50%)` }} />
                                    ))}
                                 </motion.div>
                              </div>
                           </div>

                           <button 
                             onClick={() => handleSpin()} 
                             disabled={isProcessing || isSpinning}
                             className="w-full max-w-sm py-8 bg-gradient-to-r from-gold to-[#4d4200] rounded-[2.5rem] font-black text-white uppercase tracking-[0.4em] shadow-2xl disabled:opacity-50 flex items-center justify-center gap-4 group"
                           >
                              {isSpinning ? 'GIRANDO...' : 'GIRAR RULETA'}
                              <Zap className="w-6 h-6 group-hover:scale-125 transition-transform" />
                           </button>
                        </div>
                     )}

                     {gameId === 'reward-box' && (
                      <div className="grid grid-cols-3 gap-[20px] py-10 justify-items-center relative">
                        {[...Array(6)].map((_, i) => (
                          <motion.button
                            key={i}
                            disabled={!boxesEnabled || selectedBoxIndex !== null}
                            onClick={() => handleBoxClick(i)}
                            initial={{ opacity: 0.7, scale: 1 }}
                            whileHover={boxesEnabled && selectedBoxIndex === null ? { 
                              opacity: 1,
                              scale: 1.08, 
                              boxShadow: streakCount >= 2 ? '0 0 35px #FFD700' : '0 0 20px #FFD700',
                              borderColor: '#FFD700'
                            } : {}}
                            whileTap={boxesEnabled && selectedBoxIndex === null ? { scale: 0.95 } : {}}
                            animate={
                              selectedBoxIndex === i 
                                ? cooldown && !lastResult // Near-Miss Tension Phase
                                  ? { 
                                      scale: [1.2, 1.25, 1.2],
                                      x: [0, -2, 2, -2, 2, 0],
                                      borderColor: '#FFD700',
                                      boxShadow: '0 0 30px rgba(255,215,0,0.6)'
                                    }
                                  : { // Reveal Phase
                                      rotateY: 180, 
                                      scale: 1.2, 
                                      opacity: 1,
                                      borderColor: revealResult?.win ? '#00FF88' : '#FF4444',
                                      boxShadow: revealResult?.win ? '0 0 50px rgba(0,255,136,0.6)' : '0 0 30px rgba(255,68,68,0.3)' 
                                    }
                                : boxesEnabled && selectedBoxIndex === null
                                ? { 
                                    opacity: 1,
                                    scale: [1, 1.05, 1],
                                    borderColor: streakCount >= 2 ? ['rgba(255,215,0,0.5)', '#FFD700', 'rgba(255,215,0,0.5)'] : ['rgba(255,215,0,0.2)', 'rgba(255,215,0,0.6)', 'rgba(255,215,0,0.2)'],
                                    boxShadow: [
                                      '0 0 5px rgba(255,215,0,0.1)',
                                      streakCount >= 2 ? '0 0 25px rgba(255,215,0,0.5)' : '0 0 15px rgba(255,215,0,0.3)',
                                      '0 0 5px rgba(255,215,0,0.1)'
                                    ]
                                  }
                                : { opacity: 0.7, scale: 1, rotateY: 0 }
                            }
                            transition={
                              selectedBoxIndex === i && cooldown && !lastResult
                                ? { x: { repeat: Infinity, duration: 0.1 }, scale: { repeat: Infinity, duration: 0.5 } }
                                : { duration: 0.3, ease: "easeOut" }
                            }
                            style={{ transformStyle: 'preserve-3d' }}
                            className={`w-[140px] h-[140px] rounded-[16px] border-2 flex items-center justify-center transition-all bg-[#0f0f0f] overflow-hidden cursor-pointer ${
                              boxesEnabled && selectedBoxIndex === null 
                                ? 'text-gold pointer-events-auto' 
                                : selectedBoxIndex === i 
                                  ? 'text-gold pointer-events-none' 
                                  : 'text-white/10 pointer-events-none'
                            }`}
                          >
                             <div className="relative w-full h-full flex items-center justify-center p-[10px]" style={{ transformStyle: 'preserve-3d' }}>
                               {/* Front Face: Box Image */}
                               <motion.div 
                                 animate={{ opacity: selectedBoxIndex === i ? 0 : 1 }}
                                 className="absolute inset-0 flex items-center justify-center p-[10px]"
                                 style={{ backfaceVisibility: 'hidden' }}
                               >
                                  <img 
                                    src={`/images/boxes/box-${i + 1}.png`} 
                                    alt={`Box ${i + 1}`}
                                    className="w-full h-full object-contain"
                                  />
                               </motion.div>

                               {/* Back Face: Result */}
                               <motion.div 
                                 initial={{ rotateY: 180, opacity: 0 }}
                                 animate={{ opacity: selectedBoxIndex === i ? 1 : 0 }}
                                 className="absolute inset-0 flex flex-col items-center justify-center text-center p-[10px]"
                                 style={{ backfaceVisibility: 'hidden' }}
                               >
                                  {revealResult?.win ? (
                                    <div className="flex flex-col items-center gap-1">
                                       <span className="text-4xl">💰</span>
                                       <span className="text-sm font-black text-white italic">+{revealResult.winAmount.toFixed(2)}</span>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center gap-1 opacity-40">
                                       <span className="text-4xl">❌</span>
                                       <span className="text-xs font-black text-white italic uppercase">Vacía</span>
                                    </div>
                                  )}
                               </motion.div>
                             </div>
                          </motion.button>
                        ))}
                        
                        <AnimatePresence>
                           {showFloating?.show && (
                             <FloatingFeedback win={showFloating.win} amount={showFloating.amount} />
                           )}
                        </AnimatePresence>
                      </div>
                    )}

                    {gameId === 'quick-trade' && (
                      <div className="space-y-4">
                         {(['low', 'medium', 'high'] as const).map(r => (
                           <button key={r} onClick={() => setRiskTier(r)} className={`w-full p-6 rounded-2xl border-2 flex justify-between items-center transition-all ${riskTier === r ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}>
                              <div className="flex items-center gap-4">
                                 <Target className="w-5 h-5" />
                                 <span className="text-sm font-black uppercase italic">{r === 'low' ? 'Riesgo Bajo (1.3x)' : r === 'medium' ? 'Riesgo Medio (2.0x)' : 'Riesgo Alto (4.0x)'}</span>
                              </div>
                              <Sparkles className={`w-4 h-4 ${riskTier === r ? 'opacity-100' : 'opacity-0'}`} />
                           </button>
                         ))}
                      </div>
                    )}

                    {gameId === 'candle-challenge' && (
                      <div className="grid grid-cols-2 gap-6 items-end h-56">
                         <button onClick={() => setCandleChoice('green')} className={`h-full rounded-2xl border-4 transition-all flex flex-col items-center justify-center ${candleChoice === 'green' ? 'bg-profit/10 border-profit text-profit' : 'bg-white/5 border-white/5 text-white/10'}`}>
                            <div className="w-5 h-24 bg-profit rounded-sm shadow-[0_0_20px_rgba(0,255,100,0.4)]" />
                            <span className="text-[10px] font-black uppercase mt-6 tracking-widest">Cierre Alcista</span>
                         </button>
                         <button onClick={() => setCandleChoice('red')} className={`h-full rounded-2xl border-4 transition-all flex flex-col items-center justify-center ${candleChoice === 'red' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-white/5 border-white/5 text-white/10'}`}>
                            <div className="w-5 h-24 bg-red-500 rounded-sm shadow-[0_0_20px_rgba(255,100,100,0.4)]" />
                            <span className="text-[10px] font-black uppercase mt-6 tracking-widest">Cierre Bajista</span>
                         </button>
                      </div>
                    )}

                    {gameId === 'trade-rush' && (
                      <div className="space-y-10">
                        <div className="text-center space-y-2">
                           <div className="text-5xl font-black text-white italic">{rushTarget}x</div>
                           <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">Tu objetivo</p>
                        </div>
                        <input type="range" min="1.1" max="10" step="0.1" value={rushTarget} onChange={e=>setRushTarget(e.target.value)} className="w-full bg-white/10 rounded-full h-2 appearance-none cursor-pointer accent-gold" />
                        <div className="flex justify-between text-[10px] font-bold text-white/20 px-2 uppercase tracking-widest">
                           <span>Riesgo Bajo</span>
                           <span>Riesgo Extremo</span>
                        </div>
                      </div>
                    )}

                 </div>
              </motion.div>

              {/* Stake & Action Button */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                 <div className="md:col-span-8 relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20">
                       <Coins className="w-5 h-5" />
                    </div>
                    <input 
                      value={bet} 
                      onChange={e=>setBet(e.target.value)} 
                      type="number" 
                      placeholder="Monto a invertir" 
                      className="w-full h-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] pl-16 pr-8 text-xl font-black text-white focus:border-gold/50 focus:shadow-[0_0_20px_rgba(255,215,0,0.1)] outline-none" 
                    />
                 </div>
                 <div className="md:col-span-4">
                    <button 
                      disabled={cooldown || isProcessing}
                      onClick={() => play()}
                      className="w-full h-full py-6 rounded-[1.5rem] bg-gradient-to-r from-gold to-[#FFC300] text-black font-black uppercase text-xs tracking-widest shadow-xl shadow-gold/20 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50"
                    >
                       🚀 Ejecutar operación
                    </button>
                 </div>
              </div>
              
              <AnimatePresence>
                 {(error || success) && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className={`p-6 rounded-3xl border text-center font-black uppercase text-xs tracking-widest ${success ? 'bg-profit/10 border-profit text-profit' : 'bg-red-500/10 border-red-500 text-red-500'}`}>
                       {success || error}
                    </motion.div>
                 )}
              </AnimatePresence>

           </div>

           {/* Right Column: Rules & Info */}
           <div className="md:col-span-5 space-y-6">
              
              <div className="p-8 rounded-[3rem] bg-white/[0.03] border border-white/5 space-y-6">
                 <div className="flex items-center gap-3 text-gold">
                    <Info className="w-4 h-4" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Reglas del Juego</h4>
                 </div>
                 <div className="space-y-4">
                    {game.rules.map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0 text-xs font-black text-white italic">
                         <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                         <span>{rule}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6">
                 <h4 className="text-sm font-black text-white uppercase italic tracking-tighter">¿Cómo funciona?</h4>
                 <p className="text-xs font-bold text-white/50 leading-relaxed">{game.longDesc}</p>
                 <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                       <ShieldCheck className="w-3 h-3 text-gold" />
                       <span className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none">Resultados en tiempo real</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <ShieldCheck className="w-3 h-3 text-gold" />
                       <span className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none">Ejecución en Tiempo Real</span>
                    </div>
                 </div>
              </div>

              {/* Sound Toggle */}
              <button 
                onClick={() => { setSoundEnabled(!soundEnabled); playSound('click'); }}
                className={`w-full p-6 rounded-[2rem] border transition-all flex items-center justify-between ${soundEnabled ? 'bg-gold/10 border-gold/40 text-gold shadow-lg shadow-gold/5' : 'bg-white/5 border-white/10 text-white/40 opacity-60'}`}
              >
                 <div className="flex items-center gap-3">
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{soundEnabled ? 'Sonido Activado' : 'Sonido Desactivado'}</span>
                 </div>
                 <div className={`w-8 h-4 rounded-full relative transition-colors ${soundEnabled ? 'bg-gold' : 'bg-white/10'}`}>
                    <motion.div animate={{ x: soundEnabled ? 16 : 4 }} className="absolute top-1 w-2 h-2 rounded-full bg-white shadow-sm" />
                 </div>
              </button>

           </div>

        </div>
      </div>

      <AnimatePresence>
         {lastResult && (
           <ResultPopup 
             win={lastResult.win} 
             amount={lastResult.amount} 
             onComplete={() => setLastResult(null)} 
           />
         )}
      </AnimatePresence>

      {/* Social proof sections */}
      <div className="max-w-4xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 pb-20">
         
         {/* History */}
         <div className="space-y-6">
            <div className="flex items-center gap-3 text-white/40">
               <History className="w-4 h-4" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Actividad en Vivo</h4>
            </div>
            <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-4 backdrop-blur-md overflow-hidden">
               <AnimatePresence initial={false}>
                  {liveActivity.map((h, i) => (
                    <motion.div 
                      key={h.user} 
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] px-2 rounded-2xl transition-all"
                    >
                       <div className="flex items-center gap-4">
                          <div className={`text-lg ${h.win ? 'drop-shadow-[0_0_8px_#00FF88]' : 'drop-shadow-[0_0_8px_#FF4444]'}`}>
                             {h.win ? '🔥' : '❌'}
                          </div>
                          <div className="flex flex-col">
                             <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-white italic">{h.user}</span>
                                <span className={`text-[10px] font-black uppercase ${h.win ? 'text-profit/60' : 'text-red-500/60'}`}>
                                   {h.win ? 'ganó' : 'perdió'}
                                </span>
                             </div>
                             <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">{h.time}</span>
                          </div>
                       </div>
                       <span className={`text-sm font-black italic ${h.win ? 'text-profit' : 'text-red-500'}`}>
                          {h.win ? '+' : '-'}${h.amount.toFixed(2)}
                       </span>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </div>

         {/* Ranking */}
         <div className="space-y-6">
            <div className="flex items-center gap-3 text-white/40">
               <Trophy className="w-4 h-4" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Salón de la Fama</h4>
            </div>
            <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-4 backdrop-blur-md">
               {[
                 { user: 'CryptoKing', total: 15420.50, rank: 1 },
                 { user: 'AlphaOne', total: 8900.20, rank: 2 },
                 { user: 'TraderX', total: 5400.00, rank: 3 },
                 { user: 'BitHunter', total: 3200.15, rank: 4 },
                 { user: 'Omega', total: 2100.00, rank: 5 },
               ].map((r, i) => (
                 <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] px-2 rounded-2xl transition-all">
                    <div className="flex items-center gap-5">
                       <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] ${
                         r.rank === 1 ? 'bg-gold/20 text-gold border border-gold/40' : 'bg-white/5 text-white/40 border border-white/5'
                       }`}>
                          #{r.rank}
                       </div>
                       <span className="text-xs font-black text-white italic">{r.user}</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-sm font-black text-gold italic">${r.total.toLocaleString()}</span>
                       <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Total Profit</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

      </div>

    </div>
  );
}

function RealTimeChart({ data, status }: { data: number[], status: 'up' | 'down' | 'neutral' }) {
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d}`).join(' ');
  const color = status === 'up' ? '#00FF88' : status === 'down' ? '#FF4444' : '#FFD700';

  return (
    <div className="w-full h-64 bg-[#0a0a0a] rounded-[2rem] border border-white/5 relative overflow-hidden shadow-inner group">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.03),transparent)]" />
       
       <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full p-4">
          {/* Grid lines */}
          {[25, 50, 75].map(y => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="white" strokeOpacity="0.05" strokeWidth="0.1" />
          ))}

          {/* Main Line */}
          <motion.polyline
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
            initial={false}
            animate={{ stroke: color }}
            transition={{ duration: 0.5 }}
            className="drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
          />

          {/* Area under line */}
          <motion.polyline
            fill={`url(#gradient-${status})`}
            points={`${points} 100,100 0,100`}
            initial={false}
          />

          <defs>
             <linearGradient id="gradient-neutral" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
             </linearGradient>
             <linearGradient id="gradient-up" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FF88" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
             </linearGradient>
             <linearGradient id="gradient-down" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FF4444" stopOpacity="0" />
             </linearGradient>
          </defs>
       </svg>

       {/* Price point indicator */}
       <motion.div 
         animate={{ y: 100 - data[data.length-1] + '%' }}
         className="absolute right-4 w-3 h-3 rounded-full shadow-[0_0_15px_currentColor]"
         style={{ color, top: '-6px' }}
       />
    </div>
  );
}

function FloatingFeedback({ win, amount }: { win: boolean, amount: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: [0, 1, 1, 0], y: win ? -100 : 100 }}
      transition={{ duration: 2 }}
      className={`absolute z-50 text-4xl font-black italic ${win ? 'text-profit' : 'text-red-500'}`}
    >
      {win ? `+$${amount.toFixed(2)}` : `-$${amount.toFixed(2)}`}
    </motion.div>
  );
}

function ResultPopup({ win, amount, multiplier, onComplete }: { win: boolean; amount: number; multiplier?: number; onComplete: () => void }) {
  useEffect(() => { const t = setTimeout(onComplete, 4000); return () => clearTimeout(t); }, []);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 backdrop-blur-sm bg-[#050505]/60"
    >
       <motion.div 
         initial={{ scale: 0.8, opacity: 0, y: 50 }} 
         animate={win ? { scale: 1, opacity: 1, y: 0 } : { 
           scale: 1, 
           opacity: 1, 
           y: 0,
           x: [0, -20, 20, -20, 20, 0] 
         }} 
         transition={{ 
           scale: { duration: 0.3 },
           x: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] } 
         }}
         className={`relative w-full max-w-lg p-12 rounded-[5rem] border-2 text-center shadow-2xl ${
           win ? 'bg-profit/10 border-profit/50 shadow-profit/20' : 'bg-red-500/10 border-red-500/50 shadow-red-500/20'
         }`}
       >
          {win && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[5rem]">
               {[...Array(30)].map((_, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ y: 200, opacity: 1, x: 0 }}
                   animate={{ 
                     y: -600, 
                     opacity: 0, 
                     x: (Math.random() - 0.5) * 600,
                     rotate: Math.random() * 360 
                   }}
                   transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                   className={`absolute bottom-0 left-1/2 w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-gold' : 'bg-profit'}`}
                 />
               ))}
            </div>
          )}

          <div className={`w-24 h-24 rounded-[3rem] flex items-center justify-center mx-auto mb-8 ${win ? 'bg-profit text-white shadow-[0_0_30px_#00FF88]' : 'bg-red-500 text-white shadow-[0_0_30px_#FF0000]'}`}>
             {win ? <Trophy className="w-12 h-12" /> : <X className="w-12 h-12" />}
          </div>

          <h2 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
             {win ? '¡LO LOGRASTE!' : 'LO SENTIMOS'}
          </h2>
          
          <p className={`text-4xl md:text-6xl font-black italic mb-8 ${win ? 'text-profit' : 'text-red-500'}`}>
             {win ? (multiplier ? `🔥 Ganaste x${multiplier} ($${amount.toFixed(2)} USDT)` : `🔥 Ganaste +$${amount.toFixed(2)} USDT`) : '❌ Intenta otra vez'}
          </p>

          <p className="text-[12px] text-white/40 font-black uppercase tracking-[0.5em]">
             {win ? 'Saldo acreditado en tu cuenta' : '¡Sigue intentando, el próximo giro es tuyo!'}
          </p>
       </motion.div>
    </motion.div>
  );
}
