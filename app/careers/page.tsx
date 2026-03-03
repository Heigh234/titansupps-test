'use client';

/**
 * app/careers/page.tsx — Orquestador de la página "Trabaja con Nosotros"
 * ─────────────────────────────────────────────────────────────────────────
 * CONCEPTO: "Reclutamiento de Élite"
 *
 * Responsabilidades de este archivo (y solo estas):
 *  1. Estado `showForm` — controla la visibilidad del modal de candidatura.
 *     Vive aquí porque tanto el Hero ("Candidatura Espontánea") como
 *     JobAccordion ("Aplicar a esta Posición") necesitan abrirlo.
 *  2. Renderizar el Hero con sus dos CTAs.
 *  3. Componer las tres secciones: ValoresGrid + JobAccordion + CandidatureModal.
 *
 * Árbol de estado:
 *   page.tsx         → showForm (bool)
 *   ├─ ValoresGrid   → sin estado (Server Component)
 *   ├─ JobAccordion  → openJob (interno, no sube)
 *   └─ CandidatureModal → isSubmitting, isSubmitted (internos, no suben)
 */

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { POSICIONES } from './_data';
import ValoresGrid       from './ValoresGrid';
import JobAccordion      from './JobAccordion';
import CandidatureModal  from './CandidatureModal';

export default function CareersPage() {
  // Único estado que vive aquí: apertura del modal de candidatura.
  // Dos nodos hijos lo necesitan → el estado no puede vivir más abajo.
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-titan-bg">

      {/* ── HERO ── */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        {/* Glow decorativo de fondo */}
        <div
          className="absolute inset-0 bg-gradient-to-bl from-titan-accent/6 via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />

        <div className="container mx-auto px-6 pt-32 pb-16 relative z-10">
          <div className="max-w-4xl">

            {/* Badge de posiciones activas */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-titan-accent/30 bg-titan-accent/10 text-titan-accent text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
              {POSICIONES.length} Posiciones abiertas
            </div>

            <h1 className="font-heading text-fluid-hero text-titan-text uppercase leading-[0.85] mb-8">
              Reclutamiento<br />
              <span className="text-titan-accent">de Élite</span>
            </h1>

            <p className="text-titan-text-muted text-xl leading-relaxed max-w-2xl mb-10">
              No buscamos personas que &ldquo;encajen en la cultura&rdquo;. Buscamos personas que la hagan
              crecer. Si eres extraordinario en lo que haces y te apasiona el rendimiento humano,
              este es tu sitio.
            </p>

            {/* CTAs del hero */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Ancla a la sección de posiciones */}
              <a
                href="#posiciones"
                className="group relative px-8 py-4 bg-titan-accent text-white font-heading text-2xl uppercase tracking-wider overflow-hidden flex items-center gap-3 justify-center"
              >
                <span
                  className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                  aria-hidden="true"
                />
                <span className="relative z-10">Ver Posiciones</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Abre el modal de candidatura espontánea */}
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-4 border border-titan-border text-titan-text font-heading text-2xl uppercase tracking-wider hover:border-titan-accent hover:text-titan-accent transition-colors"
              >
                Candidatura Espontánea
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN DE VALORES CULTURALES ── */}
      <ValoresGrid />

      {/* ── ACORDEÓN DE POSICIONES ── */}
      {/*
        onOpenForm sube el evento "el usuario quiere aplicar" al padre.
        page.tsx es el único nodo que puede abrir CandidatureModal.
      */}
      <JobAccordion onOpenForm={() => setShowForm(true)} />

      {/* ── MODAL DE CANDIDATURA ── */}
      <CandidatureModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
      />

    </div>
  );
}
