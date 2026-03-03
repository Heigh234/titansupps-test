/**
 * app/admin/products/ProductStatusBadge.tsx
 *
 * Badge visual del estado de un producto.
 * Componente puramente presentacional — sin estado, sin efectos.
 * Consume STATUS_CONFIG para mantener los colores centralizados en data.ts.
 *
 * Estructura idéntica a:
 *   app/admin/orders/StatusBadge.tsx   (estado de pedido)
 *   app/admin/users/SegmentBadge.tsx   (segmento de cliente)
 *
 * Usado en: ProductsTable (columna Estado de cada fila).
 * Preparado para usarse también en un futuro ProductDetailModal.
 */

import { STATUS_CONFIG } from './data';
import type { ProductStatus } from './types';

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

export default function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${cfg.bg} ${cfg.color} ${cfg.border}`}
    >
      {cfg.label}
    </span>
  );
}
