'use client';

/**
 * app/careers/JobAccordion.tsx — Acordeón de posiciones de trabajo
 * ──────────────────────────────────────────────────────────────────
 * Client Component — gestiona el estado de apertura/cierre de cada oferta.
 *
 * ESTADO INTERNO:
 * `openJob` (string | null) — ID de la posición expandida actualmente.
 * Solo puede estar abierta una posición a la vez (toggle: abrir una cierra
 * la anterior). Este estado es completamente local: nadie fuera del acordeón
 * necesita saber qué posición está abierta.
 *
 * PROP EXTERNA:
 * `onOpenForm` — callback que abre el modal de candidatura en page.tsx.
 * Se pasa hacia abajo porque el botón "Aplicar" está dentro del detalle
 * expandido de cada posición, pero el modal vive en el padre.
 *
 * ANIMACIÓN:
 * Usa Framer Motion AnimatePresence + motion.div para la expansión
 * height: 0 → auto. Framer Motion está justificado aquí porque el
 * acordeón es la interacción principal de la página y el spring natural
 * mejora la percepción de calidad del producto.
 */

import { useState } from 'react';
import { ArrowRight, MapPin, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { POSICIONES } from './_data';

interface JobAccordionProps {
  /** Abre el modal de candidatura (estado controlado por page.tsx) */
  onOpenForm: () => void;
}

export default function JobAccordion({ onOpenForm }: JobAccordionProps) {
  // ID de la posición expandida, null = todas cerradas
  const [openJob, setOpenJob] = useState<string | null>(null);

  const toggleJob = (id: string) => {
    setOpenJob((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="posiciones"
      className="container mx-auto px-6 py-20"
      aria-labelledby="jobs-heading"
    >
      {/* Encabezado */}
      <div className="mb-12">
        <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
          {POSICIONES.length} misiones disponibles
        </p>
        <h2
          id="jobs-heading"
          className="font-heading text-fluid-4xl text-titan-text uppercase leading-[0.9]"
        >
          Posiciones<br />
          <span className="text-titan-accent">Abiertas</span>
        </h2>
      </div>

      {/* Lista de posiciones */}
      <div className="space-y-4">
        {POSICIONES.map((job) => {
          const isOpen = openJob === job.id;

          return (
            <div
              key={job.id}
              className={`border transition-colors ${
                isOpen
                  ? 'border-titan-accent/50 bg-titan-surface'
                  : 'border-titan-border hover:border-titan-accent/30 bg-titan-surface/30'
              }`}
            >
              {/* ── Cabecera del acordeón (siempre visible) ── */}
              <button
                onClick={() => toggleJob(job.id)}
                className="w-full flex items-center justify-between p-6 text-left group"
                aria-expanded={isOpen}
                aria-controls={`job-detail-${job.id}`}
              >
                <div className="flex items-center gap-5 min-w-0">
                  {/* Icono de área */}
                  <div
                    className={`w-10 h-10 flex-shrink-0 flex items-center justify-center border transition-all ${
                      isOpen
                        ? 'border-titan-accent/50 bg-titan-accent/10 text-titan-accent'
                        : 'border-titan-border text-titan-text-muted group-hover:text-titan-accent'
                    }`}
                  >
                    <job.icon size={18} />
                  </div>

                  {/* Meta + título */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className="text-[10px] font-bold text-titan-accent uppercase tracking-widest">
                        {job.area}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-titan-text-muted uppercase tracking-widest">
                        <Clock size={9} /> {job.tipo}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-titan-text-muted uppercase tracking-widest">
                        <MapPin size={9} /> {job.modalidad}
                      </span>
                    </div>
                    <h3
                      className={`font-heading text-xl uppercase transition-colors ${
                        isOpen ? 'text-titan-accent' : 'text-titan-text group-hover:text-titan-accent'
                      }`}
                    >
                      {job.titulo}
                    </h3>
                  </div>
                </div>

                {/* Indicador de estado abierto/cerrado */}
                <div
                  className={`flex-shrink-0 w-8 h-8 border flex items-center justify-center transition-all ml-4 ${
                    isOpen
                      ? 'border-titan-accent bg-titan-accent/10'
                      : 'border-titan-border group-hover:border-titan-accent/50'
                  }`}
                >
                  <ArrowRight
                    size={14}
                    className={`transition-transform ${
                      isOpen ? 'rotate-90 text-titan-accent' : 'text-titan-text-muted'
                    }`}
                  />
                </div>
              </button>

              {/* ── Detalle expandido (animado con Framer Motion) ── */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`job-detail-${job.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-8 border-t border-titan-border pt-6 grid md:grid-cols-2 gap-8">

                      {/* Columna izquierda: descripción + requisitos */}
                      <div>
                        <p className="text-sm text-titan-text-muted leading-relaxed mb-6">
                          {job.descripcion}
                        </p>
                        <div>
                          <h4 className="font-heading text-base uppercase tracking-wider text-titan-text mb-3">
                            Requisitos
                          </h4>
                          <ul className="space-y-2">
                            {job.requisitos.map((req) => (
                              <li key={req} className="flex items-start gap-3 text-sm text-titan-text-muted">
                                <CheckCircle size={14} className="text-titan-accent flex-shrink-0 mt-0.5" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Columna derecha: bonus + CTA */}
                      <div>
                        <div>
                          <h4 className="font-heading text-base uppercase tracking-wider text-titan-text mb-3">
                            Valoramos (no obligatorio)
                          </h4>
                          <ul className="space-y-2 mb-8">
                            {job.bonus.map((b) => (
                              <li key={b} className="flex items-start gap-3 text-sm text-titan-text-muted">
                                <span className="w-1.5 h-1.5 rounded-full bg-titan-accent/50 flex-shrink-0 mt-1.5" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Abre el modal de candidatura en page.tsx */}
                        <button
                          onClick={onOpenForm}
                          className="w-full py-4 bg-titan-accent text-white font-heading text-lg uppercase tracking-widest hover:bg-titan-accent-hover transition-colors flex items-center justify-center gap-3"
                        >
                          Aplicar a esta Posición <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
