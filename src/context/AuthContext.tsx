import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => { success: boolean; error?: string };
  register: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'f1app_users';
const SESSION_KEY = 'f1app_session';

function getStoredUsers(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch { /* ignore corrupt session */ }
    }
  }, []);

  const login = (username: string, password: string) => {
    const trimmed = username.trim().toLowerCase();
    if (!trimmed || !password) return { success: false, error: 'Please fill in all fields.' };

    const users = getStoredUsers();
    if (!users[trimmed]) return { success: false, error: 'Account not found. Please register first.' };
    if (users[trimmed] !== password) return { success: false, error: 'Incorrect password.' };

    const u = { username: trimmed };
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    return { success: true };
  };

  const register = (username: string, password: string) => {
    const trimmed = username.trim().toLowerCase();
    if (!trimmed || !password) return { success: false, error: 'Please fill in all fields.' };
    if (trimmed.length < 3) return { success: false, error: 'Username must be at least 3 characters.' };
    if (password.length < 4) return { success: false, error: 'Password must be at least 4 characters.' };

    const users = getStoredUsers();
    if (users[trimmed]) return { success: false, error: 'Username already taken.' };

    users[trimmed] = password;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const u = { username: trimmed };
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
