/**
 * components/blog/BlogHero.tsx — Server Component
 * ──────────────────────────────────────────────────
 * Sección hero del blog. Puramente estática: título, descripción
 * y mini-stats. No necesita ningún estado ni evento del cliente,
 * por lo tanto es un Server Component puro.
 *
 * ANTES: renderizado dentro de BlogContent.tsx ('use client'),
 * lo que obligaba a esta sección —completamente estática— a
 * ejecutarse en el bundle del cliente innecesariamente.
 *
 * AHORA: se renderiza en servidor → 0 JS enviado al cliente
 * por esta sección. Mejor LCP y menor bundle inicial.
 */

import { BLOG_HERO_STATS } from '@/app/blog/_data';

export default function BlogHero() {
  return (
    <section className="relative pt-40 pb-16 overflow-hidden">
      {/* Glow de acento — decorativo, sin impacto en performance */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-titan-accent/6 blur-[120px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.3em] mb-4">
            Blog &amp; Ciencia — TitanSupps
          </p>

          <h1 className="font-heading text-fluid-hero text-titan-text uppercase leading-[0.85] mb-6">
            El Laboratorio<br />
            <span className="text-titan-accent">Abierto</span>
          </h1>

          <p className="text-titan-text-muted text-lg leading-relaxed max-w-xl">
            Artículos basados en evidencia sobre entrenamiento, nutrición y suplementación.
            Sin mitos. Sin patrocinios que comprometan la objetividad.
            Solo ciencia aplicada al atleta real.
          </p>
        </div>

        {/* Mini-stats de credibilidad */}
        <div className="flex flex-wrap items-center gap-8 mt-10 pt-8 border-t border-titan-border">
          {BLOG_HERO_STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="font-heading text-2xl text-titan-text">{value}</p>
              <p className="text-xs text-titan-text-muted uppercase tracking-widest mt-0.5">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
