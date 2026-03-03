// ─────────────────────────────────────────────────────────────────────────────
// § 1 — HERO — app/sizing/HeroSection.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Título monumental + nota de advertencia científica.
// Server Component puro — sin interactividad.
//
// DISEÑO:
// Glow radial en bottom-right para dar profundidad sin imagen de fondo
// (las imágenes de hero están reservadas para páginas de mayor peso visual
// como /about y /home). La nota con Info icon responde la objeción implícita
// de "¿cuánto es demasiado?" antes de que el usuario llegue a los datos.

import { Info } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden">

      {/* Glow radial de acento — bottom-right para asimetría intencional */}
      <div
        className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-titan-accent/5 blur-[140px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.3em] mb-4">
            Soporte — TitanSupps
          </p>
          <h1 className="font-heading text-fluid-hero text-titan-text uppercase leading-[0.85] mb-6">
            Guía de<br />
            <span className="text-titan-accent">Tamaños</span>
          </h1>
          <p className="text-titan-text-muted text-lg leading-relaxed max-w-xl">
            Presentaciones disponibles, dosis por servicio, cuándo tomarlos y cómo calcular
            la cantidad correcta para tu peso y objetivo. Sin adivinanzas.
          </p>
        </div>

        {/* Nota de advertencia científica — reduce ansiedad de sobredosificación */}
        <div className="flex items-start gap-3 mt-10 p-5 border border-titan-accent/20 bg-titan-accent/5 max-w-2xl">
          <Info size={16} className="text-titan-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-titan-text-muted">
            <strong className="text-titan-text">Importante:</strong>{' '}
            Las dosis indicadas son las respaldadas por evidencia científica actual.
            &ldquo;Más no es mejor&rdquo; en suplementación. Consumir por encima de la dosis
            recomendada no acelera los resultados y puede ser contraproducente.
          </p>
        </div>
      </div>
    </section>
  );
}
