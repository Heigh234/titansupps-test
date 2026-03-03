/**
 * app/blog/[slug]/RelatedPosts.tsx
 *
 * Sección de artículos relacionados al final del post.
 * Recibe un array de BlogPost ya resueltos (no slugs) para evitar
 * lógica de datos en un componente de UI.
 *
 * Decisión de diseño:
 *   - Grid responsivo: 1 col → 2 col (sm) → 3 col (lg)
 *   - Imágenes con loading="lazy" (están below the fold siempre)
 *   - El componente es null-safe: si no hay relacionados, no renderiza nada.
 */

import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import type { BlogPost } from './types';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-titan-border" aria-labelledby="related-heading">
      <div className="container mx-auto px-6 py-16">

        {/* Encabezado con link al blog completo */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-2">
              Sigue leyendo
            </p>
            <h2
              id="related-heading"
              className="font-heading text-fluid-4xl text-titan-text uppercase"
            >
              Artículos Relacionados
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-titan-text-muted hover:text-titan-accent uppercase tracking-widest transition-colors"
            aria-label="Ver todos los artículos del blog"
          >
            Ver todo <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((related) => (
            <Link
              key={related.slug}
              href={`/blog/${related.slug}`}
              className="group block border border-titan-border hover:border-titan-accent/40 transition-colors overflow-hidden bg-titan-surface"
            >
              {/* Imagen de la card */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={related.image}
                  alt={related.title}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-titan-surface via-titan-surface/20 to-transparent"
                  aria-hidden="true"
                />
                <span className="absolute top-3 left-3 px-2 py-1 bg-titan-accent text-black text-[10px] font-bold uppercase tracking-widest">
                  {related.category}
                </span>
              </div>

              {/* Info de la card */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] text-titan-text-muted uppercase tracking-widest">
                    {related.date}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-titan-text-muted uppercase tracking-widest">
                    <Clock size={9} aria-hidden="true" /> {related.readTime}
                  </span>
                </div>
                <h3 className="font-heading text-base uppercase text-titan-text group-hover:text-titan-accent transition-colors leading-tight">
                  {related.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
