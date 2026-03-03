/**
 * app/blog/[slug]/page.tsx
 *
 * Orquestador de la ruta dinámica /blog/[slug].
 * Este archivo SOLO contiene lógica de Next.js (generateStaticParams,
 * generateMetadata) y el layout de la página. Nada más.
 *
 * Árbol de componentes:
 *   BlogPostPage
 *   ├── BlogPostHero        → Imagen hero + breadcrumb + título + tags
 *   ├── article             → Excerpt + bloques de contenido (RenderSection) + firma autor
 *   ├── BlogPostSidebar     → Sticky: autor, TOC, CTA catálogo
 *   └── RelatedPosts        → Grid de artículos relacionados
 *
 * Datos:
 *   getPost()          → Busca el post por slug (→ notFound() si no existe)
 *   getRelatedPosts()  → Resuelve los slugs relacionados a BlogPost[]
 *   POSTS              → Alimenta generateStaticParams para SSG en build time
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { POSTS, getPost, getRelatedPosts } from './data';
import BlogPostHero from './BlogPostHero';
import BlogPostSidebar from './BlogPostSidebar';
import RelatedPosts from './RelatedPosts';
import RenderSection from './RenderSection';

/* ─── STATIC PARAMS — SSG en build time ────────────────────────────────── */

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

/* ─── METADATA — SEO por artículo ──────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Artículo no encontrado | TitanSupps' };

  return {
    title: `${post.title} | TitanSupps Blog`,
    description: post.excerpt,
    openGraph: { images: [post.image] },
  };
}

/* ─── PAGE ─────────────────────────────────────────────────────────────── */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(post.relatedSlugs);

  return (
    <div className="min-h-screen bg-titan-bg">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <BlogPostHero post={post} />

      {/* ── CUERPO DEL ARTÍCULO + SIDEBAR ──────────────────────────── */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* ── CONTENIDO PRINCIPAL ───────────────────────────────────── */}
          <article className="flex-1 min-w-0 max-w-2xl">

            {/* Excerpt destacado */}
            <p className="text-titan-text text-lg leading-relaxed border-l-4 border-titan-accent pl-5 mb-12 italic">
              {post.excerpt}
            </p>

            {/* Cuerpo del artículo — bloques renderizados dinámicamente */}
            <div className="space-y-6">
              {post.body.map((section, i) => (
                <RenderSection key={i} section={section} />
              ))}
            </div>

            {/* Firma del autor al final del artículo */}
            <div className="mt-16 pt-8 border-t border-titan-border flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full bg-titan-accent/20 border border-titan-accent/30 flex items-center justify-center text-titan-accent font-heading text-xl flex-shrink-0"
                aria-hidden="true"
              >
                {post.authorInitial}
              </div>
              <div>
                <p className="font-bold text-titan-text">{post.author}</p>
                <p className="text-xs text-titan-text-muted uppercase tracking-widest">{post.authorRole}</p>
              </div>
            </div>

            {/* Navegación: volver al blog */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <Link
                href="/blog"
                className="flex items-center gap-2 text-xs font-bold text-titan-text-muted hover:text-titan-accent uppercase tracking-widest transition-colors"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                Volver al blog
              </Link>
            </div>

          </article>

          {/* ── SIDEBAR ───────────────────────────────────────────────── */}
          <BlogPostSidebar post={post} />

        </div>
      </div>

      {/* ── ARTÍCULOS RELACIONADOS ────────────────────────────────────── */}
      <RelatedPosts posts={relatedPosts} />

    </div>
  );
}
