/**
 * app/order/[id]/data.ts — Mock data de pedidos
 * ───────────────────────────────────────────────
 * En producción: reemplazar ORDERS_MOCK por una llamada a la API/DB.
 * El helper getOrder() es el único punto de entrada para obtener un pedido,
 * lo que facilita el swap a fetch real sin tocar los componentes.
 *
 * Nota: el Record usa IDs en mayúsculas (ej. 'ORD-2099'). El page.tsx
 * normaliza el parámetro de URL con .toUpperCase() antes de llamar a getOrder().
 */

import type { OrderData } from './types';

export const ORDERS_MOCK: Record<string, OrderData> = {
  // TODO: Reemplazar con fetch/useQuery al endpoint de pedidos del usuario.
};

/**
 * Helper de acceso a datos.
 * En producción: `return await fetchOrderById(id)` o similar.
 */
export function getOrder(id: string): OrderData | null {
  return ORDERS_MOCK[id] ?? null;
}
