/**
 * app/blog/[slug]/BlogPostSidebar.tsx
 *
 * Sidebar sticky del artículo de blog.
 * Contiene tres bloques en columna vertical:
 *   1. Tarjeta del autor (inicial, nombre, rol, descripción)
 *   2. Tabla de contenidos numerada (TOC)
 *   3. CTA hacia el catálogo de productos
 *
 * Decisión de layout: `lg:sticky lg:top-28` hace que la sidebar
 * se ancle al scroll solo en desktop. En mobile fluye normalmente
 * debajo del artículo (el componente padre controla el orden DOM).
 *
 * El TOC no tiene scroll activo (no resalta la sección actual).
 * Si se necesita ese comportamiento en el futuro, añadir
 * IntersectionObserver en un Client Component wrapper.
 */

import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import type { BlogPost } from './types';

interface BlogPostSidebarProps {
  post: BlogPost;
}

export default function BlogPostSidebar({ post }: BlogPostSidebarProps) {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0" aria-label="Información del artículo">
      <div className="lg:sticky lg:top-28 space-y-8">

        {/* ── AUTOR ───────────────────────────────────────────────────── */}
        <div className="bg-titan-surface border border-titan-border p-6">
          <p className="text-[10px] font-bold text-titan-accent uppercase tracking-[0.2em] mb-4">
            Sobre el autor
          </p>
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar con inicial — sin imagen real para evitar dependencias de assets */}
            <div
              className="w-10 h-10 rounded-full bg-titan-accent/20 border border-titan-accent/30 flex items-center justify-center text-titan-accent font-heading text-lg flex-shrink-0"
              aria-hidden="true"
            >
              {post.authorInitial}
            </div>
            <div>
              <p className="font-bold text-titan-text text-sm">{post.author}</p>
              <p className="text-[10px] text-titan-text-muted uppercase tracking-widest">{post.authorRole}</p>
            </div>
          </div>
          <p className="text-xs text-titan-text-muted leading-relaxed">
            Especialista en formulación de suplementos deportivos con más de 10 años de experiencia
            en investigación aplicada al rendimiento atlético.
          </p>
        </div>

        {/* ── TABLA DE CONTENIDOS ─────────────────────────────────────── */}
        {post.toc.length > 0 && (
          <nav className="bg-titan-surface border border-titan-border p-6" aria-label="Tabla de contenidos">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={14} className="text-titan-accent" aria-hidden="true" />
              <p className="text-[10px] font-bold text-titan-accent uppercase tracking-[0.2em]">
                En este artículo
              </p>
            </div>
            <ol className="space-y-2.5">
              {post.toc.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-[10px] font-bold text-titan-accent/60 mt-0.5 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-titan-text-muted leading-relaxed hover:text-white transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* ── CTA TIENDA ──────────────────────────────────────────────── */}
        <div className="bg-titan-surface border border-titan-accent/20 p-6">
          <p className="text-[10px] font-bold text-titan-accent uppercase tracking-[0.2em] mb-3">
            Arsenal TitanSupps
          </p>
          <p className="text-sm text-titan-text-muted mb-4 leading-relaxed">
            Los suplementos que respaldan cada uno de nuestros artículos. Sin compromiso de objetividad.
          </p>
          <Link
            href="/catalog"
            className="flex items-center justify-center gap-2 w-full py-3 bg-titan-accent text-white font-heading uppercase tracking-wider text-sm hover:bg-titan-accent/80 transition-colors"
          >
            Ver catálogo <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </aside>
  );
}
