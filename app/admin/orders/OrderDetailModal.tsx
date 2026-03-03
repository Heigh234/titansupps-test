'use client';

/**
 * app/admin/orders/OrderDetailModal.tsx
 *
 * Modal de detalle completo de un pedido.
 * Cierra con: click en backdrop · tecla Escape · botón X del header.
 *
 * Secciones del modal:
 *   1. Header sticky: ID del pedido, StatusChanger, botón cierre
 *   2. Timeline del envío (oculto si está cancelado)
 *   3. Banner de cancelación con nota (solo si está cancelado)
 *   4. Grid de información: cliente · dirección · método de pago y tracking
 *   5. Lista de productos con desglose de precios y total
 *   6. Nota interna (solo si existe y el pedido no está cancelado)
 *
 * Decisión de diseño: el timeline muestra solo los 4 estados del flujo normal
 * (pendiente → procesando → enviado → entregado). El estado "cancelado" no
 * tiene posición en la barra — se comunica con un banner de alerta roja.
 */

import { useEffect } from 'react';
import {
  X, XCircle, User, MapPin, CreditCard,
  Calendar, Truck, ShoppingBag,
} from 'lucide-react';
import { STATUS_CONFIG } from './data';
import { formatDate, formatTime } from './utils';
import StatusChanger from './StatusChanger';
import type { Order, OrderStatus } from './types';

// Timeline: solo estados del flujo normal (cancelado se trata aparte)
const TIMELINE: { status: OrderStatus; label: string }[] = [
  { status: 'pendiente',  label: 'Pedido recibido' },
  { status: 'procesando', label: 'En preparación'  },
  { status: 'enviado',    label: 'En camino'        },
  { status: 'entregado',  label: 'Entregado'        },
];

// Índice de progreso para cada estado (cancelado = -1 → fuera del flujo)
const STATUS_ORDER: Record<OrderStatus, number> = {
  pendiente: 0, procesando: 1, enviado: 2, entregado: 3, cancelado: -1,
};

interface OrderDetailModalProps {
  order:          Order;
  onClose:        () => void;
  onStatusChange: (id: string, next: OrderStatus) => void;
}

