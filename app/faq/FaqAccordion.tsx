'use client';

/**
 * FaqAccordion.tsx — Filtros de categoría + acordeón interactivo
 * ───────────────────────────────────────────────────────────────
 * EXTRACCIÓN: Separado de page.tsx para que este pueda ser Server Component.
 * El hero y el CTA inferior no necesitan JS — se renderizan en servidor.
 *
 * ESTADO:
 *   openItems       — qué preguntas están abiertas (Record<key, boolean>)
 *   activeCategory  — categoría activa en el filtro (null = todas)
 *
 * DECISIÓN — CSS accordion sin Framer Motion:
 * La animación de altura usa `grid-template-rows: 0fr → 1fr`.
 * Ventajas: cero dependencias JS para la animación, solo transform/opacity
 * (sin reflow), funciona en todos los navegadores modernos (Chrome 57+,
 * Firefox 66+, Safari 10.1+). El mismo patrón ya estaba en cookies/
 * CookieManager.tsx — mantiene consistencia en el proyecto.
 *
 * ACCESIBILIDAD:
 *   - aria-expanded en cada botón del acordeón
 *   - aria-controls apuntando al panel correspondiente
 *   - aria-pressed en los botones de filtro de categoría
 *   - role="region" + aria-labelledby en cada panel de respuesta
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_DATA } from './_data';
import type { FaqCategoria } from './_data';

type OpenState = Record<string, boolean>;

export default function FaqAccordion() {
  const [openItems, setOpenItems]           = useState<OpenState>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggle = (key: string) =>
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));

  const filteredData: FaqCategoria[] = activeCategory
    ? FAQ_DATA.filter((cat) => cat.categoria === activeCategory)
    : FAQ_DATA;

  const totalQuestions = FAQ_DATA.reduce((acc, cat) => acc + cat.preguntas.length, 0);

  return (
    <div className="container mx-auto px-6 pb-24">

      {/* ── FILTROS DE CATEGORÍA ── */}
      <div
        className="flex flex-wrap gap-2 mb-12 pb-8 border-b border-titan-border"
        role="group"
        aria-label="Filtrar preguntas por categoría"
      >
        {/* Botón "Todo" */}
        <button
          onClick={() => setActiveCategory(null)}
          aria-pressed={activeCategory === null}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${
            activeCategory === null
              ? 'bg-titan-accent text-white border-titan-accent'
              : 'border-titan-border text-titan-text-muted hover:border-titan-accent/50 hover:text-white'
          }`}
        >
          Todo ({totalQuestions})
        </button>

        {/* Botón por categoría */}
        {FAQ_DATA.map(({ categoria, icon: Icon, preguntas }) => (
          <button
            key={categoria}
            onClick={() => setActiveCategory(activeCategory === categoria ? null : categoria)}
            aria-pressed={activeCategory === categoria}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${
              activeCategory === categoria
                ? 'bg-titan-accent text-white border-titan-accent'
                : 'border-titan-border text-titan-text-muted hover:border-titan-accent/50 hover:text-white'
            }`}
          >
            <Icon size={12} aria-hidden="true" />
            {categoria} ({preguntas.length})
          </button>
        ))}
      </div>

      {/* ── ACORDEÓN POR CATEGORÍAS ── */}
      <div className="space-y-12">
        {filteredData.map(({ categoria, icon: Icon, preguntas }) => (
          <section key={categoria} aria-labelledby={`cat-${categoria}`}>

            {/* Header de categoría */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-9 h-9 flex items-center justify-center border border-titan-border text-titan-accent"
                aria-hidden="true"
              >
                <Icon size={16} />
              </div>
              <h2
                id={`cat-${categoria}`}
                className="font-heading text-2xl text-titan-text uppercase tracking-wider"
              >
                {categoria}
              </h2>
              <div className="flex-1 h-px bg-titan-border" aria-hidden="true" />
              <span className="text-xs text-titan-text-muted uppercase tracking-widest font-bold">
                {preguntas.length} preguntas
              </span>
            </div>

            {/* Preguntas */}
            <div className="border border-titan-border overflow-hidden">
              {preguntas.map((item, idx) => {
                const key    = `${categoria}-${idx}`;
                const isOpen = !!openItems[key];
                const panelId = `panel-${categoria}-${idx}`.replace(/\s+/g, '-');

                return (
                  <div
                    key={key}
                    className={`border-b border-titan-border last:border-b-0 transition-colors ${
                      isOpen ? 'bg-titan-surface' : 'hover:bg-titan-surface/50'
                    }`}
                  >
                    {/* Botón pregunta */}
                    <button
                      onClick={() => toggle(key)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="w-full flex items-start justify-between gap-6 p-6 text-left group"
                    >
                      <span className={`font-bold text-sm leading-snug transition-colors ${
                        isOpen
                          ? 'text-titan-accent'
                          : 'text-titan-text group-hover:text-titan-accent'
                      }`}>
                        {item.q}
                      </span>
                      <ChevronDown
                        size={18}
                        aria-hidden="true"
                        className={`flex-shrink-0 text-titan-text-muted transition-transform duration-300 mt-0.5 ${
                          isOpen
                            ? 'rotate-180 text-titan-accent'
                            : 'group-hover:text-titan-accent'
                        }`}
                      />
                    </button>

                    {/*
                      CSS ACCORDION — grid-template-rows: 0fr → 1fr.
                      Anima la altura a "auto" sin JS ni librerías externas.
                      Solo usa la propiedad grid-template-rows (sin reflow).
                    */}
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={`btn-${key}`}
                      className="overflow-hidden transition-[grid-template-rows] duration-200 ease-in-out grid"
                      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                    >
                      <div className="min-h-0">
                        <div className="px-6 pb-6 border-t border-titan-border/50 pt-4">
                          <p className="text-titan-text-muted text-sm leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
