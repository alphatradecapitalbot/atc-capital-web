"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlayCircle, TrendingUp, CheckCircle2, ArrowRight, Award } from "lucide-react";
import { ParticleBackground } from "@/components/Effects";

export default function EarnLandingClient() {
  const { user, loading } = useAuth();

  return (
    <div className="relative min-h-screen bg-[#020202] overflow-x-hidden selection:bg-green-500/30">
      <ParticleBackground />

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-[#00FF88]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 shadow-[0_0_20px_rgba(0,255,136,0.1)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-[#00FF88]">
              MONETIZACIÓN LIBRE
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-tight"
          >
            💰 GANA DINERO VIENDO <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-[#00D1FF]">ANUNCIOS GRATIS</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto"
          >
            Únete a miles de usuarios que ya están generando ingresos pasivos sin invertir ni un solo centavo. Mira anuncios cortos de 15 segundos y retira USDT directamente.
          </motion.p>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="flex flex-wrap items-center justify-center gap-6 text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400 pt-4"
          >
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5"><CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> 100% Gratis</span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5"><CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> USDT BEP20/TRC20</span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5"><CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> Sin Límites</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-10"
          >
            {loading ? (
              <div className="px-10 py-5 bg-white/5 rounded-2xl animate-pulse w-64 h-16 mx-auto" />
            ) : user ? (
              <Link 
                href="/dashboard"
                className="px-10 py-5 bg-gradient-to-r from-[#00FF88] to-[#00CC6A] text-black font-black uppercase text-sm rounded-2xl shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:scale-105 transition-transform flex items-center justify-center gap-3"
              >
                <PlayCircle className="w-6 h-6" />
                IR A MI DASHBOARD
              </Link>
            ) : (
              <Link 
                href="/login"
                className="px-10 py-5 bg-gradient-to-r from-[#00FF88] to-[#00CC6A] text-black font-black uppercase text-sm rounded-2xl shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:scale-105 transition-transform flex items-center justify-center gap-3"
              >
                <PlayCircle className="w-6 h-6" />
                INICIAR SESIÓN PARA GANAR
              </Link>
            )}
            
            <Link 
              href="/plans"
              className="px-10 py-5 bg-[#0B0B0B] border border-white/10 text-white hover:text-[#00FF88] hover:border-[#00FF88]/30 font-black uppercase text-sm rounded-2xl transition-all flex items-center justify-center gap-3 group"
            >
              <TrendingUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
              VER PLANES PRO
            </Link>
          </motion.div>
        </div>

        {/* Features Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {[
                { title: "Mira Anuncios", desc: "Visualiza contenido patrocinado corto cada 30 segundos de forma manual.", icon: PlayCircle, color: "text-blue-400" },
                { title: "Acumula USDT", desc: "Recibe pagos instantáneos en tu balance principal por cada vista exitosa.", icon: Award, color: "text-gold" },
                { title: "Retira Rápido", desc: "Sin obstáculos innecesarios. Retira tus ganancias una vez alcances el mínimo.", icon: ArrowRight, color: "text-[#00FF88]" }
            ].map((f, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-[40px] bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${f.color} relative z-10`}>
                        <f.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight relative z-10 italic">{f.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed relative z-10">{f.desc}</p>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
