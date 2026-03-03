'use client';

/**
 * app/admin/users/ClientProfileModal.tsx
 *
 * Modal de perfil completo de un cliente.
 * Se monta sobre un backdrop con z-index alto y cierra:
 *   - Click en el backdrop
 *   - Tecla Escape (listener en window)
 *   - Botón X del header
 *
 * Secciones del modal:
 *   1. Header sticky: avatar, nombre, ID, SegmentChanger, botón cierre
 *   2. Métricas clave: pedidos, total gastado, ticket medio, tasa de éxito
 *   3. Datos de contacto: email, teléfono, ciudad
 *   4. Actividad: fecha registro, última compra, producto favorito
 *   5. Nota interna (solo si existe)
 *   6. Historial de pedidos con total acumulado
 *   7. Acciones rápidas: enviar email, llamar
 *
 * Props:
 *   client          → El cliente a mostrar (nunca null aquí — el padre controla la visibilidad)
 *   onClose         → Callback para cerrar el modal
 *   onSegmentChange → Callback para cambiar el segmento (sincronizado con la tabla)
 */

import { useEffect } from 'react';
import {
  X, Mail, Phone, MapPin, Calendar,
  ShoppingBag, TrendingUp, CreditCard,
  Package, Clock, Users,
} from 'lucide-react';
import { STATUS_ORDER_CONFIG } from './data';
import { formatDate, timeAgo } from './utils';
import Avatar from './Avatar';
import SegmentChanger from './SegmentChanger';
import type { Client, Segment } from './types';

interface ClientProfileModalProps {
  client:          Client;
  onClose:         () => void;
  onSegmentChange: (id: string, next: Segment) => void;
}

