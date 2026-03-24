"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Award, Target, Info, CheckCircle2, AlertCircle, ArrowRight, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ParticleBackground } from "@/components/Effects";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Helper components
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#0B0B0B] rounded-2xl p-5 border border-white/5 transition-all duration-300 hover:scale-[1.02] ${className}`}>
      {children}
    </div>
  );
}

// Social Proof Animation
const SOCIAL_PROOFS = [
  { name: "Carlos M.", amount: "$0.12", time: "hace 2 min" },
  { name: "Ana Torres", amount: "$0.08", time: "hace 5 min" },
  { name: "Luis R.", amount: "$0.20", time: "hace 1 min" },
  { name: "Diego G.", amount: "$0.04", time: "hace 8 min" },
  { name: "María J.", amount: "$0.16", time: "hace 3 min" },
];

function SocialProofFeed() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SOCIAL_PROOFS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-12 mb-8">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">💸 Usuarios ganando ahora</h3>
      <div className="h-12 overflow-hidden relative w-full max-w-md flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute flex items-center gap-3 bg-[#111] border border-green-500/20 px-5 py-2 rounded-full"
          >
            <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <p className="text-sm text-gray-300 font-medium">
              <span className="text-white font-bold">{SOCIAL_PROOFS[index].name}</span> ganó <span className="text-[#00FF88] font-black">{SOCIAL_PROOFS[index].amount}</span> {SOCIAL_PROOFS[index].time}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function DashboardClient() {
  const { user, token, refreshUser, loading } = useAuth();
  const router = useRouter();
  
  // States
  const [adsToday, setAdsToday] = useState(0);
  const [adsWatched, setAdsWatched] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0); 
  const [systemCooldown, setSystemCooldown] = useState(0); 
  
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const MAX_DAILY_ADS = 20;
  const REWARD_AMOUNT = 0.004;

  // Global protection
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Tick the system cooldown (30s rule)
  useEffect(() => {
    if (systemCooldown > 0) {
      const t = setTimeout(() => setSystemCooldown(s => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [systemCooldown]);

  // Watch Timer Logic
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => setCooldownTime(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } 
  }, [cooldownTime]);

  const [isWatching, setIsWatching] = useState(false);
  
  useEffect(() => {
    if (isWatching && cooldownTime === 0) {
      claimReward();
    }
  }, [cooldownTime, isWatching]);

  const handleStartWatch = () => {
    if (!user || user.id === undefined) {
      showNotification("Inicia sesión para ganar", "error");
      return;
    }
    if (adsToday >= MAX_DAILY_ADS) {
      showNotification("Límite diario alcanzado", "error");
      return;
    }
    if (systemCooldown > 0) return;
    
    // Placeholder ad URL
    window.open("https://bit.ly/example-ad-url", "_blank");
    setIsWatching(true);
    setCooldownTime(15);
  };

  const claimReward = async () => {
    setIsWatching(false);
    setIsLoading(true);

    try {
      const res = await fetch("/api/reward", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setAdsToday(data.adsToday);
        setAdsWatched(data.adsWatched);
        showNotification(`¡Recompensa USDT añadida a tu balance!`, "success");
        setSystemCooldown(30); 
        refreshUser(); 
      } else {
        showNotification(data.error || "Error al reclamar recompensa.", "error");
      }
    } catch (err) {
      showNotification("Error de red.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  const progressPct = Math.min((adsToday / MAX_DAILY_ADS) * 100, 100);

  return (
    <div className="relative min-h-screen bg-[#020202] overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      <ParticleBackground />

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-center">
        <div className="w-[800px] h-[400px] rounded-full opacity-10 mt-[-50px]"
             style={{ background: "radial-gradient(ellipse, rgba(0,255,136,0.15) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-28 pb-20">
        
        {/* Notificación flotante */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl font-bold text-sm tracking-wide border flex items-center gap-3"
              style={{
                backgroundColor: notification.type === 'success' ? "rgba(0, 255, 136, 0.1)" : "rgba(255, 50, 50, 0.1)",
                borderColor: notification.type === 'success' ? "rgba(0, 255, 136, 0.3)" : "rgba(255, 50, 50, 0.3)",
                color: notification.type === 'success' ? "#00FF88" : "#FF5555",
                backdropFilter: "blur(12px)"
              }}
            >
              {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {notification.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER DASHBOARD */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">
              MI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-[#00D1FF]">DASHBOARD</span>
            </h1>
            <p className="text-gray-400 text-sm font-black uppercase tracking-[0.2em]">Bienvenido, {user.first_name || 'Inversor'}</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
             <div className="text-right">
                <p className="text-[10px] font-black text-muted uppercase tracking-widest">Estado de Cuenta</p>
                <p className="text-sm font-black text-profit uppercase italic">Verificada ✓</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                <ShieldCheck className="w-6 h-6" />
             </div>
          </div>
        </div>

        {/* 2. DASHBOARD (CARDS) */}
        <div id="ad-player" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          
          {/* CARD 1: BALANCE */}
          <Card className="flex flex-col justify-center text-center py-8">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">💰 BALANCE DISPONIBLE</p>
            <span className="text-4xl md:text-5xl font-black text-white mb-3">
              ${user?.balance?.toFixed(4) || "0.0000"}
            </span>
            <div className="inline-block mx-auto bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg">
              <p className="text-xs font-bold text-[#00FF88]">USDT · BEP20/TRC20</p>
            </div>
          </Card>

          {/* CARD 2: PROGRESO HOY */}
          <Card className="flex flex-col justify-center py-8">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                📊 HOY
              </p>
              <span className="text-sm font-black text-white">{adsToday} <span className="text-gray-500">/ {MAX_DAILY_ADS} anuncios</span></span>
            </div>
            
            <div className="w-full bg-[#1A1A1A] rounded-full h-4 mb-2 overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${progressPct}%` }}
                className="h-full rounded-full bg-gradient-to-r from-[#00FFB2] to-[#00D1FF]"
              />
            </div>
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold mt-2">
              Progreso Diario de Recompensas
            </p>
          </Card>

          {/* CARD 3: VER ANUNCIO */}
          <Card className="flex flex-col justify-center items-center py-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#00FF88]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 z-10">🎥 GENERAR</p>
            
            <button
                  onClick={handleStartWatch}
                  disabled={isWatching || isLoading || systemCooldown > 0 || adsToday >= MAX_DAILY_ADS}
                  className="relative px-6 py-4 rounded-xl font-black uppercase text-sm tracking-widest transition-all duration-300 w-full z-10 shadow-lg"
                  style={{
                    background: (isWatching || isLoading || systemCooldown > 0 || adsToday >= MAX_DAILY_ADS) 
                      ? "#222" 
                      : "linear-gradient(135deg, #00FF88 0%, #00CC6A 100%)",
                    color: (isWatching || isLoading || systemCooldown > 0 || adsToday >= MAX_DAILY_ADS) ? "#888" : "#000",
                    boxShadow: (isWatching || isLoading || systemCooldown > 0 || adsToday >= MAX_DAILY_ADS) ? "none" : "0 8px 30px rgba(0,255,136,0.3)"
                  }}
                >
                  {isLoading ? "PROCESANDO..." :
                   isWatching ? `${cooldownTime}s` :
                   systemCooldown > 0 ? `ESPERA ${systemCooldown}s` :
                   adsToday >= MAX_DAILY_ADS ? "LÍMITE" :
                   "▶ VER ANUNCIO"}
            </button>
            <p className="text-[10px] text-gray-500 mt-4 text-center tracking-tighter">Gana recompensas por visualización.</p>
          </Card>

          {/* CARD 4: ESTADÍSTICAS */}
          <Card className="flex flex-col justify-center py-8">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">📈 ACTIVIDAD TOTAL</p>
            <div className="space-y-3 w-full">
              <div className="flex justify-between items-center bg-[#111] px-3 py-2 rounded-lg border border-white/5">
                <span className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">Total Vistos</span>
                <span className="font-black text-white text-sm">{adsWatched}</span>
              </div>
              <div className="flex justify-between items-center bg-[#111] px-3 py-2 rounded-lg border border-white/5">
                <span className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">Total Ganado</span>
                <span className="font-black text-[#00FF88] text-sm">+${(adsWatched * REWARD_AMOUNT).toFixed(4)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* 2.5 MISIONES (NUEVO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <Card className="flex flex-col justify-between p-7 bg-[#0B0B0B] border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-5 mb-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Misión Bronce</h3>
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mt-1">Recompensa: Bono USDT</p>
              </div>
            </div>

            <div className="space-y-5 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Progreso de anuncios</span>
                <span className="text-sm font-black text-white">{Math.min(adsToday, 10)} <span className="text-muted">/ 10</span></span>
              </div>
              <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${Math.min((adsToday / 10) * 100, 100)}%` }}
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" 
                />
              </div>
              <button 
                disabled={adsToday < 10}
                className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  adsToday >= 10 
                    ? 'bg-blue-400 text-black shadow-xl shadow-blue-400/20 hover:scale-[1.02] active:scale-95' 
                    : 'bg-white/5 text-muted/40 cursor-not-allowed border border-white/5'
                }`}
              >
                {adsToday >= 10 ? 'Reclamar Bonificación' : 'Meta no alcanzada'}
              </button>
            </div>
          </Card>

          <Card className="flex flex-col justify-between p-7 bg-[#0B0B0B] border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="flex items-center gap-5 mb-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Misión Plata</h3>
                <p className="text-[10px] text-purple-400 font-black uppercase tracking-[0.2em] mt-1">Recompensa: Bono Premium</p>
              </div>
            </div>

            <div className="space-y-5 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Objetivo Diario</span>
                <span className="text-sm font-black text-white">{Math.min(adsToday, 20)} <span className="text-muted">/ 20</span></span>
              </div>
              <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${Math.min((adsToday / 20) * 100, 100)}%` }}
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" 
                />
              </div>
              <button 
                disabled={adsToday < 20}
                className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  adsToday >= 20 
                    ? 'bg-purple-400 text-black shadow-xl shadow-purple-400/20 hover:scale-[1.02] active:scale-95' 
                    : 'bg-white/5 text-muted/40 cursor-not-allowed border border-white/5'
                }`}
              >
                {adsToday >= 20 ? 'Reclamar Bonificación' : 'Meta no alcanzada'}
              </button>
            </div>
          </Card>
        </div>

        {/* 3. PRUEBA SOCIAL */}
        <SocialProofFeed />

        {/* 4. CONVERSIÓN A PLANES */}
        <div className="mt-28 bg-[#0B0B0B] border border-white/10 p-8 md:p-12 rounded-[32px] overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase italic">
                Cansado de <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">¿Ver Anuncios?</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base font-medium">
                Pasa al siguiente nivel. Los inversores con planes activos generan ingresos pasivos 100% automáticos, sin cooldowns y con mayores márgenes.
              </p>
            </div>
            <Link 
              href="/plans"
              className="px-10 py-5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black uppercase text-sm rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:scale-105 transition-transform flex items-center justify-center gap-3 shrink-0"
            >
              UPGRADE A PRO <Zap className="w-5 h-5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
