"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Copy, Users, TrendingUp } from "lucide-react";

export default function ReferralPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}?ref=${user?.telegram_id}`
    : `https://alphatrade.app?ref=${user?.telegram_id}`;

  const copy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen pt-28 pb-16">
      <div className="max-w-2xl mx-auto px-6 space-y-8">

        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Programa de Referidos</h1>
          <p className="text-muted text-sm mt-1">Gana comisiones por cada persona que invites a la plataforma.</p>
        </motion.div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: "01", title: "Comparte tu enlace", desc: "Envía tu link único a amigos y familia." },
            { step: "02", title: "Se registran", desc: "Usan tu enlace para conectarse con Telegram." },
            { step: "03", title: "Ganas comisión", desc: "Recibes 0.30 USDT por cada inversión aprobada." },
          ].map((s, i) => (
            <div key={i} className="card p-6 space-y-3">
              <div className="text-[9px] font-black text-muted tracking-widest">{s.step}</div>
              <h3 className="font-bold text-sm">{s.title}</h3>
              <p className="text-muted text-xs">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Referral link */}
        <div className="card p-6 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gold">Tu Enlace de Referido</h2>
          <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
            <code className="text-[11px] text-green-400 font-mono break-all">{referralLink}</code>
            <button onClick={copy} className="btn-ghost !px-4 !py-2 shrink-0">
              {copied ? "¡Copiado!" : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-2xl font-black">0</p>
              <p className="text-[9px] uppercase tracking-widest text-muted">Referidos</p>
            </div>
          </div>
          <div className="card p-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-400/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-profit" />
            </div>
            <div>
              <p className="text-2xl font-black text-profit">0.00</p>
              <p className="text-[9px] uppercase tracking-widest text-muted">USDT Ganados</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
