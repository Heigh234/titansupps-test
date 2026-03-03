'use client';

/**
 * ProductDeleteModal.tsx — Confirmación de eliminación de producto
 * ─────────────────────────────────────────────────────────────────
 * Modal de confirmación con nombre explícito del producto antes de borrar.
 * El usuario debe escribir "ELIMINAR" para confirmar — previene borrados
 * accidentales en producción.
 *
 * DISEÑO:
 *  - Overlay con backdrop-blur + bg semitransparente
 *  - Animación de entrada/salida con framer-motion
 *  - Input de confirmación con texto explícito
 *  - Botón de eliminar desactivado hasta confirmar
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import type { Product } from './types';

interface ProductDeleteModalProps {
  product:   Product | null;
  onClose:   () => void;
  onConfirm: (product: Product) => Promise<void>;
}

export default function ProductDeleteModal({
  product,
  onClose,
  onConfirm,
}: ProductDeleteModalProps) {
  const [confirm, setConfirm]     = useState('');
  const [isDeleting, setDeleting] = useState(false);

  const isReady = confirm === 'ELIMINAR';

  const handleConfirm = async () => {
    if (!product || !isReady) return;
    setDeleting(true);
    await onConfirm(product);
    setDeleting(false);
    setConfirm('');
  };

  const handleClose = () => {
    if (isDeleting) return;
    setConfirm('');
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* ── Overlay ── */}
          <motion.div
            key="delete-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* ── Modal ── */}
          <motion.div
            key="delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-titan-surface border border-red-500/30 w-full max-w-md pointer-events-auto">

              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-titan-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={20} className="text-red-500" />
                  </div>
                  <div>
                    <h2
                      id="delete-modal-title"
                      className="font-heading text-xl uppercase tracking-wider text-titan-text"
                    >
                      Eliminar Producto
                    </h2>
                    <p className="text-xs text-titan-text-muted uppercase tracking-widest">
                      Esta acción es irreversible
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isDeleting}
                  className="p-2 text-titan-text-muted hover:text-white hover:bg-titan-bg transition-colors disabled:opacity-40"
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                <p className="text-sm text-titan-text-muted leading-relaxed">
                  Estás a punto de eliminar permanentemente{' '}
                  <span className="font-bold text-titan-text">&ldquo;{product.name}&rdquo;</span>{' '}
                  del inventario. Se borrarán también sus imágenes y variantes.
                </p>

                {/* Input de confirmación */}
                <div className="space-y-2">
                  <label
                    htmlFor="delete-confirm-input"
                    className="block text-xs font-bold text-titan-text-muted uppercase tracking-widest"
                  >
                    Escribe <span className="text-red-500">ELIMINAR</span> para confirmar
                  </label>
                  <input
                    id="delete-confirm-input"
                    type="text"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    disabled={isDeleting}
                    autoComplete="off"
                    placeholder="ELIMINAR"
                    className={`w-full bg-titan-bg border p-3 text-titan-text font-mono focus:outline-none transition-colors disabled:opacity-40 ${
                      isReady
                        ? 'border-red-500 text-red-400'
                        : 'border-titan-border focus:border-titan-text-muted'
                    }`}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-titan-border flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isDeleting}
                  className="px-6 py-2.5 bg-titan-bg border border-titan-border text-titan-text text-sm font-bold uppercase tracking-wider hover:bg-titan-surface transition-colors disabled:opacity-40"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!isReady || isDeleting}
                  className="px-6 py-2.5 bg-red-500 text-white text-sm font-bold uppercase tracking-wider hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting
                    ? <><Loader2 size={16} className="animate-spin" /> Eliminando...</>
                    : 'Eliminar Definitivamente'
                  }
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
