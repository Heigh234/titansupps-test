/**
 * app/admin/users/data.ts
 *
 * Datos y configuración del módulo de Gestión de Clientes.
 *
 * Exporta:
 *   MOCK_CLIENTS         → 20 clientes con historial de pedidos realista.
 *                          En producción se reemplaza por fetch/useQuery a la API.
 *   PAGE_SIZE            → Clientes por página en la tabla.
 *   SEGMENT_CONFIG       → Colores, iconos y descripción de cada segmento.
 *   STATUS_ORDER_CONFIG  → Colores de estado de pedido para el modal.
 *   ALL_SEGMENTS         → Array tipado de todos los segmentos (para iteración).
 */

import {
  Sparkles, UserCheck, UserX, Star,
} from 'lucide-react';
import type { Client, Segment } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

export const PAGE_SIZE = 8;

// ─────────────────────────────────────────────────────────────────────────────
// SEGMENT CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const SEGMENT_CONFIG: Record<Segment, {
  label:  string;
  color:  string;
  bg:     string;
  border: string;
  icon:   React.ElementType;
  desc:   string;
}> = {
  vip:        { label: 'VIP',        color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30', icon: Sparkles,  desc: '+10 pedidos o >€1.000 gastados' },
  activo:     { label: 'Activo',     color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30', icon: UserCheck, desc: 'Compra regularmente' },
  nuevo:      { label: 'Nuevo',      color: 'text-blue-400',  bg: 'bg-blue-400/10',  border: 'border-blue-400/30',  icon: Star,      desc: 'Primer pedido reciente' },
  suspendido: { label: 'Suspendido', color: 'text-red-400',   bg: 'bg-red-400/10',   border: 'border-red-400/30',   icon: UserX,     desc: 'Acceso restringido' },
};

export const ALL_SEGMENTS = Object.keys(SEGMENT_CONFIG) as Segment[];

// ─────────────────────────────────────────────────────────────────────────────
// STATUS ORDER CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const STATUS_ORDER_CONFIG = {
  entregado:  { label: 'Entregado',  color: 'text-green-400'  },
  enviado:    { label: 'Enviado',    color: 'text-purple-400' },
  procesando: { label: 'Procesando', color: 'text-blue-400'   },
  cancelado:  { label: 'Cancelado',  color: 'text-red-400'    },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — 20 clientes con historial de pedidos realista
// En producción: reemplazar por fetch/useQuery al endpoint de clientes.
// ─────────────────────────────────────────────────────────────────────────────

// TODO: Reemplazar con fetch/useQuery al endpoint de clientes.
export const MOCK_CLIENTS: Client[] = [];
