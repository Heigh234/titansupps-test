'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';

// ─── Tipos ────────────────────────────────────────────────────────
interface VariantGroup {
  name: string;       // "Sabor", "Tamaño"
  options: string[];  // ["Vainilla", "Chocolate", "Fresa"]
}

interface ProductInteractiveProps {
  product: {
    id: string;
    name: string;
    price: number;
    variantGroups: VariantGroup[]; // grupos estructurados, no array plano
    images: string[];
  };
  onImageChange?: (index: number) => void;
}

export default function ProductInteractive({ product, onImageChange }: ProductInteractiveProps) {
  // Un estado de selección por grupo: { "Sabor": "Vainilla", "Tamaño": "1 kg" }
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(
    () => Object.fromEntries(
      (product.variantGroups ?? []).map((g) => [g.name, g.options[0] ?? ''])
    )
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const addItem  = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  // Etiqueta compacta para el carrito: "Sabor: Chocolate | Tamaño: 1 kg"
  const variantLabel = Object.entries(selectedVariants)
    .map(([name, option]) => `${name}: ${option}`)
    .join(' | ');

  const handleSelect = (groupName: string, option: string) => {
    setSelectedVariants((prev) => ({ ...prev, [groupName]: option }));
  };

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
      variant: variantLabel || undefined,
    });

    addToast({
      type: 'success',
      title: '¡Añadido al arsenal!',
      message: `${product.name}${variantLabel ? ` — ${variantLabel}` : ''} x${quantity}`,
    });

    setTimeout(() => setIsAdding(false), 800);
  };

  return (
    /*
      Padding reducido: p-6 → p-4
      Gap interno: gap-6 → gap-4
      Altura de controles: h-[60px] → h-[48px] — más compacto, igualmente usable
    */
    <div className="bg-titan-surface border border-titan-border p-4 flex flex-col gap-4">

      {/* Selector de variantes — un bloque por grupo */}
      {(product.variantGroups ?? []).map((group) => (
        <div key={group.name}>
          <label className="text-xs font-bold uppercase tracking-widest text-titan-text-muted block mb-2">
            {group.name}:{' '}
            <span className="text-titan-text">{selectedVariants[group.name]}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => (
              <button
                // Key único: combina el nombre del grupo + la opción.
                // Evita colisiones cuando dos grupos tienen opciones iguales.
                key={`${group.name}-${option}`}
                onClick={() => handleSelect(group.name, option)}
                className={`px-3 py-1.5 text-xs uppercase font-bold tracking-wider transition-all border ${
                  selectedVariants[group.name] === option
                    ? 'border-titan-accent bg-titan-accent/10 text-titan-accent'
                    : 'border-titan-border text-titan-text-muted hover:border-titan-text hover:text-white'
                }`}
                aria-pressed={selectedVariants[group.name] === option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Cantidad + CTA — en fila, más compactos */}
      <div className="flex gap-3 items-stretch">

        {/* Cantidad */}
        <div className="flex-shrink-0">
          <label className="text-xs font-bold uppercase tracking-widest text-titan-text-muted block mb-1.5">
            Uds.
          </label>
          <div className="flex h-[48px] border border-titan-border bg-titan-bg w-28">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex-1 flex items-center justify-center text-titan-text hover:bg-titan-surface transition-colors text-lg"
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <div className="w-8 flex items-center justify-center font-heading text-xl text-white border-x border-titan-border">
              {quantity}
            </div>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="flex-1 flex items-center justify-center text-titan-text hover:bg-titan-surface transition-colors text-lg"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>

        {/* CTA Principal */}
        <div className="flex flex-col flex-1">
          <label className="text-xs font-bold uppercase tracking-widest text-transparent block mb-1.5 select-none" aria-hidden="true">
            ·
          </label>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex-1 h-[48px] font-heading text-xl uppercase tracking-widest transition-all flex items-center justify-center relative overflow-hidden group ${
              isAdding
                ? 'bg-green-600 text-white cursor-default'
                : 'bg-titan-accent text-white hover:bg-titan-accent-hover active:scale-[0.98] shadow-[0_0_20px_rgba(255,94,0,0.15)] hover:shadow-[0_0_30px_rgba(255,94,0,0.35)]'
            }`}
            aria-live="polite"
          >
            {!isAdding && (
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            )}
            <span className="relative z-10">
              {isAdding ? '✓ Añadido' : 'Añadir al Arsenal'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
