/**
 * StepIndicator.tsx — Indicador de progreso del checkout
 * ─────────────────────────────────────────────────────────
 * Componente presentacional puro: no tiene estado propio ni accede
 * a ningún store. Recibe el paso activo y el handler de cambio como props.
 *
 * DISEÑO:
 * El botón "01. Envío" es clickable para poder retroceder desde el Paso 2.
 * "02. Pago" es un <span> (no botón) porque no tiene sentido saltar al paso
 * de pago sin haber validado el formulario de envío primero.
 *
 * active vs inactive:
 *   - Activo: text-titan-accent
 *   - Inactivo clickable: text-titan-text-muted hover:text-white
 *   - Inactivo no clickable: text-titan-text-muted (sin hover)
 */

import { ChevronRight } from 'lucide-react';

interface StepIndicatorProps {
  step: 1 | 2;
  onGoToStep: (step: 1 | 2) => void;
}

export default function StepIndicator({ step, onGoToStep }: StepIndicatorProps) {
  return (
    <div
      className="flex items-center gap-4 mb-10 border-b border-titan-border pb-6"
      aria-label="Progreso del checkout"
    >
      {/* Paso 1 — clickable para retroceder desde paso 2 */}
      <button
        onClick={() => onGoToStep(1)}
        className={`font-heading text-xl uppercase tracking-wide transition-colors ${
          step === 1 ? 'text-titan-accent' : 'text-titan-text-muted hover:text-white'
        }`}
        aria-current={step === 1 ? 'step' : undefined}
      >
        01. Envío
      </button>

      <ChevronRight size={20} className="text-titan-border flex-shrink-0" aria-hidden="true" />

      {/* Paso 2 — solo visual, no es navegable directamente */}
      <span
        className={`font-heading text-xl uppercase tracking-wide transition-colors ${
          step === 2 ? 'text-titan-accent' : 'text-titan-text-muted'
        }`}
        aria-current={step === 2 ? 'step' : undefined}
      >
        02. Pago
      </span>
    </div>
  );
}
