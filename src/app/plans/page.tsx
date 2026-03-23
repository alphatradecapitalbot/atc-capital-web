"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { PLANS } from "@/lib/constants";
import Link from "next/link";

export default function PlansPage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter"
          >
            Planes de Inversión
          </motion.h1>
          <div className="w-16 h-0.5 bg-gold mx-auto rounded-full" />
          <p className="text-muted text-sm">Elige tu plan y empieza a generar ganancias en 24 horas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.02 }}
              className={`card card-hover p-8 relative overflow-hidden ${plan.border}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-60 pointer-events-none`} />
              <div className="relative z-10">
                {plan.badge && <div className="badge mb-4 inline-block">{plan.badge}</div>}

                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6" style={{ color: plan.accent }}>
                  {plan.name}
                </h3>

                <div className="text-4xl font-black tracking-tighter mb-1">
                  <span style={{ color: plan.accent }}>${plan.investment + plan.profit}</span>
                  <span className="text-muted text-base font-normal ml-2">USDT</span>
                </div>
                <p className="text-muted text-xs mb-6">Desde ${plan.investment} USDT · Ganancia: +${plan.profit}</p>

                <div className="space-y-3 text-[11px] mb-8">
                  <div className="flex justify-between border-t border-white/5 pt-3">
                    <span className="text-muted">Inversión mínima</span>
                    <span className="text-white font-bold">${plan.investment} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Ganancia</span>
                    <span className="text-profit font-bold">+${plan.profit} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Ciclo</span>
                    <span className="text-white font-bold">{plan.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Red</span>
                    <span className="text-white font-bold">TRC20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Verificación</span>
                    <span className="text-profit font-bold">Automática</span>
                  </div>
                </div>

                <Link
                  href={user ? "/deposit" : "/"}
                  className="w-full btn-gold text-center block"
                >
                  {user ? "Invertir Ahora" : "Login para Invertir"}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center card p-8 space-y-3">
          <p className="text-sm text-muted">¿Tienes dudas sobre los planes?</p>
          <Link href="/support" className="btn-ghost inline-block">Contactar Soporte →</Link>
        </div>
      </div>
    </main>
  );
}
