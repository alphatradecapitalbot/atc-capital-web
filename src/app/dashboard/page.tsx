'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('user_id')
    if (!id) {
      router.push('/')
    } else {
      setUserId(id)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            Dashboard <span className="text-gold">AlphaTrade</span>
          </h1>
          <div className="bg-gold/10 border border-gold/20 px-4 py-2 rounded-full text-xs font-bold text-gold uppercase tracking-widest">
            ID: {userId}
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 border border-white/10 rounded-3xl bg-white/[0.02]">
            <h2 className="text-muted text-[10px] font-black uppercase tracking-widest mb-2">Welcome</h2>
            <p className="text-xl font-bold">Successfully logged in via Telegram.</p>
          </div>
          
          <div className="p-8 border border-white/10 rounded-3xl bg-white/[0.02]">
            <h2 className="text-muted text-[10px] font-black uppercase tracking-widest mb-2">Account Status</h2>
            <p className="text-xl font-bold text-profit">Verified ✓</p>
          </div>
        </main>
      </div>
    </div>
  )
}
