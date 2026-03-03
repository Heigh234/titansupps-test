/**
 * TestimonialsSection.tsx — Social proof / testimonios
 * ──────────────────────────────────────────────────────
 * DECISIÓN DE DISEÑO — Tarjeta central elevada:
 * La card del índice 1 (Laura V.) recibe:
 *   - `border-l-2 border-l-titan-accent` — acento visual diferenciador
 *   - `lg:-translate-y-2`               — elevación sutil en desktop
 *   - `shadow-[0_0_30px_rgba(255,94,0,0.08)]` — glow de acento muy tenue
 * Crea jerarquía visual dentro de la grilla sin romper la coherencia.
 * El efecto es más perceptible en desktop donde las 3 cards están alineadas.
 *
 * ACCESIBILIDAD — Stars rating:
 * `role="img"` es obligatorio para que `aria-label` sea válido en un <div>.
 * Sin él, el atributo está prohibido por la especificación ARIA (4.1.2).
 * Cada estrella individual lleva `aria-hidden="true"` — solo el wrapper
 * comunica el valor agregado al lector de pantalla.
 *
 * <article> para cada testimonio: cada uno es una unidad de contenido
 * autocontenida (autor + texto + rating), lo que hace <article> semánticamente
 * más correcto que <div> o <li>.
 *
 * cv-section-testimonials: content-visibility en globals.css.
 */

import { Star } from 'lucide-react';
import { TESTIMONIALS } from './_data';

export default function TestimonialsSection() {
  return (
    <section
      className="cv-section-testimonials container mx-auto px-6 py-24"
      aria-labelledby="testimonials-heading"
    >
      {/* Header centrado */}
      <div className="text-center mb-12">
        <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
          Hablan los que entrenan
        </p>
        <h2
          id="testimonials-heading"
          className="text-fluid-4xl text-titan-text"
        >
          La <span className="text-titan-accent">Comunidad</span> Opina
        </h2>
      </div>

      {/* Grid de testimonios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <article
            key={t.name}
            className={`bg-titan-surface border border-titan-border p-6 flex flex-col gap-4 relative ${
              i === 1
                ? 'border-l-2 border-l-titan-accent lg:-translate-y-2 shadow-[0_0_30px_rgba(255,94,0,0.08)]'
                : ''
            }`}
          >
            {/* Rating visual — accesible */}
            <div
              role="img"
              aria-label={`${t.rating} de 5 estrellas`}
              className="flex gap-1"
            >
              {[...Array(5)].map((_, s) => (
                <Star
                  key={s}
                  size={14}
                  className="text-titan-accent"
                  aria-hidden="true"
                  fill={s < t.rating ? 'currentColor' : 'none'}
                />
              ))}
            </div>

            {/* Cita */}
            <blockquote className="text-titan-text-muted text-sm leading-relaxed flex-1">
              &ldquo;{t.text}&rdquo;
            </blockquote>

            {/* Autor */}
            <footer className="border-t border-titan-border pt-4 flex items-center gap-3">
              {/* Avatar con inicial */}
              <div
                className="w-8 h-8 rounded-full bg-titan-accent/20 border border-titan-accent/30 flex items-center justify-center text-titan-accent font-heading text-sm flex-shrink-0"
                aria-hidden="true"
              >
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-titan-text">{t.name}</p>
                <p className="text-[10px] text-titan-text-muted uppercase tracking-widest">
                  {t.role}
                </p>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
