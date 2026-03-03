'use client';

/**
 * app/admin/orders/StatusChanger.tsx
 *
 * Dropdown inline para cambiar el estado de un pedido directamente
 * desde la tabla o desde el modal de detalle, sin navegar a otra pantalla.
 *
 * Comportamiento:
 *   - Click en el badge abre el dropdown con los estados disponibles
 *     (excluyendo el estado actual)
 *   - Click fuera cierra el dropdown (listener mousedown sobre document)
 *   - Al seleccionar un nuevo estado: llama a onChange() y cierra el dropdown
 *
 * Estado local: solo `open` (boolean). El cambio de estado real lo gestiona
 * el componente padre a través del callback `onChange`.
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { STATUS_CONFIG, ALL_STATUSES } from './data';
import StatusBadge from './StatusBadge';
import type { OrderStatus } from './types';

interface StatusChangerProps {
  orderId: string;
  current: OrderStatus;
  onChange: (id: string, next: OrderStatus) => void;
}

export default function StatusChanger({ orderId, current, onChange }: StatusChangerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cierra el dropdown si se hace click fuera del componente
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger: badge actual + chevron */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-1"
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Cambiar estado"
      >
        <StatusBadge status={current} />
        <ChevronDown
          size={12}
          className={`text-titan-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown de opciones */}
      {open && (
        <div
          role="listbox"
          aria-label="Seleccionar estado"
          className="absolute top-[calc(100%+6px)] left-0 z-30 w-44 bg-titan-surface border border-titan-border shadow-2xl shadow-black/60"
        >
          <p className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-titan-text-muted border-b border-titan-border">
            Cambiar estado
          </p>
          {ALL_STATUSES.filter((s) => s !== current).map((s) => {
            const cfg  = STATUS_CONFIG[s];
            const Icon = cfg.icon;
            return (
              <button
                key={s}
                role="option"
                aria-selected={false}
                onClick={() => { onChange(orderId, s); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-titan-bg ${cfg.color}`}
              >
                <Icon size={12} aria-hidden="true" />
                {cfg.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
