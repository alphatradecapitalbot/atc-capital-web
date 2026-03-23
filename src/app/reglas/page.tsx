"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, Users, Clock, Zap, 
  Info, ArrowUpRight 
} from "lucide-react";
import Link from "next/link";

export default function ReglasPage() {
  const rules = [
    {
      icon: Users,
      title: "Referidos Activos",
      desc: "Para desbloquear retiros completos, se requieren 3 referidos activos.",
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    {
      icon: Zap,
      title: "Límite Diario",
      desc: "Si no tienes referidos, puedes retirar hasta 2.50 USDT cada 24 horas.",
      color: "text-gold",
      bg: "bg-gold/10"
    },
    {
      icon: ShieldCheck,
      title: "Escalabilidad",
      desc: "Este sistema aplica hasta alcanzar 100 usuarios activos con inversiones verificadas. Luego de esto, los retiros serán libres.",
      color: "text-profit",
      bg: "bg-profit/10"
    },
    {
      icon: Clock,
      title: "Procesamiento",
      desc: "Las solicitudes nocturnas se procesan durante el día.",
      color: "text-purple-400",
      bg: "bg-purple-400/10"
    }
  ];

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-[#080808]">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-[9px] font-black uppercase tracking-[0.25em] text-gold border border-gold/20 bg-gold/5 px-4 py-1.5 rounded-full"
          >
            Reglamento Oficial
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter"
          >
            Modelo de <span className="text-gold">Crecimiento</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted text-sm max-w-xl mx-auto leading-relaxed"
          >
            AlphaTrade Capital ha implementado un sistema diseñado para fortalecer la comunidad y garantizar estabilidad a largo plazo.
          </motion.p>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="card p-8 space-y-4 group hover:border-white/10 transition-colors"
            >
              <div className={`w-14 h-14 rounded-2xl ${rule.bg} flex items-center justify-center ${rule.color}`}>
                <rule.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight">{rule.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{rule.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="glass p-8 rounded-3xl border-white/5 text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-2 text-gold">
            <Info className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Nota Importante</span>
          </div>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Estas reglas están diseñadas para asegurar que cada inversión esté respaldada y que el ecosistema crezca de manera saludable. Agradecemos tu confianza en AlphaTrade Capital.
          </p>
          <div className="pt-4">
            <Link href="/dashboard" className="btn-gold inline-flex items-center gap-2 text-[10px]">
              Ir al Panel <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
