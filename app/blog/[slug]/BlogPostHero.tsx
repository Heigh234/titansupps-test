/**
 * app/blog/[slug]/BlogPostHero.tsx
 *
 * Hero del artículo de blog.
 * Ocupa el 55vh superior con:
 *   - Imagen de fondo con LCP prioritario (priority + fetchPriority="high")
 *   - Gradiente de transición hacia el contenido
 *   - Breadcrumb accesible (aria-label="Breadcrumb")
 *   - Categoría, tiempo de lectura, fecha
 *   - Título principal H1
 *   - Tags del artículo
 *
 * Decisión de performance: la imagen del hero es siempre el LCP de la página,
 * por eso forzamos priority={true} y fetchPriority="high" para que Next.js
 * la precargue con <link rel="preload">.
 */

import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { BlogPost } from './types';

interface BlogPostHeroProps {
  post: BlogPost;
}

export default function BlogPostHero({ post }: BlogPostHeroProps) {
  return (
    <div className="relative h-[55vh] min-h-[400px] overflow-hidden">

      {/* Imagen de fondo — LCP crítico de la página */}
      <Image
        src={post.image}
        alt={post.title}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover opacity-35"
      />

      {/* Gradiente hacia abajo para transición suave con el contenido */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.6) 50%, #050505 100%)' }}
        aria-hidden="true"
      />

      {/* Contenido posicionado en la parte inferior del hero */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-6 pb-12">

          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-titan-text-muted mb-6"
            aria-label="Breadcrumb"
          >
            <Link href="/blog" className="hover:text-titan-accent transition-colors">
              Blog
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-titan-accent">{post.category}</span>
          </nav>

          <div className="max-w-3xl">
            {/* Meta: categoría + lectura + fecha */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="px-3 py-1 bg-titan-accent text-black text-[10px] font-bold uppercase tracking-widest">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-titan-text-muted uppercase tracking-widest font-bold">
                <Clock size={10} aria-hidden="true" /> {post.readTime} lectura
              </span>
              <span className="text-[10px] text-titan-text-muted uppercase tracking-widest font-bold">
                {post.date}
              </span>
            </div>

            {/* Título H1 — único en la página */}
            <h1 className="font-heading text-fluid-3xl md:text-fluid-4xl text-titan-text uppercase leading-[0.9] mb-6">
              {post.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2" role="list" aria-label="Etiquetas del artículo">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  role="listitem"
                  className="px-2 py-1 border border-titan-border text-[10px] text-titan-text-muted uppercase tracking-widest font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
