'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Check, 
  X, 
  ExternalLink, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  MessageCircle,
  Hash,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDeposit {
  id: number;
  user_id: string;
  telegram_id: string | number;
  username: string | null;
  first_name: string | null;
  amount: any;
  txid: string;
  status: string;
  reference: string;
  plan: string;
  created_at: string;
}

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState<AdminDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await fetch('/api/admin/deposits');
      const data = await res.json();
      setDeposits(data.deposits || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: 'confirm' | 'reject') => {
    try {
      const apiAction = action === 'confirm' ? 'approveDeposit' : 'rejectDeposit';
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: apiAction, depositId: id })
      });
      const data = await res.json();
      if (data.success) fetchDeposits();
      else alert(data.error || 'Error al procesar');
    } catch (e) { console.error(e); }
  };

  const filteredDeposits = deposits.filter(d => filter === 'all' || d.status === filter);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight">Gestión de Depósitos</h1>
          <p className="text-muted text-xs uppercase tracking-widest font-bold mt-1">Cola de verificación y aprobación</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/5">
          {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                filter === f ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              {f === 'pending' ? 'Pendientes' : f === 'approved' ? 'Aprobados' : f === 'rejected' ? 'Rechazados' : 'Todos'}
            </button>
          ))}
          <button onClick={fetchDeposits} className="p-2 ml-2 hover:bg-white/5 rounded-xl transition-colors">
            <RefreshCw className={`w-4 h-4 text-gold ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 opacity-50">
            <RefreshCw className="w-8 h-8 animate-spin text-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sincronizando depósitos...</p>
          </div>
        ) : filteredDeposits.length === 0 ? (
          <div className="p-20 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-muted/20">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-black text-white uppercase italic">No hay depósitos en esta categoría</p>
              <p className="text-[10px] text-muted font-bold mt-1 tracking-widest">Todo está al día por ahora.</p>
            </div>
          </div>
        ) : (
          filteredDeposits.map((dep, i) => (
            <motion.div
              key={dep.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-6 border-white/5 bg-white/[0.01] hover:border-gold/20 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Status Indicator Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                dep.status === 'pending' ? 'bg-gold animate-pulse' :
                dep.status === 'approved' ? 'bg-profit' : 'bg-red-500'
              }`} />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                
                {/* User & Amount */}
                <div className="flex items-center gap-5 shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                    <p className="text-[9px] font-black text-muted/60 uppercase">USDT</p>
                    <p className="text-lg font-black text-white leading-tight">${parseFloat(dep.amount).toLocaleString()}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <p className="text-sm font-black text-white uppercase tracking-tight">{dep.first_name || 'Usuario'}</p>
                       <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-bold text-muted border border-white/5">
                         {dep.plan}
                       </span>
                    </div>
                    <p className="text-[10px] text-muted font-bold mt-0.5 font-mono">
                      {dep.username ? `@${dep.username}` : `ID: ${dep.telegram_id}`}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-l border-white/5 pl-8">
                  <div>
                    <p className="text-[9px] font-black text-muted/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Hash className="w-3 h-3" /> Referencia Interna
                    </p>
                    <p className="text-[10px] font-bold text-white tracking-widest">{dep.reference}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3" /> Blockchain TXID
                    </p>
                    {dep.txid ? (
                      <a 
                        href={`https://tronscan.org/#/transaction/${dep.txid}`} 
                        target="_blank" 
                        className="text-[10px] font-mono text-gold hover:underline flex items-center gap-1 group/tx"
                      >
                        <span className="truncate max-w-[120px] font-black uppercase tracking-tighter">{dep.txid}</span>
                      </a>
                    ) : (
                      <p className="text-[10px] font-bold text-muted/40 italic">No proporcionado</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Fecha Solicitud
                    </p>
                    <p className="text-[10px] font-bold text-white">
                      {new Date(dep.created_at).toLocaleString('es-DO', { hour12: true })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  {dep.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleAction(dep.id, 'reject')}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/10"
                      >
                        <X className="w-4 h-4" /> Rechazar
                      </button>
                      <button 
                        onClick={() => handleAction(dep.id, 'confirm')}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-profit text-black hover:scale-105 active:scale-95 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-profit/20"
                      >
                        <Check className="w-4 h-4" /> Aprobar
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 pr-4">
                      {dep.status === 'approved' ? (
                        <div className="flex items-center gap-2 text-profit bg-profit/10 px-4 py-2 rounded-lg border border-profit/20">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-black uppercase">Verificado</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-black uppercase">Rechazado</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}
