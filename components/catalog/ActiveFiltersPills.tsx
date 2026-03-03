'use client';

/*
  ActiveFiltersPills.tsx
  ──────────────────────
  Muestra los filtros activos como pills removibles debajo del botón de filtros
  en mobile. El usuario sabe en todo momento qué tiene filtrado sin abrir el drawer.

  FIX: Mapa de CATEGORY_LABELS actualizado para coincidir con los valores
  reales de la BD: proteinas, creatinas, aminoacidos, gainers, vitaminas, pre-workout.
*/

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';

// Labels 1:1 con los valores de `category` en la tabla `products`
const CATEGORY_LABELS: Record<string, string> = {
  'proteinas':   'Proteínas',
  'pre-workout': 'Pre-Workout',
  'creatinas':   'Creatinas',
  'aminoacidos': 'Aminoácidos',
  'gainers':     'Gainers',
  'vitaminas':   'Vitaminas',
};

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value.split(',').map((v) => v.trim().toLowerCase()).filter(Boolean);
}

export default function ActiveFiltersPills() {
  const searchParams     = useSearchParams();
  const router           = useRouter();
  const pathname         = usePathname();

  const activeCategories = parseList(searchParams.get('category'));
  const hasPrice         = searchParams.get('price') !== null;
  const query            = searchParams.get('q');

  const totalActive = activeCategories.length + (hasPrice ? 1 : 0) + (query ? 1 : 0);

  if (totalActive === 0) return null;

  const removeFromList = (key: string, value: string, current: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    const next   = current.filter((v) => v !== value);
    if (next.length > 0) {
      params.set(key, next.join(','));
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => router.push(pathname, { scroll: false });

  return (
    <div className="lg:hidden flex flex-wrap items-center gap-2 py-2" aria-label="Filtros activos">

      {activeCategories.map((cat) => (
        <span
          key={cat}
          className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-titan-accent/10 border border-titan-accent/40 text-titan-accent text-xs font-bold uppercase tracking-wider"
        >
          {CATEGORY_LABELS[cat] ?? cat}
          <button
            onClick={() => removeFromList('category', cat, activeCategories)}
            className="hover:bg-titan-accent/20 rounded-full p-0.5 transition-colors"
            aria-label={`Quitar filtro ${CATEGORY_LABELS[cat] ?? cat}`}
          >
            <X size={10} />
          </button>
        </span>
      ))}

      {hasPrice && (
        <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-titan-surface border border-titan-border text-titan-text-muted text-xs font-bold uppercase tracking-wider">
          Precio: {searchParams.get('price')}€
          <button
            onClick={() => removeParam('price')}
            className="hover:text-white transition-colors rounded-full p-0.5"
            aria-label="Quitar filtro de precio"
          >
            <X size={10} />
          </button>
        </span>
      )}

      {query && (
        <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-titan-surface border border-titan-border text-titan-text-muted text-xs font-bold uppercase tracking-wider">
          &ldquo;{query}&rdquo;
          <button
            onClick={() => removeParam('q')}
            className="hover:text-white transition-colors rounded-full p-0.5"
            aria-label="Limpiar búsqueda"
          >
            <X size={10} />
          </button>
        </span>
      )}

      {totalActive > 1 && (
        <button
          onClick={clearAll}
          className="text-[10px] font-bold text-titan-text-muted hover:text-titan-accent uppercase tracking-widest underline underline-offset-2 transition-colors ml-1"
        >
          Limpiar todo
        </button>
      )}
    </div>
  );
}
