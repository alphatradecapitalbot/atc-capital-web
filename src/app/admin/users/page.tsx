'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  MoreVertical, 
  ShieldAlert, 
  ShieldCheck, 
  Wallet, 
  History,
  TrendingUp,
  RefreshCw,
  Edit2,
  X,
  Check,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminUser {
  id: string;
  telegram_id: string;
  username: string | null;
  first_name: string | null;
  balance: number;
  game_balance: any;
  investment_balance: any;
  total_invested: any;
  total_withdrawn: any;
  active_investments: number;
  status: string;
  created_at: string;
  is_admin: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newBalance, setNewBalance] = useState('');
  const [balanceAction, setBalanceAction] = useState<'set' | 'add' | 'sub'>('set');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (user: any) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    try {
      await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleBlock', userId: user.id, status: newStatus })
      });
      fetchUsers();
    } catch (e) { console.error(e); }
  };

  const handleUpdateBalance = async () => {
    if (!editingUser || !newBalance) return;
    try {
      await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'updateBalance', 
          userId: editingUser.id, 
          amount: parseFloat(newBalance), 
          type: balanceAction 
        })
      });
      setEditingUser(null);
      setNewBalance('');
      fetchUsers();
    } catch (e) { console.error(e); }
  };

  const filteredUsers = users.filter(u => 
    u.telegram_id?.toString().includes(search) || 
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.first_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted text-xs uppercase tracking-widest font-bold mt-1">Control total sobre la base de datos</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
            <input 
              type="text" 
              placeholder="Buscar por ID o Username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm pl-10 w-64 text-white placeholder:text-muted/30 font-bold"
            />
          </div>
          <button onClick={fetchUsers} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <RefreshCw className={`w-4 h-4 text-gold ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden border-white/5 bg-white/[0.01]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted/60">
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Balance Disponible</th>
              <th className="px-6 py-4">Balance Invertido</th>
              <th className="px-6 py-4">Invertido</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((user, i) => (
              <motion.tr 
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-white/[0.02] transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs text-gold border border-white/5 group-hover:border-gold/30 transition-colors">
                      {user.first_name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{user.first_name || 'Sin nombre'}</p>
                      <p className="text-[10px] text-muted font-bold tracking-tight">
                        {user.username ? `@${user.username}` : `ID: ${user.telegram_id}`}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-black text-blue-400">${parseFloat(user.game_balance).toLocaleString()}</p>
                  <p className="text-[9px] text-muted font-bold uppercase tracking-widest">Liquid</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-black text-gold">${parseFloat(user.investment_balance).toLocaleString()}</p>
                  <p className="text-[9px] text-muted font-bold uppercase tracking-widest">Locked</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3 text-profit" />
                    <span className="text-xs font-bold text-white">${parseFloat(user.total_invested).toLocaleString()}</span>
                  </div>
                  <p className="text-[9px] text-muted font-bold mt-1">{user.active_investments} Ciclos Activos</p>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                    user.status === 'active' 
                      ? 'bg-profit/10 text-profit border-profit/20' 
                      : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="p-2 hover:bg-gold/10 hover:text-gold rounded-lg text-muted transition-all"
                      title="Editar Balance"
                    >
                      <Wallet className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleBlock(user)}
                      className={`p-2 rounded-lg transition-all ${
                        user.status === 'active' 
                          ? 'hover:bg-red-500/10 hover:text-red-500 text-muted' 
                          : 'hover:bg-profit/10 hover:text-profit text-red-500'
                      }`}
                      title={user.status === 'active' ? 'Bloquear' : 'Desbloquear'}
                    >
                      {user.status === 'active' ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Balance Edit Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md card p-8 border-gold/20 bg-[#0c0c0c] shadow-2xl"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tight text-white">Editar Balance</h3>
                  <p className="text-xs text-muted mt-1 uppercase font-bold tracking-widest">{editingUser.first_name} (@{editingUser.username})</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted font-bold uppercase mb-1">Disponible / Invertido</p>
                  <p className="text-lg font-black text-gold">
                    ${parseFloat(editingUser.game_balance).toFixed(2)} / ${parseFloat(editingUser.investment_balance).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                  {(['set', 'add', 'sub', 'set_inv'] as const).map(a => (
                    <button
                      key={a}
                      onClick={() => setBalanceAction(a as any)}
                      className={`flex-1 min-w-[80px] py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                        balanceAction === a ? 'bg-gold text-black' : 'text-muted hover:text-white'
                      }`}
                    >
                      {a === 'set' ? 'Ajustar Disp' : a === 'add' ? 'Añadir Disp' : a === 'sub' ? 'Restar Disp' : 'Ajustar Inv'}
                    </button>
                  ))}
                </div>

                <div className="relative group">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-gold transition-colors" />
                  <input 
                    type="number" 
                    placeholder="Monto..."
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 focus:border-gold/50 focus:ring-0 rounded-xl py-4 pl-12 text-white font-black"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setEditingUser(null)}
                    className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-muted hover:text-white transition-colors border border-white/5 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleUpdateBalance}
                    className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest bg-gold text-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-gold/20"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
