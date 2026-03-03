// ─────────────────────────────────────────────────────────────────────────────
// § 1 — HERO — app/about/HeroSection.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Full-viewport. Imagen de laboratorio como LCP.
// Texto monumental anclado al bottom del viewport.
// Dos CTAs: ancla interna (#proceso) + link al catálogo.

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-end overflow-hidden">

      {/* Imagen LCP — priority para CWV */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1800&auto=format&fit=crop"
          alt="Laboratorio de formulación de suplementos TitanSupps"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
        {/* Gradiente doble: oscurece arriba y abajo para legibilidad */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, #050505 0%, transparent 30%, transparent 50%, #050505 100%)',
          }}
          aria-hidden="true"
        />
        {/* Glow radial de acento */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-titan-accent/8 blur-[100px] rounded-full"
          aria-hidden="true"
        />
      </div>

      {/* Contenido anclado al bottom */}
      <div className="relative z-10 w-full container mx-auto px-6 pb-20 pt-40">

        <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.3em] mb-6">
          TitanSupps — Desde 2017
        </p>

        <h1 className="font-heading text-fluid-hero uppercase leading-[0.85] text-titan-text text-glow max-w-5xl">
          La Ciencia<br />
          <span className="text-titan-accent">Detrás</span> del Acero
        </h1>

        <div className="flex items-center gap-4 my-8">
          <div className="w-12 h-[2px] bg-titan-accent" aria-hidden="true" />
          <p className="text-titan-text-muted text-lg max-w-2xl leading-relaxed">
            No fabricamos suplementos. Fabricamos resultados verificables.
            Cada cápsula, cada scoop, cada fórmula parte de evidencia científica
            real — no de tendencias de marketing.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <a
            href="#proceso"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-titan-accent text-white font-heading text-xl uppercase tracking-wider overflow-hidden relative hover:bg-titan-accent-hover transition-colors"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" aria-hidden="true" />
            <span className="relative z-10">Ver el Proceso</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-3 px-8 py-4 border border-titan-border text-titan-text font-heading text-xl uppercase tracking-wider hover:border-titan-accent hover:text-titan-accent transition-colors"
          >
            Ver el Arsenal
          </Link>
        </div>
      </div>
    </section>
  );
}
