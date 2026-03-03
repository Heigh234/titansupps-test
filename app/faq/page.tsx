/**
 * app/faq/page.tsx — Preguntas Frecuentes
 * ─────────────────────────────────────────
 * CONCEPTO: "La Base de Inteligencia"
 *
 * ARQUITECTURA POST-MODULARIZACIÓN:
 * Este archivo es ahora un Server Component puro.
 * Sus únicas responsabilidades son:
 *   1. Metadata de SEO
 *   2. Hero estático con el contador de preguntas (calculado en servidor)
 *   3. Montar <FaqAccordion /> para toda la interactividad
 *   4. CTA estático al pie ("¿No encontraste tu respuesta?")
 *
 * Lo que SALIÓ de aquí:
 *   → _data.ts          FAQ_DATA con tipos FaqPregunta y FaqCategoria
 *   → FaqAccordion.tsx  estado de acordeón + filtros de categoría
 *
 * BENEFICIO CLAVE — totalQuestions en servidor:
 * El contador del hero ("16 respuestas directas...") se calcula desde
 * FAQ_DATA en servidor. No requiere hidratación. Solo FaqAccordion
 * (filtros + acordeón) se hidrata en el cliente.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FAQ_DATA } from './_data';
import FaqAccordion from './FaqAccordion';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes | TitanSupps',
  description: 'Respuestas a las preguntas más frecuentes sobre pedidos, productos, pagos, envíos, devoluciones y privacidad en TitanSupps.',
};

// Calculado en servidor — no requiere JS en el cliente
const totalQuestions = FAQ_DATA.reduce((acc, cat) => acc + cat.preguntas.length, 0);

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-titan-bg">

      {/* ── HERO — renderizado en servidor, cero JS ── */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div
          className="absolute top-0 left-0 w-[60vw] h-[50vh] bg-titan-accent/5 blur-[140px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.3em] mb-4">
              Soporte — TitanSupps
            </p>
            <h1 className="font-heading text-fluid-hero text-titan-text uppercase leading-[0.85] mb-6">
              Base de<br />
              <span className="text-titan-accent">Inteligencia</span>
            </h1>
            <p className="text-titan-text-muted text-lg leading-relaxed max-w-xl">
              {totalQuestions} respuestas directas a las preguntas que más recibimos.
              Si no encuentras lo que buscas, nuestro equipo responde en menos de 4 horas.
            </p>
          </div>
        </div>
      </section>

      {/* ── FILTROS + ACORDEÓN — Client Component ── */}
      <FaqAccordion />

      {/* ── CTA — NO ENCONTRÉ MI RESPUESTA — renderizado en servidor ── */}
      <section className="border-t border-titan-border bg-titan-surface/20">
        <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-heading text-3xl text-titan-text uppercase mb-2">
              ¿No encontraste tu respuesta?
            </h2>
            <p className="text-titan-text-muted">
              Escríbenos. Respondemos en menos de 4 horas en días hábiles.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 px-8 py-4 bg-titan-accent text-white font-heading text-xl uppercase tracking-wider hover:bg-titan-accent-hover transition-colors flex items-center gap-3"
          >
            Contactar Soporte <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
