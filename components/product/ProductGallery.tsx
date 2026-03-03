'use client';

/*
  ProductGallery.tsx — v2 (más compacta)
  ───────────────────────────────────────
  CAMBIO CLAVE: aspect-[4/5] → aspect-square
  
  Antes: en pantalla de 1440px la columna izquierda tiene ~600px de ancho.
  Con ratio 4:5, la imagen medía ~750px de alto → más que el viewport → scroll obligatorio.
  
  Ahora: aspect-square → ~600×600px, encaja en pantalla sin scroll inicial.
  El usuario ve la imagen completa + toda la info del producto sin bajar.
  
  Thumbnails: disposición vertical (columna) al lado de la imagen en desktop,
  para aprovechar mejor el espacio horizontal que sobra.
*/

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  stock?: number;
}

export default function ProductGallery({ images, productName, stock }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // MOBILE FIX: sticky top-24 en mobile apilado pegaba la galería al scroll
  // mientras el usuario leía descripción, variantes e ingredientes debajo.
  // Solución: sticky solo desde lg (layout de 2 columnas reales).
  return (
    <div className="lg:sticky lg:top-24 flex flex-col gap-3">

      {/* Layout: thumbnails en columna vertical a la izquierda (desktop) */}
      <div className="flex gap-3">

        {/* Thumbnails verticales — solo si hay más de una imagen */}
        {images.length > 1 && (
          <div
            className="hidden sm:flex flex-col gap-2 flex-shrink-0"
            role="tablist"
            aria-label="Miniaturas de producto"
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`Ver imagen ${idx + 1} de ${productName}`}
                className={`relative w-16 h-16 border-2 cursor-pointer bg-titan-bg overflow-hidden flex-shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-titan-accent ${
                  idx === activeIndex
                    ? 'border-titan-accent shadow-[0_0_10px_rgba(255,94,0,0.25)]'
                    : 'border-titan-border hover:border-titan-text/40 opacity-50 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`Miniatura ${idx + 1}`} fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Imagen principal */}
        <div className="relative aspect-square flex-1 bg-[#0a0a0a] border border-titan-border overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image
                src={images[activeIndex]}
                alt={`${productName} — imagen ${activeIndex + 1}`}
                fill
                priority={activeIndex === 0}
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>

          {/* Badge stock bajo */}
          {stock !== undefined && stock < 20 && (
            <div className="absolute top-3 right-3 bg-red-600 text-white px-2.5 py-1 font-heading uppercase text-xs animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.4)] z-10">
              Solo {stock} en stock
            </div>
          )}

          {/* Contador de imagen */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-widest">
              {activeIndex + 1}/{images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails horizontales — mobile (< sm) */}
      {images.length > 1 && (
        <div className="sm:hidden flex gap-2" role="tablist" aria-label="Miniaturas de producto">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Ver imagen ${idx + 1}`}
              className={`relative w-14 h-14 border-2 cursor-pointer bg-titan-bg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                idx === activeIndex
                  ? 'border-titan-accent'
                  : 'border-titan-border opacity-50'
              }`}
            >
              <Image src={img} alt={`Miniatura ${idx + 1}`} fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
