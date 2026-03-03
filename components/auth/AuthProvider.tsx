'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';

/**
 * AuthProvider — inicializa la sesión de Supabase al montar la app.
 * Una vez que el usuario está autenticado, sincroniza los favoritos
 * desde Supabase para que el estado refleje la DB, no localStorage.
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize     = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const syncWithDB     = useFavoritesStore((state) => state.syncWithDB);

  // Inicializar sesión al montar
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Sincronizar favoritos con Supabase cuando la sesión esté lista
  useEffect(() => {
    if (isAuthenticated) {
      syncWithDB();
    }
  }, [isAuthenticated, syncWithDB]);

  return <>{children}</>;
}
