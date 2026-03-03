'use client';

// ─────────────────────────────────────────────────────────────────────────────
// TAB: DIRECCIONES — app/account/TabAddresses.tsx
// ─────────────────────────────────────────────────────────────────────────────
// CRUD completo de direcciones conectado a Supabase via Server Actions.
// Ya no usa INITIAL_ADDRESSES (mock) — carga datos reales al montar.

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Edit2, Check, Trash2, Plus, Loader2 } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';
import AddressModal from './AddressModal';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '@/actions/account';
import { emptyForm } from './_types';
import type { AddressFormData } from './_types';

// Tipo alineado con el schema de Supabase (snake_case, id como string UUID)
interface DBAddress {
  id:         string;
  title:      string;
  address:    string;
  city:       string;
  country:    string;
  cp:         string | null;
  is_default: boolean;
}

export default function TabAddresses() {
  const addToast = useToastStore((state) => state.addToast);

  const [addresses, setAddresses] = useState<DBAddress[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [modal, setModal] = useState<{
    open:    boolean;
    mode:    'add' | 'edit';
    editing: DBAddress | null;
  }>({ open: false, mode: 'add', editing: null });

  // ── Cargar direcciones desde Supabase ───────────────────────────────────────
  const loadAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAddresses();
      setAddresses(data as DBAddress[]);
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'No se pudieron cargar tus direcciones.' });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // ── Apertura del modal ──────────────────────────────────────────────────────
  const openAddModal  = () => setModal({ open: true, mode: 'add',  editing: null });
  const openEditModal = (addr: DBAddress) => setModal({ open: true, mode: 'edit', editing: addr });
  const closeModal    = () => setModal({ open: false, mode: 'add', editing: null });

  // ── Guardar (añadir o editar) ───────────────────────────────────────────────
  const handleSave = async (data: AddressFormData) => {
    setSaving(true);

    // Construir FormData para la Server Action (espera FormData, no objeto plano)
    const fd = new FormData();
    fd.append('title',   data.title);
    fd.append('address', data.address);
    fd.append('city',    data.city);

    let result;
    if (modal.mode === 'add') {
      result = await createAddress(fd);
    } else if (modal.editing) {
      result = await updateAddress(modal.editing.id, fd);
    }

    setSaving(false);
    closeModal();

    if (result && 'error' in result) {
      addToast({ type: 'error', title: 'Error', message: result.error });
      return;
    }

    addToast({
      type: 'success',
      title: modal.mode === 'add' ? '¡Base añadida!' : 'Dirección actualizada',
      message: `"${data.title}" se guardó correctamente.`,
    });

    // Recargar desde Supabase para reflejar el estado real
    await loadAddresses();
  };

  // ── Eliminar ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string, title: string) => {
    const result = await deleteAddress(id);
    if (result && 'error' in result) {
      addToast({ type: 'error', title: 'Error', message: result.error });
      return;
    }
    addToast({ type: 'info', title: 'Dirección eliminada', message: `"${title}" fue removida.` });
    await loadAddresses();
  };

  // ── Establecer como principal ───────────────────────────────────────────────
  const handleSetDefault = async (id: string) => {
    const result = await setDefaultAddress(id);
    if (result && 'error' in result) {
      addToast({ type: 'error', title: 'Error', message: result.error });
      return;
    }
    addToast({ type: 'success', title: 'Dirección principal actualizada', message: 'Tu dirección de envío por defecto fue cambiada.' });
    await loadAddresses();
  };

  // ── Estado de carga inicial ─────────────────────────────────────────────────
  if (loading) {
    return (
      <motion.div
        key="addresses-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-24"
      >
        <Loader2 size={24} className="animate-spin text-titan-accent" />
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        key="addresses"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {/* Header con botón de nueva dirección */}
        <div className="flex justify-between items-center border-b border-titan-border pb-4">
          <h2 className="font-heading text-2xl uppercase tracking-wider text-titan-text">Tus Bases</h2>
          <button
            onClick={openAddModal}
            disabled={saving}
            className="flex items-center gap-1.5 text-xs text-titan-accent font-bold uppercase tracking-widest hover:text-white transition-colors px-3 py-2 border border-titan-accent/30 hover:border-white/30 hover:bg-white/5 disabled:opacity-50"
          >
            <Plus size={14} /> Nueva dirección
          </button>
        </div>

        {/* Estado vacío */}
        {addresses.length === 0 ? (
          <div className="border border-dashed border-titan-border p-12 text-center">
            <MapPin size={32} className="text-titan-text-muted mx-auto mb-3" />
            <p className="text-titan-text-muted mb-4">Aún no tienes direcciones guardadas.</p>
            <button
              onClick={openAddModal}
              className="text-xs font-bold text-titan-accent uppercase tracking-widest hover:text-white transition-colors"
            >
              + Añadir tu primera dirección
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            <AnimatePresence>
              {addresses.map((addr) => (
                <motion.div
                  key={addr.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="bg-titan-surface border border-titan-border p-6 relative group"
                >
                  {/* Badge de dirección principal */}
                  {addr.is_default && (
                    <span className="absolute top-0 right-0 bg-titan-text text-titan-bg text-[10px] uppercase font-bold px-2 py-1">
                      Principal
                    </span>
                  )}

                  <h3 className="font-bold text-titan-text mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-titan-text-muted" /> {addr.title}
                  </h3>
                  <p className="text-sm text-titan-text-muted mb-6">
                    {addr.address}<br />{addr.city}
                    {addr.cp && `, ${addr.cp}`}
                  </p>

                  {/* Acciones */}
                  <div className="flex flex-wrap gap-4 border-t border-titan-border pt-4">
                    <button
                      onClick={() => openEditModal(addr)}
                      className="text-xs font-bold uppercase tracking-widest text-titan-text-muted hover:text-titan-text flex items-center gap-1 transition-colors"
                    >
                      <Edit2 size={12} /> Editar
                    </button>

                    {!addr.is_default && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-xs font-bold uppercase tracking-widest text-titan-text-muted hover:text-titan-accent flex items-center gap-1 transition-colors"
                      >
                        <Check size={12} /> Hacer principal
                      </button>
                    )}

                    {(!addr.is_default || addresses.length > 1) && (
                      <button
                        onClick={() => handleDelete(addr.id, addr.title)}
                        className="text-xs font-bold uppercase tracking-widest text-titan-text-muted hover:text-red-500 flex items-center gap-1 transition-colors ml-auto"
                      >
                        <Trash2 size={12} /> Eliminar
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Modal — fuera del flujo del tab para animación de salida correcta */}
      <AnimatePresence>
        {modal.open && (
          <AddressModal
            mode={modal.mode}
            initial={
              modal.mode === 'edit' && modal.editing
                ? { title: modal.editing.title, address: modal.editing.address, city: modal.editing.city }
                : emptyForm
            }
            onSave={handleSave}
            onClose={closeModal}
            externalSaving={saving}
          />
        )}
      </AnimatePresence>
    </>
  );
}
