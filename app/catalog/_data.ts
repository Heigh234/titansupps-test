/**
 * app/catalog/_data.ts
 *
 * Los productos ahora se obtienen en tiempo real desde Supabase.
 * Ver: actions/products.ts → getProducts()
 * Ver: components/catalog/CatalogGrid.tsx
 *
 * Este archivo se mantiene para no romper imports existentes.
 * ALL_PRODUCTS ya no se usa — CatalogGrid consume getProducts() directamente.
 */

export interface CatalogProduct {
  id:        string;
  title:     string;
  price:     number;
  category:  string;
  brand:     string;
  image:     string;
  badge?:    string;
  createdAt: number;
}

// Mantenido por compatibilidad. No se usa — CatalogGrid usa getProducts() de Supabase.
export const ALL_PRODUCTS: CatalogProduct[] = [];
