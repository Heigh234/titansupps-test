/**
 * app/order/[id]/OrderTimeline.tsx — Línea de tiempo de estados del pedido
 * ──────────────────────────────────────────────────────────────────────────
 * Renderiza los 4 pasos del ciclo de vida: Confirmado → Preparación →
 * En Camino → Entregado.
 *
 * Lógica de presentación:
 * - El paso activo es el último con `completado: true` (findLastIndex).
 * - El paso activo tiene glow naranja + dot pulsante para indicar estado actual.
 * - Los pasos completados anteriores usan verde para denotar "misión cumplida".
 * - Los pasos futuros están en gris apagado.
 * - Si el paso es "En camino" y está completado, muestra el tracking inline.
 *
 * La línea vertical conectora está posicionada absolutamente. Se ajusta entre
 * el primer y último icono (top desde el centro del primero, bottom análogo)
 * usando top-[36px] / bottom-[36px] que corresponden al centro de los iconos
 * de 36px de alto (w-9 h-9).
 */

import type { OrderData } from './types';
import { TIMELINE_ICONS } from './types';

interface OrderTimelineProps {
  order: OrderData;
}

export default function OrderTimeline({ order }: OrderTimelineProps) {
  // Índice del último paso completado = paso activo actual
  const activeIndex = order.timeline.reduce(
    (last, step, i) => (step.completado ? i : last),
    -1,
  );

  return (
    <section aria-labelledby="timeline-heading">
      <h2
        id="timeline-heading"
        className="font-heading text-xl text-titan-text uppercase tracking-wider mb-5"
      >
        Estado del Pedido
      </h2>

      <div className="border border-titan-border bg-titan-surface p-6">
        <ol className="relative space-y-0" role="list">
          {/* Línea vertical conectora entre iconos */}
          <div
            className="absolute left-[18px] top-[36px] bottom-[36px] w-px bg-titan-border"
            aria-hidden="true"
          />

          {order.timeline.map((step, i) => {
            const StepIcon = TIMELINE_ICONS[i];
            const isActive = i === activeIndex;

            return (
              <li key={step.estado} className="relative flex gap-5 pb-8 last:pb-0">

                {/* ── Icono del paso ── */}
                <div
                  className={`
                    flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center z-10 border transition-all
                    ${step.completado
                      ? isActive
                        ? 'bg-titan-accent border-titan-accent text-white shadow-[0_0_15px_rgba(255,94,0,0.3)]'
                        : 'bg-titan-surface border-green-500/50 text-green-500'
                      : 'bg-titan-bg border-titan-border text-titan-text-muted'
                    }
                  `}
                >
                  <StepIcon size={15} />
                </div>

                {/* ── Contenido del paso ── */}
                <div className="flex-1 min-w-0 pt-1">

                  {/* Etiqueta + fecha + dot pulsante (solo en paso activo) */}
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span
                      className={`font-bold text-sm uppercase tracking-wider ${
                        step.completado
                          ? isActive
                            ? 'text-titan-accent'
                            : 'text-titan-text'
                          : 'text-titan-text-muted'
                      }`}
                    >
                      {step.estado}
                    </span>
                    <span className="text-[10px] text-titan-text-muted uppercase tracking-widest font-bold">
                      {step.fecha}
                    </span>
                    {isActive && step.completado && (
                      <span
                        className="w-2 h-2 rounded-full bg-titan-accent animate-pulse"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Descripción del paso */}
                  <p className="text-xs text-titan-text-muted">{step.desc}</p>

                  {/* Tracking inline — solo visible en el paso "En camino" completado */}
                  {step.estado === 'En camino' && step.completado && (
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-titan-text-muted uppercase tracking-widest font-bold">
                      <span>{order.transportista}:</span>
                      <code className="font-mono text-titan-accent">{order.tracking}</code>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
