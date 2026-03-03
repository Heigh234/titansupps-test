/**
 * app/admin/orders/data.ts
 *
 * Datos y configuración del módulo de Gestión de Pedidos.
 *
 * Exporta:
 *   MOCK_ORDERS    → 18 pedidos con variedad de estados, fechas y montos reales.
 *                    En producción se reemplaza por fetch/useQuery al endpoint de pedidos.
 *   PAGE_SIZE      → Pedidos por página en la tabla.
 *   STATUS_CONFIG  → Colores, iconos y etiquetas de cada estado de pedido.
 *   ALL_STATUSES   → Array tipado de todos los estados (para iteración).
 */

import {
  Clock, RefreshCw, Truck, CheckCircle, XCircle,
} from 'lucide-react';
import type { Order, OrderStatus } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

export const PAGE_SIZE = 8;

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<OrderStatus, {
  label:  string;
  color:  string;
  bg:     string;
  border: string;
  icon:   React.ElementType;
}> = {
  pendiente:  { label: 'Pendiente',  color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', icon: Clock       },
  procesando: { label: 'Procesando', color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/30',   icon: RefreshCw   },
  enviado:    { label: 'Enviado',    color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30', icon: Truck       },
  entregado:  { label: 'Entregado',  color: 'text-green-400',  bg: 'bg-green-400/10',  border: 'border-green-400/30',  icon: CheckCircle },
  cancelado:  { label: 'Cancelado',  color: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/30',    icon: XCircle     },
};

export const ALL_STATUSES = Object.keys(STATUS_CONFIG) as OrderStatus[];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — 18 pedidos con variedad de estados, fechas y montos reales.
// En producción: reemplazar por fetch/useQuery al endpoint de pedidos.
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_ORDERS: Order[] = [
  // TODO: Reemplazar con fetch/useQuery al endpoint de pedidos.
];
