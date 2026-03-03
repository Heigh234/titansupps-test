'use client';

/**
 * useFavoritesStore — Sistema de favoritos sincronizado con Supabase
 * ─────────────────────────────────────────────────────────────────────────
 * - El estado en memoria sirve para UI reactiva instantánea (corazones)
 * - Cada toggle llama a la Server Action para persistir en Supabase
 * - syncWithDB() carga el estado real desde Supabase al iniciar sesión
 *
 * Flujo:
 *   1. AuthProvider llama syncWithDB() después de initialize()
 *   2. El store se llena con los favoritos reales del usuario
 *   3. Al togglear, se actualiza el store (optimista) y luego Supabase
 */

import { create } from 'zustand';
import { toggleFavorite as toggleFavoriteAction, getFavorites } from '@/actions/account';

export interface FavoriteProduct {
  id:       string;
  title:    string;
  price:    number;
  image:    string;
  category: string;
  slug?:    string;
}

interface FavoritesState {
  items:          FavoriteProduct[];
  synced:         boolean;
  toggleFavorite: (product: FavoriteProduct) => Promise<void>;
  removeFavorite: (id: string) => void;
  isFavorite:     (id: string) => boolean;
  syncWithDB:     () => Promise<void>;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  items:  [],
  synced: false,

  // Carga favoritos reales desde Supabase y reemplaza el estado local
  syncWithDB: async () => {
    try {
      const data = await getFavorites();
      const items: FavoriteProduct[] = (data as {
        product_id: string;
        products: {
          id: string; name: string; slug: string; price: number;
          product_images?: { url: string }[];
        } | null;
      }[])
        .filter((row) => row.products !== null)
        .map((row) => ({
          id:       row.products!.id,
          title:    row.products!.name,
          price:    row.products!.price,
          image:    row.products!.product_images?.[0]?.url ?? '',
          category: '',
          slug:     row.products!.slug,
        }));

      set({ items, synced: true });
    } catch {
      // Si falla la sync, el store queda vacío — no es crítico
      set({ synced: true });
    }
  },

  // Update optimista + persistencia en Supabase
  toggleFavorite: async (product: FavoriteProduct) => {
    const exists = get().items.some((item) => item.id === product.id);

    // 1. Actualizar UI inmediatamente (optimista)
    if (exists) {
      set({ items: get().items.filter((item) => item.id !== product.id) });
    } else {
      set({ items: [...get().items, product] });
    }

    // 2. Persistir en Supabase (silencioso — si falla, revertir)
    try {
      await toggleFavoriteAction(product.id);
    } catch {
      // Revertir si la Server Action falla
      if (exists) {
        set({ items: [...get().items, product] });
      } else {
        set({ items: get().items.filter((item) => item.id !== product.id) });
      }
    }
  },

  removeFavorite: (id: string) => {
    set({ items: get().items.filter((item) => item.id !== id) });
    // También persiste en Supabase
    toggleFavoriteAction(id).catch(() => {});
  },

  isFavorite: (id: string) => {
    return get().items.some((item) => item.id === id);
  },

  // Llamar en logout para limpiar el estado
  clearFavorites: () => set({ items: [], synced: false }),
}));
