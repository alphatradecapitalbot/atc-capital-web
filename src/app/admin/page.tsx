'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  BarChart, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Globe,
  DollarSign,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminStatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: any; // Keep icon as any but it's common for lucide components if not imported specifically
  color: string;
  bg: string;
  delay: number;
  prefix?: string;
}

function AdminStatCard({ label, value, sub, icon: Icon, color, bg, delay, prefix = "$" }: AdminStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card p-7 border-white/5 bg-white/[0.02] flex items-center gap-6 group hover:border-gold/20 transition-all duration-300"
    >
      <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center ${color} shrink-0 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted/60">{label}</p>
        <h2 className="text-3xl font-bold text-white mt-1 leading-none tracking-tighter">
          {prefix}{typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2 }) : value}
        </h2>
        <p className={`text-[10px] font-bold mt-1.5 flex items-center gap-1 ${sub.includes('+') ? 'text-profit' : 'text-muted/40'}`}>
          {sub}
        </p>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="p-12 border border-white/5 bg-white/[0.01] rounded-3xl animate-pulse flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 bg-white/5 rounded-full" />
      <p className="text-xs font-bold text-muted uppercase tracking-widest">Cargando estadísticas...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      
      {/* ── Header ── */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">System Dashboard</h1>
          <p className="text-muted text-sm mt-1 uppercase tracking-widest font-bold">Resumen de operaciones en tiempo real</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
          <button className="px-4 py-2 bg-gold/10 text-gold text-xs font-black uppercase rounded-lg">Real-time</button>
          <button onClick={fetchStats} className="px-4 py-2 hover:bg-white/5 text-muted text-xs font-black uppercase rounded-lg transition-colors">Refrescar</button>
        </div>
      </div>

      {/* ── Stat Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard 
          label="Depósitos Hoy"
          value={stats?.total_deposits_today || 0}
          sub={`+${stats?.total_deposits_today || 0} USDT desde las 12:00 AM`}
          icon={CreditCard}
          color="text-gold"
          bg="bg-gold/10"
          delay={0}
        />
        <AdminStatCard 
          label="Soporte Pagado"
          value={stats?.total_paid || 0}
          sub="Total pagado a inversores"
          icon={TrendingUp}
          color="text-profit"
          bg="bg-profit/10"
          delay={0.1}
        />
        <AdminStatCard 
          label="Usuarios Activos"
          value={stats?.active_users || 0}
          sub="Total en el sistema"
          icon={Users}
          color="text-blue-400"
          bg="bg-blue-400/10"
          delay={0.2}
          prefix=""
        />
        <AdminStatCard 
          label="Inversiones Ciclo"
          value={stats?.active_investments || 0}
          sub="Ciclos activos actualmente"
          icon={Activity}
          color="text-orange-400"
          bg="bg-orange-400/10"
          delay={0.3}
          prefix=""
        />
      </div>

      {/* ── Advanced Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* System Volume */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card p-8 border-white/5 bg-white/[0.01]"
        >
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Estado del Sistema</p>
              <h3 className="text-xl font-black text-white mt-1 uppercase italic tracking-tight">Volumen Total Operado</h3>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-profit/10 border border-profit/20 text-profit text-[10px] font-black uppercase">
              <TrendingUp className="w-3 h-3" />
              Sistema Saludable
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-[10px] font-bold text-muted/60 uppercase tracking-widest mb-2 font-mono">Volumen Total</p>
              <p className="text-4xl font-black text-white tracking-tighter">${stats?.system_volume?.toLocaleString()}</p>
              <div className="h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-gold w-[65%]" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted/60 uppercase tracking-widest mb-2 font-mono">Nuevos Usuarios (24h)</p>
              <p className="text-4xl font-black text-blue-400 tracking-tighter">+{stats?.new_users_today || 0}</p>
              <div className="h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-blue-400 w-[40%]" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted/60 uppercase tracking-widest mb-2 font-mono">Ganancia Sistema</p>
              <p className="text-4xl font-black text-profit tracking-tighter">${(stats?.system_volume - stats?.total_paid).toLocaleString()}</p>
              <div className="h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-profit w-[25%]" />
              </div>
            </div>
          </div>

          <div className="mt-12 p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-tight">Uptime Global</p>
                <p className="text-[10px] text-muted font-bold">Latencia: 42ms · Servidor: Miami, US</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-profit uppercase tracking-tight">99.98%</p>
              <p className="text-[10px] text-muted font-bold tracking-widest uppercase">Operativo</p>
            </div>
          </div>
        </motion.div>

        {/* Real-time Events Feed (Static Demo Placeholder but could be dynamic) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-8 border-white/5 bg-white/[0.01] flex flex-col"
        >
          <div className="flex items-center gap-2 text-gold mb-8">
            <Activity className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Live Activity</h3>
          </div>

          <div className="space-y-6 flex-1">
            {[
              { type: 'deposit', user: '@crypto_jack', amount: '100 USDT', time: '2m ago', icon: DollarSign, color: 'text-gold' },
              { type: 'new_user', user: 'George M.', amount: 'Joined', time: '14m ago', icon: UserPlus, color: 'text-blue-400' },
              { type: 'payout', user: '@sarah_k', amount: '45 USDT', time: '22m ago', icon: ArrowUpRight, color: 'text-profit' },
              { type: 'reinvest', user: 'ID: 5716...', amount: '50 USDT', icon: Activity, time: '1h ago', color: 'text-orange-400' },
            ].map((ev, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center ${ev.color}`}>
                  <ev.icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white leading-none">{ev.user}</p>
                  <p className="text-[10px] text-muted mt-1 uppercase font-bold tracking-tight">{ev.type} · {ev.amount}</p>
                </div>
                <p className="text-[9px] font-black text-muted/40 uppercase">{ev.time}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/50 transition-all border border-white/5">
              Ver todos los logs
            </button>
          </div>
        </motion.div>

      </div>

      {/* Profit Analytics Chart (NEW) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-8 border-white/5 bg-white/[0.01]"
      >
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Analítica de Rendimiento</p>
            <h3 className="text-xl font-black text-white mt-1 uppercase italic tracking-tight">Flujo de Capital (7d)</h3>
          </div>
          <div className="flex gap-6">
            <span className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(255,215,0,0.5)]" /> Depósitos
            </span>
            <span className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-profit" /> Retiros
            </span>
          </div>
        </div>

        <div className="h-64 w-full relative group">
           {/* Simple SVG Chart Representation */}
           <svg viewBox="0 0 1000 300" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gradGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFD700" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FF88" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Guidelines */}
              <line x1="0" y1="280" x2="1000" y2="280" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
              <line x1="0" y1="180" x2="1000" y2="180" stroke="white" strokeOpacity="0.03" strokeWidth="1" />
              <line x1="0" y1="80" x2="1000" y2="80" stroke="white" strokeOpacity="0.01" strokeWidth="1" />

              {/* Deposits Area (Gold) */}
              <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                d="M0,250 Q150,220 300,180 T600,120 T900,150 T1000,100 L1000,300 L0,300 Z" 
                fill="url(#gradGold)" 
              />
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                d="M0,250 Q150,220 300,180 T600,120 T900,150 T1000,100" 
                fill="none" 
                stroke="#FFD700" 
                strokeWidth="3" 
                strokeLinecap="round" 
              />

              {/* Withdrawals Area (Green) */}
              <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                d="M0,280 Q200,260 400,230 T700,180 T1000,160 L1000,300 L0,300 Z" 
                fill="url(#gradProfit)" 
              />
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                d="M0,280 Q200,260 400,230 T700,180 T1000,160" 
                fill="none" 
                stroke="#00FF88" 
                strokeWidth="2" 
                strokeDasharray="6,4" 
                strokeOpacity="0.5" 
              />
           </svg>

           {/* Hover info overlay */}
           <div className="absolute top-1/2 left-2/3 -translate-y-1/2 bg-black/60 backdrop-blur-xl border border-white/10 p-5 rounded-[24px] opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 shadow-2xl">
              <p className="text-[10px] text-muted font-black uppercase tracking-[0.2em]">Corte de Hoy</p>
              <div className="mt-3 space-y-2">
                <p className="text-base font-black text-white flex justify-between gap-8">
                  <span className="text-gold">+$2,450.00</span>
                  <span className="opacity-20">DEPOSIT</span>
                </p>
                <p className="text-base font-black text-white flex justify-between gap-8">
                  <span className="text-profit">-$890.12</span>
                  <span className="opacity-20">PAYOUT</span>
                </p>
              </div>
           </div>
        </div>
        
        <div className="grid grid-cols-7 mt-10 border-t border-white/5 pt-6">
          {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-muted/30 uppercase tracking-[0.3em]">{d}</div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
