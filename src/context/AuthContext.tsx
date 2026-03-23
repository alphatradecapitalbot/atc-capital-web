"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  telegram_id: string;
  email?: string;
  username?: string;
  first_name?: string;
  balance?: number; // Legacy
  game_balance?: number;
  investment_balance?: number;
  total_invested?: number;
  total_earned?: number;
  active_investments?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('atc_token');
    const savedUser = localStorage.getItem('atc_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Optionally verify token with backend
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      }).then(res => {
        if (!res.ok) logout();
        else return res.json();
      }).then(data => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem('atc_user', JSON.stringify(data.user));
        }
      }).catch(() => {});
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('atc_token', newToken);
    localStorage.setItem('atc_user', JSON.stringify(newUser));
    router.push('/dashboard');
  };

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('atc_token');
    if (!savedToken) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('atc_user', JSON.stringify(data.user));
        }
      }
    } catch (e) { console.error(e); }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('atc_token');
    localStorage.removeItem('atc_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
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
