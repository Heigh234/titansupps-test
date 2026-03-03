/**
 * PaymentForm.tsx — Formulario de pago (Paso 2)
 * ───────────────────────────────────────────────
 * Renderiza el paso 2 del checkout: el panel de tarjeta y el botón
 * de confirmación final.
 *
 * STRIPE PLACEHOLDER:
 * El div con `[Stripe Elements Integration Aquí]` es el punto de montaje
 * donde se inicializará el CardElement de @stripe/react-stripe-js.
 * Mantenerlo como componente separado facilita esa integración futura:
 * solo hay que añadir <StripeProvider> aquí sin tocar el page ni los demás pasos.
 *
 * SIN PROPS:
 * No recibe ninguna prop porque el botón de submit utiliza type="submit",
 * que delega la acción al <form> padre definido en page.tsx.
 * El onSubmit del form se ejecuta via react-hook-form handleSubmit
 * cuando este botón se presiona.
 *
 * ANIMACIÓN:
 * Entry desde izquierda (x: -20), idéntico al ShippingForm para coherencia
 * de dirección de avance. No hay exit explícito porque al enviar el form
 * la página completa cambia de estado.
 */

import { motion } from 'framer-motion';

export default function PaymentForm() {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Panel de tarjeta con borde de acento izquierdo */}
      <div className="glass-panel p-6 relative overflow-hidden">
        {/* Línea de acento izquierda — consistente con blockquote del Manifesto */}
        <div className="absolute top-0 left-0 w-1 h-full bg-titan-accent" aria-hidden="true" />

        <h3 className="font-heading text-2xl text-titan-text uppercase mb-4">
          Tarjeta de Crédito / Débito
        </h3>

        {/*
          STRIPE MOUNT POINT:
          En producción, reemplazar este div por:
          <Elements stripe={stripePromise}>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </Elements>
        */}
        <div
          className="bg-titan-bg border border-titan-border border-dashed p-4 h-32 flex items-center justify-center text-titan-text-muted"
          aria-label="Zona de integración de pasarela de pago"
        >
          [Stripe Elements Integration Aquí]
        </div>
      </div>

      {/* CTA de confirmación — el shadow-glow refuerza la acción primaria */}
      <button
        type="submit"
        className="w-full py-5 bg-titan-accent text-white font-heading text-2xl uppercase tracking-widest hover:bg-titan-accent-hover transition-colors shadow-[0_0_20px_rgba(255,94,0,0.3)] hover:shadow-[0_0_30px_rgba(255,94,0,0.5)] mt-4"
      >
        Confirmar Orden
      </button>
    </motion.div>
  );
}
