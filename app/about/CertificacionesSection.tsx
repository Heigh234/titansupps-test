// ─────────────────────────────────────────────────────────────────────────────
// § 4 — CERTIFICACIONES & STATS — app/about/CertificacionesSection.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Grid de 6 stats + explicación del COA con checklist.
// Fondo con imagen atmosférica de laboratorio a baja opacidad.

import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { CERTIFICACIONES, COA_CHECKLIST } from './_data';

export default function CertificacionesSection() {
  return (
    <section className="relative overflow-hidden border-y border-titan-border" aria-labelledby="certs-heading">

      {/* Fondo atmosférico */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1800&auto=format&fit=crop"
          alt="Análisis de laboratorio de suplementos"
          fill
          sizes="100vw"
          className="object-cover opacity-10"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-titan-bg/80" aria-hidden="true" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Columna izquierda: titular + grid de stats */}
          <div>
            <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
              Números que hablan
            </p>
            <h2 id="certs-heading" className="font-heading text-fluid-4xl text-titan-text uppercase leading-[0.9] mb-10">
              Transparencia<br />
              <span className="text-titan-accent">Verificable</span>
            </h2>

            {/* Grid de stats — diseño tipo "tabla de especificaciones" */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-titan-border border border-titan-border">
              {CERTIFICACIONES.map(({ label, valor, sub }) => (
                <div
                  key={label}
                  className="bg-titan-bg p-6 flex flex-col gap-1 group hover:bg-titan-surface transition-colors"
                >
                  <span className="font-heading text-fluid-2xl text-titan-accent leading-none">
                    {valor}
                  </span>
                  <span className="text-[10px] font-bold text-titan-text uppercase tracking-widest leading-tight">
                    {label}
                  </span>
                  <span className="text-[10px] text-titan-text-muted uppercase tracking-widest">
                    {sub}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Columna derecha: COA explainer + checklist */}
          <div className="flex flex-col gap-8">
            <div className="border-l-2 border-titan-accent pl-8">
              <h3 className="font-heading text-fluid-xl text-titan-text uppercase mb-3">
                ¿Qué es un COA y<br />
                <span className="text-titan-accent">por qué importa?</span>
              </h3>
              <p className="text-titan-text-muted leading-relaxed text-sm">
                Un Certificate of Analysis (COA) es el documento emitido por un
                laboratorio independiente que certifica la composición exacta de
                un lote de producto. Incluye la pureza del ingrediente activo,
                ausencia de metales pesados, contaminantes microbianos y
                disolventes residuales.
              </p>
            </div>

            <p className="text-titan-text-muted leading-relaxed text-sm">
              La mayoría de marcas no los publica porque revelarían sobredosificaciones,
              subdosificaciones o contaminaciones. En TitanSupps, cada lote tiene su
              COA accesible por número de lote desde el empaque.
            </p>

            <ul className="space-y-3" role="list">
              {COA_CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-titan-text-muted">
                  <CheckCircle size={16} className="text-titan-accent flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-titan-text font-heading text-lg uppercase tracking-wider border-b border-titan-accent pb-1 hover:text-titan-accent transition-colors group w-fit"
            >
              Ver Catálogo con COAs
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
