'use client';

/**
 * components/ui/SearchModal.tsx
 *
 * Modal de búsqueda global. Se activa desde el ícono de lupa del Navbar.
 * Al buscar: navega a /catalog?q=término con router.push.
 * Keyboard: Escape cierra, Enter confirma búsqueda.
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';

// Sugerencias rápidas sin escribir nada
const QUICK_LINKS = [
  { label: 'Proteínas',    href: '/catalog?category=proteina' },
  { label: 'Pre-Workout',  href: '/catalog?category=pre-workout' },
  { label: 'Creatina',     href: '/catalog?category=creatina' },
  { label: 'Novedades',    href: '/catalog?sort=new' },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  // Focus automático al abrir + limpiar query al cerrar
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery(''); // eslint-disable-line react-hooks/set-state-in-effect
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Cierre con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            aria-hidden="true"
          />

          {/* Modal — centrado, ancho fijo */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-[10vh] left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-[61]"
            role="dialog"
            aria-modal="true"
            aria-label="Búsqueda de productos"
          >
            <div className="bg-titan-surface border border-titan-border shadow-2xl">

              {/* Input */}
              <form onSubmit={handleSearch} className="flex items-center border-b border-titan-border">
                <span className="pl-6 text-titan-text-muted flex-shrink-0">
                  <Search size={22} />
                </span>
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar producto o ingrediente..."
                  className="flex-1 bg-transparent px-4 py-6 text-xl text-titan-text placeholder-titan-text-muted/50 focus:outline-none"
                  aria-label="Término de búsqueda"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="pr-4 text-titan-text-muted hover:text-white transition-colors"
                    aria-label="Limpiar búsqueda"
                  >
                    <X size={20} />
                  </button>
                )}
                {query && (
                  <button
                    type="submit"
                    className="mr-4 px-4 py-2 bg-titan-accent text-white font-heading uppercase tracking-wider text-sm hover:bg-titan-accent-hover transition-colors flex items-center gap-2"
                  >
                    Buscar <ArrowRight size={14} />
                  </button>
                )}
              </form>

              {/* Sugerencias rápidas */}
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-titan-text-muted mb-4">
                  Accesos Rápidos
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_LINKS.map(({ label, href }) => (
                    <button
                      key={label}
                      onClick={() => { router.push(href); onClose(); }}
                      className="px-4 py-2 border border-titan-border text-sm text-titan-text-muted hover:border-titan-accent hover:text-titan-accent transition-colors uppercase tracking-wider font-bold"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tip de keyboard */}
              <div className="px-6 py-3 border-t border-titan-border flex gap-4 text-[10px] text-titan-text-muted uppercase tracking-widest">
                <span><kbd className="font-mono bg-titan-bg px-1 py-0.5 border border-titan-border">Esc</kbd> para cerrar</span>
                <span><kbd className="font-mono bg-titan-bg px-1 py-0.5 border border-titan-border">Enter</kbd> para buscar</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
