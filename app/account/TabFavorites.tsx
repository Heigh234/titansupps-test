'use client';

// ─────────────────────────────────────────────────────────────────────────────
// TAB: FAVORITOS — app/account/TabFavorites.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Lee del useFavoritesStore, que ahora está sincronizado con Supabase.
// Los favoritos persisten entre dispositivos y recargas.

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Loader2 } from 'lucide-react';
import { useToastStore }     from '@/store/useToastStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useCartStore }      from '@/store/useCartStore';

export default function TabFavorites() {
  const addToast       = useToastStore((state) => state.addToast);
  const favorites      = useFavoritesStore((state) => state.items);
  const synced         = useFavoritesStore((state) => state.synced);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const addItem        = useCartStore((state) => state.addItem);

  const handleRemove = (id: string, title: string) => {
    removeFavorite(id);
    addToast({ type: 'info', title: 'Eliminado de favoritos', message: `${title} fue removido de tu arsenal deseado.` });
  };

  const handleAddToCart = (fav: typeof favorites[0]) => {
    addItem({ id: fav.id, name: fav.title, price: fav.price, image: fav.image, quantity: 1 });
    addToast({ type: 'success', title: '¡Añadido al arsenal!', message: `${fav.title} se añadió a tu carrito.` });
  };

  // Spinner mientras se sincroniza con Supabase por primera vez
  if (!synced) {
    return (
      <motion.div
        key="favorites-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-24"
      >
        <Loader2 size={24} className="animate-spin text-titan-accent" />
      </motion.div>
    );
  }

  return (
    <motion.div
      key="favorites"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-titan-border pb-4">
        <h2 className="font-heading text-2xl uppercase tracking-wider text-titan-text">Arsenal Deseado</h2>
        {favorites.length > 0 && (
          <span className="text-xs text-titan-text-muted font-bold uppercase tracking-widest">
            {favorites.length} producto{favorites.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Estado vacío */}
      {favorites.length === 0 ? (
        <div className="border border-dashed border-titan-border p-16 text-center">
          <Heart size={36} className="text-titan-text-muted mx-auto mb-4" />
          <p className="text-titan-text font-heading text-xl uppercase tracking-wider mb-2">Tu arsenal está vacío</p>
          <p className="text-titan-text-muted text-sm mb-6">
            Guarda productos desde la tienda pulsando el ícono{' '}
            <Heart size={12} className="inline text-titan-accent" fill="currentColor" />{' '}
            en cada tarjeta.
          </p>
          <Link
            href="/catalog"
            className="inline-block px-6 py-3 bg-titan-accent text-white font-heading text-base uppercase tracking-widest hover:bg-titan-accent/80 transition-colors"
          >
            Explorar tienda
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {favorites.map((fav) => (
              <motion.div
                key={fav.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-titan-surface border border-titan-border p-4 flex gap-4 relative group hover:border-titan-accent/40 transition-colors"
              >
                {/* Botón eliminar de favoritos */}
                <button
                  onClick={() => handleRemove(fav.id, fav.title)}
                  className="absolute top-2 right-2 p-1.5 text-titan-accent hover:text-red-500 hover:bg-red-500/10 rounded transition-colors z-10"
                  aria-label={`Quitar ${fav.title} de favoritos`}
                >
                  <Heart size={15} fill="currentColor" />
                </button>

                {/* Imagen del producto */}
                <div className="w-20 h-24 bg-titan-bg border border-titan-border relative flex-shrink-0 overflow-hidden">
                  {fav.image ? (
                    <Image
                      src={fav.image}
                      alt={fav.title}
                      fill
                      sizes="80px"
                      className="object-cover p-1 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart size={20} className="text-titan-border" />
                    </div>
                  )}
                </div>

                {/* Info + acciones */}
                <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-titan-text-muted block mb-1">
                      {fav.category || 'Suplemento'}
                    </span>
                    <h3 className="font-heading text-base leading-tight text-titan-text pr-6 line-clamp-2">
                      {fav.title}
                    </h3>
                  </div>

                  <p className="font-bold text-titan-accent text-lg mt-2">
                    €{fav.price.toFixed(2)}
                  </p>

                  <div className="flex items-center gap-2 mt-3 border-t border-titan-border/60 pt-3">
                    <button
                      onClick={() => handleAddToCart(fav)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-titan-text-muted hover:text-white hover:bg-titan-accent border border-titan-border/60 hover:border-titan-accent py-2 transition-colors"
                    >
                      <ShoppingCart size={11} /> Añadir
                    </button>
                    <Link
                      href={`/product/${fav.slug ?? fav.id}`}
                      className="flex-1 text-center text-[10px] uppercase tracking-widest text-titan-text-muted hover:text-white underline underline-offset-2 transition-colors py-2"
                    >
                      Ver producto
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
