"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { TELEGRAM_BOT_LINK } from "@/lib/constants";

export default function SupportPage() {
  return (
    <main className="min-h-screen pt-32 pb-16 flex flex-col items-center">
      <div className="w-full max-w-xl px-6 space-y-10">

        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">Soporte</h1>
          <p className="text-gray-400 text-sm mt-3 font-medium">Contáctanos por nuestro canal oficial exclusivo.</p>
        </motion.div>

        {/* Contact cards */}
        <div className="flex justify-center">
          <motion.a
            href={TELEGRAM_BOT_LINK}
            target="_blank"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-md bg-[#0B0B0B] p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col items-center gap-5 group transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)]"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
              <MessageCircle className="w-8 h-8" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="font-black text-xl md:text-2xl uppercase tracking-widest text-white">Telegram</h3>
              <p className="text-gray-400 text-sm font-medium">@alphatradecapital_bot</p>
            </div>
            
            <div className="mt-2 w-full text-center py-3.5 rounded-xl bg-blue-500/10 text-blue-400 font-bold uppercase tracking-widest text-[11px] group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all duration-300">
              Soporte Oficial →
            </div>
          </motion.a>
        </div>

        {/* Note */}
        <div className="w-full max-w-md mx-auto p-5 rounded-xl bg-yellow-400/5 border border-yellow-400/10 text-center">
          <p className="text-xs text-yellow-400/80 leading-relaxed font-medium">
            ⚠️ <strong className="text-yellow-400">Solo contáctanos por este canal oficial.</strong> Nunca pediremos tu contraseña, clave privada ni transferencias directas fuera de la plataforma.
          </p>
        </div>

      </div>
    </main>
  );
}
