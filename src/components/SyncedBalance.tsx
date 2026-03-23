'use client';

import React, { useState, useEffect } from 'react';
import { fetchSyncedUser } from '@/lib/apiSync';
import { Wallet, RefreshCw, Smartphone } from 'lucide-react';

interface SyncedBalanceProps {
  telegramId: string;
}

export default function SyncedBalance({ telegramId }: SyncedBalanceProps) {
  const [data, setData] = useState<{ balance: number; username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!telegramId) return;
    setRefreshing(true);
    const result = await fetchSyncedUser(telegramId);
    if (result) {
      setData({
        balance: result.balance || 0,
        username: result.username || 'Usuario'
      });
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
    
    // Auto refresh every 30 seconds for live feel
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [telegramId]);

  if (loading) return (
    <div className="flex items-center gap-2 text-gold/50 animate-pulse py-2">
      <RefreshCw className="w-3 h-3 animate-spin" />
      <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">Sincronizando Wallet...</span>
    </div>
  );

  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md min-w-[200px] shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gold/10 rounded-lg border border-gold/20">
            <Wallet className="w-4 h-4 text-gold" />
          </div>
          <p className="text-[9px] font-black uppercase text-white/40 tracking-[0.1em]">Shared Balance</p>
        </div>
        <button 
          onClick={loadData}
          disabled={refreshing}
          className={`p-1.5 bg-white/5 hover:bg-gold/20 rounded-lg border border-white/10 transition-all ${refreshing ? 'animate-spin opacity-50' : ''}`}
        >
          <RefreshCw className="w-3 h-3 text-gold" />
        </button>
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-black text-white italic tracking-tighter flex items-baseline gap-1">
          <span className="text-gold text-lg">$</span>
          {data?.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span className="text-[10px] text-white/20 uppercase ml-2 not-italic tracking-widest font-bold">USDT</span>
        </div>
        
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[9px] font-black text-white/50 uppercase tracking-widest flex items-center gap-1">
            <Smartphone className="w-3 h-3 text-gold" />
            @{data?.username || 'user'}
          </p>
        </div>
      </div>
    </div>
  );
}
