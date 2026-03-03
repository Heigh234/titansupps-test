/**
 * components/blog/BlogFeaturedPost.tsx
 * ──────────────────────────────────────
 * Card del artículo destacado del blog. Gran imagen de fondo
 * con overlay gradiente + metadatos + título + autor.
 *
 * IMPORTANTE — Por qué este componente NO es Server Component:
 * Aunque solo renderiza datos estáticos, vive DENTRO de BlogGrid
 * (Client Component) porque su visibilidad depende del estado
 * `activeCategory`. Al ser hijo de un Client Component, se ejecuta
 * en el cliente también. No hay forma de evitarlo sin reestructurar
 * la lógica de filtrado al servidor (ej: searchParams de URL).
 *
 * Extraído de BlogContent.tsx para separar la lógica de render
 * de la lógica de estado del filtro. Cada archivo tiene ahora
 * una sola responsabilidad.
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import type { FeaturedPost } from '@/app/blog/_data';

interface BlogFeaturedPostProps {
  post: FeaturedPost;
}

export default function BlogFeaturedPost({ post }: BlogFeaturedPostProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block relative overflow-hidden border border-titan-border hover:border-titan-accent/50 transition-colors"
      aria-label={`Leer artículo destacado: ${post.title}`}
    >
      {/* Imagen de fondo */}
      <div className="relative h-[55vh] min-h-[380px]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover opacity-40 group-hover:opacity-50 group-hover:scale-[1.02] transition-all duration-700"
        />
        {/*
          Gradiente horizontal: de sólido (#050505) a transparente.
          Asegura contraste del texto en el lado izquierdo sin
          bloquear la imagen en el lado derecho.
        */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, #050505 40%, transparent 100%)' }}
          aria-hidden="true"
        />
      </div>

      {/* Contenido superpuesto */}
      <div className="absolute inset-0 flex items-end p-8 md:p-12">
        <div className="max-w-2xl">

          {/* Meta: categoría + tiempo de lectura + fecha */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
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

          <h2
            id="featured-post-heading"
            className="font-heading text-fluid-2xl lg:text-fluid-4xl text-titan-text uppercase leading-[0.9] mb-4 group-hover:text-titan-accent transition-colors"
          >
            {post.title}
          </h2>

          <p className="text-titan-text-muted leading-relaxed mb-6 hidden md:block max-w-xl">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 border border-titan-border text-[10px] text-titan-text-muted uppercase tracking-widest font-bold"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Autor + CTA */}
          <div className="flex items-center gap-4">
            {/* Avatar con inicial */}
            <div
              className="w-8 h-8 rounded-full bg-titan-accent/20 border border-titan-accent/30 flex items-center justify-center text-titan-accent font-heading text-sm flex-shrink-0"
              aria-hidden="true"
            >
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-titan-text">{post.author}</p>
              <p className="text-[10px] text-titan-text-muted uppercase tracking-widest">
                {post.authorRole}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-titan-accent font-bold text-sm uppercase tracking-widest group-hover:gap-3 transition-all">
              Leer <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}
