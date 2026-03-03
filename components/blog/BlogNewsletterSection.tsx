/**
 * components/blog/BlogNewsletterSection.tsx — Server Component
 * ──────────────────────────────────────────────────────────────
 * Sección de suscripción al newsletter científico del blog.
 * El layout, título y lista de tópicos son estáticos → Server Component.
 * Solo el formulario (BlogNewsletterForm) es Client Component,
 * siguiendo el principio de "push client components to the leaves".
 *
 * ANTES: toda esta sección se renderizaba en el cliente porque
 * vivía dentro de BlogContent.tsx ('use client').
 *
 * AHORA: el wrapper es Server Component → 0 JS extra al cliente
 * por el layout. Solo BlogNewsletterForm envía JS al cliente.
 */

import { NEWSLETTER_TOPICS } from '@/app/blog/_data';
import BlogNewsletterForm from '@/components/blog/BlogNewsletterForm';

export default function BlogNewsletterSection() {
  return (
    <section
      className="border-t border-titan-border bg-titan-surface/30"
      aria-labelledby="blog-newsletter-heading"
    >
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Columna izquierda: copy + tópicos */}
          <div>
            <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-4">
              Ciencia en tu bandeja
            </p>
            <h2
              id="blog-newsletter-heading"
              className="font-heading text-fluid-4xl text-titan-text uppercase leading-[0.9] mb-6"
            >
              Un email semanal.<br />
              <span className="text-titan-accent">Sin relleno.</span>
            </h2>
            <p className="text-titan-text-muted leading-relaxed mb-8">
              Cada domingo enviamos un resumen de los estudios más relevantes de la semana,
              un protocolo aplicable y análisis de suplementos sin conflictos de interés.
            </p>

            {/* Lista de tópicos del newsletter */}
            <ul className="space-y-2 mb-8">
              {NEWSLETTER_TOPICS.map((topic) => (
                <li key={topic} className="flex items-center gap-3 text-sm text-titan-text-muted">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-titan-accent flex-shrink-0"
                    aria-hidden="true"
                  />
                  {topic}
                </li>
              ))}
            </ul>
          </div>

          {/* Columna derecha: formulario (Client Component) */}
          <div>
            <BlogNewsletterForm />
          </div>

        </div>
      </div>
    </section>
  );
}
