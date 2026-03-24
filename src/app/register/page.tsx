"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { TrendingUp, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setError('Por favor rellena todos los campos');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { data, error: signUpError } = await signUp(email, password, { first_name: fullName });
      
      if (signUpError) throw signUpError;

      if (data?.user) {
        // Create matching record in 'users' table
        // We use a random numeric ID for telegram_id if not present to satisfy schema
        const tempId = Math.floor(Math.random() * 1000000000).toString();
        
        const { error: dbError } = await supabase.from('users').insert({
          email: data.user.email,
          first_name: fullName,
          telegram_id: tempId, 
          balance: 0,
          total_invested: 0,
          total_earned: 0,
          active_investments: 0
        });
        
        if (dbError) {
          console.error("Database sync error:", dbError);
          // If insert fails (e.g. unique constraint), we still have the Auth user.
          // In a real app, you'd use a trigger for this.
        }
      }

      // Success - Supabase handles redirection via state change or manual push
      // But for a better UX, we can show a success message if email confirm is on
      alert("Registro exitoso. Por favor revisa tu email si es necesario.");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
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
            Crea tu <br/><span className="text-gold">Cuenta</span>
          </h1>
          <p className="text-muted text-sm font-medium">
            Empieza a ganar hoy mismo
          </p>
        </div>

        <form onSubmit={handleRegister} className="card p-10 border-white/5 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-gold transition-colors" />
              <input 
                type="text"
                placeholder="Nombre Completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all"
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-gold transition-colors" />
              <input 
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-gold transition-colors" />
              <input 
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-xs font-bold"
            >
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-yellow-500 text-black py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-gold/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Registrarme
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-muted font-medium">
            ¿Ya tienes cuenta? <Link href="/login" className="text-gold hover:underline">Inicia Sesión</Link>
          </p>
        </form>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-gold transition-colors">
            ← Volver al Inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
