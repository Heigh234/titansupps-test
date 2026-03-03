/**
 * app/privacy/page.tsx — Política de Privacidad
 * ─────────────────────────────────────────────────
 * CONCEPTO: "El Contrato Transparente"
 *
 * ARQUITECTURA POST-MODULARIZACIÓN:
 * Este archivo es un Server Component puro que solo gestiona:
 *   1. El metadata de SEO
 *   2. El hero de la página
 *   3. El layout de dos columnas (sidebar sticky + contenido)
 *   4. La navegación del índice lateral
 *
 * Lo que SALIÓ de aquí:
 *   → _data.ts          todos los arrays de datos legales
 *   → PrivacyContent.tsx las 11 secciones del artículo (~300 líneas)
 *
 * RESULTADO: página completamente estática renderizada en servidor.
 * Cero JavaScript enviado al cliente para esta ruta.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { SECCIONES, ULTIMA_ACTUALIZACION } from './_data';
import PrivacyContent from './PrivacyContent';

export const metadata: Metadata = {
  title: 'Política de Privacidad | TitanSupps',
  description:
    'Cómo TitanSupps recopila, usa y protege tus datos personales. Transparencia total sobre nuestras prácticas de privacidad.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-titan-bg">

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-16 border-b border-titan-border overflow-hidden">
        <div
          className="absolute top-0 left-0 w-[50vw] h-[50vh] bg-titan-accent/4 blur-[140px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.3em] mb-4">
            Legal — TitanSupps
          </p>
          <h1 className="font-heading text-fluid-hero text-titan-text uppercase leading-[0.85] mb-6">
            Política de<br />
            <span className="text-titan-accent">Privacidad</span>
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-xs text-titan-text-muted uppercase tracking-widest font-bold">
            <span>Última actualización: {ULTIMA_ACTUALIZACION}</span>
            <span className="hidden sm:block w-px h-4 bg-titan-border" />
            <span>Versión 2.1</span>
            <span className="hidden sm:block w-px h-4 bg-titan-border" />
            <Link href="/cookies" className="text-titan-accent hover:text-white transition-colors">
              Ver Política de Cookies →
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
              <nav aria-label="Índice de la política de privacidad">
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
                  ¿Preguntas?
                </p>
                <Link
                  href="/contact"
                  className="text-xs text-titan-accent hover:text-white transition-colors font-bold"
                >
                  Contactar al DPO →
                </Link>
              </div>
            </div>
          </aside>

          {/* Contenido de las 11 secciones — delegado a PrivacyContent */}
          <PrivacyContent />

        </div>
      </div>

    </div>
  );
}
