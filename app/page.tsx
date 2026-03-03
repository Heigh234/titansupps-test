/**
 * app/page.tsx — Home Page
 * ─────────────────────────
 * ARQUITECTURA POST-MODULARIZACIÓN:
 * Este archivo es ahora un Server Component puro (~40 líneas).
 * Su única responsabilidad es componer las secciones en el orden correcto.
 *
 * BENEFICIOS OBTENIDOS:
 * ✓ Eliminado 'use client' innecesario — toda la página se renderiza
 *   en servidor. Solo los subcomponentes que realmente necesitan estado
 *   (NewsletterForm, ProductCard) son Client Components.
 * ✓ Cada sección es independiente: modificable, testeable y movible
 *   sin riesgo de efectos secundarios en otras secciones.
 * ✓ Los datos estáticos centralizados en _data.ts — un único punto
 *   de modificación para actualizar productos/stats/testimonios.
 *
 * SECCIONES EN ORDEN:
 * 1. HeroSection          → Impacto inmediato, LCP crítico
 * 2. StatsSection         → Social proof rápido (50K atletas, 4.9★...)
 * 3. FeaturedProducts     → 4 productos best-seller
 * 4. CategoriesSection    → Grid asimétrico por objetivo
 * 5. ManifestoSection     → Identidad editorial de marca
 * 6. TestimonialsSection  → Social proof detallado
 * 7. NewsletterSection    → Captura de lead con incentivo
 */

import HeroSection        from './HeroSection';
import StatsSection       from './StatsSection';
import FeaturedProducts   from './FeaturedProducts';
import CategoriesSection  from './CategoriesSection';
import ManifestoSection   from './ManifestoSection';
import TestimonialsSection from './TestimonialsSection';
import NewsletterSection  from './NewsletterSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedProducts />
      <CategoriesSection />
      <ManifestoSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
