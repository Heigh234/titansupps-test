/**
 * app/admin/products/types.ts
 *
 * Tipos compartidos para el módulo de Gestión de Inventario.
 *
 * ACTUALIZACIÓN: Se añaden campos opcionales usados por ProductEditModal:
 *   - description:  para pre-poblar el textarea de descripción
 *   - comparePrice: para pre-poblar el precio de comparación
 *   - variants:     para pre-poblar la lista de variantes
 */

export type ProductStatus = 'active' | 'low_stock' | 'out_of_stock' | 'draft' | 'archived';

export interface Product {
  id:           string;
  name:         string;
  sku:          string;
  price:        number;
  stock:        number;
  status:       ProductStatus;
  category:     string;
  image:        string;
  // Campos opcionales usados solo en el modal de edición
  description?:  string;
  comparePrice?: number;
  variants?:     { name: string; options: string[] }[];
}
