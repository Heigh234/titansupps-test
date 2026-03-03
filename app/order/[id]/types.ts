/**
 * app/order/[id]/types.ts — Tipos del módulo de detalle de pedido
 * ──────────────────────────────────────────────────────────────────
 * Centraliza interfaces + configuración de estado + iconografía del timeline.
 * Importado por data.ts, page.tsx y todos los sub-componentes.
 *
 * STATUS_CONFIG y TIMELINE_ICONS viven aquí (y no en data.ts) porque son
 * configuración de presentación —mapean un valor de dominio a clases CSS e
 * iconos— no datos de negocio.
 */

import { Package, CheckCircle, Clock, Truck } from 'lucide-react';

/* ─── INTERFACES DE DOMINIO ─────────────────────────────────────── */

export interface OrderItem {
  id: string;
  nombre: string;
  variante: string;
  precio: number;
  cantidad: number;
  image: string;
  slug: string;
}

export interface TimelineStep {
  estado: string;
  fecha: string;
  completado: boolean;
  desc: string;
}

export type OrderStatus = 'confirmado' | 'preparacion' | 'en_camino' | 'entregado';

export interface OrderData {
  id: string;
  fecha: string;
  fechaEstimada: string | null;
  status: OrderStatus;
  tracking: string;
  transportista: string;
  items: OrderItem[];
  envio: {
    nombre: string;
    direccion: string;
    ciudad: string;
    pais: string;
    cp: string;
  };
  pago: {
    metodo: string;
    subtotal: number;
    costoEnvio: number;
    descuento: number;
    total: number;
    moneda: string;
  };
  timeline: TimelineStep[];
}

/* ─── CONFIGURACIÓN DE PRESENTACIÓN ────────────────────────────── */

/**
 * Mapea cada estado del pedido a su color y etiqueta de badge.
 * Usado en el header de la página para el chip de estado.
 */
export const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  confirmado:  { label: 'Confirmado',      color: 'text-blue-400',    bg: 'bg-blue-400/10 border-blue-400/20'          },
  preparacion: { label: 'En Preparación',  color: 'text-yellow-400',  bg: 'bg-yellow-400/10 border-yellow-400/20'      },
  en_camino:   { label: 'En Camino',       color: 'text-titan-accent', bg: 'bg-titan-accent/10 border-titan-accent/20' },
  entregado:   { label: 'Entregado',       color: 'text-green-500',   bg: 'bg-green-500/10 border-green-500/20'        },
};

/**
 * Iconos del timeline en orden: Confirmado → Preparación → En Camino → Entregado.
 * El índice del array coincide con el índice del paso en order.timeline.
 */
export const TIMELINE_ICONS = [Package, Clock, Truck, CheckCircle] as const;
