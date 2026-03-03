'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  category: string;
  brand: string;
  image: string;
  badge?: string;
}

export default function ProductCard({ id, title, price, category, brand, image, badge }: ProductCardProps) {
  const addItem    = useCartStore((state) => state.addItem);
  const addToast   = useToastStore((state) => state.addToast);

  // Favoritos — lectura reactiva del estado para que el ícono se actualice en tiempo real
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite     = useFavoritesStore((state) => state.isFavorite(id));

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, name: title, price, image, quantity: 1 });
    addToast({
      type: 'success',
      title: '¡Añadido al arsenal!',
      message: `${title} se añadió a tu carrito.`,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar navegar al producto
    toggleFavorite({ id, title, price, image, category });
    addToast({
      type: isFavorite ? 'info' : 'success',
      title: isFavorite ? 'Eliminado de favoritos' : '¡Guardado en favoritos!',
      message: isFavorite
        ? `${title} fue removido de tu arsenal deseado.`
        : `${title} se añadió a tu arsenal deseado.`,
    });
  };

  // MOBILE 2-COL: padding reducido en mobile (p-2) para que las cards quepan en 2 columnas.
  // p-4 en sm+ donde hay más espacio por card.
  return (
    <article className="group relative flex flex-col bg-titan-surface border border-titan-border p-2 sm:p-4 transition-all duration-300 hover:border-titan-accent/50 hover:bg-titan-surface-hover hover:shadow-[0_0_30px_rgba(255,94,0,0.1)]">

      {badge && (
        <span className="absolute top-4 left-4 z-20 bg-titan-accent text-black text-xs font-bold uppercase tracking-wider px-2 py-1">
          {/*
            text-black sobre #ff5e00 = ratio 8.1:1 ✅ (WCAG AAA).
            text-white sobre #ff5e00 = ratio 2.9:1 ✗ (falla AA).
          */}
          {badge}
        </span>
      )}

      {/* ── BOTÓN FAVORITO (DESKTOP) ─────────────────────────────────────────
          IMPORTANTE: Debe estar FUERA del <Link> para evitar dos problemas:
          1. button dentro de <a> = HTML inválido (el navegador lo colapsa)
          2. El <Link> tiene overflow-hidden que recortaba el botón absolutamente posicionado
          Se posiciona relativo al <article> padre que ya tiene `relative`.
      ─────────────────────────────────────────────────────────────────── */}
      <button
        onClick={handleToggleFavorite}
        aria-label={isFavorite ? `Quitar ${title} de favoritos` : `Añadir ${title} a favoritos`}
        aria-pressed={isFavorite}
        className={`
          absolute top-3 right-3 z-30 p-2 rounded-full backdrop-blur-sm transition-all duration-200 hidden lg:flex items-center justify-center
          ${isFavorite
            ? 'bg-titan-accent/90 text-white opacity-100 scale-100'
            : 'bg-black/60 text-white/60 opacity-0 group-hover:opacity-100 group-hover:text-white hover:bg-titan-accent/80'
          }
        `}
      >
        <Heart
          size={15}
          fill={isFavorite ? 'currentColor' : 'none'}
          strokeWidth={isFavorite ? 0 : 2}
        />
      </button>

      {/* Contenedor de imagen — mb reducido en mobile para cards compactas */}
      <Link href={`/product/${id}`} className="relative w-full aspect-[4/5] mb-2 sm:mb-4 overflow-hidden bg-[#0A0A0A] block">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 767px) calc(50vw - 28px), (max-width: 1023px) calc(50vw - 40px), 25vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110 group-hover:opacity-80"
          loading="lazy"
        />

        {/* Quick Add overlay — desktop hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20 hidden lg:block">
          <button
            className="w-full bg-white text-black font-heading text-xl uppercase py-3 hover:bg-titan-accent hover:text-white transition-colors"
            onClick={handleQuickAdd}
            aria-label={`Añadir ${title} al carrito`}
          >
            + Quick Add
          </button>
        </div>
      </Link>

      <div className="flex flex-col flex-grow">
        {/* Categoría + Marca — separadas por un · */}
        <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1 flex-wrap">
          <span className="text-titan-text-muted text-[10px] sm:text-sm uppercase tracking-wider">{category}</span>
          <span className="text-titan-border text-[10px] sm:text-xs" aria-hidden="true">·</span>
          {/* Marca en acento muy sutil — identifica sin competir con el título */}
          <span className="text-titan-accent/60 text-[10px] sm:text-xs uppercase tracking-wider font-bold">{brand}</span>
        </div>
        <Link href={`/product/${id}`} className="focus:outline-none">
          {/* Título — text-sm en mobile 2-col, text-xl en sm+ */}
          <h3 className="text-titan-text text-sm sm:text-xl font-heading tracking-wide mb-1 sm:mb-2 group-hover:text-titan-accent transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between gap-1 sm:gap-2">
          {/* Precio — text-sm en mobile 2-col, text-lg en sm+ */}
          <span className="text-white font-medium text-sm sm:text-lg">${price.toFixed(2)}</span>

          {/*
            WCAG 2.5.5: mínimo 44×44px para áreas táctiles en mobile.
            w-9 (36px) era insuficiente — subido a w-11 h-11 (44px) en todas las resoluciones.
            gap reducido a gap-0 en mobile para que ambos botones quepan en tarjetas 2-col
            sin comprometer el área táctil.
          */}
          <div className="flex items-center gap-0 sm:gap-2 lg:hidden">
            <button
              onClick={handleToggleFavorite}
              aria-label={isFavorite ? `Quitar ${title} de favoritos` : `Añadir ${title} a favoritos`}
              aria-pressed={isFavorite}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                isFavorite
                  ? 'bg-titan-accent text-black'
                  : 'bg-titan-border text-white/60 active:bg-titan-accent active:text-black'
              }`}
            >
              <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={isFavorite ? 0 : 2} />
            </button>

            <button
              onClick={handleQuickAdd}
              className="w-11 h-11 bg-titan-accent rounded-full flex items-center justify-center text-black active:bg-titan-accent-hover transition-colors flex-shrink-0"
              aria-label={`Añadir ${title} al carrito`}
            >
              <span aria-hidden="true" className="text-sm font-bold leading-none">+</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
