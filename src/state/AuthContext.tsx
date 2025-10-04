/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  login as apiLogin,
  logout as apiLogout,
  me as apiMe,
  register as apiRegister,
  type AppUser,
} from '../hooks/useAuth';
import { authToken } from '../utils/authToken';

type Ctx = {
  user: AppUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!authToken.get()) return;
        const u = await apiMe();
        setUser(u);
      } catch {
        authToken.clear();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(email: string, password: string) {
    const u = await apiLogin(email, password);
    setUser(u);
  }

  async function register(email: string, password: string, name: string) {
    const u = await apiRegister(email, password, name);
    setUser(u);
  }

  function logout() {
    apiLogout();
    setUser(null);
  }

  return <AuthCtx.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
