// ─────────────────────────────────────────────────────────────────────────────
// § 5 — VALORES EN ACCIÓN — app/about/ValoresSection.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Imagen editorial con cita superpuesta + grid de 6 valores.
// Layout de dos columnas en desktop.

import Image from 'next/image';
import { VALORES } from './_data';

export default function ValoresSection() {
  return (
    <section className="container mx-auto px-6 py-24" aria-labelledby="valores-heading">
      <div className="grid lg:grid-cols-2 gap-16 items-start">

        {/* Imagen editorial con cita superpuesta */}
        <div className="relative aspect-[4/5] overflow-hidden border border-titan-border">
          <Image
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=900&auto=format&fit=crop"
            alt="Atleta de alto rendimiento usando TitanSupps"
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover opacity-60"
            loading="lazy"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-titan-bg via-titan-bg/20 to-transparent"
            aria-hidden="true"
          />
          {/* Cita editorial anclada al pie de la imagen */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <blockquote className="border-l-4 border-titan-accent pl-6">
              <p className="font-heading text-fluid-2xl text-white uppercase leading-tight text-glow">
                &ldquo;Si no podemos verificarlo,<br />
                no lo ponemos en la fórmula.&rdquo;
              </p>
              <footer className="mt-4">
                <p className="text-xs text-titan-accent font-bold uppercase tracking-widest">
                  — Dr. Marcos Villanueva, Director de Formulación
                </p>
              </footer>
            </blockquote>
          </div>
        </div>

        {/* Columna de valores */}
        <div className="flex flex-col justify-center gap-8">
          <header>
            <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
              Lo que nos define
            </p>
            <h2 id="valores-heading" className="font-heading text-fluid-4xl text-titan-text uppercase leading-[0.9]">
              Nuestros<br />
              <span className="text-titan-accent">Valores</span>
            </h2>
          </header>

          <ul
            className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-titan-border border border-titan-border"
            role="list"
          >
            {VALORES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="bg-titan-bg p-5 flex items-start gap-4 group hover:bg-titan-surface transition-colors"
              >
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-titan-border text-titan-accent group-hover:border-titan-accent/40 transition-colors mt-0.5">
                  <Icon size={14} />
                </div>
                <p className="text-sm text-titan-text-muted group-hover:text-titan-text transition-colors leading-snug">
                  {label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
