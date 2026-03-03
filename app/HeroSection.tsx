/**
 * HeroSection.tsx — Sección hero del Home
 * ─────────────────────────────────────────
 * DECISIONES DE DISEÑO:
 *
 * Grid asimétrico (texto | imagen):
 * En desktop: dos columnas, imagen como columna derecha.
 * En mobile: imagen como background absoluto con overlay doble
 * (oscuridad + fade-to-bottom). Evita la complejidad de un
 * reordenamiento de columnas y da más impacto en pantallas pequeñas.
 *
 * LCP (Largest Contentful Paint):
 * Ambas instancias de <Image> llevan priority + fetchPriority="high".
 * Next.js inyecta <link rel="preload"> en el <head> automáticamente.
 * El elemento LCP real depende del viewport, pero cubrimos ambos casos.
 *
 * Scroll indicator:
 * aria-hidden="true" — elemento puramente decorativo, no aporta
 * información semántica al árbol de accesibilidad.
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">

      {/* Glow radial de acento — integra la imagen con el fondo oscuro */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-titan-accent/10 blur-[120px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      {/*
        MOBILE BACKGROUND — solo visible en mobile (lg:hidden).
        En desktop la imagen va como columna derecha del grid.
        Overlay doble: oscurece para contraste WCAG AA + fade al pie
        para transición suave hacia la sección siguiente.
      */}
      <div className="absolute inset-0 lg:hidden" aria-hidden="true">
        <Image
          src="/hero-athlete.webp"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center object-top"
        />
        <div className="absolute inset-0 bg-titan-bg/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-titan-bg" />
      </div>

      {/* Grid de contenido */}
      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center mt-20">

        {/* Columna izquierda: texto + CTAs */}
        <div className="flex flex-col items-start gap-6 z-20">

          {/* Chip de novedad */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-titan-accent/30 bg-titan-accent/10 text-titan-accent text-sm font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-titan-accent animate-pulse" aria-hidden="true" />
            Nueva Fórmula Pre-Workout
          </div>

          <h1 className="text-fluid-hero text-glow leading-[0.85] text-titan-text">
            FORJA <br />
            <span className="text-titan-accent">TU LEYENDA</span>
          </h1>

          <p className="text-fluid-lg text-titan-text-muted max-w-md">
            Suplementación de grado élite sin filtros ni promesas vacías.
            Solo ciencia, potencia y resultados puros.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">

            {/* CTA Primario — shimmer effect on hover */}
            <Link
              href="/catalog"
              className="group relative px-8 py-4 bg-titan-accent text-white font-heading text-2xl uppercase tracking-wider overflow-hidden flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95"
            >
              <div
                className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                aria-hidden="true"
              />
              <span className="relative z-10">Explorar Productos</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* CTA Secundario */}
            <Link
              href="/about"
              className="px-8 py-4 border border-titan-border text-titan-text font-heading text-2xl uppercase tracking-wider flex items-center justify-center hover:border-titan-accent hover:text-titan-accent transition-colors"
            >
              Nuestra Ciencia
            </Link>
          </div>
        </div>

        {/*
          DESKTOP IMAGEN — columna derecha del grid, solo en lg+.
          WebkitMaskImage crea el fade vertical que integra
          la imagen con el fondo oscuro sin un corte brusco.
          hidden lg:flex oculta este bloque en mobile (usa el BG absoluto).
        */}
        <div className="hidden lg:relative lg:flex lg:h-[80vh] lg:w-full lg:items-center lg:justify-center">
          <Image
            src="/hero-athlete.webp"
            alt="Atleta levantando pesas en ambiente oscuro — TitanSupps"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1023px) 0vw, 50vw"
            className="object-cover object-center"
            style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40"
        aria-hidden="true"
      >
        <div className="w-px h-12 bg-gradient-to-b from-titan-accent to-transparent" />
      </div>
    </section>
  );
}
