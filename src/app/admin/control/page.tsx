'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Zap, 
  Wallet, 
  ShieldAlert, 
  Activity, 
  ArrowUpRight, 
  Trash2, 
  AlertTriangle,
  Send,
  User,
  Plus,
  RefreshCw,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminControl() {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [planKey, setPlanKey] = useState('starter');
  const [invId, setInvId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const sendAction = async (endpoint: string, body: any) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('atc_token');
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${api}/api/admin/${endpoint}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) setSuccess('Acción completada con éxito');
      else setError(data.error || 'Error al procesar');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualInvest = () => {
    if (!userId || !planKey) return;
    sendAction('investments/manual', { userId: parseInt(userId), plan: planKey, amount: parseFloat(amount) || undefined });
  };

  const handleAdjustBalance = (action: 'add' | 'sub' | 'set') => {
    if (!userId || !amount) return;
    sendAction(`users/${userId}/balance`, { amount: parseFloat(amount), operation: action });
  };

  const handleInvAction = async (action: 'payout' | 'delete') => {
    if (!invId) return;
    if (action === 'delete' && !confirm('¿Eliminar inversión definitivamente?')) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('atc_token');
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const method = action === 'delete' ? 'DELETE' : 'POST';
      const url = action === 'delete' ? `${api}/api/admin/investments/${invId}` : `${api}/api/admin/investments/${invId}/payout`;
      
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success || data.msg) setSuccess('Acción completada');
      else setError(data.error || 'Error en la acción');
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase text-white tracking-tight">System Control Panel</h1>
        <p className="text-muted text-xs uppercase tracking-widest font-bold mt-1">Herramientas de administración avanzada y overrides</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Manual Investment */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-8 border-gold/20 bg-gold/[0.02] space-y-8"
        >
          <div className="flex items-center gap-3 text-gold">
            <Zap className="w-6 h-6" />
            <h2 className="text-xl font-black uppercase italic tracking-tight">Activar Inversión Manual</h2>
          </div>

          <p className="text-xs text-muted/60 leading-relaxed font-bold uppercase tracking-widest">
            Usa esta función para activar planes directamente a un usuario sin pasar por la cola de depósitos.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted/50 ml-1">User Database ID</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/40" />
                  <input 
                    type="number" 
                    placeholder="Ej: 15"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-gold/50 focus:ring-0 rounded-xl py-3 pl-12 text-sm text-white font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted/50 ml-1">Plan</label>
                <select 
                  value={planKey}
                  onChange={(e) => setPlanKey(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-gold/50 focus:ring-0 rounded-xl py-3 px-4 text-sm text-white font-black uppercase tracking-widest"
                >
                  {['starter', 'silver', 'gold', 'platinum', 'diamond', 'pro', 'elite', 'premier'].map(p => (
                    <option key={p} value={p} className="bg-[#0c0c0c]">{p.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted/50 ml-1">Monto (Opcional - Usará el plan por defecto)</label>
              <div className="relative">
                <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/40" />
                <input 
                  type="number" 
                  placeholder="USDT..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-gold/50 focus:ring-0 rounded-xl py-4 pl-12 text-sm text-white font-black"
                />
              </div>
            </div>

            <button 
              onClick={handleManualInvest}
              disabled={loading || !userId}
              className="w-full btn-gold py-4 flex items-center justify-center gap-2 disabled:opacity-50 group hover:scale-[1.02] transition-transform"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              <span className="text-xs font-black uppercase tracking-widest">Activar Inversión</span>
            </button>
          </div>
        </motion.div>

        {/* Global Balance Adjustments */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-8 border-white/5 bg-white/[0.01] space-y-8"
        >
          <div className="flex items-center gap-3 text-white">
            <Wallet className="w-6 h-6" />
            <h2 className="text-xl font-black uppercase italic tracking-tight italic">Modificar Capital</h2>
          </div>

          <p className="text-xs text-muted/60 leading-relaxed font-bold uppercase tracking-widest">
            Ajusta el balance disponible de cualquier usuario. Usa con precaución para correcciones.
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted/50 ml-1">User ID & Monto</label>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number" 
                  placeholder="User ID..."
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-white/30 focus:ring-0 rounded-xl py-3 px-4 text-sm text-white font-bold"
                />
                <input 
                  type="number" 
                  placeholder="USDT..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-white/30 focus:ring-0 rounded-xl py-3 px-4 text-sm text-white font-bold font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <button 
                onClick={() => handleAdjustBalance('add')}
                className="py-4 rounded-xl bg-profit/5 border border-profit/10 text-profit text-[10px] font-black uppercase tracking-widest hover:bg-profit/10 transition-colors"
              >
                Añadir
              </button>
              <button 
                 onClick={() => handleAdjustBalance('sub')}
                className="py-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-colors"
              >
                Restar
              </button>
              <button 
                 onClick={() => handleAdjustBalance('set')}
                className="py-4 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Setear
              </button>
            </div>
            
            <div className="mt-8 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 flex gap-4">
              <AlertTriangle className="w-6 h-6 text-orange-400 shrink-0" />
              <p className="text-[10px] text-orange-400/80 font-bold leading-relaxed">
                Todas las modificaciones de balance quedan registradas en los logs del sistema para auditoría futura.
              </p>
            </div>
          </div>
        </motion.div>
        {/* Forced Payout & Cancellation */}
        <motion.div 
          initial={{ opacity: 0, x: -20, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          className="card p-8 border-white/5 bg-white/[0.01] space-y-8"
        >
          <div className="flex items-center gap-3 text-profit">
            <Activity className="w-6 h-6" />
            <h2 className="text-xl font-black uppercase italic tracking-tight">Acciones sobre Inversión</h2>
          </div>

          <p className="text-xs text-muted/60 leading-relaxed font-bold uppercase tracking-widest">
            Forzar pago inmediato o eliminar un ciclo de inversión usando su ID interno.
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted/50 ml-1">ID de Inversión</label>
              <input 
                type="number" 
                placeholder="Ej: 105"
                value={invId}
                onChange={(e) => setInvId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-profit/30 focus:ring-0 rounded-xl py-3 px-4 text-sm text-white font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button 
                onClick={() => handleInvAction('payout')}
                className="py-4 rounded-xl bg-profit text-black text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-profit/20"
              >
                Forzar Pago
              </button>
              <button 
                onClick={() => handleInvAction('delete')}
                className="py-4 rounded-xl bg-red-500/10 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Notifications / Result Area */}
      <AnimatePresence>
        {(success || error) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-6 rounded-2xl border flex items-center gap-4 ${
              success ? 'bg-profit/10 border-profit/20 text-profit' : 'bg-red-500/10 border-red-500/20 text-red-500'
            }`}
          >
            {success ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            <span className="text-sm font-black uppercase tracking-tight">{success || error}</span>
            <button onClick={() => { setSuccess(''); setError(''); }} className="ml-auto p-1.5 hover:bg-white/5 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
