// ─────────────────────────────────────────────────────────────────────────────
// § 7 — CTA FINAL — app/about/CtaSection.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Cierre de página con máxima energía.
// Imagen de fondo + glow radial de acento + dos CTAs: catálogo y registro.

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-titan-border" aria-labelledby="cta-heading">

      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1800&auto=format&fit=crop"
          alt="Atleta en pleno entrenamiento"
          fill
          sizes="100vw"
          className="object-cover opacity-15"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center bottom, rgba(255,94,0,0.08) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-28 text-center flex flex-col items-center gap-8">
        <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.3em]">
          Ya conoces el proceso
        </p>

        <h2 id="cta-heading" className="font-heading text-fluid-hero uppercase leading-[0.85] text-titan-text text-glow max-w-4xl">
          Ahora <span className="text-titan-accent">Forja</span><br />
          Tu Legado
        </h2>

        <p className="text-titan-text-muted max-w-xl leading-relaxed">
          Cada producto en nuestro catálogo pasó por las cinco fases que acabas de leer.
          Sin atajos. Sin compromisos. Solo la mejor versión de cada fórmula.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            href="/catalog"
            className="group relative px-10 py-5 bg-titan-accent text-white font-heading text-2xl uppercase tracking-widest overflow-hidden flex items-center gap-3 hover:bg-titan-accent-hover transition-colors shadow-[0_0_40px_rgba(255,94,0,0.25)] hover:shadow-[0_0_60px_rgba(255,94,0,0.4)]"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" aria-hidden="true" />
            <span className="relative z-10">Ver el Arsenal</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/auth/register"
            className="px-10 py-5 border border-titan-border text-titan-text font-heading text-2xl uppercase tracking-widest flex items-center gap-3 hover:border-titan-accent hover:text-titan-accent transition-colors"
          >
            Unirme al Batallón
          </Link>
        </div>
      </div>
    </section>
  );
}
