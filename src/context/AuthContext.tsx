"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: number;
  telegram_id: string;
  email?: string;
  username?: string;
  first_name?: string;
  balance?: number;
  game_balance?: number;
  investment_balance?: number;
  total_invested?: number;
  total_earned?: number;
  active_investments?: number;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: any }>;
  signUp: (email: string, pass: string, metadata: any) => Promise<{ error: any; data: any }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setSupabaseUser(session.user);
          await fetchUserData(session.user.id);
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (supabaseId: string) => {
    try {
      // Try fetching by supabase_id (preferred) or email
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`supabase_id.eq.${supabaseId},email.eq.${supabaseUser?.email}`)
        .single();

      if (data) {
        setUser(data);
      }
    } catch (e) {
      console.error("Error fetching user data:", e);
    }
  };

  const signIn = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (!error) router.push('/dashboard');
    return { error };
  };

  const signUp = async (email: string, pass: string, metadata: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: metadata }
    });
    return { data, error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const refreshUser = async () => {
    if (supabaseUser) await fetchUserData(supabaseUser.id);
  };

  return (
    <AuthContext.Provider value={{ user, supabaseUser, loading, signIn, signUp, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
