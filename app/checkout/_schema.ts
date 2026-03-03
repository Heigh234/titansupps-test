/**
 * app/checkout/_schema.ts — Esquema de validación del checkout
 * ──────────────────────────────────────────────────────────────
 * Centraliza el esquema Zod y el tipo inferido en un solo lugar.
 *
 * DECISIÓN: separar el schema del page.tsx tiene dos ventajas concretas:
 *   1. El page.tsx deja de importar `* as z from 'zod'` directamente —
 *      el schema ya viene listo para pasar al zodResolver.
 *   2. Si en el futuro se añaden campos (teléfono, estado, código postal),
 *      el cambio ocurre en un único archivo sin tocar la lógica del page.
 *
 * CONVENCIÓN: el prefijo "_" indica archivo de infraestructura de la ruta,
 * no un componente ni una página. Sigue el mismo patrón de _data.ts y _types.ts
 * establecido en about/, account/, admin/settings/, etc.
 */

import * as z from 'zod';

export const checkoutSchema = z.object({
  email: z.string().email({ message: 'Email inválido. Necesitamos contactarte.' }),
  firstName: z.string().min(2, { message: 'Nombre requerido' }),
  lastName: z.string().min(2, { message: 'Apellido requerido' }),
  address: z.string().min(5, { message: 'Dirección requerida para el envío' }),
  city: z.string().min(2, { message: 'Ciudad requerida' }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
