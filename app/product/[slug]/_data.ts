/**
 * app/product/[slug]/_data.ts
 *
 * Los productos ahora se obtienen desde Supabase.
 * Ver: actions/products.ts → getProductBySlug()
 * Ver: app/product/[slug]/page.tsx
 *
 * Este archivo se mantiene para no romper imports existentes.
 * PRODUCT_DETAIL_MAP ya no se usa — la page usa getProductBySlug() directamente.
 */

export interface ProductDetail {
  id:          string;
  name:        string;
  slug:        string;
  price:       number;
  category:    string;
  brand:       string;
  badge?:      string;
  description: string;
  rating:      number;
  reviews:     number;
  stock:       number;
  images:      string[];
  variants:    string[];
  ingredients: string;
}

// Mantenido por compatibilidad. No se usa — page.tsx usa getProductBySlug() de Supabase.
export const PRODUCT_DETAIL_MAP: Record<string, ProductDetail> = {};

export function getProductBySlug(slug: string): ProductDetail | undefined {
  return PRODUCT_DETAIL_MAP[slug];
}

export const ALL_PRODUCT_SLUGS = Object.keys(PRODUCT_DETAIL_MAP);
