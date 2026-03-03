/**
 * app/careers/ValoresGrid.tsx — Grid de valores culturales de la empresa
 * ────────────────────────────────────────────────────────────────────────
 * Server Component puro — sin estado, sin interactividad.
 * Recibe los valores desde _data.ts y los renderiza en un grid 3-col
 * con bordes separadores internos CSS (sin gaps, sin box-shadow).
 *
 * LÓGICA DE BORDES:
 * El grid usa `gap-0 border border-titan-border` en el contenedor y
 * bordes individuales en cada celda para crear la ilusión de tabla.
 * Las reglas se calculan por índice para evitar doble-borde:
 *
 *   borderBottom → solo en las primeras 3 celdas (fila superior en lg)
 *   borderRight  → celdas cuyo índice no sea la última columna de cada fila
 *   mdBorderRight→ versión para tablet (2 columnas): solo celdas pares
 *
 * Este patrón es consistente con la sección de Beneficios de affiliates/
 * y la sección Stats del footer, manteniendo coherencia visual global.
 */

import { VALORES_EMPRESA } from './_data';

export default function ValoresGrid() {
  return (
    <section
      className="border-y border-titan-border bg-titan-surface/20"
      aria-labelledby="valores-heading"
    >
      <div className="container mx-auto px-6 py-20">

        {/* Encabezado de sección */}
        <div className="mb-12">
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
            Nuestra cultura
          </p>
          <h2
            id="valores-heading"
            className="font-heading text-fluid-4xl text-titan-text uppercase leading-[0.9]"
          >
            Cómo Trabajamos<br />
            <span className="text-titan-accent">Aquí</span>
          </h2>
        </div>

        {/* Grid de valores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-titan-border">
          {VALORES_EMPRESA.map(({ icon: Icon, titulo, desc }, i) => {
            // Bordes internos para simular separadores de tabla sin gap
            const borderBottom  = i < 3  ? 'border-b lg:border-b'  : '';
            const borderRight   = i % 3 !== 2 ? 'lg:border-r'       : '';
            const mdBorderRight = i % 2 === 0  ? 'md:border-r'      : '';

            return (
              <div
                key={titulo}
                className={`
                  p-8 flex flex-col gap-4 group hover:bg-titan-surface transition-colors
                  border-titan-border ${borderBottom} ${borderRight} ${mdBorderRight}
                `}
              >
                {/* Icono */}
                <div className="w-9 h-9 flex items-center justify-center border border-titan-border text-titan-accent group-hover:border-titan-accent/50 group-hover:bg-titan-accent/5 transition-all">
                  <Icon size={16} />
                </div>

                {/* Texto */}
                <div>
                  <h3 className="font-heading text-xl text-titan-text uppercase mb-2 group-hover:text-titan-accent transition-colors">
                    {titulo}
                  </h3>
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
