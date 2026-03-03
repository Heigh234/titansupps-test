// ─────────────────────────────────────────────────────────────────────────────
// § 3 — CALCULADORA DE PROTEÍNA — app/sizing/ProteinSection.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Grid de dos columnas: explicación científica (izquierda) + tabla de referencia
// rápida por rango de peso corporal (derecha).
// Server Component puro — consume CALCULADORA_PROTEINA de _data.ts.
//
// DECISIÓN DE NOMBRE "Section" vs "Calculator":
// El componente no tiene interactividad real (no calcula nada en tiempo real),
// es una tabla de referencia estática. Llamarlo "Calculator" sería engañoso
// sobre su comportamiento. "ProteinSection" describe lo que hace sin prometer
// funcionalidad que no existe aún.
// TODO: En una futura iteración, este componente puede convertirse en
// 'use client' con un input de peso que calcule el valor dinámicamente.

import { Scale } from 'lucide-react';
import { CALCULADORA_PROTEINA } from './_data';

export default function ProteinSection() {
  return (
    <section
      className="border-y border-titan-border bg-titan-surface/30"
      aria-labelledby="calc-heading"
    >
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* ── Columna izquierda: explicación y fórmula ────────────────── */}
          <div>
            <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
              Referencia basada en evidencia
            </p>
            <h2
              id="calc-heading"
              className="font-heading text-fluid-4xl text-titan-text uppercase leading-[0.9] mb-6"
            >
              ¿Cuánta Proteína<br /><span className="text-titan-accent">Necesitas?</span>
            </h2>

            <p className="text-titan-text-muted leading-relaxed mb-6">
              El consenso científico actual sitúa la ingesta óptima para deportistas en{' '}
              <strong className="text-titan-text">1.6g por kg de peso corporal al día</strong>.
              Este valor cubre todas las fuentes alimenticias combinadas, no solo suplementos.
            </p>

            {/* Fórmula destacada */}
            <div className="flex items-start gap-3 p-5 border border-titan-border">
              <Scale size={16} className="text-titan-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-titan-text-muted">
                <strong className="text-titan-text">Fórmula:</strong>{' '}
                Peso corporal (kg) × 1.6 = gramos de proteína diaria total.
                Para entrenamiento muy intenso o en déficit calórico: usa 2.0g/kg como tope.
              </p>
            </div>
          </div>

          {/* ── Columna derecha: tabla de referencia rápida ─────────────── */}
          <div>
            <div className="overflow-hidden border border-titan-border">
              {/* Cabecera de la tabla */}
              <div className="bg-titan-surface border-b border-titan-border px-5 py-3">
                <p className="text-xs font-bold text-titan-text-muted uppercase tracking-widest">
                  Referencia Rápida — Proteína Diaria Total
                </p>
              </div>

              <table className="w-full text-sm" aria-label="Tabla de referencia de proteína diaria por peso corporal">
                <thead>
                  <tr className="border-b border-titan-border">
                    <th scope="col" className="text-left px-5 py-3 text-xs font-bold text-titan-text-muted uppercase tracking-widest">Peso</th>
                    <th scope="col" className="text-left px-5 py-3 text-xs font-bold text-titan-text-muted uppercase tracking-widest">Proteína/día</th>
                    <th scope="col" className="text-left px-5 py-3 text-xs font-bold text-titan-text-muted uppercase tracking-widest hidden md:table-cell">Objetivo típico</th>
                  </tr>
                </thead>

                <tbody>
                  {CALCULADORA_PROTEINA.map((row, i) => (
                    <tr
                      key={row.peso}
                      className={`border-b border-titan-border last:border-b-0 ${
                        i % 2 === 0 ? 'bg-titan-bg' : 'bg-titan-surface/50'
                      }`}
                    >
                      <td className="px-5 py-3 font-bold text-titan-accent">{row.peso}</td>
                      <td className="px-5 py-3 font-bold text-titan-text">{row.rango}</td>
                      <td className="px-5 py-3 text-titan-text-muted text-xs hidden md:table-cell">{row.objetivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cita de fuente científica */}
            <p className="text-[10px] text-titan-text-muted uppercase tracking-widest mt-3">
              * Basado en meta-análisis de Morton et al. (2018) y Stokes et al. (2018).
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
