// ─────────────────────────────────────────────────────────────────────────────
// § 4 — CTA FINAL — app/sizing/CtaSection.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Cierre de página con dos acciones: ver productos y consultar la FAQ.
// Server Component puro — sin interactividad.
//
// LÓGICA DE CTAs:
// - Primario (naranja): "Ver Arsenal" — convierte al usuario que ya sabe
//   qué necesita después de leer la guía.
// - Secundario (borde): "FAQ Completa" — retiene al usuario con dudas
//   adicionales en lugar de perderlo a un buscador externo.
//
// POSICIÓN ESTRATÉGICA:
// La guía de tamaños responde "cuánto comprar". El CTA inmediato después
// de esa respuesta es el momento óptimo de conversión (intención alta + contexto).

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section
      className="container mx-auto px-6 py-16"
      aria-labelledby="sizing-cta-heading"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Copy */}
        <div>
          <h2
            id="sizing-cta-heading"
            className="font-heading text-3xl text-titan-text uppercase mb-2"
          >
            ¿Aún tienes dudas sobre qué tomar?
          </h2>
          <p className="text-titan-text-muted">
            Consulta nuestra FAQ o contacta a nuestro equipo de nutrición.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
          <Link
            href="/catalog"
            className="px-8 py-4 bg-titan-accent text-white font-heading text-xl uppercase tracking-wider hover:bg-titan-accent-hover transition-colors flex items-center gap-3 justify-center"
          >
            Ver Arsenal <ArrowRight size={18} />
          </Link>
          <Link
            href="/faq"
            className="px-8 py-4 border border-titan-border text-titan-text font-heading text-xl uppercase tracking-wider hover:border-titan-accent hover:text-titan-accent transition-colors flex items-center justify-center"
          >
            FAQ Completa
          </Link>
        </div>

      </div>
    </section>
  );
}
