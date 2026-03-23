'use client'

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ConnectContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id');
  const [user, setUser] = useState<{ username: string; balance: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://147.93.181.40:3001/user/${userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser({
            username: data.username,
            balance: data.balance
          });
        }
      } catch (error) {
        // Handle errors silently
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        <p className="text-muted text-xs uppercase font-black tracking-widest">Sincronizando Wallet...</p>
      </div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Acceso <span className="text-red-500">Denegado</span></h1>
        <p className="text-muted text-sm px-6">No se encontró el perfil de Telegram. Por favor, inicia el bot nuevamente.</p>
        <a href="https://t.me/alphatradecapital_bot" className="btn-gold inline-block px-8 py-3">Volver al Bot</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-profit/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 transition-all duration-500">
        <div className="card p-10 border-white/5 bg-white/[0.02] backdrop-blur-xl text-center space-y-8 relative overflow-hidden group hover:border-gold/20 transition-all">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent shadow-[0_0_20px_rgba(250,204,21,0.2)]" />
          
          <div className="space-y-4">
            <div className="inline-block p-4 bg-gold/10 rounded-3xl border border-gold/20 mb-2 group-hover:scale-110 transition-transform shadow-inner">
               <span className="text-4xl">🎰</span>
            </div>
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
              ¡Bienvenido, <span className="text-gold">@{user.username}</span>!
            </h1>
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-muted">Balance Sincronizado</p>
          </div>

          <div className="p-8 bg-black/40 border border-white/5 rounded-3xl relative overflow-hidden shadow-2xl group-hover:bg-black/60 transition-colors">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <span className="text-4xl font-black italic select-none">USDT</span>
            </div>
            <p className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <span className="text-gold text-2xl align-top mr-1">$</span>
              {user.balance.toFixed(2)}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
              <p className="text-[9px] font-black uppercase text-profit tracking-[0.2em]">Fondos Disponibles</p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-[11px] text-muted leading-relaxed font-medium">
              Tu cuenta de Telegram ha sido vinculada con éxito. Puedes acceder a todos los servicios de la plataforma.
            </p>
            <a 
              href="/dashboard" 
              className="w-full btn-gold py-5 rounded-2xl text-lg font-black uppercase tracking-widest transition-all duration-300 hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(250,204,21,0.15)]"
            >
              🚀 ENTRAR AL PANEL
            </a>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[9px] font-black uppercase tracking-[0.4em] text-muted opacity-40">
          AlphaTrade Capital · Blockchain SECURE
        </p>
      </div>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    }>
      <ConnectContent />
    </Suspense>
  );
}
