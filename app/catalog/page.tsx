import { Suspense } from 'react';
import CatalogGrid from '@/components/catalog/CatalogGrid';
import CatalogFilters from '@/components/catalog/CatalogFilters';
import CatalogSkeleton from '@/components/catalog/CatalogSkeleton';
import DebouncedSearch from '@/components/ui/DebouncedSearch';
import MobileFilterDrawer from '@/components/catalog/MobileFilterDrawer';
import ActiveFiltersPills from '@/components/catalog/ActiveFiltersPills';

export const metadata = {
  title: 'Catálogo de Suplementos | TitanSupps',
  description: 'Explora nuestro arsenal completo. Proteínas, pre-entrenos, creatina y más.',
};

/*
  CATALOG PAGE v2.1
  ─────────────────
  Novedades vs v2.0:
  - ActiveFiltersPills: pills removibles con los filtros activos en mobile
  - id="catalog-results" en el <main>: target del scroll automático desde MobileFilterDrawer
  - SlidersHorizontal import eliminado (ya no se usa aquí, se movió a MobileFilterDrawer)
*/

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-titan-bg pt-28 pb-24">
      <div className="container mx-auto px-6">

        {/* HEADER */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-titan-border pb-8">
          <div>
            <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-2">Todo el arsenal</p>
            <h1 className="text-fluid-4xl font-heading text-titan-text uppercase">
              El <span className="text-titan-accent">Arsenal</span>
            </h1>
            <p className="text-titan-text-muted mt-2">Equípate con lo mejor. Sin excusas.</p>
          </div>

          {/* DebouncedSearch — conectado a ?q= con 300ms debounce */}
          <Suspense fallback={<div className="h-12 w-full md:w-96 bg-titan-surface animate-pulse" />}>
            <DebouncedSearch />
          </Suspense>
        </header>

        {/* LAYOUT PRINCIPAL */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Mobile: Botón de filtros + pills activos ────────────── */}
          <div className="lg:hidden flex flex-col gap-2">
            {/*
              MobileFilterDrawer: botón con badge de conteo de filtros activos.
              Al aplicar → cierra y hace scroll a #catalog-results.
            */}
            <Suspense fallback={null}>
              <MobileFilterDrawer />
            </Suspense>

            {/*
              ActiveFiltersPills: pills removibles debajo del botón.
              Solo renderiza si hay filtros activos. Feedback visual inmediato.
            */}
            <Suspense fallback={null}>
              <ActiveFiltersPills />
            </Suspense>
          </div>

          {/* SIDEBAR DE FILTROS (Desktop — sticky) */}
          <aside className="hidden lg:block w-64 flex-shrink-0" aria-label="Filtros de productos">
            <div className="sticky top-32">
              <Suspense fallback={<div className="h-96 bg-titan-surface animate-pulse" />}>
                <CatalogFilters />
              </Suspense>
            </div>
          </aside>

          {/*
            GRID DE PRODUCTOS
            id="catalog-results": target del scrollIntoView desde MobileFilterDrawer.
            El usuario ve los resultados inmediatamente al aplicar filtros en mobile.
          */}
          <main id="catalog-results" className="flex-1" aria-label="Productos">
            <Suspense fallback={<CatalogSkeleton />}>
              <CatalogGrid />
            </Suspense>
          </main>

        </div>
      </div>
    </div>
  );
}
