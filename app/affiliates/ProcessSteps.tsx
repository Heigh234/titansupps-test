/**
 * app/affiliates/ProcessSteps.tsx — Sección "Cómo Funciona" (4 pasos)
 * ──────────────────────────────────────────────────────────────────────
 * Server Component puro — sin estado, sin interactividad.
 *
 * DETALLE DE DISEÑO — CONECTORES ENTRE PASOS:
 * Cada paso tiene un conector horizontal decorativo (w-6, h-px)
 * posicionado absolutamente a la derecha, desplazado fuera del contenedor
 * con translate-x-full. Se oculta en mobile/tablet (hidden lg:block) donde
 * los pasos se apilan verticalmente.
 *
 * El último paso no debería mostrar conector. En el original esto se
 * intentaba con CSS :last-child, pero como el div del conector está
 * dentro de un div hijo y no en el li directamente, el selector no
 * funciona. La solución más robusta es la clase `last:hidden` aplicada
 * al propio conector — Tailwind aplica :last-child al padre inmediato
 * que en este caso es el `div.relative.group`, correcto.
 *
 * Los números en Bebas Neue a text-5xl con opacity 30% crean la
 * jerarquía visual de "paso N" sin competir con el titular del paso.
 */

import { PASOS } from './_data';

export default function ProcessSteps() {
  return (
    <section
      className="container mx-auto px-6 py-20"
      aria-labelledby="proceso-heading"
    >
      {/* Encabezado */}
      <div className="mb-12">
        <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
          Simple y directo
        </p>
        <h2
          id="proceso-heading"
          className="font-heading text-fluid-4xl text-titan-text uppercase leading-[0.9]"
        >
          Cómo Funciona
        </h2>
      </div>

      {/* Grid de pasos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PASOS.map(({ numero, titulo, desc }) => (
          <div key={numero} className="relative group">
            {/* Conector horizontal entre pasos (solo desktop, oculto en el último) */}
            <div
              className="hidden lg:block last:hidden absolute top-8 right-0 w-6 h-px bg-titan-border translate-x-full z-10"
              aria-hidden="true"
            />

            <div className="p-6 border border-titan-border hover:border-titan-accent/40 transition-colors bg-titan-surface/30 hover:bg-titan-surface h-full">
              {/* Número del paso */}
              <span className="font-heading text-5xl text-titan-accent/30 leading-none block mb-4">
                {numero}
              </span>
              {/* Título */}
              <h3 className="font-heading text-xl text-titan-text uppercase mb-2 group-hover:text-titan-accent transition-colors">
                {titulo}
              </h3>
              {/* Descripción */}
              <p className="text-sm text-titan-text-muted leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
