/**
 * components/blog/BlogPostCardSm.tsx
 * ────────────────────────────────────
 * Card de artículo en formato "compacto" — columna derecha del grid.
 * Thumbnail 96×96px + categoría + título + fecha en fila horizontal.
 *
 * Extraída del grid inline de BlogContent.tsx.
 * Componente de presentación puro → Server Component.
 *
 * NOTA: el borde inferior divisor entre cards se gestiona en el padre
 * (BlogGrid) con la clase `border-b border-titan-border` aplicada
 * al wrapper de motion.div, para mantener esta card sin opinión
 * sobre su contexto de lista.
 */

import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { BlogPost } from '@/app/blog/_data';

interface BlogPostCardSmProps {
  post: BlogPost;
}

export default function BlogPostCardSm({ post }: BlogPostCardSmProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-5 p-6 hover:bg-titan-bg transition-colors"
    >
      {/* Thumbnail cuadrado */}
      <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden border border-titan-border">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="96px"
          className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
          loading="lazy"
        />
      </div>

      {/* Texto */}
      <div className="flex flex-col justify-center gap-2 min-w-0">
        {/* Categoría + tiempo */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-titan-accent uppercase tracking-widest">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-titan-text-muted uppercase tracking-widest">
            <Clock size={10} aria-hidden="true" /> {post.readTime}
          </span>
        </div>

        <h3 className="font-heading text-base uppercase text-titan-text group-hover:text-titan-accent transition-colors leading-tight">
          {post.title}
        </h3>

        <p className="text-[11px] text-titan-text-muted uppercase tracking-widest">
          {post.date}
        </p>
      </div>
    </Link>
  );
}
