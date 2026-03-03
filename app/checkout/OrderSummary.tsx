'use client';

/**
 * OrderSummary.tsx — Sidebar de resumen de pedido
 * ─────────────────────────────────────────────────
 * MEJORA RESPECTO AL ORIGINAL:
 * El original usaba un item hardcodeado de placeholder ("Titan Whey Isolate / $59.99").
 * Este componente lee los datos reales de useCartStore, exactamente igual que
 * CartDrawer.tsx — el usuario ve los mismos items que tenía en su carrito.
 *
 * LÓGICA DE ENVÍO:
 * - Envío gratis si el subtotal supera $75 (incentivo de pedido mínimo)
 * - $5.00 Express por defecto
 * Constante FREE_SHIPPING_THRESHOLD centralizada para modificación fácil.
 *
 * ESTADO VACÍO:
 * Si el carrito está vacío en checkout (caso edge: borrado manualmente),
 * muestra un mensaje con link de retorno al catálogo en lugar de un summary
 * roto con $0.00.
 *
 * sticky top-28: el header de checkout tiene py-6 (≈ 96px) + border.
 * top-28 (112px) garantiza que el aside no quede debajo del header al hacer
 * scroll en pantallas con contenido alto en el formulario.
 */

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 5;

export default function OrderSummary() {
  const items        = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const subtotal     = getTotalPrice();
  const shipping     = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total        = subtotal + shipping;

  return (
    <aside className="w-full lg:w-[400px]" aria-label="Resumen de tu pedido">
      <div className="bg-titan-surface border border-titan-border p-6 sticky top-28">

        <h2 className="font-heading text-2xl text-titan-text uppercase mb-6 border-b border-titan-border pb-4">
          Resumen de Orden
        </h2>

        {/* Estado vacío */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <ShoppingBag size={32} className="text-titan-text-muted" />
            <p className="text-titan-text-muted text-sm">Tu carrito está vacío.</p>
            <Link
              href="/catalog"
              className="text-xs font-bold uppercase tracking-widest text-titan-accent hover:underline"
            >
              Volver al Arsenal
            </Link>
          </div>
        ) : (
          <>
            {/* Lista de items del carrito real */}
            <ul className="space-y-4 mb-6" role="list">
              {items.map((item) => (
                <li key={`${item.id}-${item.variant ?? 'default'}`} className="flex gap-4">
                  {/* Thumbnail del producto */}
                  <div className="w-16 h-20 bg-titan-bg border border-titan-border relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                    {/* Badge de cantidad */}
                    {item.quantity > 1 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-titan-accent text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    )}
                  </div>

                  {/* Info del item */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-titan-text font-medium text-sm leading-tight line-clamp-2">
                      {item.name}
                    </h4>
                    {item.variant && (
                      <p className="text-titan-text-muted text-xs mt-1">{item.variant}</p>
                    )}
                    <p className="text-titan-text-muted text-xs mt-0.5">
                      Cant: {item.quantity}
                    </p>
                    <p className="text-titan-accent font-bold text-sm mt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Desglose de totales */}
            <div className="space-y-3 border-t border-titan-border pt-4 mb-4 text-sm text-titan-text-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-titan-text">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío {shipping === 0 ? '(Gratis)' : '(Express)'}</span>
                <span className={shipping === 0 ? 'text-green-500 font-bold' : 'text-titan-text'}>
                  {shipping === 0 ? '¡Gratis!' : `$${SHIPPING_COST.toFixed(2)}`}
                </span>
              </div>
              {/* Incentivo de envío gratis si aún no alcanza el mínimo */}
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="text-[10px] text-titan-accent uppercase tracking-widest">
                  +${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} para envío gratis
                </p>
              )}
            </div>

            {/* Total final */}
            <div className="flex justify-between items-end border-t border-titan-border pt-4">
              <span className="text-titan-text uppercase tracking-wider text-sm">Total a Pagar</span>
              <span className="font-heading text-3xl text-titan-accent">${total.toFixed(2)}</span>
            </div>
          </>
        )}

      </div>
    </aside>
  );
}
