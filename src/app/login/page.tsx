"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleVerifyCode = async () => {
    if (!code) return;
    setError('');
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${apiUrl}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Código inválido');

      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-profit/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-gold/20">
              <TrendingUp className="text-black w-5 h-5" />
            </div>
            <span className="font-black text-xl uppercase tracking-tighter text-white">AlphaTrade</span>
          </Link>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight leading-none mb-4">
            AlphaTrade <br/><span className="text-gold">Connect</span>
          </h1>
          <p className="text-muted text-sm font-medium">
            Acceso instantáneo con tu cuenta de Telegram
          </p>
        </div>

        <div className="card p-10 border-white/5 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden text-center space-y-8">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
              Acceder con Telegram
            </h1>
            <p className="text-muted text-[10px] uppercase tracking-[0.2em] font-bold">
              Autenticación segura vía BOT
            </p>
          </div>

          <div className="space-y-6">
            <button 
              onClick={() => window.open("https://t.me/alphatradecapital_bot?start=login", "_blank")}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-xl text-lg font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-yellow-400/20"
            >
              <MessageSquare className="w-5 h-5" />
              Continuar con Telegram
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black text-muted tracking-widest leading-none">
                <span className="bg-[#0a0a0a] px-4">O introduce tu código</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <input 
                  type="text"
                  placeholder="Introduce tu código de acceso"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-5 px-4 text-center text-sm font-bold tracking-[0.2em] focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all placeholder:text-muted/30 placeholder:tracking-normal"
                />
              </div>

              <button 
                onClick={handleVerifyCode}
                disabled={loading || !code}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Verificando...</span>
                  </div>
                ) : 'Verificar código'}
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-[10px] font-black uppercase tracking-widest"
            >
              {error}
            </motion.div>
          )}
        </div>
        
        <div className="mt-8 text-center space-y-4">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-gold transition-colors block">
            ← Volver al Inicio
          </Link>
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted opacity-30">
            <MessageSquare className="w-3 h-3" />
            <span>Soporte vía Telegram</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
