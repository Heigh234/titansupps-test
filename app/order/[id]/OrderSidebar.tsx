/**
 * app/order/[id]/OrderSidebar.tsx — Columna lateral del detalle de pedido
 * ─────────────────────────────────────────────────────────────────────────
 * Agrupa los tres elementos de la columna derecha del grid:
 *
 *  1. Resumen de pago — subtotal, envío, descuento opcional y total.
 *     El envío gratuito se renderiza en verde. El descuento solo aparece
 *     si `pago.descuento > 0` para no mostrar una línea vacía.
 *
 *  2. Dirección de envío — nombre, dirección, CP + ciudad, país.
 *     Si el pedido está "en_camino", añade el bloque de transportista
 *     y número de tracking con fuente mono para legibilidad.
 *
 *  3. Botón de retorno — vuelve a /account (listado de pedidos).
 *
 * Separar el sidebar en su propio componente permite que page.tsx
 * sea un orquestador de layout sin ninguna lógica de presentación.
 */

import Link from 'next/link';
import { CreditCard, MapPin, Download, ArrowLeft } from 'lucide-react';
import type { OrderData } from './types';

interface OrderSidebarProps {
  order: OrderData;
}

export default function OrderSidebar({ order }: OrderSidebarProps) {
  return (
    <div className="space-y-6">

      {/* ── 1. RESUMEN DE PAGO ── */}
      <section
        aria-labelledby="payment-heading"
        className="border border-titan-border bg-titan-surface p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <CreditCard size={16} className="text-titan-accent" />
          <h2
            id="payment-heading"
            className="font-heading text-lg text-titan-text uppercase tracking-wider"
          >
            Resumen
          </h2>
        </div>

        <div className="space-y-3 text-sm">
          {/* Subtotal */}
          <div className="flex justify-between">
            <span className="text-titan-text-muted">Subtotal</span>
            <span className="text-titan-text font-bold">
              {order.pago.moneda}{order.pago.subtotal.toFixed(2)}
            </span>
          </div>

          {/* Envío — verde si es gratuito */}
          <div className="flex justify-between">
            <span className="text-titan-text-muted">Envío</span>
            <span className={order.pago.costoEnvio === 0 ? 'text-green-500 font-bold' : 'text-titan-text font-bold'}>
              {order.pago.costoEnvio === 0
                ? 'Gratis'
                : `${order.pago.moneda}${order.pago.costoEnvio.toFixed(2)}`}
            </span>
          </div>

          {/* Descuento — solo si aplica */}
          {order.pago.descuento > 0 && (
            <div className="flex justify-between">
              <span className="text-titan-text-muted">Descuento</span>
              <span className="text-green-500 font-bold">
                -{order.pago.moneda}{order.pago.descuento.toFixed(2)}
              </span>
            </div>
          )}

          {/* Separador */}
          <div className="h-px bg-titan-border" />

          {/* Total */}
          <div className="flex justify-between items-end">
            <span className="font-bold text-titan-text uppercase tracking-wider">Total</span>
            <span className="font-heading text-2xl text-titan-accent">
              {order.pago.moneda}{order.pago.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Método de pago */}
        <div className="mt-5 pt-4 border-t border-titan-border">
          <p className="text-[10px] text-titan-text-muted uppercase tracking-widest mb-1">
            Método de pago
          </p>
          <p className="text-sm font-bold text-titan-text">{order.pago.metodo}</p>
        </div>

        {/* CTA descarga de factura */}
        <button className="w-full mt-5 flex items-center justify-center gap-2 py-3 border border-titan-border text-titan-text-muted hover:border-titan-accent hover:text-titan-accent transition-colors text-xs font-bold uppercase tracking-widest">
          <Download size={13} />
          Descargar factura
        </button>
      </section>

      {/* ── 2. DIRECCIÓN DE ENVÍO ── */}
      <section
        aria-labelledby="shipping-heading"
        className="border border-titan-border bg-titan-surface p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <MapPin size={16} className="text-titan-accent" />
          <h2
            id="shipping-heading"
            className="font-heading text-lg text-titan-text uppercase tracking-wider"
          >
            Dirección de Envío
          </h2>
        </div>

        <div className="text-sm space-y-1 text-titan-text-muted">
          <p className="font-bold text-titan-text">{order.envio.nombre}</p>
          <p>{order.envio.direccion}</p>
          <p>{order.envio.cp} {order.envio.ciudad}</p>
          <p>{order.envio.pais}</p>
        </div>

        {/* Bloque de transportista — solo cuando el pedido está en camino */}
        {order.status === 'en_camino' && (
          <div className="mt-4 pt-4 border-t border-titan-border">
            <p className="text-[10px] text-titan-text-muted uppercase tracking-widest mb-2">
              Transportista
            </p>
            <p className="text-sm font-bold text-titan-text mb-1">{order.transportista}</p>
            <code className="text-xs font-mono text-titan-accent block">{order.tracking}</code>
          </div>
        )}
      </section>

      {/* ── 3. BOTÓN VOLVER AL DASHBOARD ── */}
      <Link
        href="/account"
        className="flex items-center justify-center gap-2 w-full py-4 border border-titan-border text-titan-text font-heading text-lg uppercase tracking-wider hover:border-titan-accent hover:text-titan-accent transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Mis Pedidos
      </Link>
    </div>
  );
}
