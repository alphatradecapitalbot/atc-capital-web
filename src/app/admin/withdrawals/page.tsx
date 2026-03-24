'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign,
  User,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminWithdrawal {
  id: number;
  user_id: string;
  telegram_id: string | number;
  username: string | null;
  first_name: string | null;
  amount: number;
  address: string;
  status: string;
  created_at: string;
}

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all'|'pending'|'approved'|'rejected'>('pending');

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/withdrawals');
      const data = await res.json();
      setWithdrawals(data.withdrawals || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const apiAction = status === 'approved' ? 'approveWithdrawal' : 'rejectWithdrawal';
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: apiAction, withdrawalId: id })
      });
      if (res.ok) fetchWithdrawals();
    } catch (e) { console.error(e); }
  };

  const filtered = withdrawals.filter(w => filter === 'all' ? true : w.status === filter);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight">Gestión de Retiros</h1>
          <p className="text-muted text-xs uppercase tracking-widest font-bold mt-1">Aprobar o rechazar solicitudes de pago</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-gold text-black' : 'text-muted hover:text-white'
              }`}
            >
              {f === 'pending' ? 'Pendientes' : f === 'approved' ? 'Pagados' : f === 'rejected' ? 'Rechazados' : 'Todos'}
            </button>
          ))}
          <button onClick={fetchWithdrawals} className="p-2 ml-2 hover:bg-white/5 rounded-lg transition-colors">
            <RefreshCw className={`w-4 h-4 text-gold ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="card overflow-hidden border-white/5 bg-white/[0.01]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted/60">
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Monto</th>
              <th className="px-6 py-4">Método / Dirección</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <p className="text-xs font-black text-muted uppercase tracking-[0.2em]">No hay retiros {filter !== 'all' ? filter : ''} encontrados</p>
                </td>
              </tr>
            ) : (
              filtered.map((w, i) => (
                <motion.tr 
                  key={w.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs text-gold border border-white/5">
                        <User className="w-5 h-5 text-gold/50" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">{w.username || `@User_${w.user_id}`}</p>
                        <p className="text-[10px] text-muted font-bold">ID: {w.user_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-white italic tracking-tighter">${Number(w.amount).toLocaleString()}</p><span className="text-[10px] text-muted">USDT</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 group/addr cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-muted/40 group-hover/addr:text-gold transition-colors" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white font-mono break-all max-w-[150px]">{w.address || 'TRC20 Network'}</p>
                        <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-0.5">Red Tron (TRC20)</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                     <p className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-2">
                       <Clock className="w-3.5 h-3.5" />
                       {new Date(w.created_at).toLocaleDateString()}
                     </p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                      w.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                      w.status === 'approved' ? 'bg-profit/10 text-profit border-profit/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {w.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleAction(w.id, 'rejected')}
                          className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/10 hover:bg-red-500/20 transition-all"
                          title="Rechazar"
                        >
                          <XCircle className="w-4.5 h-4.5" />
                        </button>
                        <button 
                          onClick={() => handleAction(w.id, 'approved')}
                          className="p-2.5 rounded-xl bg-profit text-black hover:scale-105 transition-all shadow-lg shadow-profit/20"
                          title="Aprobar Pago"
                        >
                          <CheckCircle2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
