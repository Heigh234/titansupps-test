/**
 * app/admin/orders/StatusBadge.tsx
 *
 * Badge visual del estado de un pedido.
 * Componente puramente presentacional — sin estado, sin efectos.
 * Consume STATUS_CONFIG para mantener los colores centralizados en data.ts.
 *
 * Usado como trigger en StatusChanger y de forma directa en OrderDetailModal.
 */

import { STATUS_CONFIG } from './data';
import type { OrderStatus } from './types';

interface StatusBadgeProps {
  status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg  = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${cfg.bg} ${cfg.color} ${cfg.border}`}
    >
      <Icon size={10} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}
