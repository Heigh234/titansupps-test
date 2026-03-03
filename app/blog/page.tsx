/**
 * app/blog/page.tsx — Server Component
 * ───────────────────────────────────────
 * Orquestador de la página del blog. Compone las secciones en orden,
 * aprovechando al máximo el renderizado en servidor.
 *
 * ARQUITECTURA POST-MODULARIZACIÓN:
 *
 * ANTES (BlogContent.tsx monolito de 480 líneas, 'use client'):
 * ┌─────────────────────────────────────────────────┐
 * │  BlogContent ('use client')                     │
 * │  ├── Hero            ← innecesariamente cliente │
 * │  ├── Filters         ← necesita cliente ✓       │
 * │  ├── FeaturedPost    ← innecesariamente cliente │
 * │  ├── PostGrid        ← necesita cliente ✓       │
 * │  └── Newsletter      ← innecesariamente cliente │
 * └─────────────────────────────────────────────────┘
 *
 * AHORA (árbol híbrido óptimo):
 * ┌─────────────────────────────────────────────────┐
 * │  BlogPage (Server Component)                    │
 * │  ├── BlogHero               ← Server ✅         │
 * │  ├── BlogGrid               ← Client ✅         │
 * │  │   ├── BlogCategoryFilters ← Client ✅        │
 * │  │   ├── BlogFeaturedPost   ← en Client scope   │
 * │  │   ├── BlogPostCardMd     ← en Client scope   │
 * │  │   └── BlogPostCardSm     ← en Client scope   │
 * │  └── BlogNewsletterSection  ← Server ✅         │
 * │      └── BlogNewsletterForm ← Client ✅ (hoja)  │
 * └─────────────────────────────────────────────────┘
 *
 * RESULTADO: Solo BlogGrid, BlogCategoryFilters y BlogNewsletterForm
 * envían JS al cliente. Hero y NewsletterSection se renderizan en
 * servidor → bundle del cliente significativamente más pequeño.
 */

import type { Metadata } from 'next';
import BlogHero               from '@/components/blog/BlogHero';
import BlogGrid               from '@/components/blog/BlogGrid';
import BlogNewsletterSection  from '@/components/blog/BlogNewsletterSection';

export const metadata: Metadata = {
  title: 'Blog & Ciencia | TitanSupps',
  description:
    'Artículos basados en evidencia sobre entrenamiento, nutrición y suplementación. Escritos por atletas y revisados por científicos.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-titan-bg">
      {/* 1. Hero estático — renderizado en servidor */}
      <BlogHero />

      {/* 2. Filtros + Featured + Grid — Client Component (necesita useState) */}
      <BlogGrid />

      {/* 3. Newsletter — wrapper en servidor, formulario en cliente */}
      <BlogNewsletterSection />
    </div>
  );
}
