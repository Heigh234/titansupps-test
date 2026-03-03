/**
 * app/affiliates/AffiliateTestimonials.tsx — Testimonios de embajadores
 * ────────────────────────────────────────────────────────────────────────
 * Server Component puro — sin estado, sin interactividad.
 *
 * DISEÑO DE LA TARJETA:
 * Cada card muestra: rating (5 estrellas fijas), cita, y un footer con
 * avatar inicial + nombre/perfil a la izquierda, y la comisión mensual
 * en verde a la derecha. El verde en `text-green-500` para la comisión
 * refuerza semánticamente "ingreso positivo" sin necesitar más contexto.
 *
 * AVATAR:
 * Generado con la inicial del nombre. Patrón consistente con los
 * testimonios del homepage y los avatares de la cuenta de usuario.
 * En producción: reemplazar por <Image> con foto real del embajador.
 *
 * ACCESIBILIDAD:
 * Las estrellas usan role="img" + aria-label en su contenedor para que
 * los lectores de pantalla anuncien "5 de 5 estrellas" en lugar de
 * leer 5 iconos SVG vacíos.
 */

import { Star } from 'lucide-react';
import { TESTIMONIOS } from './_data';

export default function AffiliateTestimonials() {
  return (
    <section
      className="border-y border-titan-border bg-titan-surface/20"
      aria-labelledby="testimonios-heading"
    >
      <div className="container mx-auto px-6 py-20">

        {/* Encabezado centrado */}
        <div className="mb-12 text-center">
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
            Embajadores reales
          </p>
          <h2
            id="testimonios-heading"
            className="font-heading text-fluid-4xl text-titan-text uppercase leading-[0.9]"
          >
            Ellos ya <span className="text-titan-accent">Generan</span>
          </h2>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIOS.map((t) => (
            <article
              key={t.nombre}
              className="bg-titan-surface border border-titan-border p-6 flex flex-col gap-4"
            >
              {/* Rating — accesible para lectores de pantalla */}
              <div
                role="img"
                aria-label="5 de 5 estrellas"
                className="flex gap-1"
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className="text-titan-accent"
                    fill="currentColor"
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Cita */}
              <blockquote className="text-titan-text-muted text-sm leading-relaxed flex-1">
                &ldquo;{t.texto}&rdquo;
              </blockquote>

              {/* Footer: avatar + nombre / comisión */}
              <footer className="border-t border-titan-border pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar con inicial */}
                  <div
                    className="w-8 h-8 rounded-full bg-titan-accent/20 border border-titan-accent/30 flex items-center justify-center text-titan-accent font-heading text-sm flex-shrink-0"
                    aria-hidden="true"
                  >
                    {t.nombre.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-titan-text">{t.nombre}</p>
                    <p className="text-[10px] text-titan-text-muted uppercase tracking-widest">{t.perfil}</p>
                  </div>
                </div>
                {/* Comisión en verde — refuerzo semántico de ingreso positivo */}
                <span className="text-xs font-bold text-green-500 uppercase tracking-widest">
                  {t.comision}
                </span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
