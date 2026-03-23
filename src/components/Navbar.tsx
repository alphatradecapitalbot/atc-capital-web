"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TrendingUp, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { SITE_SHORT, TELEGRAM_BOT_LINK, YOUTUBE_CHANNEL } from "@/lib/constants";

const NAV_PUBLIC = [
  { href: "/#como-funciona", label: "Cómo Funciona" },
  { href: "/#planes", label: "Planes" },
  { href: "/games", label: "🎮 Juegos 🔥" },
  { href: "/#seguridad", label: "Seguridad" },
  { href: "/reglas", label: "Reglas" },
  { href: "/#faq", label: "FAQ" },
  { href: "/support", label: "Soporte" },
];

const NAV_AUTH = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/deposit", label: "Invertir" },
  { href: "/games", label: "🎮 Juegos 🔥" },
  { href: "/withdraw", label: "Retiros" },
  { href: "/referral", label: "Referidos" },
  { href: "/support", label: "Soporte" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const links = user ? NAV_AUTH : NAV_PUBLIC;

  return (
    <nav className="fixed top-0 w-full z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto glass flex items-center justify-between px-8 py-5 rounded-[24px] relative overflow-hidden shadow-2xl">
        {/* Subtle gold gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent pointer-events-none opacity-30" />
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10 hover:scale-105 transition-transform duration-300">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#B8960C] rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <TrendingUp className="text-black w-6 h-6" />
          </div>
          <div>
            <span className="font-black text-sm uppercase tracking-tight leading-none block text-white">{SITE_SHORT}</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-gold leading-none block mt-0.5">Capital</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-10 relative z-10">
          {links.map(l => {
            const isActive = path === l.href;
            const isGames = l.href === '/games';
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link ${isActive ? 'active' : ''} ${isGames ? 'animate-pulse-gold font-bold' : ''}`}
              >
                {l.label}
              </Link>
            );
          })}
          <a
            href={YOUTUBE_CHANNEL}
            target="_blank"
            className="nav-link text-red-500 hover:text-red-400 font-bold"
          >
            ▶ YouTube
          </a>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4 relative z-10">
          {user ? (
            <>
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">
                  {user.email?.split('@')[0] || user.username || 'Usuario'}
                </span>
                <span className="text-[8px] text-white/40 uppercase tracking-widest font-bold">Online</span>
              </div>
              <button onClick={logout} className="btn-ghost !px-4 !py-2.5 flex items-center gap-2 group hover:border-red-500/30">
                <LogOut className="w-4 h-4 group-hover:text-red-500 transition-colors" />
                <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest">Salir</span>
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-gold-premium flex items-center gap-2">
              🔐 Acceder
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            {open ? <X className="w-6 h-6 text-gold" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden glass mt-3 rounded-3xl px-8 py-6 space-y-4 mx-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          {links.map(l => {
            const isActive = path === l.href;
            const isGames = l.href === '/games';
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link block py-3 text-lg ${isActive ? 'active' : ''} ${isGames ? 'animate-pulse-gold' : ''}`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-white/5">
            <a 
              href={YOUTUBE_CHANNEL} 
              target="_blank" 
              className="nav-link block py-3 text-lg text-red-500 font-bold"
              onClick={() => setOpen(false)}
            >
              ▶ YouTube
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
