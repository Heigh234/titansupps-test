/**
 * app/affiliates/BenefitsGrid.tsx — Grid de beneficios del programa
 * ──────────────────────────────────────────────────────────────────
 * Server Component puro — sin estado, sin interactividad de React.
 *
 * ELEMENTO DIFERENCIADOR:
 * Cada celda tiene una barra izquierda de acento (w-[2px]) que hace
 * scale-y 0→1 con origin-bottom en hover. Da un efecto de "activación"
 * elegante sin usar JS. Se combina con el leve cambio de fondo para
 * reforzar el feedback visual sin saturar.
 *
 * LÓGICA DE BORDES (mismo patrón que ValoresGrid en careers/):
 * Grid 3-col en desktop, 2-col en tablet, 1-col en mobile.
 * Los bordes internos se calculan por índice para evitar doble-borde
 * entre celdas adyacentes. La variable `isLast` desactiva el
 * mdBorderRight en el último elemento para no romper el borde del
 * contenedor cuando el total de items no es múltiplo de 2.
 */

import { BENEFICIOS } from './_data';

export default function BenefitsGrid() {
  return (
    <section
      id="beneficios"
      className="border-y border-titan-border bg-titan-surface/20"
      aria-labelledby="beneficios-heading"
    >
      <div className="container mx-auto px-6 py-20">

        {/* Encabezado */}
        <div className="mb-14">
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
            Por qué unirte
          </p>
          <h2
            id="beneficios-heading"
            className="font-heading text-fluid-4xl text-titan-text uppercase leading-[0.9]"
          >
            Lo que Obtienes<br />
            <span className="text-titan-accent">Sin Letra Chica</span>
          </h2>
        </div>

        {/* Grid de beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-titan-border">
          {BENEFICIOS.map(({ icon: Icon, valor, titulo, desc }, i) => {
            const isLast       = i === BENEFICIOS.length - 1;
            const borderBottom = i < 3           ? 'border-b'    : '';
            const borderRight  = i % 3 !== 2     ? 'lg:border-r' : '';
            // Evitar mdBorderRight en el último item si es impar (rompe borde contenedor)
            const mdBorderRight = !isLast && i % 2 === 0 ? 'md:border-r' : '';

            return (
              <div
                key={titulo}
                className={`
                  p-8 flex flex-col gap-5 group hover:bg-titan-surface transition-colors relative
                  border-titan-border ${borderBottom} ${borderRight} ${mdBorderRight}
                `}
              >
                {/* Barra de acento izquierda — escala en hover desde abajo */}
                <div
                  className="absolute top-0 left-0 bottom-0 w-[2px] bg-titan-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"
                  aria-hidden="true"
                />

                {/* Icono + valor numérico */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 flex items-center justify-center border border-titan-border text-titan-accent group-hover:border-titan-accent/50 group-hover:bg-titan-accent/5 transition-all">
                    <Icon size={18} />
                  </div>
                  <span className="font-heading text-3xl text-titan-accent">{valor}</span>
                </div>

                {/* Texto */}
                <div>
                  <h3 className="font-heading text-xl text-titan-text uppercase mb-2">{titulo}</h3>
                  <p className="text-sm text-titan-text-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
