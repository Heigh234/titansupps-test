/**
 * app/about/page.tsx
 *
 * CONCEPTO: "La Ciencia Detrás del Acero"
 * ─────────────────────────────────────────
 * Server Component puro — sin interactividad, full SSR.
 * Este archivo solo orquesta secciones; no contiene JSX de presentación.
 *
 * Estructura de módulos:
 *  _data.ts                  → datos estáticos (PRINCIPIOS, PROCESO_STEPS, etc.)
 *  HeroSection.tsx           → § 1 Hero full-viewport con imagen LCP
 *  PrincipiosSection.tsx     → § 2 Grid de 3 principios filosóficos
 *  ProcesoSection.tsx        → § 3 Timeline vertical de 5 fases
 *  CertificacionesSection.tsx→ § 4 Stats verificables + explicación COA
 *  ValoresSection.tsx        → § 5 Imagen editorial + grid de 6 valores
 *  HitosSection.tsx          → § 6 Timeline histórico de la marca
 *  CtaSection.tsx            → § 7 CTA final de conversión
 */

import type { Metadata } from 'next';
import HeroSection            from './HeroSection';
import PrincipiosSection      from './PrincipiosSection';
import ProcesoSection         from './ProcesoSection';
import CertificacionesSection from './CertificacionesSection';
import ValoresSection         from './ValoresSection';
import HitosSection           from './HitosSection';
import CtaSection             from './CtaSection';

export const metadata: Metadata = {
  title: 'Nuestra Ciencia & Proceso | TitanSupps',
  description:
    'Descubre cómo TitanSupps formula, testea y certifica cada producto. Transparencia total desde el laboratorio hasta tu base.',
  openGraph: {
    images: ['https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1200'],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-titan-bg">
      <HeroSection />
      <PrincipiosSection />
      <ProcesoSection />
      <CertificacionesSection />
      <ValoresSection />
      <HitosSection />
      <CtaSection />
    </div>
  );
}
