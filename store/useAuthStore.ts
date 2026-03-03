'use client';

/**
 * useAuthStore — Autenticación respaldada por Supabase
 * Mantiene la misma interfaz que antes para no romper componentes existentes.
 */

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

export interface AuthUser {
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Intentar obtener el perfil de la tabla profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      set({
        user: {
          name: profile?.name || user.email?.split('@')[0] || 'Usuario',
          email: user.email || '',
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }

    // Escuchar cambios de sesión
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', session.user.id)
          .single();

        set({
          user: {
            name: profile?.name || session.user.email?.split('@')[0] || 'Usuario',
            email: session.user.email || '',
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },

  login: (user: AuthUser) => {
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },
}));
