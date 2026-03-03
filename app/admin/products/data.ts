/**
 * app/admin/products/data.ts
 *
 * Datos y configuración del módulo de Gestión de Inventario.
 *
 * Exporta:
 *   MOCK_PRODUCTS   → 4 productos de ejemplo con variedad de estados y stock.
 *                     En producción se reemplaza por fetch/useQuery al endpoint de inventario.
 *   PAGE_SIZE       → Productos por página en la tabla.
 *   STATUS_CONFIG   → Colores, etiquetas de cada estado de producto.
 *                     Fuente única de verdad — usada por ProductStatusBadge y ProductsTable.
 *   LOW_STOCK_LIMIT → Umbral por debajo del cual el stock se considera crítico (rojo).
 *
 * Estructura análoga a app/admin/orders/data.ts y app/admin/users/data.ts.
 */

import type { Product, ProductStatus } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

export const PAGE_SIZE = 8;

/**
 * Umbral de stock bajo. Si stock < LOW_STOCK_LIMIT el número se pinta en rojo.
 * Centralizado aquí para que ProductsTable y cualquier lógica futura lo usen
 * sin hardcodear el 20 en varios sitios.
 */
export const LOW_STOCK_LIMIT = 20;

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  ProductStatus,
  { label: string; bg: string; color: string; border: string }
> = {
  active:       { label: 'Activo',     bg: 'bg-green-500/10',    color: 'text-green-500',        border: 'border-green-500/20'  },
  low_stock:    { label: 'Stock Bajo', bg: 'bg-yellow-500/10',   color: 'text-yellow-500',       border: 'border-yellow-500/20' },
  out_of_stock: { label: 'Agotado',    bg: 'bg-red-500/10',      color: 'text-red-500',          border: 'border-red-500/20'    },
  draft:        { label: 'Borrador',   bg: 'bg-titan-border/40', color: 'text-titan-text-muted', border: 'border-titan-border'  },
  archived:     { label: 'Archivado',  bg: 'bg-zinc-500/10',     color: 'text-zinc-400',         border: 'border-zinc-500/20'   },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// TODO: Reemplazar con fetch/useQuery al endpoint de inventario.
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_PRODUCTS: Product[] = [];
