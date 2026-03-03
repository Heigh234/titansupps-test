/**
 * app/affiliates/page.tsx — Orquestador de la página "Programa de Afiliados"
 * ────────────────────────────────────────────────────────────────────────────
 * CONCEPTO: "El Batallón de Embajadores"
 *
 * ✅ SERVER COMPONENT — sin 'use client'.
 * El estado del formulario vive en AffiliateForm (Client Component).
 * Este archivo no tiene ningún hook → puede ejecutarse en el servidor,
 * lo que mejora el TTI y reduce el bundle JS del cliente.
 *
 * Responsabilidades de este archivo (y solo estas):
 *  1. Renderizar el Hero con stats y CTAs.
 *  2. Componer las cuatro secciones en orden de flujo narrativo:
 *     BenefitsGrid → ProcessSteps → AffiliateTestimonials → AffiliateForm.
 *
 * Árbol de componentes y sus tipos:
 *   page.tsx (Server)
 *   ├─ Hero inline           (Server — JSX puro, sin estado)
 *   ├─ BenefitsGrid          (Server)
 *   ├─ ProcessSteps          (Server)
 *   ├─ AffiliateTestimonials (Server)
 *   └─ AffiliateForm         (Client — único nodo hidratado)
 */

import { ArrowRight } from 'lucide-react';
import { HERO_STATS }            from './_data';
import BenefitsGrid              from './BenefitsGrid';
import ProcessSteps              from './ProcessSteps';
import AffiliateTestimonials     from './AffiliateTestimonials';
import AffiliateForm             from './AffiliateForm';

export default function AffiliatesPage() {
  return (
    <div className="min-h-screen bg-titan-bg">

      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">

        {/* Glows decorativos de fondo */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-titan-accent/8 via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 right-0 -translate-y-1/2 w-[50vw] h-[80vh] bg-titan-accent/5 blur-[120px] rounded-full pointer-events-none"
          aria-hidden="true"
        />

        <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
          <div className="max-w-4xl">

            {/* Badge de urgencia */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-titan-accent/30 bg-titan-accent/10 text-titan-accent text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-titan-accent animate-pulse" aria-hidden="true" />
              Programa de Afiliados 2026 — Plazas Limitadas
            </div>

            <h1 className="font-heading text-fluid-hero text-titan-text uppercase leading-[0.85] mb-8">
              Únete al<br />
              <span className="text-titan-accent">Batallón</span>
            </h1>

            <p className="text-titan-text-muted text-xl leading-relaxed max-w-2xl mb-10">
              Convierte tu audiencia y tu credibilidad en un ingreso real recomendando suplementos
              que realmente funcionan. Comisiones del 15%, pagos puntuales y soporte humano.
            </p>

            {/* Mini-grid de stats de impacto */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-titan-border max-w-2xl">
              {HERO_STATS.map(({ val, label }, i) => (
                <div
                  key={label}
                  className={`p-5 text-center border-r border-titan-border last:border-r-0 ${
                    i < 2 ? 'border-b md:border-b-0' : ''
                  }`}
                >
                  <p className="font-heading text-2xl text-titan-accent">{val}</p>
                  <p className="text-[10px] text-titan-text-muted uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* CTAs del hero */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              {/* Ancla al formulario de solicitud */}
              <a
                href="#solicitar"
                className="group relative px-8 py-4 bg-titan-accent text-white font-heading text-2xl uppercase tracking-wider overflow-hidden flex items-center gap-3 justify-center"
              >
                <span
                  className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                  aria-hidden="true"
                />
                <span className="relative z-10">Solicitar Acceso</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Ancla a la sección de beneficios */}
              <a
                href="#beneficios"
                className="px-8 py-4 border border-titan-border text-titan-text font-heading text-2xl uppercase tracking-wider hover:border-titan-accent hover:text-titan-accent transition-colors flex items-center justify-center"
              >
                Ver Beneficios
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIONES COMPUESTAS ── */}
      <BenefitsGrid />
      <ProcessSteps />
      <AffiliateTestimonials />
      {/* AffiliateForm es el único Client Component — hidratación mínima */}
      <AffiliateForm />

    </div>
  );
}
