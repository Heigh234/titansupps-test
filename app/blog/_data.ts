/**
 * app/blog/_data.ts — Datos estáticos del Blog
 * ───────────────────────────────────────────────
 * Sigue el mismo patrón del resto del proyecto:
 * about/_data.ts / affiliates/_data.ts / careers/_data.ts
 *
 * Centraliza en un único punto los arrays de datos que antes
 * vivían dentro de BlogContent.tsx, mezclados con la lógica
 * de render. Ahora son importables por cualquier componente
 * del blog (Server o Client) sin contaminar su bundle.
 *
 * PRÓXIMO PASO (producción):
 * Reemplazar estos arrays por llamadas a CMS (Sanity, Contentful)
 * o base de datos. Los tipos ya están preparados para esa migración.
 */

import type { LucideIcon } from 'lucide-react';
import { FlaskConical, Dumbbell, Zap, Brain, Leaf } from 'lucide-react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface BlogCategory {
  label: string;
  value: string;
  icon: LucideIcon | null;
}

export interface FeaturedPost {
  slug:         string;
  category:     string;
  categoryValue: string;
  title:        string;
  excerpt:      string;
  image:        string;
  author:       string;
  authorRole:   string;
  date:         string;
  readTime:     string;
  tags:         string[];
}

export interface BlogPost {
  slug:          string;
  category:      string;
  categoryValue: string;
  title:         string;
  excerpt:       string;
  image:         string;
  date:          string;
  readTime:      string;
  /** 'md' = card grande (columna izquierda), 'sm' = card compacta (columna derecha) */
  size:          'md' | 'sm';
}

export interface NewsletterTopic {
  label: string;
}

// ─── Datos ────────────────────────────────────────────────────────────────────

export const BLOG_CATEGORIES: BlogCategory[] = [
  { label: 'Todo',           value: 'todo',           icon: null },
  { label: 'Nutrición',      value: 'nutricion',      icon: FlaskConical },
  { label: 'Entrenamiento',  value: 'entrenamiento',  icon: Dumbbell },
  { label: 'Energía',        value: 'energia',        icon: Zap },
  { label: 'Suplementación', value: 'suplementacion', icon: Brain },
  { label: 'Recuperación',   value: 'recuperacion',   icon: Leaf },
];

export const FEATURED_POST: FeaturedPost = {
  slug:          'creatina-guia-definitiva-2026',
  category:      'Suplementación',
  categoryValue: 'suplementacion',
  title:         'Creatina: La Guía Definitiva de 2026 Basada en Evidencia',
  excerpt:       'Después de revisar más de 300 estudios sobre creatina monohidratada, aquí está todo lo que necesitas saber: qué hace, cuánto tomar, cuándo tomarla y por qué es el suplemento más respaldado por la ciencia.',
  image:         'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1400&auto=format&fit=crop',
  author:        'Dr. Marcos Villanueva',
  authorRole:    'Director de Formulación',
  date:          '20 Feb 2026',
  readTime:      '12 min',
  tags:          ['Creatina', 'Fuerza', 'Evidencia Nivel A'],
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug:          'proteina-whey-vs-caseina',
    category:      'Nutrición',
    categoryValue: 'nutricion',
    title:         'Whey vs. Caseína: ¿Cuál Proteína Necesitas Realmente?',
    excerpt:       'La velocidad de absorción importa, pero no de la manera en que el marketing te ha dicho. Analizamos la ciencia real detrás de cada proteína.',
    image:         'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800&auto=format&fit=crop',
    date:          '15 Feb 2026',
    readTime:      '8 min',
    size:          'md',
  },
  {
    slug:          'pre-workout-sin-crash',
    category:      'Energía',
    categoryValue: 'energia',
    title:         'Cómo Elegir un Pre-Workout Sin el Crash Post-Entreno',
    excerpt:       'Los picos de cafeína son el problema, no la cafeína en sí. Aquí está el sistema correcto.',
    image:         'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    date:          '10 Feb 2026',
    readTime:      '6 min',
    size:          'sm',
  },
  {
    slug:          'ventana-anabolica-mito',
    category:      'Entrenamiento',
    categoryValue: 'entrenamiento',
    title:         'La "Ventana Anabólica": Mito vs. Realidad en 2026',
    excerpt:       '¿Tienes realmente 30 minutos para tomar proteína después de entrenar? La respuesta te va a sorprender.',
    image:         'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
    date:          '5 Feb 2026',
    readTime:      '7 min',
    size:          'sm',
  },
  {
    slug:          'sleep-recuperacion-muscular',
    category:      'Recuperación',
    categoryValue: 'recuperacion',
    title:         'Por Qué el Sueño es el Suplemento Más Poderoso que Existe',
    excerpt:       'Sin 7-9 horas de sueño de calidad, ningún suplemento, por caro que sea, va a optimizar tu recuperación. La ciencia del sueño aplicada al atleta moderno.',
    image:         'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
    date:          '28 Ene 2026',
    readTime:      '10 min',
    size:          'md',
  },
  {
    slug:          'zinc-magnesio-testosterona',
    category:      'Suplementación',
    categoryValue: 'suplementacion',
    title:         'Zinc y Magnesio: El Dúo Olvidado que Afecta tu Testosterona',
    excerpt:       'La deficiencia de estos dos micronutrientes es más común de lo que crees, especialmente en atletas. Y las consecuencias en hormonas y sueño son medibles.',
    image:         'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop',
    date:          '22 Ene 2026',
    readTime:      '9 min',
    size:          'md',
  },
  {
    slug:          'carga-carbohidratos-protocolo',
    category:      'Nutrición',
    categoryValue: 'nutricion',
    title:         'Protocolo de Carga de Carbohidratos para Competencia',
    excerpt:       'Guía práctica de 7 días para maximizar el glucógeno muscular sin retención excesiva de agua.',
    image:         'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop',
    date:          '18 Ene 2026',
    readTime:      '11 min',
    size:          'sm',
  },
];

export const NEWSLETTER_TOPICS: string[] = [
  'Nuevos estudios semanales',
  'Protocolos de entrenamiento',
  'Análisis de suplementos',
  'Entrevistas con atletas',
];

/** Mini-stats del Hero del blog */
export const BLOG_HERO_STATS = [
  { value: '48',      label: 'Artículos publicados' },
  { value: '300+',    label: 'Estudios analizados' },
  { value: 'Semanal', label: 'Frecuencia de publicación' },
] as const;
