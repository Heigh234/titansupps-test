/**
 * app/order/[id]/OrderItems.tsx — Lista de artículos del pedido
 * ──────────────────────────────────────────────────────────────
 * Renderiza cada producto del pedido con imagen, nombre, variante,
 * cantidad y precio total de línea.
 *
 * Acciones contextuales en el footer del bloque:
 * - "Volver a pedir" → solo visible si el pedido está entregado.
 * - "Gestionar devolución" → siempre visible, redirige a /returns.
 * - "Soporte" → siempre visible, redirige a /contact.
 *
 * El separador entre items usa border-b condicional en lugar de un
 * <hr> para evitar el doble borde en el último elemento.
 */

import Image from 'next/image';
import Link from 'next/link';
import { Package, RefreshCw, MessageSquare } from 'lucide-react';
import type { OrderData } from './types';

interface OrderItemsProps {
  order: OrderData;
}

export default function OrderItems({ order }: OrderItemsProps) {
  const totalUnits = order.items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <section aria-labelledby="items-heading">
      <h2
        id="items-heading"
        className="font-heading text-xl text-titan-text uppercase tracking-wider mb-5"
      >
        Artículos ({totalUnits})
      </h2>

      <div className="border border-titan-border bg-titan-surface overflow-hidden">

        {/* ── Lista de productos ── */}
        {order.items.map((item, i) => (
          <div
            key={item.id}
            className={`
              flex items-center gap-5 p-5 group hover:bg-titan-surface-hover transition-colors
              ${i < order.items.length - 1 ? 'border-b border-titan-border' : ''}
            `}
          >
            {/* Imagen del producto */}
            <div className="w-20 h-20 flex-shrink-0 relative border border-titan-border overflow-hidden bg-titan-bg">
              <Image
                src={item.image}
                alt={item.nombre}
                fill
                sizes="80px"
                className="object-cover p-2 group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Info textual */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/product/${item.slug}`}
                className="font-bold text-titan-text hover:text-titan-accent transition-colors text-sm leading-snug block mb-1"
              >
                {item.nombre}
              </Link>
              <p className="text-xs text-titan-text-muted mb-2">{item.variante}</p>
              <p className="text-xs text-titan-text-muted uppercase tracking-widest font-bold">
                Cant: <span className="text-titan-text">{item.cantidad}</span>
              </p>
            </div>

            {/* Precio de línea */}
            <div className="flex-shrink-0 text-right">
              <p className="font-heading text-xl text-titan-accent">
                ${(item.precio * item.cantidad).toFixed(2)}
              </p>
              {item.cantidad > 1 && (
                <p className="text-xs text-titan-text-muted">${item.precio.toFixed(2)} c/u</p>
              )}
            </div>
          </div>
        ))}

        {/* ── Acciones del bloque ── */}
        <div className="border-t border-titan-border p-4 flex flex-wrap gap-3 bg-titan-bg/50">

          {/* Solo disponible cuando el pedido ya fue entregado */}
          {order.status === 'entregado' && (
            <button className="flex items-center gap-2 text-xs font-bold text-titan-text-muted hover:text-titan-accent transition-colors uppercase tracking-widest border border-titan-border hover:border-titan-accent/50 px-3 py-2">
              <RefreshCw size={12} />
              Volver a pedir
            </button>
          )}

          <Link
            href="/returns"
            className="flex items-center gap-2 text-xs font-bold text-titan-text-muted hover:text-titan-accent transition-colors uppercase tracking-widest border border-titan-border hover:border-titan-accent/50 px-3 py-2"
          >
            <Package size={12} />
            Gestionar devolución
          </Link>

          <Link
            href="/contact"
            className="flex items-center gap-2 text-xs font-bold text-titan-text-muted hover:text-titan-accent transition-colors uppercase tracking-widest border border-titan-border hover:border-titan-accent/50 px-3 py-2"
          >
            <MessageSquare size={12} />
            Soporte
          </Link>
        </div>
      </div>
    </section>
  );
}
