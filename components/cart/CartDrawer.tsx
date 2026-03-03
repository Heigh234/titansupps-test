'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Evitar error de hidratación con localStorage
  useEffect(() => setMounted(true), []); // eslint-disable-line react-hooks/set-state-in-effect

  // Bloquear scroll del body cuando el carrito está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted) return null;

  // Si el usuario no está autenticado, lo redirige al login con ?redirect=/checkout
  // para que tras iniciar sesión vuelva directo al checkout sin perder el carrito.
  const handleCheckout = () => {
    toggleCart(false);
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
            aria-hidden="true"
          />

          {/* Drawer Lateral */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-titan-surface border-l border-titan-border z-[51] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <header className="p-6 border-b border-titan-border flex justify-between items-center">
              <h2 className="font-heading text-3xl uppercase tracking-wider text-titan-text">
                Tu <span className="text-titan-accent">Arsenal</span>
              </h2>
              <button 
                onClick={() => toggleCart(false)} 
                className="p-2 hover:text-titan-accent transition-colors text-titan-text-muted hover:bg-titan-bg rounded-full"
                aria-label="Cerrar carrito"
              >
                <X size={24} />
              </button>
            </header>

            {/* Lista de Items */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <X size={48} className="text-titan-text-muted" />
                  <p className="font-heading text-xl tracking-wider uppercase text-titan-text-muted">Tu arsenal está vacío</p>
                  <button onClick={() => toggleCart(false)} className="text-titan-accent underline text-sm uppercase tracking-widest">
                    Volver al catálogo
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="flex gap-4 group">
                    {/* Imagen cuadrada, fondo oscuro */}
                    <div className="relative w-20 h-24 bg-titan-bg border border-titan-border flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover p-2" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-heading text-lg leading-tight text-titan-text line-clamp-2 pr-4">{item.name}</h3>
                          {/* 
                            MOBILE FIX: group-hover no se activa en touch.
                            Siempre visible en mobile (opacity-100), hover-only en desktop (md:opacity-0 md:group-hover:opacity-100).
                            Tap target ampliado a p-2 para cumplir WCAG 2.5.5 (44px recomendado).
                          */}
                          <button 
                            onClick={() => removeItem(item.id, item.variant)}
                            className="p-2 -mr-2 -mt-1 text-titan-text-muted hover:text-red-500 active:text-red-500 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                            aria-label={`Eliminar ${item.name} del carrito`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {item.variant && <p className="text-xs text-titan-text-muted mt-1 uppercase tracking-wider">Sabor: {item.variant}</p>}
                      </div>
                      
                      <div className="flex justify-between items-end mt-4">
                        {/* 
                          Tap targets subidos de p-1 (~22px) a p-2.5 (~34px).
                          No llega a los 44px ideales pero el diseño compacto lo limita.
                          Suficiente para uso cómodo en mobile.
                        */}
                        <div className="flex items-center border border-titan-border">
                          <button onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)} className="p-2.5 hover:bg-titan-bg active:bg-titan-bg text-titan-text transition-colors" aria-label="Disminuir cantidad"><Minus size={14}/></button>
                          <span className="w-8 text-center text-sm font-bold text-titan-text">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)} className="p-2.5 hover:bg-titan-bg active:bg-titan-bg text-titan-text transition-colors" aria-label="Aumentar cantidad"><Plus size={14}/></button>
                        </div>
                        <p className="font-bold text-titan-accent">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout CTA */}
            {items.length > 0 && (
              <div className="p-6 bg-titan-bg border-t border-titan-border space-y-4">
                <div className="flex justify-between items-center text-titan-text">
                  <span className="uppercase tracking-widest text-sm text-titan-text-muted">Subtotal</span>
                  <span className="font-heading text-2xl">${getTotalPrice().toFixed(2)}</span>
                </div>
                <p className="text-xs text-titan-text-muted text-center">Impuestos y envío calculados en el checkout.</p>
                
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-titan-accent text-white font-heading text-xl uppercase tracking-widest text-center hover:bg-titan-accent-hover transition-colors shadow-[0_0_20px_rgba(255,94,0,0.2)] hover:shadow-[0_0_30px_rgba(255,94,0,0.4)]"
                >
                  Proceder al Pago
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}