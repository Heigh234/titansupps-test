// ─────────────────────────────────────────────────────────────────────────────
// § 3 — EL PROCESO — app/about/ProcesoSection.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Timeline vertical de 5 fases. Números romanos como anclas visuales.
// Línea conectora vertical de acento entre pasos (solo desktop).

import { PROCESO_STEPS } from './_data';

export default function ProcesoSection() {
  return (
    <section id="proceso" className="container mx-auto px-6 py-24" aria-labelledby="proceso-heading">

      <header className="mb-16 grid lg:grid-cols-2 gap-12 items-end">
        <div>
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
            De la Molécula al Producto
          </p>
          <h2 id="proceso-heading" className="font-heading text-fluid-4xl text-titan-text uppercase leading-[0.9]">
            El Proceso de<br />
            <span className="text-titan-accent">Cinco Fases</span>
          </h2>
        </div>
        <p className="text-titan-text-muted leading-relaxed">
          Fabricar un suplemento de élite no es mezclar polvos. Es un proceso
          riguroso que tarda entre 4 y 8 meses desde la concepción hasta que
          el producto está en tu base. Aquí está cada paso, sin omitir nada.
        </p>
      </header>

      <div className="relative">
        {/* Línea vertical de conexión — solo desktop */}
        <div
          className="absolute left-[2.25rem] top-0 bottom-0 w-px bg-gradient-to-b from-titan-accent via-titan-border to-transparent hidden md:block"
          aria-hidden="true"
        />

        <ol className="space-y-0" role="list">
          {PROCESO_STEPS.map(({ romano, fase, titulo, detalle, dato }, i) => (
            <li
              key={romano}
              className="relative grid md:grid-cols-[5rem_1fr] gap-0 md:gap-10 group"
            >
              {/* Número romano — ancla visual */}
              <div className="flex flex-col items-center md:items-start pt-2 mb-6 md:mb-0">
                <div className="w-[4.5rem] h-[4.5rem] bg-titan-bg border border-titan-border flex items-center justify-center relative z-10 group-hover:border-titan-accent/50 transition-colors">
                  <span className="font-heading text-2xl text-titan-accent">{romano}</span>
                </div>
              </div>

              {/* Contenido del paso */}
              <div className={`pb-14 ${i < PROCESO_STEPS.length - 1 ? 'border-b border-titan-border/40' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-titan-accent uppercase tracking-[0.25em] mb-1">
                      Fase {romano} — {fase}
                    </p>
                    <h3 className="font-heading text-fluid-xl text-titan-text uppercase leading-tight group-hover:text-titan-accent transition-colors">
                      {titulo}
                    </h3>
                  </div>
                  {/* Dato destacado — estilo "spec de producto" */}
                  <div className="flex-shrink-0 px-3 py-1.5 border border-titan-border bg-titan-surface text-[10px] font-bold uppercase tracking-widest text-titan-text-muted whitespace-nowrap self-start">
                    {dato}
                  </div>
                </div>
                <p className="text-titan-text-muted leading-relaxed max-w-2xl text-sm">
                  {detalle}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
