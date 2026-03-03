/**
 * types.ts — Tipos compartidos para admin/products/new
 * ──────────────────────────────────────────────────────
 * RAZÓN DE EXISTENCIA:
 * ProductFormValues se infiere del schema Zod en page.tsx y necesita
 * ser compartido con VariantsFieldArray.tsx sin crear una dependencia
 * circular (VariantsFieldArray → page) ni duplicar el schema.
 *
 * PATRÓN: El schema Zod permanece en page.tsx (es el propietario del
 * formulario). Este archivo solo exporta el tipo inferido para que
 * los subcomponentes puedan tipar sus props correctamente.
 */

import * as z from 'zod';

// ─── Schema Zod (fuente de verdad) ───────────────────────────────────────────
// Duplicado aquí desde page.tsx para que types.ts sea el único import
// necesario en los subcomponentes. page.tsx importará de aquí también.
export const productSchema = z.object({
  name:         z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description:  z.string().min(20, 'La descripción es muy corta. Vende el producto.'),
  price:        z.coerce.number().min(0.01, 'El precio debe ser mayor a 0'),
  comparePrice: z.coerce.number().optional(),
  sku:          z.string().min(3, 'SKU requerido para logística'),
  stock:        z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
  category:     z.string().min(1, 'Selecciona una categoría'),
  status:       z.enum(['active', 'draft', 'archived']),
  variants: z.array(
    z.object({
      name:    z.string().min(1, 'Nombre de variante requerido'),
      options: z.string().min(1, 'Opciones requeridas (separadas por coma)'),
    })
  ).optional(),
});

// ─── Tipo inferido ────────────────────────────────────────────────────────────
export type ProductFormValues = z.infer<typeof productSchema>;
