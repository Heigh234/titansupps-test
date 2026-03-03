/**
 * app/cookies/page.tsx — Política de Cookies
 * ────────────────────────────────────────────
 * CONCEPTO: "Control Total"
 *
 * ARQUITECTURA POST-MODULARIZACIÓN:
 * Este archivo es ahora un Server Component puro.
 * Solo tiene dos responsabilidades:
 *   1. El hero estático de la página (se renderiza en servidor)
 *   2. Montar <CookieManager /> que gestiona toda la interactividad
 *
 * Lo que SALIÓ de aquí:
 *   → _data.ts           CATEGORIAS_COOKIES, NAVEGADORES (arrays de datos)
 *   → CookieManager.tsx  todo el estado interactivo + las dos columnas
 *
 * POR QUÉ UN SOLO CLIENT COMPONENT:
 * El panel de preferencias (sidebar) y el acordeón (documento) comparten
 * el estado `preferences` — el acordeón muestra "Activadas"/"Desactivadas"
 * en tiempo real según lo que el usuario togglea en el sidebar.
 * Separarlos en dos Client Components requeriría un Context o prop-drilling
 * desde page.tsx, lo que forzaría a page.tsx a ser 'use client' de nuevo.
 * CookieManager como único Client Component es la solución más limpia.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ULTIMA_ACTUALIZACION } from './_data';
import CookieManager from './CookieManager';

export const metadata: Metadata = {
  title: 'Política de Cookies | TitanSupps',
  description:
    'Gestiona tus preferencias de cookies. Información detallada sobre qué cookies usa TitanSupps y cómo controlarlas.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-titan-bg">

      {/* ── HERO — renderizado en servidor, cero JS ── */}
      <section className="relative pt-40 pb-16 border-b border-titan-border overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] bg-titan-accent/4 blur-[140px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.3em] mb-4">
            Legal — TitanSupps
          </p>
          <h1 className="font-heading text-fluid-hero text-titan-text uppercase leading-[0.85] mb-6">
            Política de<br />
            <span className="text-titan-accent">Cookies</span>
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-xs text-titan-text-muted uppercase tracking-widest font-bold">
            <span>Última actualización: {ULTIMA_ACTUALIZACION}</span>
            <span className="hidden sm:block w-px h-4 bg-titan-border" />
            <Link href="/privacy" className="text-titan-accent hover:text-white transition-colors">
              Ver Privacidad →
            </Link>
            <Link href="/terms" className="text-titan-accent hover:text-white transition-colors">
              Ver Términos →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTENIDO INTERACTIVO — Client Component ── */}
      <CookieManager />

    </div>
  );
}
