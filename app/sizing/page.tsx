/**
 * app/sizing/page.tsx
 *
 * CONCEPTO: "Las Especificaciones del Arsenal"
 * ─────────────────────────────────────────────
 * Server Component puro — sin interactividad, full SSR.
 * Este archivo solo orquesta secciones; no contiene JSX de presentación.
 *
 * Estructura de módulos:
 *   _data.ts           → PRODUCTOS + CALCULADORA_PROTEINA con sus tipos
 *   HeroSection.tsx    → § 1 Título monumental + nota de advertencia científica
 *   SpecsSection.tsx   → § 2 Tabla de presentaciones/dosis + grid de notas
 *   ProteinSection.tsx → § 3 ¿Cuánta proteína necesitas? con tabla de referencia
 *   CtaSection.tsx     → § 4 CTA final hacia catálogo y FAQ
 *
 * Patrón idéntico a app/about/page.tsx.
 */

import type { Metadata } from 'next';
import HeroSection    from './HeroSection';
import SpecsSection   from './SpecsSection';
import ProteinSection from './ProteinSection';
import CtaSection     from './CtaSection';

export const metadata: Metadata = {
  title: 'Guía de Tamaños y Dosificación | TitanSupps',
  description:
    'Guía completa de presentaciones, dosis recomendadas y cómo elegir el tamaño correcto de cada suplemento según tu peso y objetivo.',
};

export default function SizingPage() {
  return (
    <div className="min-h-screen bg-titan-bg">
      <HeroSection />
      <SpecsSection />
      <ProteinSection />
      <CtaSection />
    </div>
  );
}
