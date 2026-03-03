/**
 * components/blog/BlogPostCardMd.tsx
 * ────────────────────────────────────
 * Card de artículo en formato "grande" — columna izquierda del grid.
 * Imagen de 208px de altura + datos de meta + título + excerpt + CTA.
 *
 * Extraída del grid inline que estaba dentro de BlogContent.tsx.
 * Al ser un componente de presentación puro (solo recibe props,
 * no tiene estado ni eventos), es un Server Component.
 *
 * REUTILIZABLE: puede usarse en cualquier listado del blog
 * (home, sección relacionados, página de autor, etc.)
 */

import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
import type { BlogPost } from '@/app/blog/_data';

interface BlogPostCardMdProps {
  post: BlogPost;
}

export default function BlogPostCardMd({ post }: BlogPostCardMdProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border border-titan-border hover:border-titan-accent/40 transition-colors overflow-hidden bg-titan-surface"
    >
      {/* Imagen con zoom en hover */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-titan-surface via-titan-surface/20 to-transparent" />

        {/* Badge de categoría */}
        <span className="absolute top-4 left-4 px-2 py-1 bg-titan-accent text-black text-[10px] font-bold uppercase tracking-widest">
          {post.category}
        </span>
      </div>

      {/* Cuerpo de la card */}
      <div className="p-6">
        {/* Meta: fecha + tiempo de lectura */}
        <div className="flex items-center gap-4 mb-3">
          <span className="text-[10px] text-titan-text-muted uppercase tracking-widest font-bold">
            {post.date}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-titan-text-muted uppercase tracking-widest font-bold">
            <Clock size={10} aria-hidden="true" /> {post.readTime}
          </span>
        </div>

        <h3 className="font-heading text-xl uppercase text-titan-text group-hover:text-titan-accent transition-colors leading-tight mb-2">
          {post.title}
        </h3>

        <p className="text-sm text-titan-text-muted leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-1 mt-4 text-titan-accent text-xs font-bold uppercase tracking-widest group-hover:gap-2 transition-all">
          Leer artículo <ChevronRight size={12} aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
