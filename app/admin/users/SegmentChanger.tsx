'use client';

/**
 * app/admin/users/SegmentChanger.tsx
 *
 * Dropdown inline para cambiar el segmento de un cliente directamente
 * desde la tabla o desde el modal de perfil, sin navegar a otra pantalla.
 *
 * Comportamiento:
 *   - Click en el badge abre el dropdown con los segmentos disponibles
 *     (excluyendo el segmento actual)
 *   - Click fuera cierra el dropdown (listener en mousedown sobre document)
 *   - Al seleccionar un nuevo segmento: llama a onChange() y cierra el dropdown
 *
 * Estado local: solo `open` (boolean). El cambio de segmento real lo gestiona
 * el componente padre a través del callback `onChange`.
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { SEGMENT_CONFIG, ALL_SEGMENTS } from './data';
import SegmentBadge from './SegmentBadge';
import type { Segment } from './types';

interface SegmentChangerProps {
  clientId: string;
  current:  Segment;
  onChange: (id: string, next: Segment) => void;
}

export default function SegmentChanger({ clientId, current, onChange }: SegmentChangerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cierra el dropdown si se hace click fuera del componente
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger: badge actual + chevron */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1"
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Cambiar segmento"
      >
        <SegmentBadge segment={current} />
        <ChevronDown
          size={12}
          className={`text-titan-text-muted transition-transform ml-0.5 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown de opciones */}
      {open && (
        <div
          role="listbox"
          aria-label="Seleccionar segmento"
          className="absolute top-[calc(100%+6px)] left-0 z-30 w-48 bg-titan-surface border border-titan-border shadow-2xl shadow-black/60"
        >
          <p className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-titan-text-muted border-b border-titan-border">
            Cambiar segmento
          </p>

          {ALL_SEGMENTS.filter((s) => s !== current).map((s) => {
            const cfg  = SEGMENT_CONFIG[s];
            const Icon = cfg.icon;
            return (
              <button
                key={s}
                role="option"
                aria-selected={false}
                onClick={() => { onChange(clientId, s); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-titan-bg ${cfg.color}`}
              >
                <Icon size={13} aria-hidden="true" />
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
