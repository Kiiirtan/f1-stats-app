import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

/* ─── Types ─── */

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: { displayName?: string; avatarUrl?: string }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ─── Helpers ─── */

function mapUser(su: SupabaseUser): AuthUser {
  return {
    id: su.id,
    email: su.email ?? '',
    displayName: su.user_metadata?.display_name || su.user_metadata?.full_name || su.email?.split('@')[0] || 'F1 Fan',
    avatarUrl: su.user_metadata?.avatar_url || null,
    createdAt: su.created_at,
  };
}

/* ─── Provider ─── */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ? mapUser(s.user) : null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ? mapUser(s.user) : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: 'Authentication service unavailable.' };

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) return { success: false, error: 'Please fill in all fields.' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          display_name: displayName || trimmedEmail.split('@')[0],
        },
      },
    });

    if (error) return { success: false, error: error.message };
    if (data.user) {
      // For projects with email confirmation disabled, user is auto-logged in
      return { success: true };
    }
    return { success: true };
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: 'Authentication service unavailable.' };

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) return { success: false, error: 'Please fill in all fields.' };

    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: 'Invalid email or password.' };
      }
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (data: { displayName?: string; avatarUrl?: string }): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: 'Authentication service unavailable.' };

    const updates: Record<string, string> = {};
    if (data.displayName !== undefined) updates.display_name = data.displayName;
    if (data.avatarUrl !== undefined) updates.avatar_url = data.avatarUrl;

    const { error } = await supabase.auth.updateUser({
      data: updates,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
