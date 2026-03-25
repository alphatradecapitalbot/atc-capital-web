"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart2,
  Users,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { SITE_SHORT } from "@/lib/constants";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Deposit",   href: "/deposit",   icon: ArrowDownToLine },
  { label: "Withdraw",  href: "/withdraw",  icon: ArrowUpFromLine },
  { label: "Plans",     href: "/plans",     icon: BarChart2 },
  { label: "Referral",  href: "/referral",  icon: Users },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex">
      {/* ── SIDEBAR DESKTOP ─────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#0E0E14] border-r border-white/5 fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="px-6 py-8 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center shadow-lg shadow-gold/20">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-black uppercase tracking-tighter">{SITE_SHORT}</span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group ${
                  active
                    ? "bg-gold/10 text-gold border border-gold/20 shadow-[0_0_20px_rgba(255,215,0,0.08)]"
                    : "text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-4.5 h-4.5 ${active ? "text-gold" : "group-hover:text-white"}`} />
                {item.label}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-4 py-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-sm">
              {(user?.first_name || user?.email || "U")[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white truncate">{user?.first_name || user?.email || "Investor"}</p>
              <p className="text-[10px] text-profit font-bold">${user?.balance?.toFixed(2) || "0.00"} USDT</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── SIDEBAR MOBILE (overlay) ─────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0E0E14] border-r border-white/5 z-50 flex flex-col md:hidden"
            >
              <div className="px-6 py-8 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center"><TrendingUp className="w-5 h-5 text-black" /></div>
                  <span className="text-lg font-black uppercase tracking-tighter">{SITE_SHORT}</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-muted hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? "bg-gold/10 text-gold border border-gold/20" : "text-muted hover:text-white hover:bg-white/5"}`}>
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="px-4 py-6 border-t border-white/5">
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted hover:text-red-400">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ────────────────────────── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-[#0B0B0F]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-muted hover:text-white">
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
              <Wallet className="w-4 h-4 text-gold" />
              <span className="text-sm font-black text-white">${user?.balance?.toFixed(2) || "0.00"}</span>
              <span className="text-[10px] font-bold text-muted uppercase">USDT</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center font-black text-sm text-primary border border-primary/20">
              {(user?.first_name || user?.email || "U")[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
