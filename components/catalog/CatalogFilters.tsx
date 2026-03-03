'use client';

/**
 * components/catalog/CatalogFilters.tsx
 *
 * Lee el estado actual desde la URL y escribe de vuelta en ella.
 * Fuente de verdad única = searchParams — sin useState interno para filtros.
 *
 * Escribe los parámetros:
 *   ?category=proteinas,creatinas   (multi-selección, comma-separated)
 *   ?price=150                      (precio máximo en €)
 *
 * FIXES aplicados:
 *  [1] Valores de categoría corregidos para coincidir con los de la BD:
 *      proteinas, creatinas, pre-workout, aminoacidos, gainers, vitaminas
 *  [2] Sección de marcas eliminada — la BD no tiene columna brand ni
 *      los productos tienen esa info. Se sustituye por un bloque
 *      "Próximamente" para no confundir al usuario.
 *  [3] Símbolo de moneda corregido: $ → €
 */

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Check } from 'lucide-react';

/* ─── DATA ──────────────────────────────────────────────────────────── */

// Valores alineados 1:1 con el campo `category` de la tabla `products`
const CATEGORIES = [
  { label: 'Proteínas',    value: 'proteinas'   },
  { label: 'Pre-Workout',  value: 'pre-workout' },
  { label: 'Creatinas',    value: 'creatinas'   },
  { label: 'Aminoácidos',  value: 'aminoacidos' },
  { label: 'Gainers',      value: 'gainers'     },
  { label: 'Vitaminas',    value: 'vitaminas'   },
];

/* ─── HELPERS ───────────────────────────────────────────────────────── */

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value.split(',').map((v) => v.trim().toLowerCase()).filter(Boolean);
}

/* ─── COMPONENT ─────────────────────────────────────────────────────── */

export default function CatalogFilters() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const activeCategories = parseList(searchParams.get('category'));
  const currentPrice     = Number(searchParams.get('price') || 200);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleCategory = (value: string) => {
    const next = activeCategories.includes(value)
      ? activeCategories.filter((v) => v !== value)
      : [...activeCategories, value];
    updateParams('category', next.join(','));
  };

  const clearAll = () => router.push(pathname, { scroll: false });

  const hasActiveFilters =
    activeCategories.length > 0 || searchParams.get('price') !== null;

  return (
    <div className="space-y-8 pr-6">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-titan-border pb-4">
        <h3 className="font-heading text-xl uppercase tracking-wider text-titan-text">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-titan-accent hover:text-white uppercase tracking-widest transition-colors font-bold"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* ── Categorías ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-widest text-titan-text-muted">Categoría</h4>
        <div className="space-y-3">
          {CATEGORIES.map(({ label, value }) => {
            const isChecked = activeCategories.includes(value);
            return (
              <label key={value} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(value)}
                    className="peer appearance-none w-5 h-5 border border-titan-border bg-titan-bg checked:bg-titan-accent checked:border-titan-accent transition-colors cursor-pointer"
                  />
                  <Check
                    size={14}
                    className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                  />
                </div>
                <span className={`text-sm transition-colors ${isChecked ? 'text-white font-bold' : 'text-titan-text group-hover:text-white'}`}>
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ── Precio Máximo ───────────────────────────────────────────── */}
      <div className="space-y-4 border-t border-titan-border pt-6">
        <h4 className="text-sm font-bold uppercase tracking-widest text-titan-text-muted">Precio Máximo</h4>
        <input
          type="range"
          min="0"
          max="200"
          value={currentPrice}
          onChange={(e) => updateParams('price', e.target.value)}
          className="w-full accent-titan-accent bg-titan-border h-1 appearance-none cursor-pointer"
          aria-label="Precio máximo"
        />
        <div className="flex justify-between text-xs font-bold">
          <span className="text-titan-text-muted">$0</span>
          <span className="text-titan-accent">
            {currentPrice >= 200 ? '$200+' : `$${currentPrice}`}
          </span>
          <span className="text-titan-text-muted">$200+</span>
        </div>
      </div>

    </div>
  );
}
