'use client';

/*
  MobileFilterDrawer.tsx — v2
  ───────────────────────────
  Mejoras UX vs v1:

  1. Badge de conteo en el botón trigger:
     Muestra cuántos filtros están activos sin abrir el drawer.
     "Filtrar · 3" → el usuario sabe inmediatamente qué tiene activo.

  2. Cierre automático al aplicar:
     Al pulsar "Ver resultados", el drawer se cierra Y la página
     hace scroll suave hasta el id="catalog-results" (el grid de productos),
     para que el usuario vea los resultados inmediatamente.

  3. El botón cambia de estilo cuando hay filtros activos:
     Borde y texto en acento naranja → señal visual clara de estado.
*/

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { Suspense } from 'react';
import CatalogFilters from '@/components/catalog/CatalogFilters';

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value.split(',').map((v) => v.trim()).filter(Boolean);
}

export default function MobileFilterDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams        = useSearchParams();

  // Contar filtros activos para el badge
  const activeCount =
    parseList(searchParams.get('category')).length +
    parseList(searchParams.get('brand')).length +
    (searchParams.get('price') ? 1 : 0);

  const hasActive = activeCount > 0;

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleApply = () => {
    setIsOpen(false);
    // Scroll suave al grid de resultados tras cerrar
    setTimeout(() => {
      const resultsEl = document.getElementById('catalog-results');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 320); // esperar a que el drawer termine su animación de salida
  };

  return (
    <>
      {/* Botón trigger con badge de conteo */}
      <button
        onClick={() => setIsOpen(true)}
        className={`lg:hidden flex items-center justify-center gap-2 w-full py-3 border font-heading tracking-wider uppercase transition-colors ${
          hasActive
            ? 'border-titan-accent bg-titan-accent/5 text-titan-accent'
            : 'border-titan-border bg-titan-surface text-titan-text hover:border-titan-accent hover:text-titan-accent'
        }`}
        aria-label={`Abrir filtros${hasActive ? `, ${activeCount} activos` : ''}`}
        aria-expanded={isOpen}
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
        Filtrar
        {/* Badge de conteo */}
        {hasActive && (
          <span className="inline-flex items-center justify-center w-5 h-5 bg-titan-accent text-black text-[10px] font-bold rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {/* Overlay + Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
              aria-hidden="true"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filtros de productos"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 left-0 h-full w-[85vw] max-w-sm bg-titan-surface border-r border-titan-border z-50 flex flex-col shadow-2xl lg:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-titan-border">
                <div>
                  <h2 className="font-heading text-2xl uppercase tracking-wider text-titan-text">
                    Filtrar <span className="text-titan-accent">Arsenal</span>
                  </h2>
                  {hasActive && (
                    <p className="text-[10px] text-titan-accent uppercase tracking-widest font-bold mt-0.5">
                      {activeCount} filtro{activeCount !== 1 ? 's' : ''} activo{activeCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-titan-text-muted hover:text-white hover:bg-titan-bg rounded-full transition-colors"
                  aria-label="Cerrar filtros"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Filtros scrollables */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                <Suspense fallback={<div className="h-96 bg-titan-bg animate-pulse" />}>
                  <CatalogFilters />
                </Suspense>
              </div>

              {/* Footer — Ver resultados con scroll automático */}
              <div className="p-6 border-t border-titan-border space-y-3">
                <button
                  onClick={handleApply}
                  className="w-full py-4 bg-titan-accent text-white font-heading text-xl uppercase tracking-widest hover:bg-titan-accent-hover transition-colors shadow-[0_0_20px_rgba(255,94,0,0.2)]"
                >
                  Ver Resultados
                </button>
                {hasActive && (
                  <button
                    onClick={() => {
                      // Limpiar todos los filtros y cerrar
                      const url = new URL(window.location.href);
                      ['category', 'brand', 'price'].forEach((k) => url.searchParams.delete(k));
                      window.history.pushState({}, '', url.toString());
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      setIsOpen(false);
                    }}
                    className="w-full py-2.5 border border-titan-border text-titan-text-muted font-heading text-sm uppercase tracking-widest hover:border-titan-accent hover:text-titan-accent transition-colors"
                  >
                    Limpiar Filtros
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
