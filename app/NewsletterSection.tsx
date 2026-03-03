/**
 * NewsletterSection.tsx — CTA de captura de lead
 * ─────────────────────────────────────────────────
 * Posición estratégica: última sección antes del footer.
 * El usuario que llega aquí ya procesó el hero, los productos,
 * el manifiesto y los testimonios. Es el momento óptimo para
 * pedir su email con un incentivo claro (10% de descuento).
 *
 * DISEÑO:
 * - Glow de acento muy sutil (bg-titan-accent/5) para diferenciar
 *   la sección del resto sin crear una ruptura visual agresiva.
 * - border-y: separa la sección con líneas horizontales discretas.
 * - Texto de privacidad al pie: reduce la fricción de suscripción
 *   respondiendo la objeción implícita ("¿me van a spamear?").
 *
 * NewsletterForm es un Client Component (tiene estado para el input
 * y la lógica de submit). Se importa aquí pero no fuerza a esta
 * sección a ser 'use client'.
 *
 * cv-section-newsletter: content-visibility en globals.css.
 */

import NewsletterForm from '@/components/ui/NewsletterForm';

export default function NewsletterSection() {
  return (
    <section
      className="cv-section-newsletter relative overflow-hidden border-y border-titan-border"
      aria-labelledby="newsletter-heading"
    >
      {/* Glow de acento de fondo — atmosférico, no distrae */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-titan-bg via-titan-accent/5 to-titan-bg pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 container mx-auto px-6 py-24 flex flex-col items-center text-center gap-6">

        <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em]">
          Únete al batallón
        </p>

        <h2
          id="newsletter-heading"
          className="font-heading text-fluid-4xl text-titan-text uppercase max-w-2xl leading-[0.95]"
        >
          10% de descuento en tu{' '}
          <span className="text-titan-accent">primer pedido</span>
        </h2>

        <p className="text-titan-text-muted max-w-md">
          Suscríbete y recibe ofertas exclusivas, nuevos lanzamientos y
          contenido de entrenamiento antes que nadie.
        </p>

        {/* Client Component — maneja el input y el submit */}
        <NewsletterForm />

        <p className="text-[10px] text-titan-text-muted uppercase tracking-widest">
          Sin spam. Un email semanal. Baja cuando quieras.
        </p>
      </div>
    </section>
  );
}
