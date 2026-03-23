'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  LogOut, 
  ChevronRight,
  Shield,
  Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Usuarios', href: '/admin/users', icon: Users },
  { name: 'Depósitos', href: '/admin/deposits', icon: CreditCard },
  { name: 'Inversiones', href: '/admin/investments', icon: TrendingUp },
  { name: 'Control Panel', href: '/admin/control', icon: Settings },
];

const ADMIN_IDS = [523694323, 5073465344];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [alert, setAlert] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!ADMIN_IDS.includes(parseInt(user.telegram_id))) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  // Real-time Polling for alerts
  useEffect(() => {
    if (!user) return;
    
    const checkNewEvents = async () => {
      try {
        const token = localStorage.getItem('atc_token');
        const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${api}/api/admin/deposits`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        const all = data.deposits || [];
        
        const pending = all.filter((d: any) => d.status === 'pending');
        const approved = all.filter((d: any) => d.status === 'approved');
        const rejected = all.filter((d: any) => d.status === 'rejected');
        
        if (pending.length > pendingCount && pendingCount !== 0) {
          setAlert(`🔔 Nuevo depósito pendiente: $${pending[0].amount}`);
        } else if (approved.length > approvedCount && approvedCount !== 0) {
          setAlert(`✅ Depósito confirmado: $${approved[0].amount}`);
        } else if (rejected.length > rejectedCount && rejectedCount !== 0) {
          setAlert(`❌ Error/Rechazo de depósito`);
        }

        if (alert) setTimeout(() => setAlert(null), 5000);
        
        setPendingCount(pending.length);
        setApprovedCount(approved.length);
        setRejectedCount(rejected.length);
      } catch (e) { console.error(e); }
    };

    const interval = setInterval(checkNewEvents, 10000);
    return () => clearInterval(interval);
  }, [user, pendingCount, approvedCount, rejectedCount, alert]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <Zap className="w-8 h-8 text-gold animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex overflow-hidden">
      
      {/* ── Sidebar ── */}
      <aside className="w-72 border-r border-white/5 bg-white/[0.01] flex flex-col shrink-0">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center shadow-lg shadow-gold/20 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest leading-none">AlphaTrade</p>
              <p className="text-[10px] font-bold text-gold uppercase tracking-tighter mt-1">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 pt-4">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`group flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gold/10 text-gold border border-gold/10' 
                    : 'text-muted hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="text-sm font-bold tracking-tight">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center text-black font-black text-xs">
                {user?.first_name?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black truncate">{user?.first_name || 'Admin'}</p>
                <p className="text-[10px] text-muted truncate">ID: {user?.telegram_id}</p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white/70 transition-all border border-white/5"
            >
              <LayoutDashboard className="w-3 h-3" />
              Ver Dashboard User
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-gold/[0.03] to-transparent pointer-events-none" />
        
        {/* Real-time Alert Toast */}
        <AnimatePresence>
          {alert && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-8 right-8 z-[200] flex items-center gap-4 p-5 rounded-2xl bg-gold text-black shadow-2xl shadow-gold/40 border border-white/20"
            >
              <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">System Alert</p>
                <p className="text-sm font-black uppercase italic leading-tight">{alert}</p>
              </div>
              <button onClick={() => setAlert(null)} className="ml-4 opacity-40 hover:opacity-100 transition-opacity">
                 <LogOut className="w-4 h-4 rotate-90" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
