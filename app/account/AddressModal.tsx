'use client';

// ─────────────────────────────────────────────────────────────────────────────
// MODAL DE DIRECCIÓN — app/account/AddressModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Formulario modal para añadir o editar una dirección.
// Cierre por Escape, click en backdrop o botón X.
// Simula latencia de red con un pequeño delay antes de llamar a onSave.

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Loader2 } from 'lucide-react';
import type { AddressFormData } from './_types';

interface AddressModalProps {
  mode:            'add' | 'edit';
  initial:         AddressFormData;
  onSave:          (data: AddressFormData) => void | Promise<void>;
  onClose:         () => void;
  externalSaving?: boolean; // el guardado real lo gestiona el padre (TabAddresses)
}

export default function AddressModal({ mode, initial, onSave, onClose, externalSaving = false }: AddressModalProps) {
  const [form, setForm] = useState<AddressFormData>(initial);
  const firstInputRef   = useRef<HTMLInputElement>(null);

  // Autofocus al primer campo al montar
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.address.trim() || !form.city.trim()) return;
    await onSave(form);
  };

  const isValid = form.title.trim() && form.address.trim() && form.city.trim();
  const saving  = externalSaving;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-full max-w-md bg-titan-surface border border-titan-border p-8 relative"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.2em] mb-1">
              {mode === 'add' ? 'Nueva Base' : 'Editar Base'}
            </p>
            <h2 id="modal-title" className="font-heading text-2xl uppercase text-titan-text">
              {mode === 'add' ? 'Añadir Dirección' : 'Editar Dirección'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-titan-text-muted hover:text-white transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="addr-title" className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
              Nombre de la dirección *
            </label>
            <input
              ref={firstInputRef}
              id="addr-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ej: Casa, Trabajo, Gimnasio..."
              required
              className="w-full bg-titan-bg border border-titan-border p-3 text-titan-text placeholder:text-titan-text-muted/50 focus:outline-none focus:border-titan-accent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="addr-address" className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
              Dirección completa *
            </label>
            <input
              id="addr-address"
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Av. Principal 123, Depto 4B"
              required
              className="w-full bg-titan-bg border border-titan-border p-3 text-titan-text placeholder:text-titan-text-muted/50 focus:outline-none focus:border-titan-accent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="addr-city" className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
              Ciudad *
            </label>
            <input
              id="addr-city"
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Ciudad"
              required
              className="w-full bg-titan-bg border border-titan-border p-3 text-titan-text placeholder:text-titan-text-muted/50 focus:outline-none focus:border-titan-accent transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-titan-border text-titan-text-muted font-bold uppercase tracking-wider text-sm hover:border-white/30 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !isValid}
              className="flex-1 py-3 bg-titan-accent text-white font-heading text-xl uppercase tracking-wider hover:bg-titan-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving
                ? <><Loader2 size={16} className="animate-spin" /> Guardando...</>
                : <><Check size={16} /> Guardar</>
              }
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