export default function OrderDetailModal({ order, onClose, onStatusChange }: OrderDetailModalProps) {

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const currentIdx   = STATUS_ORDER[order.status];
  const isCancelled  = order.status === 'cancelado';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle del pedido ${order.id}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-titan-surface border border-titan-border shadow-2xl no-scrollbar">

        {/* ── HEADER STICKY ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-titan-border bg-titan-surface">
          <div className="flex items-center gap-4">
            <h2 className="font-heading text-2xl uppercase tracking-wider text-titan-text">
              {order.id}
            </h2>
            <StatusChanger
              orderId={order.id}
              current={order.status}
              onChange={onStatusChange}
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-titan-text-muted hover:text-white hover:bg-titan-bg transition-colors"
            aria-label="Cerrar detalle"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* ── TIMELINE (solo si no está cancelado) ── */}
          {!isCancelled && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-titan-text-muted mb-4">
                Estado del envío
              </p>
              <div className="relative flex items-start">
                {TIMELINE.map((step, idx) => {
                  const done   = idx <= currentIdx;
                  const active = idx === currentIdx;
                  const cfg    = STATUS_CONFIG[step.status];
                  const Icon   = cfg.icon;
                  return (
                    <div key={step.status} className="flex-1 flex flex-col items-center relative">
                      {/* Línea conectora hacia la derecha */}
                      {idx < TIMELINE.length - 1 && (
                        <div
                          className={`absolute top-4 left-1/2 w-full h-[2px] ${done ? 'bg-titan-accent' : 'bg-titan-border'}`}
                          aria-hidden="true"
                        />
                      )}
                      {/* Ícono del paso */}
                      <div className={`relative z-10 w-8 h-8 flex items-center justify-center border-2 ${
                        active
                          ? 'border-titan-accent bg-titan-accent text-black'
                          : done
                          ? 'border-titan-accent bg-titan-accent/20 text-titan-accent'
                          : 'border-titan-border bg-titan-bg text-titan-text-muted'
                      }`}>
                        <Icon size={14} aria-hidden="true" />
                      </div>
                      {/* Etiqueta del paso */}
                      <div className="mt-2 text-center px-1">
                        <p className={`text-[10px] font-bold uppercase tracking-wider leading-tight ${
                          done ? 'text-titan-text' : 'text-titan-text-muted'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── BANNER CANCELADO ── */}
          {isCancelled && (
            <div className="flex items-center gap-3 p-4 border border-red-500/30 bg-red-500/5">
              <XCircle size={18} className="text-red-400 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-red-400 uppercase tracking-wider">Pedido Cancelado</p>
                {order.notes && (
                  <p className="text-xs text-titan-text-muted mt-0.5">{order.notes}</p>
                )}
              </div>
            </div>
          )}

          {/* ── GRID DE INFORMACIÓN ── */}
          <div className="grid sm:grid-cols-3 gap-4">

            {/* Cliente */}
            <div className="bg-titan-bg border border-titan-border p-4 space-y-2">
              <div className="flex items-center gap-2 text-titan-accent mb-3">
                <User size={14} aria-hidden="true" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Cliente</p>
              </div>
              <p className="text-sm font-bold text-titan-text">{order.customer.name}</p>
              <p className="text-xs text-titan-text-muted">{order.customer.email}</p>
              <p className="text-xs text-titan-text-muted">{order.customer.phone}</p>
            </div>

            {/* Dirección */}
            <div className="bg-titan-bg border border-titan-border p-4 space-y-2">
              <div className="flex items-center gap-2 text-titan-accent mb-3">
                <MapPin size={14} aria-hidden="true" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Dirección</p>
              </div>
              <p className="text-sm font-bold text-titan-text">{order.address.street}</p>
              <p className="text-xs text-titan-text-muted">{order.address.city}</p>
              <p className="text-xs text-titan-text-muted">{order.address.country}</p>
            </div>

            {/* Pago & Fecha & Tracking */}
            <div className="bg-titan-bg border border-titan-border p-4 space-y-2">
              <div className="flex items-center gap-2 text-titan-accent mb-3">
                <CreditCard size={14} aria-hidden="true" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Pago</p>
              </div>
              <p className="text-sm font-bold text-titan-text">{order.paymentMethod}</p>
              <div className="flex items-center gap-1 text-xs text-titan-text-muted">
                <Calendar size={11} aria-hidden="true" />
                {formatDate(order.date)} — {formatTime(order.date)}
              </div>
              {order.trackingCode && (
                <div className="flex items-center gap-1 text-xs text-titan-accent font-bold">
                  <Truck size={11} aria-hidden="true" />
                  {order.trackingCode}
                </div>
              )}
            </div>
          </div>

          {/* ── PRODUCTOS ── */}
          <div>
            <div className="flex items-center gap-2 text-titan-accent mb-3">
              <ShoppingBag size={14} aria-hidden="true" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Productos</p>
            </div>
            <div className="border border-titan-border divide-y divide-titan-border">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4">
                  <div className="relative w-14 h-14 bg-titan-bg border border-titan-border flex-shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-titan-text">{item.name}</p>
                    <p className="text-xs text-titan-text-muted">{item.variant}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-titan-text-muted">×{item.qty}</p>
                    <p className="text-sm font-bold text-titan-text">
                      €{(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Total del pedido */}
              <div className="flex justify-between items-center p-4 bg-titan-bg">
                <p className="text-sm font-bold uppercase tracking-wider text-titan-text-muted">
                  Total del pedido
                </p>
                <p className="font-heading text-2xl text-titan-accent">
                  €{order.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* ── NOTA INTERNA (solo si existe y no está cancelado) ── */}
          {order.notes && !isCancelled && (
            <div className="p-4 border border-titan-border bg-titan-bg">
              <p className="text-[10px] font-bold uppercase tracking-widest text-titan-text-muted mb-1">
                Nota interna
              </p>
              <p className="text-sm text-titan-text-muted">{order.notes}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
