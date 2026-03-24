"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Mail, Lock, ArrowRight, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) throw signInError;
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' ? 'Credenciales inválidas' : err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-[0_0_30px_rgba(255,215,0,0.3)] relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl group-hover:opacity-0 transition-opacity" />
              <TrendingUp className="text-black w-6 h-6 relative z-10" />
            </div>
            <div className="text-left">
              <span className="font-black text-2xl uppercase tracking-tighter text-white leading-none block">AlphaTrade</span>
              <span className="text-[10px] text-gold uppercase tracking-[0.3em] font-black">Capital</span>
            </div>
          </Link>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2 flex items-center justify-center gap-2">
            Iniciar <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-400">Sesión</span>
          </h1>
          <p className="text-muted/80 text-sm font-medium">
            Ingresa para gestionar tus inversiones
          </p>
        </div>

        <div className="p-8 md:p-10 rounded-[32px] border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Top highlight line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Mail className="w-5 h-5 text-muted group-focus-within:text-gold transition-colors" />
                </div>
                <input 
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#000000]/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder:text-white/20 backdrop-blur-md"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Lock className="w-5 h-5 text-muted group-focus-within:text-gold transition-colors" />
                </div>
                <input 
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#000000]/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder:text-white/20 backdrop-blur-md"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-xs font-bold mt-2">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Entrar a mi cuenta
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 mb-6 relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black text-muted tracking-widest leading-none">
              <span className="bg-[#0a0a0a]/80 backdrop-blur-md px-4 rounded-full py-1 border border-white/5">Opciones</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link 
              href="/register"
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 backdrop-blur-md"
            >
              Crear una cuenta
            </Link>

            <button 
              onClick={() => window.open("https://t.me/alphatradecapital_bot?start=login", "_blank")}
              className="w-full text-muted hover:text-[#0088cc] py-2 text-xs font-bold transition-colors flex items-center justify-center gap-2 group"
            >
              <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Acceder rápidamente con Telegram
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-white transition-colors flex items-center justify-center gap-2">
            <ArrowRight className="w-3 h-3 rotate-180" />
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );

}
