// ─────────────────────────────────────────────────────────────────────────────
// § 2 — TRES PRINCIPIOS — app/about/PrincipiosSection.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Grid de 3 columnas. Números monumentales como textura de fondo.
// Borde naranja izquierdo en hover — marcador editorial sin JS.

import { PRINCIPIOS } from './_data';

export default function PrincipiosSection() {
  return (
    <section className="border-y border-titan-border bg-titan-surface/30" aria-labelledby="principios-heading">
      <div className="container mx-auto px-6 py-20">

        <header className="mb-14">
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
            Nuestra Filosofía
          </p>
          <h2 id="principios-heading" className="font-heading text-fluid-4xl text-titan-text uppercase">
            Tres Principios.<br />
            <span className="text-titan-accent">Sin Excepción.</span>
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-titan-border">
          {PRINCIPIOS.map(({ icon: Icon, numero, titulo, cuerpo }, i) => (
            <article
              key={numero}
              className={`p-8 flex flex-col gap-6 group hover:bg-titan-surface transition-colors relative
                ${i < 2 ? 'border-b md:border-b-0 md:border-r border-titan-border' : ''}
              `}
            >
              {/* Borde izquierdo de acento — aparece en hover sin JS */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[2px] bg-titan-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"
                aria-hidden="true"
              />

              {/* Número monumental como textura visual de fondo */}
              <span
                className="font-heading text-[7rem] leading-none text-titan-border/40 absolute top-4 right-6 select-none pointer-events-none"
                aria-hidden="true"
              >
                {numero}
              </span>

              <div className="w-10 h-10 flex items-center justify-center border border-titan-border text-titan-accent group-hover:border-titan-accent/50 group-hover:bg-titan-accent/5 transition-all duration-300 relative z-10">
                <Icon size={18} />
              </div>

              <div className="relative z-10 flex flex-col gap-3">
                <h3 className="font-heading text-2xl uppercase tracking-wider text-titan-text group-hover:text-titan-accent transition-colors">
                  {titulo}
                </h3>
                <p className="text-titan-text-muted text-sm leading-relaxed">
                  {cuerpo}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
