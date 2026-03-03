'use client';

/**
 * components/ui/BackToTop.tsx
 * ────────────────────────────
 * ANTES: usaba AnimatePresence + motion.button de Framer Motion para
 * la transición de entrada/salida (opacity + scale + y).
 *
 * PROBLEMA: FM añadía peso al bundle de este componente sin ninguna
 * ventaja real. Este es exactamente el tipo de caso que el proyecto
 * ya resolvió en el Navbar: animaciones simples de opacity/transform
 * no justifican cargar FM.
 *
 * AHORA: CSS puro con la misma estrategia del Navbar —
 * el botón está SIEMPRE en el DOM, visible/oculto con:
 *   - opacity-0 / opacity-100
 *   - scale-75 / scale-100       (equivale al scale: 0.5 → 1 de FM)
 *   - translate-y-4 / translate-y-0  (equivale al y: 20 → 0 de FM)
 *   - pointer-events-none / pointer-events-auto
 *
 * transition-all duration-300 cubre entrada y salida, igual que
 * AnimatePresence manejaba el exit. Framer Motion: 0 KB cargado.
 */

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    /*
     * Siempre en el DOM — visibilidad controlada con clases CSS.
     * pointer-events-none cuando oculto evita clicks accidentales.
     * translate-y-4 + scale-75 replica el y:20 + scale:0.5 de FM.
     * duration-300 cubre entrada y salida (reemplaza AnimatePresence exit).
     */
    <button
      onClick={scrollToTop}
      aria-label="Volver arriba"
      aria-hidden={!isVisible}
      className={`
        fixed bottom-6 left-6 z-50
        p-3 bg-titan-surface border border-titan-border
        text-titan-text hover:text-titan-accent hover:border-titan-accent
        shadow-lg group
        transition-all duration-300
        ${isVisible
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-75 translate-y-4 pointer-events-none'
        }
      `}
    >
      <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
    </button>
  );
}