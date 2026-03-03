'use client';

/**
 * components/blog/BlogCategoryFilters.tsx — Client Component
 * ─────────────────────────────────────────────────────────────
 * Barra sticky de filtros por categoría del blog.
 * Extraída de BlogGrid para aislar su template y hacer que
 * BlogGrid se enfoque exclusivamente en la lógica de filtrado.
 *
 * Recibe como props:
 * - categories: array de categorías (desde _data.ts)
 * - activeCategory: categoría actualmente seleccionada
 * - onSelect: callback para actualizar el estado en BlogGrid
 *
 * ACCESIBILIDAD:
 * - aria-pressed en cada botón indica el estado seleccionado
 *   a lectores de pantalla sin necesidad de texto adicional.
 * - La sección tiene aria-label para que AT anuncie su propósito.
 */

import type { BlogCategory } from '@/app/blog/_data';

interface BlogCategoryFiltersProps {
  categories:     BlogCategory[];
  activeCategory: string;
  onSelect:       (value: string) => void;
}

export default function BlogCategoryFilters({
  categories,
  activeCategory,
  onSelect,
}: BlogCategoryFiltersProps) {
  return (
    <section
      className="sticky top-[72px] z-40 bg-titan-bg border-y border-titan-border"
      aria-label="Filtrar por categoría"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
          {categories.map(({ label, value, icon: Icon }) => {
            const isActive = activeCategory === value;
            return (
              <button
                key={value}
                onClick={() => onSelect(value)}
                aria-pressed={isActive}
                className={`
                  flex items-center gap-2 px-4 py-2 flex-shrink-0
                  text-xs font-bold uppercase tracking-widest
                  transition-all duration-200 border
                  ${isActive
                    ? 'bg-titan-accent text-white border-titan-accent'
                    : 'bg-transparent text-titan-text-muted border-titan-border hover:border-titan-accent/50 hover:text-white'
                  }
                `}
              >
                {Icon && <Icon size={12} aria-hidden="true" />}
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
