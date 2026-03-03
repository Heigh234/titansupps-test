/**
 * app/terms/page.tsx — Términos y Condiciones
 * ──────────────────────────────────────────────
 * CONCEPTO: "Las Reglas del Juego"
 *
 * ARQUITECTURA POST-MODULARIZACIÓN:
 * Este archivo mantiene su condición de Server Component y queda
 * reducido a sus dos únicas responsabilidades:
 *   1. Hero + metadata de SEO
 *   2. Layout de dos columnas con sidebar sticky + TermsContent
 *
 * Lo que SALIÓ de aquí:
 *   → _data.ts          SECCIONES + 6 arrays de datos inline
 *   → TermsContent.tsx  las 11 secciones del artículo (~240 líneas)
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { SECCIONES, ULTIMA_ACTUALIZACION } from './_data';
import TermsContent from './TermsContent';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | TitanSupps',
  description: 'Términos y condiciones de uso de TitanSupps. Las reglas del juego, explicadas con claridad.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-titan-bg">

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-16 border-b border-titan-border overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-titan-accent/4 blur-[140px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.3em] mb-4">
            Legal — TitanSupps
          </p>
          <h1 className="font-heading text-fluid-hero text-titan-text uppercase leading-[0.85] mb-6">
            Términos &<br />
            <span className="text-titan-accent">Condiciones</span>
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-xs text-titan-text-muted uppercase tracking-widest font-bold">
            <span>Última actualización: {ULTIMA_ACTUALIZACION}</span>
            <span className="hidden sm:block w-px h-4 bg-titan-border" />
            <span>Versión 3.0</span>
            <span className="hidden sm:block w-px h-4 bg-titan-border" />
            <Link href="/privacy" className="text-titan-accent hover:text-white transition-colors">
              Ver Política de Privacidad →
            </Link>
          </div>
        </div>
      </section>

      {/* ── LAYOUT: Índice lateral + Contenido ── */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* Índice lateral sticky */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-28">
              <p className="text-[10px] font-bold text-titan-text-muted uppercase tracking-[0.2em] mb-4">
                Índice
              </p>
              <nav aria-label="Índice de términos y condiciones">
                <ul className="space-y-1">
                  {SECCIONES.map(({ id, titulo }) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className="block text-xs text-titan-text-muted hover:text-titan-accent transition-colors py-1.5 border-l-2 border-transparent hover:border-titan-accent pl-3"
                      >
                        {titulo}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-8 p-4 border border-titan-border bg-titan-surface/30">
                <p className="text-[10px] font-bold text-titan-text-muted uppercase tracking-widest mb-2">
                  Dudas
                </p>
                <Link
                  href="/contact"
                  className="text-xs text-titan-accent hover:text-white transition-colors font-bold"
                >
                  Contactar soporte →
                </Link>
              </div>
            </div>
          </aside>

          {/* Contenido de las 11 secciones — delegado a TermsContent */}
          <TermsContent />

        </div>
      </div>

    </div>
  );
}
