'use client';

/**
 * components/blog/BlogGrid.tsx — Client Component
 * ─────────────────────────────────────────────────
 * ÚNICA responsabilidad de 'use client' en el blog:
 * gestionar el estado del filtro de categorías y orquestar
 * el render animado del artículo destacado y el grid de posts.
 *
 * ANTES: todo este árbol más el Hero y la sección Newsletter
 * estaban en BlogContent.tsx (480 líneas, un solo 'use client').
 *
 * AHORA:
 * - BlogHero           → Server Component (0 JS al cliente)
 * - BlogGrid           → Client Component mínimo (~130 líneas)
 *   ├── BlogCategoryFilters  → extraído para legibilidad
 *   ├── BlogFeaturedPost     → presentación, sin estado propio
 *   ├── BlogPostCardMd       → presentación, sin estado propio
 *   └── BlogPostCardSm       → presentación, sin estado propio
 * - BlogNewsletterSection → Server Component (0 JS al cliente)
 *
 * LÓGICA DE FILTRADO:
 * - "Todo" → muestra featured + todos los posts
 * - Categoría concreta → filtra posts y oculta el featured
 *   si no pertenece a esa categoría
 * - Estado vacío → mensaje + botón de reset al filtro "Todo"
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';

import { BLOG_CATEGORIES, BLOG_POSTS, FEATURED_POST } from '@/app/blog/_data';
import BlogFeaturedPost    from '@/components/blog/BlogFeaturedPost';
import BlogPostCardMd      from '@/components/blog/BlogPostCardMd';
import BlogPostCardSm      from '@/components/blog/BlogPostCardSm';
import BlogCategoryFilters from '@/components/blog/BlogCategoryFilters';

export default function BlogGrid() {
  const [activeCategory, setActiveCategory] = useState('todo');

  // Posts filtrados según categoría activa
  const filteredPosts = activeCategory === 'todo'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.categoryValue === activeCategory);

  // El featured solo se muestra en "Todo" o si su categoría coincide con el filtro
  const showFeatured =
    activeCategory === 'todo' || FEATURED_POST.categoryValue === activeCategory;

  // Separar posts por formato de card
  const mdPosts = filteredPosts.filter((p) => p.size === 'md');
  const smPosts = filteredPosts.filter((p) => p.size === 'sm');

  // Etiqueta de la categoría activa para el heading del grid
  const activeCategoryLabel =
    BLOG_CATEGORIES.find((c) => c.value === activeCategory)?.label ?? '';

  return (
    <>
      {/* ── § FILTROS DE CATEGORÍA ──────────────────────────────────── */}
      <BlogCategoryFilters
        categories={BLOG_CATEGORIES}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* ── § ARTÍCULO FEATURED (condicional según filtro) ─────────── */}
      <AnimatePresence mode="wait">
        {showFeatured && (
          <motion.section
            key="featured"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="container mx-auto px-6 py-16"
            aria-labelledby="featured-post-heading"
          >
            <BlogFeaturedPost post={FEATURED_POST} />
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── § GRID DE POSTS FILTRADO ────────────────────────────────── */}
      <section
        className="container mx-auto px-6 pb-24"
        aria-labelledby="posts-heading"
        aria-live="polite"
      >
        {/* Header del grid */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-2">
              {activeCategory === 'todo'
                ? 'Todos los artículos'
                : `Categoría: ${activeCategoryLabel}`}
            </p>
            <h2
              id="posts-heading"
              className="font-heading text-fluid-4xl text-titan-text uppercase"
            >
              El Archivo
            </h2>
          </div>
          <span className="text-xs text-titan-text-muted uppercase tracking-widest hidden sm:block">
            {filteredPosts.length} artículo{filteredPosts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Estado vacío */}
        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4 text-center border border-dashed border-titan-border"
          >
            <BookOpen size={32} className="text-titan-text-muted" aria-hidden="true" />
            <p className="font-heading text-xl uppercase text-titan-text">
              Sin artículos en esta categoría
            </p>
            <p className="text-titan-text-muted text-sm">
              Próximamente publicaremos más contenido aquí.
            </p>
            <button
              onClick={() => setActiveCategory('todo')}
              className="mt-2 text-xs font-bold text-titan-accent uppercase tracking-widest hover:text-white transition-colors"
            >
              Ver todos los artículos
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Columna izquierda — cards formato "md" */}
            <AnimatePresence mode="popLayout">
              <div className="space-y-6">
                {mdPosts.length > 0 ? (
                  mdPosts.map((post) => (
                    <motion.div
                      key={post.slug}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.22 }}
                    >
                      <BlogPostCardMd post={post} />
                    </motion.div>
                  ))
                ) : (
                  <p className="text-titan-text-muted text-sm italic py-4">
                    Los artículos de esta categoría están a la derecha.
                  </p>
                )}
              </div>
            </AnimatePresence>

            {/* Columna derecha — cards formato "sm" compactas */}
            <AnimatePresence mode="popLayout">
              <div className="space-y-0 border border-titan-border bg-titan-surface h-fit">
                {smPosts.length > 0 ? (
                  smPosts.map((post, i, arr) => (
                    <motion.div
                      key={post.slug}
                      layout
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                      className={i < arr.length - 1 ? 'border-b border-titan-border' : ''}
                    >
                      <BlogPostCardSm post={post} />
                    </motion.div>
                  ))
                ) : (
                  <div className="p-6 text-titan-text-muted text-sm italic">
                    No hay artículos compactos en esta categoría.
                  </div>
                )}

                {/* CTA "Cargar más" al pie de la columna sm */}
                <div className="p-6 border-t border-titan-border bg-titan-bg/50">
                  <p className="text-xs text-titan-text-muted uppercase tracking-widest mb-3">
                    ¿Quieres más artículos?
                  </p>
                  <button className="w-full py-3 border border-titan-border text-titan-text-muted font-heading text-sm uppercase tracking-widest hover:border-titan-accent hover:text-titan-accent transition-colors flex items-center justify-center gap-2">
                    Cargar más artículos <ArrowRight size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </AnimatePresence>

          </div>
        )}
      </section>
    </>
  );
}
