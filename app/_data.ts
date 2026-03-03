/**
 * app/_data.ts — Datos estáticos del Home
 * ─────────────────────────────────────────
 * Centraliza los datos que NO vienen de la base de datos:
 *  - CATEGORIES: las categorías son una constante del negocio, no filas de BD.
 *    Cada categoría apunta a /catalog?category=xxx.
 *    Las imágenes provienen de Unsplash (ya tenemos preconnect en layout.tsx).
 *  - TESTIMONIALS: datos curados hasta tener tabla de reseñas.
 *  - STATS: ahora cargados dinámicamente en StatsSection desde getHomeStats().
 *
 * NOTAS:
 *  - FEATURED_PRODUCTS se elimina: FeaturedProducts.tsx usa getFeaturedProducts()
 *    directamente desde Supabase.
 *  - STATS se elimina del export: StatsSection lo obtiene desde getHomeStats().
 */

import type { LucideIcon } from 'lucide-react';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface Category {
  label: string;
  href:  string;
  image: string;
  desc:  string;
}

export interface Testimonial {
  name:   string;
  role:   string;
  rating: number;
  text:   string;
}

// Mantenemos el tipo Stat para StatsSection (aunque los valores vienen de DB)
export interface Stat {
  value: string;
  label: string;
  icon:  LucideIcon;
}

// ─── CATEGORÍAS ──────────────────────────────────────────────────────────────
// Mapeadas 1:1 con el campo `category` de la tabla `products`.
// El parámetro ?category= alimenta el filtro en /catalog.
//
// Imágenes: Unsplash con parámetros específicos para atletismo/suplementos.
// Orden: Proteínas primero (mayor volumen de ventas → ocupa row-span-2 en grid).

export const CATEGORIES: Category[] = [
  {
    label: 'Proteínas',
    href:  '/catalog?category=proteinas',
    image: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=800&q=80&auto=format&fit=crop',
    desc:  'Masa Muscular',
  },
  {
    label: 'Pre-Workout',
    href:  '/catalog?category=pre-workout',
    image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80&auto=format&fit=crop',
    desc:  'Energía & Explosividad',
  },
  {
    label: 'Creatinas',
    href:  '/catalog?category=creatinas',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80&auto=format&fit=crop',
    desc:  'Fuerza & Potencia',
  },
  {
    label: 'Aminoácidos',
    href:  '/catalog?category=aminoacidos',
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80&auto=format&fit=crop',
    desc:  'Recuperación',
  },
];

// ─── TESTIMONIOS ─────────────────────────────────────────────────────────────
// Datos curados hasta implementar una tabla reviews en Supabase.
// Representan los tres arquetipos principales de cliente TitanSupps:
//  - Powerlifter serio (resultados de fuerza)
//  - Atleta fitness femenina (calidad + experiencia sensorial)
//  - Runner/crossfitter (recuperación)
// El testimonio central (índice 1) recibe el tratamiento visual diferenciado
// en TestimonialsSection: borde de acento + elevación sutil en desktop.

export const TESTIMONIALS: Testimonial[] = [
  {
    name:   'Marcos R.',
    role:   'Powerlifter · 3 años cliente',
    rating: 5,
    text:   'Llevo tres años tomando la Creatina Monohidrato y el Whey Isolate. Los resultados en plataforma hablan solos: +40kg en sentadilla en 18 meses. Sin ingredientes de relleno, sin excusas.',
  },
  {
    name:   'Laura V.',
    role:   'Atleta CrossFit · 2 años cliente',
    rating: 5,
    text:   'Probé mil marcas antes de TitanSupps. La diferencia está en la calidad real: el Whey Isolate se disuelve perfectamente, el sabor a Vainilla es limpio sin empalagar. Y el Pre-Workout no me da picos de ansiedad.',
  },
  {
    name:   'Diego M.',
    role:   'Runner de élite · 1 año cliente',
    rating: 5,
    text:   'Los BCAA Recovery Complex cambiaron mi recuperación post-maratón. Antes necesitaba 5 días para volver a entrenar, ahora en 48 horas estoy al 100%. El envío express en 24h es un plus que no esperaba.',
  },
];
