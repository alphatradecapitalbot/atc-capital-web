'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Activity, 
  History, 
  RefreshCw,
  Search,
  CheckCircle2,
  Calendar,
  User,
  Zap,
  DollarSign,
  Repeat,
  Trash2,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminInvestments() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'deposit' | 'reinvestment' | 'manual'>('all');

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const token = localStorage.getItem('atc_token');
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${api}/api/admin/investments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setInvestments(data.investments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const forcePayout = async (id: number) => {
    if (!confirm('¿Forzar pago inmediato? Se acreditará capital + ganancia al usuario.')) return;
    try {
      const token = localStorage.getItem('atc_token');
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${api}/api/admin/investments/${id}/payout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchInvestments();
    } catch (e) { console.error(e); }
  };

  const deleteInvestment = async (id: number) => {
    if (!confirm('¿Eliminar inversión? No se devolverán fondos.')) return;
    try {
      const token = localStorage.getItem('atc_token');
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${api}/api/admin/investments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchInvestments();
    } catch (e) { console.error(e); }
  };

  const filtered = investments.filter(i => {
    const matchesSearch = 
      i.telegram_id?.toString().includes(search) || 
      i.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      i.plan?.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = filter === 'all' || i.type === filter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight">Registro de Inversiones</h1>
          <p className="text-muted text-xs uppercase tracking-widest font-bold mt-1">Carga activa y completada del sistema</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
            <input 
              type="text" 
              placeholder="Buscar por Usuario o Plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm pl-10 w-64 text-white placeholder:text-muted/30 font-bold"
            />
          </div>
          <button onClick={fetchInvestments} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <RefreshCw className={`w-4 h-4 text-gold ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2">
        {(['all', 'deposit', 'reinvestment', 'manual'] as const).map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
              filter === t ? 'bg-gold text-black border-gold shadow-lg shadow-gold/20' : 'text-muted border-white/5 hover:bg-white/5'
            }`}
          >
            {t === 'all' ? 'Ver Todos' : t === 'deposit' ? 'Depósitos' : t === 'reinvestment' ? 'Reinversiones' : 'Manual'}
          </button>
        ))}
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div className="card p-5 border-white/5 bg-white/[0.01] flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted/60 uppercase">Activas</p>
            <p className="text-xl font-black text-white">{investments.filter(i => i.status === 'active').length}</p>
          </div>
        </div>
        <div className="card p-5 border-white/5 bg-white/[0.01] flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-profit/10 flex items-center justify-center text-profit">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted/60 uppercase">Completadas</p>
            <p className="text-xl font-black text-white">{investments.filter(i => i.status === 'completed').length}</p>
          </div>
        </div>
        <div className="card p-5 border-white/5 bg-white/[0.01] flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted/60 uppercase">Total Ciclos</p>
            <p className="text-xl font-black text-white">{investments.length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden border-white/5 bg-white/[0.01]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted/60">
              <th className="px-6 py-4 font-black">Usuario</th>
              <th className="px-6 py-4 font-black">Plan & Monto</th>
              <th className="px-6 py-4 font-black">Ganancia</th>
              <th className="px-6 py-4 font-black">Estado / Vencimiento</th>
              <th className="px-6 py-4 text-right font-black">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((inv, i) => (
              <motion.tr 
                key={inv.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                className="hover:bg-white/[0.02] transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted/30" />
                    <div>
                      <p className="text-xs font-black text-white uppercase">{inv.first_name || 'User'}</p>
                      <p className="text-[9px] text-muted font-bold">ID: {inv.telegram_id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <Zap className={`w-3.5 h-3.5 ${inv.type === 'reinvestment' ? 'text-blue-400' : 'text-gold'}`} />
                    <p className="text-xs font-black text-white uppercase tracking-tight">{inv.plan}</p>
                  </div>
                  <p className="text-[10px] font-bold text-muted mt-0.5">${parseFloat(inv.amount).toLocaleString()} USDT</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-xs font-black text-profit leading-tight">+${parseFloat(inv.profit).toLocaleString()}</p>
                  <p className="text-[9px] text-muted font-bold uppercase tracking-tighter">Neto</p>
                </td>
                <td className="px-6 py-5">
                  {inv.status === 'active' ? (
                    <div className="space-y-1.5">
                       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-gold/10 text-[9px] font-black text-gold border border-gold/10 uppercase italic">
                         <Clock className="w-3 h-3" /> En Proceso
                       </span>
                       <p className="text-[9px] text-muted font-bold">Exp: {new Date(inv.expires_at).toLocaleString()}</p>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-profit/10 text-[9px] font-black text-profit border border-profit/10 uppercase">
                      <CheckCircle2 className="w-3 h-3" /> Completada
                    </span>
                  )}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {inv.status === 'active' && (
                      <button 
                        onClick={() => forcePayout(inv.id)}
                        className="p-2 hover:bg-profit/10 hover:text-profit text-muted transition-all"
                        title="Forzar Pago"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteInvestment(inv.id)}
                      className="p-2 hover:bg-red-500/10 hover:text-red-500 text-muted transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
