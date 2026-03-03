/**
 * app/careers/_data.ts — Datos estáticos de la página de carreras
 * ──────────────────────────────────────────────────────────────────
 * Exporta los dos arrays de contenido de la página:
 *
 *  · VALORES_EMPRESA  — los 6 valores culturales del grid
 *  · POSICIONES       — las ofertas de trabajo activas
 *
 * En producción: reemplazar POSICIONES por un fetch a un CMS
 * (Contentful, Sanity, Notion API, etc.) para que el equipo de
 * RRHH pueda actualizar las ofertas sin tocar código.
 *
 * Los iconos de Lucide se incluyen aquí porque forman parte de la
 * definición del dato (cada posición/valor tiene su icono propio)
 * y los componentes los usan como `icon: React.ElementType`.
 */

import {
  FlaskConical, Shield, TrendingUp, Users, Zap, Dumbbell,
  Megaphone, Code,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ─── TIPOS ──────────────────────────────────────────────────────── */

export interface ValorEmpresa {
  icon: LucideIcon;
  titulo: string;
  desc: string;
}

export interface Posicion {
  id: string;
  area: string;
  icon: LucideIcon;
  titulo: string;
  tipo: string;
  modalidad: string;
  descripcion: string;
  requisitos: string[];
  bonus: string[];
}

/* ─── VALORES CULTURALES ─────────────────────────────────────────── */

export const VALORES_EMPRESA: ValorEmpresa[] = [
  {
    icon: FlaskConical,
    titulo: 'Ciencia primero',
    desc: 'Cada decisión parte de datos, no de opiniones. Cuestionamos todo, incluso nuestras propias creencias.',
  },
  {
    icon: Shield,
    titulo: 'Sin bullshit',
    desc: 'Comunicación directa internamente y con el mundo. Lo que ves es lo que hay.',
  },
  {
    icon: TrendingUp,
    titulo: 'Mejora continua',
    desc: 'No buscamos la perfección inmediata. Buscamos el progreso medible y sostenido.',
  },
  {
    icon: Users,
    titulo: 'Comunidad real',
    desc: 'Nuestros clientes son atletas reales, no avatares de marketing. Los conocemos por nombre.',
  },
  {
    icon: Zap,
    titulo: 'Velocidad + criterio',
    desc: 'Moverse rápido no significa moverse sin pensar. Sabemos cuándo acelerar y cuándo detenerse.',
  },
  {
    icon: Dumbbell,
    titulo: 'Vivimos lo que vendemos',
    desc: 'El equipo entrena. No es requisito, es una consecuencia natural de trabajar aquí.',
  },
];

/* ─── POSICIONES ABIERTAS ────────────────────────────────────────── */

export const POSICIONES: Posicion[] = [
  {
    id: 'mkt-001',
    area: 'Marketing',
    icon: Megaphone,
    titulo: 'Performance Marketing Specialist',
    tipo: 'Full-time',
    modalidad: 'Remoto',
    descripcion:
      'Responsable de escalar nuestras campañas de paid media (Meta Ads, Google Ads, TikTok) con foco en ROAS y LTV. Buscamos a alguien obsesionado con los datos y con experiencia real en e-commerce DTC.',
    requisitos: [
      '3+ años en paid media para e-commerce',
      'Experiencia con Meta Ads Manager avanzado',
      'Conocimiento de atribución y modelos multi-touch',
      'Capacidad analítica: te sientes cómodo en Google Analytics 4',
    ],
    bonus: [
      'Experiencia en suplementación o health/fitness',
      'Conocimiento de Klaviyo para retención',
    ],
  },
  {
    id: 'tech-002',
    area: 'Tecnología',
    icon: Code,
    titulo: 'Frontend Engineer (Next.js)',
    tipo: 'Full-time',
    modalidad: 'Remoto',
    descripcion:
      'Construir y optimizar nuestra tienda online y CMS interno. Stack: Next.js, TypeScript, Tailwind CSS. Foco en performance (Core Web Vitals), accesibilidad y experiencia de usuario de nivel producto de Silicon Valley.',
    requisitos: [
      '3+ años con React/Next.js en producción',
      'TypeScript obligatorio',
      'Obsesión con performance y Lighthouse scores',
      'Portfolio con proyectos visuales de alto nivel',
    ],
    bonus: [
      'Experiencia con Zustand, Framer Motion',
      'Conocimiento de e-commerce (Shopify, headless)',
    ],
  },
  {
    id: 'sci-003',
    area: 'Ciencia',
    icon: FlaskConical,
    titulo: 'Formulador / Nutricionista Deportivo',
    tipo: 'Full-time',
    modalidad: 'Híbrido (Barcelona)',
    descripcion:
      'Investigación de ingredientes, desarrollo de nuevas fórmulas y revisión de evidencia científica. Trabajarás con nuestro Director de Formulación y tendrás autonomía real en el proceso de I+D.',
    requisitos: [
      'Licenciatura en Nutrición, Farmacia o Bioquímica',
      'Capacidad para interpretar estudios clínicos (PubMed fluido)',
      'Conocimiento de regulación de suplementos (EFSA, FDA)',
      'Experiencia en formulación de suplementos es un +',
    ],
    bonus: [
      'Publicaciones científicas propias',
      'Experiencia atlética personal (cualquier disciplina)',
    ],
  },
];
