/**
 * CategoriesSection.tsx — Grid asimétrico de categorías
 * ───────────────────────────────────────────────────────
 * DECISIÓN DE LAYOUT ASIMÉTRICO:
 * La primera categoría (Proteínas) ocupa md:row-span-2 en desktop,
 * creando un grid editorial que rompe la monotonía de 3 columnas iguales.
 * En mobile se colapsa a una columna simple para no acumular alturas.
 *
 * MOBILE FIX documentado en el original:
 * min-h fijo acumulaba 880px+ en mobile (400+240+240).
 * Reducidos a 200px / 160px en mobile, se recuperan en md+.
 * El usuario mobile no debería scrollear 1.3 pantallas en solo esta sección.
 *
 * HOVER EFFECTS:
 * - Imagen: opacity 50% → 60% + scale 105% (zoom sutil)
 * - Overlay: gradiente permanente hacia abajo para legibilidad del texto
 * - Texto: ArrowRight hace translate-x en hover
 * Ningún efecto usa propiedades que causen reflow (solo transform + opacity).
 *
 * cv-section-categories: content-visibility optimizado en globals.css.
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from './_data';

export default function CategoriesSection() {
  return (
    <section
      className="cv-section-categories container mx-auto px-6 pb-24"
      aria-labelledby="categories-heading"
    >
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
          Encuentra tu objetivo
        </p>
        <h2
          id="categories-heading"
          className="text-fluid-4xl text-titan-text"
        >
          Por <span className="text-titan-accent">Categoría</span>
        </h2>
      </div>

      {/* Grid asimétrico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.label}
            href={cat.href}
            className={`group relative overflow-hidden border border-titan-border hover:border-titan-accent/50 transition-colors ${
              i === 0
                ? 'md:row-span-2 min-h-[200px] md:min-h-[400px]'
                : 'min-h-[160px] md:min-h-[240px]'
            }`}
            aria-label={`Ver ${cat.label}`}
          >
            {/* Imagen de fondo con zoom en hover */}
            <Image
              src={cat.image}
              alt={cat.label}
              fill
              sizes="(max-width: 767px) calc(100vw - 48px), 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-50 group-hover:opacity-60"
              loading="lazy"
            />

            {/* Overlay gradiente — garantiza legibilidad del texto */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-titan-bg via-titan-bg/40 to-transparent"
              aria-hidden="true"
            />

            {/* Contenido superpuesto */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-1">
              <span className="text-xs text-titan-accent font-bold uppercase tracking-widest">
                {cat.desc}
              </span>
              <h3 className="font-heading text-3xl text-white uppercase">
                {cat.label}
              </h3>
              <div className="flex items-center gap-2 text-titan-text-muted text-sm mt-2 group-hover:text-titan-accent transition-colors">
                <span className="uppercase tracking-widest text-xs font-bold">Explorar</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