export default function ClientProfileModal({
  client,
  onClose,
  onSegmentChange,
}: ClientProfileModalProps) {

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Tasa de éxito: % de pedidos entregados sobre el total
  const deliveredOrders = client.orders.filter((o) => o.status === 'entregado');
  const successRate = client.orders.length > 0
    ? Math.round((deliveredOrders.length / client.orders.length) * 100)
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Perfil de ${client.name}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-titan-surface border border-titan-border shadow-2xl no-scrollbar">

        {/* ── HEADER STICKY ── */}
        <div className="sticky top-0 z-10 bg-titan-surface border-b border-titan-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar client={client} size="sm" />
            <div>
              <h2 className="font-heading text-xl uppercase tracking-wider text-titan-text leading-none">
                {client.name}
              </h2>
              <p className="text-[11px] text-titan-text-muted mt-0.5">{client.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SegmentChanger
              clientId={client.id}
              current={client.segment}
              onChange={onSegmentChange}
            />
            <button
              onClick={onClose}
              className="p-2 text-titan-text-muted hover:text-white hover:bg-titan-bg transition-colors"
              aria-label="Cerrar perfil"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* ── MÉTRICAS CLAVE ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: ShoppingBag, label: 'Pedidos',       value: client.totalOrders.toString() },
              { icon: TrendingUp,  label: 'Total gastado', value: `€${client.totalSpent.toFixed(0)}` },
              { icon: CreditCard,  label: 'Ticket medio',  value: `€${client.avgOrderValue.toFixed(0)}` },
              { icon: Package,     label: 'Tasa éxito',    value: `${successRate}%` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-titan-bg border border-titan-border p-4 text-center">
                <Icon size={16} className="text-titan-accent mx-auto mb-2" aria-hidden="true" />
                <p className="font-heading text-2xl text-titan-text leading-none">{value}</p>
                <p className="text-[10px] text-titan-text-muted uppercase tracking-widest mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* ── DATOS DE CONTACTO + ACTIVIDAD ── */}
          <div className="grid sm:grid-cols-2 gap-4">

            {/* Contacto */}
            <div className="bg-titan-bg border border-titan-border p-4 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-titan-accent flex items-center gap-2">
                <Users size={12} aria-hidden="true" /> Contacto
              </p>
              <div className="space-y-2">
                <a
                  href={`mailto:${client.email}`}
                  className="flex items-center gap-2 text-sm text-titan-text hover:text-titan-accent transition-colors group"
                >
                  <Mail size={13} className="text-titan-text-muted group-hover:text-titan-accent transition-colors flex-shrink-0" aria-hidden="true" />
                  {client.email}
                </a>
                <a
                  href={`tel:${client.phone}`}
                  className="flex items-center gap-2 text-sm text-titan-text hover:text-titan-accent transition-colors group"
                >
                  <Phone size={13} className="text-titan-text-muted group-hover:text-titan-accent transition-colors flex-shrink-0" aria-hidden="true" />
                  {client.phone}
                </a>
                <div className="flex items-center gap-2 text-sm text-titan-text-muted">
                  <MapPin size={13} className="flex-shrink-0" aria-hidden="true" />
                  {client.city}, {client.country}
                </div>
              </div>
            </div>

            {/* Actividad */}
            <div className="bg-titan-bg border border-titan-border p-4 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-titan-accent flex items-center gap-2">
                <Calendar size={12} aria-hidden="true" /> Actividad
              </p>
              <div className="space-y-2.5">
                <div>
                  <p className="text-[10px] text-titan-text-muted uppercase tracking-wider">Registrado</p>
                  <p className="text-sm text-titan-text font-medium">
                    {formatDate(client.registered)} · {timeAgo(client.registered)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-titan-text-muted uppercase tracking-wider">Última compra</p>
                  <p className="text-sm text-titan-text font-medium">
                    {formatDate(client.lastPurchase)} · {timeAgo(client.lastPurchase)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-titan-text-muted uppercase tracking-wider">Producto favorito</p>
                  <p className="text-sm text-titan-accent font-bold">{client.favoriteProduct}</p>
                </div>
              </div>
            </div>

          </div>

          {/* ── NOTA INTERNA ── */}
          {client.notes && (
            <div className="p-4 border border-amber-500/20 bg-amber-500/5 flex gap-3">
              <Clock size={14} className="text-amber-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1">
                  Nota interna
                </p>
                <p className="text-sm text-titan-text-muted">{client.notes}</p>
              </div>
            </div>
          )}

          {/* ── HISTORIAL DE PEDIDOS ── */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-titan-accent flex items-center gap-2 mb-3">
              <ShoppingBag size={12} aria-hidden="true" />
              Últimos pedidos ({client.orders.length})
            </p>

            <div className="border border-titan-border divide-y divide-titan-border">
              {client.orders.map((order) => {
                const statusCfg = STATUS_ORDER_CONFIG[order.status];
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 gap-4 hover:bg-titan-bg/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-heading text-base text-titan-accent">{order.id}</span>
                        <span className={`text-[10px] font-bold uppercase ${statusCfg.color}`}>
                          · {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-titan-text-muted truncate">{order.items}</p>
                      <p className="text-[11px] text-titan-text-muted mt-0.5">{formatDate(order.date)}</p>
                    </div>
                    <p className="font-heading text-xl text-titan-text flex-shrink-0">
                      €{order.total.toFixed(2)}
                    </p>
                  </div>
                );
              })}

              {/* Total acumulado */}
              <div className="flex justify-between items-center p-4 bg-titan-bg">
                <p className="text-sm font-bold uppercase tracking-wider text-titan-text-muted">
                  Total acumulado
                </p>
                <p className="font-heading text-2xl text-titan-accent">
                  €{client.totalSpent.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* ── ACCIONES RÁPIDAS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-titan-border">
            <a
              href={`mailto:${client.email}?subject=TitanSupps — Mensaje para ${client.name}`}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-titan-accent text-white font-bold text-sm uppercase tracking-wider hover:bg-titan-accent-hover transition-colors shadow-[0_0_15px_rgba(255,94,0,0.2)]"
            >
              <Mail size={16} aria-hidden="true" />
              Enviar Email
            </a>
            <a
              href={`tel:${client.phone}`}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-titan-border text-titan-text font-bold text-sm uppercase tracking-wider hover:border-titan-accent hover:text-titan-accent transition-colors"
            >
              <Phone size={16} aria-hidden="true" />
              Llamar
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
