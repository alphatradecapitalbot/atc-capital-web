"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { TELEGRAM_BOT_LINK } from "@/lib/constants";

export default function SupportPage() {
  return (
    <main className="min-h-screen pt-28 pb-16">
      <div className="max-w-2xl mx-auto px-6 space-y-8">

        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Soporte</h1>
          <p className="text-muted text-sm mt-1">Contáctanos por cualquiera de nuestros canales oficiales.</p>
        </motion.div>

        {/* Contact cards */}
        <div className="space-y-4">
          <motion.a
            href={TELEGRAM_BOT_LINK}
            target="_blank"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card card-hover p-6 flex items-center gap-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-lg uppercase italic">Telegram</h3>
              <p className="text-muted text-sm">@alphatradecapital_bot</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Soporte Oficial →</p>
            </div>
          </motion.a>

          <motion.a
            href="https://wa.me/15550000001"
            target="_blank"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card card-hover p-6 flex items-center gap-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-lg uppercase italic">WhatsApp</h3>
              <p className="text-muted text-sm">+1 (555) 000-0001</p>
              <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mt-1">Escribir Ahora →</p>
            </div>
          </motion.a>

          <motion.a
            href="https://wa.me/15550000002"
            target="_blank"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card card-hover p-6 flex items-center gap-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-lg uppercase italic">WhatsApp 2</h3>
              <p className="text-muted text-sm">+1 (555) 000-0002</p>
              <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mt-1">Escribir Ahora →</p>
            </div>
          </motion.a>
        </div>

        {/* Note */}
        <div className="card p-6 bg-yellow-400/5 border-yellow-400/20">
          <p className="text-xs text-yellow-400/80">
            ⚠️ <strong className="text-yellow-400">Solo contáctanos por estos canales oficiales.</strong> Nunca pediremos tu contraseña, clave privada ni transferencias directas fuera de la plataforma.
          </p>
        </div>
      </div>
    </main>
  );
}
