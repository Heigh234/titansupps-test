// ─────────────────────────────────────────────────────────────────────────────
// § 2 — ESPECIFICACIONES — app/sizing/SpecsSection.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Tabla responsiva de presentaciones y dosis + grid de notas científicas.
// Server Component puro — consume PRODUCTOS de _data.ts.
//
// DECISIÓN DE LAYOUT:
// La tabla usa min-w-[700px] + overflow-x-auto para mobile — el contenido
// tabular denso es más legible con scroll horizontal que colapsado en tarjetas.
// Las notas científicas van en un grid separado debajo de la tabla, ya que
// incluirlas como columna adicional haría la tabla impracticable en mobile.
//
// SEMÁNTICA:
// scope="col" en <th> es obligatorio para lectores de pantalla que necesitan
// asociar cada celda de datos con su cabecera de columna correcta.

import { FlaskConical } from 'lucide-react';
import { PRODUCTOS }    from './_data';

export default function SpecsSection() {
  return (
    <section className="container mx-auto px-6 pb-24" aria-labelledby="specs-heading">

      {/* Header de sección */}
      <div className="mb-12">
        <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
          Presentaciones y dosis
        </p>
        <h2
          id="specs-heading"
          className="font-heading text-fluid-4xl text-titan-text uppercase leading-[0.9]"
        >
          Tabla de<br /><span className="text-titan-accent">Especificaciones</span>
        </h2>
      </div>

      {/* Tabla — responsiva: scroll-x en mobile, ancho completo en desktop */}
      <div className="overflow-x-auto border border-titan-border">
        <table className="w-full text-sm min-w-[700px]" aria-label="Especificaciones de productos TitanSupps">
          <thead>
            <tr className="border-b border-titan-border bg-titan-surface">
              <th scope="col" className="text-left px-5 py-4 text-xs font-bold text-titan-text-muted uppercase tracking-widest">Producto</th>
              <th scope="col" className="text-left px-5 py-4 text-xs font-bold text-titan-text-muted uppercase tracking-widest">Presentaciones</th>
              <th scope="col" className="text-left px-5 py-4 text-xs font-bold text-titan-text-muted uppercase tracking-widest">Scoop / Dosis</th>
              <th scope="col" className="text-left px-5 py-4 text-xs font-bold text-titan-text-muted uppercase tracking-widest">Recomendación diaria</th>
              <th scope="col" className="text-left px-5 py-4 text-xs font-bold text-titan-text-muted uppercase tracking-widest">Cuándo tomar</th>
            </tr>
          </thead>

          <tbody>
            {PRODUCTOS.map((prod, i) => (
              <tr
                key={prod.nombre}
                className={`border-b border-titan-border last:border-b-0 hover:bg-titan-surface transition-colors group ${
                  i % 2 === 0 ? 'bg-titan-bg' : 'bg-titan-surface/30'
                }`}
              >
                {/* Producto + badge de categoría */}
                <td className="px-5 py-5 align-top">
                  <p className="font-bold text-titan-text group-hover:text-titan-accent transition-colors leading-snug">
                    {prod.nombre}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-titan-accent/10 border border-titan-accent/20 text-[10px] font-bold text-titan-accent uppercase tracking-widest">
                    {prod.categoria}
                  </span>
                </td>

                {/* Presentaciones disponibles */}
                <td className="px-5 py-5 align-top">
                  <ul className="space-y-1" role="list">
                    {prod.presentaciones.map((p) => (
                      <li key={p} className="text-titan-text-muted text-xs flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-titan-accent/50 flex-shrink-0" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </td>

                {/* Tamaño de scoop + proteína por servicio si aplica */}
                <td className="px-5 py-5 align-top">
                  <p className="font-heading text-xl text-titan-accent">{prod.scoop}</p>
                  {prod.proteina_por_servicio !== '—' && (
                    <p className="text-[10px] text-titan-text-muted uppercase tracking-widest mt-1">
                      {prod.proteina_por_servicio} proteína
                    </p>
                  )}
                </td>

                {/* Dosis diaria recomendada */}
                <td className="px-5 py-5 align-top">
                  <p className="font-bold text-titan-text text-xs uppercase tracking-wider">
                    {prod.dosis_recomendada}
                  </p>
                </td>

                {/* Momento óptimo de toma */}
                <td className="px-5 py-5 align-top">
                  <p className="text-titan-text-muted text-xs leading-relaxed">{prod.cuando}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grid de notas científicas — información adicional por producto */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {PRODUCTOS.map((prod) => (
          <div
            key={`nota-${prod.nombre}`}
            className="border border-titan-border p-5 bg-titan-surface/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical size={14} className="text-titan-accent flex-shrink-0" aria-hidden="true" />
              <h3 className="font-bold text-xs text-titan-text uppercase tracking-wider">
                {prod.nombre}
              </h3>
            </div>
            <p className="text-xs text-titan-text-muted leading-relaxed">{prod.nota}</p>
          </div>
        ))}
      </div>

    </section>
  );
}
