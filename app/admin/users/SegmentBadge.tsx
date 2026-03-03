/**
 * app/admin/users/SegmentBadge.tsx
 *
 * Badge visual de segmento de cliente.
 * Componente puramente presentacional — sin estado, sin efectos.
 * Consume SEGMENT_CONFIG para mantener los colores centralizados en data.ts.
 *
 * Usado en: SegmentChanger (como trigger del dropdown) y ClientsTable.
 */

import { SEGMENT_CONFIG } from './data';
import type { Segment } from './types';

interface SegmentBadgeProps {
  segment: Segment;
}

export default function SegmentBadge({ segment }: SegmentBadgeProps) {
  const cfg  = SEGMENT_CONFIG[segment];
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
