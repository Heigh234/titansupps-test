'use client';

/**
 * CheckoutHeader.tsx — Header minimalista de conversión
 * ───────────────────────────────────────────────────────
 * CONCEPTO "TUNNEL CHECKOUT":
 * Durante el checkout, la Navbar principal se oculta (el layout de checkout
 * está fuera del layout raíz — ver app/auth/layout.tsx como referencia).
 * Este header reemplaza la Navbar con una versión de mínimo ruido:
 *   - Izquierda: solo escape (carrito o tienda) — el usuario puede salir
 *   - Centro: logo de marca — refuerza confianza en el momento de pago
 *   - Derecha: señal de seguridad — responde la objeción implícita
 *
 * DECISIÓN DE PROPS:
 * No recibe props. Lee `toggleCart` directamente del store porque es
 * el único consumidor de esa acción en este componente y no se reutiliza
 * en otros contextos donde el carrito sea diferente.
 */

import Link from 'next/link';
import { ShieldCheck, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CheckoutHeader() {
  const toggleCart = useCartStore((state) => state.toggleCart);

  return (
    <header className="border-b border-titan-border py-6 bg-titan-surface/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">

        {/* Izquierda: escape del checkout */}
        <div className="flex items-center gap-3">
          {/* Volver al carrito — abre el drawer sin navegar */}
          <button
            onClick={() => toggleCart(true)}
            className="flex items-center gap-2 text-titan-text-muted hover:text-white transition-colors group"
            aria-label="Volver al carrito"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Carrito</span>
          </button>

          {/* Divisor visual — solo sm+ */}
          <span className="hidden sm:block w-px h-4 bg-titan-border" aria-hidden="true" />

          {/* Ir a la tienda — escape total */}
          <Link
            href="/catalog"
            className="flex items-center gap-2 text-titan-text-muted hover:text-titan-accent transition-colors group"
            aria-label="Ir a la tienda"
          >
            <ShoppingBag size={18} />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Tienda</span>
          </Link>
        </div>

        {/* Centro: logo — ancla de confianza de marca */}
        <div className="text-2xl font-heading tracking-widest text-titan-text">
          TITAN<span className="text-titan-accent">SUPPS</span>
        </div>

        {/* Derecha: señal de seguridad — reduce ansiedad de pago */}
        <div className="flex items-center gap-2 text-titan-text-muted text-sm">
          <ShieldCheck size={18} className="text-titan-accent" />
          <span className="hidden sm:inline">Pago 100% Seguro</span>
        </div>

      </div>
    </header>
  );
}
