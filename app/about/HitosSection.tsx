// ─────────────────────────────────────────────────────────────────────────────
// § 6 — HITOS DE LA MARCA — app/about/HitosSection.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Timeline horizontal de 4 hitos históricos.
// Línea base conectora visible en desktop. Grid 2-col en mobile.

import { HITOS } from './_data';

export default function HitosSection() {
  return (
    <section className="border-t border-titan-border bg-titan-surface/20" aria-labelledby="hitos-heading">
      <div className="container mx-auto px-6 py-20">

        <header className="mb-12">
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
            Ocho Años Construyendo
          </p>
          <h2 id="hitos-heading" className="font-heading text-fluid-4xl text-titan-text uppercase leading-[0.9]">
            El <span className="text-titan-accent">Legado</span>
          </h2>
        </header>

        <div className="relative">
          {/* Línea base horizontal — solo desktop */}
          <div
            className="absolute top-[2.25rem] left-0 right-0 h-px bg-titan-border hidden md:block"
            aria-hidden="true"
          />

          <ol className="grid grid-cols-2 md:grid-cols-4 gap-8" role="list">
            {HITOS.map(({ año, hito, desc }) => (
              <li key={año} className="flex flex-col gap-4 group">
                {/* Marcador del año */}
                <div className="relative flex items-center gap-3">
                  <div className="w-[4.5rem] h-[4.5rem] flex-shrink-0 border border-titan-border bg-titan-bg flex items-center justify-center relative z-10 group-hover:border-titan-accent/60 group-hover:bg-titan-surface transition-all duration-300">
                    <span className="font-heading text-lg text-titan-accent">{año}</span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-xl uppercase tracking-wider text-titan-text group-hover:text-titan-accent transition-colors">
                    {hito}
                  </h3>
                  <p className="text-xs text-titan-text-muted leading-relaxed">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
