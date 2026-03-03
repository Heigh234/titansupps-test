/**
 * app/returns/page.tsx — Política de Devoluciones
 * ─────────────────────────────────────────────────
 * CONCEPTO: "Las Reglas del Campo de Batalla"
 *
 * ARQUITECTURA POST-MODULARIZACIÓN:
 * Server Component — ya lo era antes. La modularización aquí no cambia
 * el boundary cliente/servidor, sino que separa responsabilidades:
 *
 *   page.tsx          → metadata + hero con garantías + CTA final
 *   ReturnsContent.tsx → 3 secciones del cuerpo (proceso, condiciones, defectuosos)
 *   _data.ts          → PASOS, ACEPTA, NO_ACEPTA, GARANTIAS
 *
 * EL HERO PERMANECE EN page.tsx porque:
 *   - Contiene el <h1> semántico de la ruta
 *   - Las métricas de garantías (GARANTIAS) son parte del encabezado visual
 *   - Junto con el CTA final, forma el "envoltorio" de la ruta
 *
 * Cero JavaScript enviado al cliente — toda la página es HTML estático.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GARANTIAS } from './_data';
import ReturnsContent from './ReturnsContent';

export const metadata: Metadata = {
  title: 'Política de Devoluciones | TitanSupps',
  description: 'Todo lo que necesitas saber sobre devoluciones, reembolsos y cambios en TitanSupps. Proceso simple, sin complicaciones.',
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-titan-bg">

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[50vw] h-[60vh] bg-titan-accent/5 blur-[140px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.3em] mb-4">
              Soporte — TitanSupps
            </p>
            <h1 className="font-heading text-fluid-hero text-titan-text uppercase leading-[0.85] mb-6">
              Política de<br />
              <span className="text-titan-accent">Devoluciones</span>
            </h1>
            <p className="text-titan-text-muted text-lg leading-relaxed max-w-xl">
              Sin letra pequeña. Sin procesos kafkianos. Confiamos en nuestros productos
              y lo respaldamos con una política clara, justa y directa.
            </p>
          </div>

          {/* Métricas de garantía */}
          <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-titan-border">
            {GARANTIAS.map(({ valor, desc }) => (
              <div
                key={desc}
                className="flex items-center gap-4 pr-6 border-r border-titan-border last:border-r-0"
              >
                <span className="font-heading text-2xl text-titan-accent">{valor}</span>
                <span className="text-xs text-titan-text-muted uppercase tracking-widest">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CUERPO: proceso + condiciones + defectuosos ── */}
      <ReturnsContent />

      {/* ── CTA FINAL ── */}
      <section className="border-t border-titan-border bg-titan-surface/20">
        <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-heading text-3xl text-titan-text uppercase mb-2">
              ¿Tienes una duda puntual?
            </h2>
            <p className="text-titan-text-muted">
              Nuestro equipo responde en menos de 4 horas en días hábiles.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <Link
              href="/contact"
              className="px-8 py-4 bg-titan-accent text-white font-heading text-xl uppercase tracking-wider hover:bg-titan-accent-hover transition-colors flex items-center gap-3 justify-center"
            >
              Contactar Soporte <ArrowRight size={18} />
            </Link>
            <Link
              href="/faq"
              className="px-8 py-4 border border-titan-border text-titan-text font-heading text-xl uppercase tracking-wider hover:border-titan-accent hover:text-titan-accent transition-colors flex items-center justify-center"
            >
              Ver FAQ
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
