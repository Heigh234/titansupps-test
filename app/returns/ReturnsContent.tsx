/**
 * ReturnsContent.tsx — Secciones del cuerpo de la política de devoluciones
 * ──────────────────────────────────────────────────────────────────────────
 * EXTRACCIÓN: Contiene las 3 secciones del cuerpo de la página que no son
 * ni el hero ni el CTA final — ambos permanecen en page.tsx por ser
 * estructuralmente parte del layout de la ruta.
 *
 * SECCIONES:
 *   1. Proceso      — grid de 4 pasos con números monumentales de fondo
 *   2. Condiciones  — tabla split "Aceptamos / No Aplica"
 *   3. Defectuosos  — callout editorial con CTA a soporte directo
 *
 * Server Component puro — cero JS al cliente.
 *
 * DETALLE DE DISEÑO — bordes del grid de pasos:
 * El grid de 4 columnas en desktop requiere bordes selectivos para evitar
 * bordes dobles. La lógica de clases condicionales por índice (i < 3, i === 1,
 * etc.) está documentada inline para facilitar futuras modificaciones.
 */

import Link from 'next/link';
import { ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import { PASOS, ACEPTA, NO_ACEPTA } from './_data';

export default function ReturnsContent() {
  return (
    <>
      {/* ══════════════════════════════════════════════════
          SECCIÓN 1 — Proceso: 4 pasos
          ══════════════════════════════════════════════════ */}
      <section className="container mx-auto px-6 pb-24" aria-labelledby="proceso-heading">
        <div className="mb-12">
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
            El proceso
          </p>
          <h2
            id="proceso-heading"
            className="font-heading text-fluid-4xl text-titan-text uppercase leading-[0.9]"
          >
            Cuatro Pasos.<br />
            <span className="text-titan-accent">Sin Sorpresas.</span>
          </h2>
        </div>

        {/*
          GRID DE PASOS — bordes condicionales por índice:
          - Todos los pasos: border-b en mobile (stack vertical)
          - md (2 col): border-r en col izquierda (i===0, i===1 top row)
          - lg (4 col): border-r en todos menos el último (i < 3)
          El wrapper tiene `border` exterior, las celdas gestionan sus
          bordes interiores para evitar duplicados.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-titan-border">
          {PASOS.map(({ numero, icon: Icon, titulo, detalle, plazo }, i) => (
            <div
              key={numero}
              className={[
                'p-8 flex flex-col gap-5 relative group hover:bg-titan-surface transition-colors',
                // Mobile: separador inferior excepto el último
                i < PASOS.length - 1 ? 'border-b border-titan-border' : '',
                // md (2 col): quitar border-b de los dos últimos, añadir border-r al par izquierdo
                i < 2 ? 'md:border-b lg:border-b-0' : 'md:border-b-0',
                i % 2 === 0 ? 'md:border-r border-titan-border' : 'md:border-r-0',
                // lg (4 col): border-r en todos excepto el último
                i < 3 ? 'lg:border-r border-titan-border' : 'lg:border-r-0',
              ].join(' ')}
            >
              {/* Número monumental decorativo de fondo */}
              <span
                className="absolute top-4 right-5 font-heading text-[5rem] leading-none text-titan-border/30 select-none pointer-events-none"
                aria-hidden="true"
              >
                {numero}
              </span>

              {/* Línea de acento en hover — solo transform, sin reflow */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-titan-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                aria-hidden="true"
              />

              {/* Icono */}
              <div className="w-10 h-10 flex items-center justify-center border border-titan-border text-titan-accent group-hover:border-titan-accent/50 group-hover:bg-titan-accent/5 transition-all relative z-10">
                <Icon size={18} aria-hidden="true" />
              </div>

              {/* Texto */}
              <div className="relative z-10 flex flex-col gap-2">
                <h3 className="font-heading text-xl text-titan-text uppercase leading-tight">
                  {titulo}
                </h3>
                <p className="text-sm text-titan-text-muted leading-relaxed">{detalle}</p>
              </div>

              {/* Badge de plazo */}
              <div className="relative z-10 mt-auto">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-titan-accent/30 bg-titan-accent/5 text-[10px] font-bold text-titan-accent uppercase tracking-widest">
                  <Clock size={10} aria-hidden="true" /> {plazo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECCIÓN 2 — Condiciones: Aceptamos / No Aplica
          ══════════════════════════════════════════════════ */}
      <section
        className="border-y border-titan-border bg-titan-surface/30"
        aria-labelledby="condiciones-heading"
      >
        <div className="container mx-auto px-6 py-20">
          <div className="mb-12">
            <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
              Condiciones
            </p>
            <h2
              id="condiciones-heading"
              className="font-heading text-fluid-4xl text-titan-text uppercase leading-[0.9]"
            >
              El Reglamento<br />
              <span className="text-titan-accent">Sin Letra Chica</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-titan-border">

            {/* Columna ACEPTA */}
            <div className="p-8 border-b lg:border-b-0 lg:border-r border-titan-border">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle size={20} className="text-green-500" aria-hidden="true" />
                <h3 className="font-heading text-2xl text-titan-text uppercase tracking-wider">
                  Aceptamos
                </h3>
              </div>
              <ul className="space-y-4">
                {ACEPTA.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-titan-text-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna NO APLICA */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <XCircle size={20} className="text-red-500" aria-hidden="true" />
                <h3 className="font-heading text-2xl text-titan-text uppercase tracking-wider">
                  No Aplica
                </h3>
              </div>
              <ul className="space-y-4">
                {NO_ACEPTA.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-titan-text-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1.5" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECCIÓN 3 — Nota sobre productos defectuosos
          ══════════════════════════════════════════════════ */}
      <section className="container mx-auto px-6 py-20">
        <div className="border-l-4 border-titan-accent pl-8 max-w-3xl">
          <h2 className="font-heading text-2xl text-titan-text uppercase mb-4">
            ¿Producto Defectuoso o con Error?
          </h2>
          <p className="text-titan-text-muted leading-relaxed mb-6">
            Si tu producto llega dañado, con mal olor inusual, textura anormal, o si detectas
            cualquier anomalía respecto a lo que esperabas basándote en nuestros COAs,{' '}
            <strong className="text-titan-text">no pagas el envío de vuelta</strong> y el
            reembolso es prioritario. Toma fotos del empaque y del producto antes de deshacerte
            de nada — eso acelera el proceso significativamente.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-titan-accent font-heading text-lg uppercase tracking-wider border-b border-titan-accent pb-1 hover:text-white hover:border-white transition-colors group"
          >
            Contactar soporte directo
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
