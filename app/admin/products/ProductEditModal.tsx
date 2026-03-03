'use client';

/**
 * ProductEditModal.tsx — Modal completo de edición de producto
 * ─────────────────────────────────────────────────────────────────
 * Modal con formulario pre-poblado a partir del producto seleccionado.
 * Mismo diseño visual que new/page.tsx pero en overlay.
 *
 * ARQUITECTURA:
 *  - useForm + zodResolver con defaultValues = datos del producto actual
 *  - ImageUploadZone reutilizada — muestra imágenes existentes al abrir
 *  - Variantes como lista editable (sin useFieldArray para simplificar el modal)
 *  - Al guardar: llama updateProduct() de actions/products.ts
 *  - Si el admin sube nuevas imágenes → reemplaza. Si no → conserva las actuales.
 *
 * SCROLL:
 *  El modal tiene overflow-y-auto para contenido largo. El body del documento
 *  se bloquea con overflow-hidden mientras el modal está abierto.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2, Plus, Trash2, UploadCloud } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';
import { updateProduct, uploadProductImage } from '@/actions/products';
import { productSchema, type ProductFormValues } from './new/types';
import type { Product } from './types';

interface ProductEditModalProps {
  product:  Product | null;
  onClose:  () => void;
  onSaved:  (updated: Product) => void;
}

// ─── Categorías alineadas con la BD ──────────────────────────────
const CATEGORIES = [
  { label: 'Proteínas',   value: 'proteinas'   },
  { label: 'Pre-Workout', value: 'pre-workout' },
  { label: 'Creatinas',   value: 'creatinas'   },
  { label: 'Aminoácidos', value: 'aminoacidos' },
  { label: 'Gainers',     value: 'gainers'     },
  { label: 'Vitaminas',   value: 'vitaminas'   },
];

export default function ProductEditModal({
  product,
  onClose,
  onSaved,
}: ProductEditModalProps) {
  const addToast     = useToastStore((s) => s.addToast);
  const [saving, setSaving]         = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [newImages, setNewImages]   = useState<string[]>([]);   // URLs de nuevas imágenes subidas
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const { fields: variantFields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  // Pre-poblar el formulario cuando cambia el producto seleccionado.
  // NOTA: setNewImages([]) fue eliminado de este effect para evitar el patrón
  // setState síncrono dentro de un effect (react-hooks/set-state-in-effect).
  // El reset de newImages ahora ocurre de forma natural: el componente padre
  // usa key={editingProduct?.id} en este modal, forzando un remount completo
  // cada vez que cambia el producto. Esto resetea todo el estado local (incluyendo
  // newImages) sin necesidad de effects adicionales — patrón recomendado por React.
  useEffect(() => {
    if (!product) return;
    reset({
      name:         product.name,
      description:  product.description ?? '',
      price:        product.price,
      comparePrice: product.comparePrice ?? undefined,
      sku:          product.sku,
      stock:        product.stock,
      category:     product.category,
      status:       (product.status === 'low_stock' || product.status === 'out_of_stock')
                      ? 'active'
                      : product.status as 'active' | 'draft',
      variants:     (product.variants ?? []).map((v) => ({
        name:    v.name,
        options: Array.isArray(v.options) ? v.options.join(', ') : v.options,
      })),
    });
  }, [product, reset]);

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  // ─── Upload de imágenes ───────────────────────────────────────
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const results = await Promise.all(
      Array.from(files).map((file) => uploadProductImage(file))
    );

    const uploaded = results.flatMap((r) => r.url ? [r.url] : []);
    const errors_  = results.filter((r) => r.error);

    if (uploaded.length > 0) {
      setNewImages((prev) => [...prev, ...uploaded]);
    }
    if (errors_.length > 0) {
      addToast({ type: 'error', title: 'Error al subir', message: 'Alguna imagen no pudo subirse.' });
    }

    setUploading(false);
  };

  // ─── Submit ───────────────────────────────────────────────────
  const onSubmit = async (data: ProductFormValues) => {
    if (!product) return;
    setSaving(true);

    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k !== 'variants' && v !== undefined && v !== null) {
        formData.append(k, String(v));
      }
    });

    const parsedVariants = (data.variants ?? []).map((v) => ({
      name:    v.name,
      options: v.options.split(',').map((o) => o.trim()).filter(Boolean),
    }));

    const result = await updateProduct(product.id, formData, newImages, parsedVariants);

    if (result.error) {
      addToast({ type: 'error', title: 'Error al guardar', message: result.error });
      setSaving(false);
      return;
    }

    addToast({
      type:    'success',
      title:   'Producto actualizado',
      message: `"${data.name}" guardado correctamente.`,
    });

    // Notificar al padre con los datos actualizados para refrescar la tabla
    onSaved({
      ...product,
      name:     data.name,
      price:    data.price,
      stock:    data.stock,
      category: data.category,
      status:   data.status as Product['status'],
      sku:      data.sku,
      image:    newImages[0] ?? product.image,
    });

    setSaving(false);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* ── Overlay ── */}
          <motion.div
            key="edit-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => { if (!saving) onClose(); }}
            aria-hidden="true"
          />

          {/* ── Modal panel (full-height drawer from right) ── */}
          <motion.div
            key="edit-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-titan-bg border-l border-titan-border flex flex-col shadow-2xl"
          >
            {/* ─── Header sticky ─────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-titan-border bg-titan-surface flex-shrink-0">
              <div>
                <p className="text-[10px] font-bold text-titan-accent uppercase tracking-[0.25em] mb-0.5">
                  Inventario · Edición
                </p>
                <h2
                  id="edit-modal-title"
                  className="font-heading text-2xl uppercase tracking-wider text-titan-text leading-none"
                >
                  {product.name}
                </h2>
              </div>
              <button
                onClick={() => { if (!saving) onClose(); }}
                disabled={saving}
                className="p-2 text-titan-text-muted hover:text-white hover:bg-titan-bg transition-colors disabled:opacity-40"
                aria-label="Cerrar modal"
              >
                <X size={22} />
              </button>
            </div>

            {/* ─── Scrollable body ───────────────────────────── */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto"
            >
              <div className="p-6 space-y-6">

                {/* ── Detalles generales ── */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-titan-text-muted uppercase tracking-[0.25em] border-b border-titan-border pb-3">
                    Detalles Generales
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                      Nombre del Producto
                    </label>
                    <input
                      {...register('name')}
                      className={`w-full bg-titan-surface border p-3 text-titan-text focus:outline-none focus:border-titan-accent transition-colors ${errors.name ? 'border-red-500' : 'border-titan-border'}`}
                      placeholder="Nombre del producto"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                      Descripción
                    </label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className={`w-full bg-titan-surface border p-3 text-titan-text focus:outline-none focus:border-titan-accent transition-colors resize-y ${errors.description ? 'border-red-500' : 'border-titan-border'}`}
                      placeholder="Describe beneficios, ingredientes y uso..."
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                  </div>
                </section>

                {/* ── Estado y Categoría ── */}
                <section className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                      Estado
                    </label>
                    <select
                      {...register('status')}
                      className="w-full bg-titan-surface border border-titan-border p-3 text-titan-text focus:outline-none focus:border-titan-accent uppercase tracking-widest text-sm font-bold cursor-pointer"
                    >
                      <option value="active">Activo</option>
                      <option value="draft">Borrador</option>
                      <option value="archived">Archivado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                      Categoría
                    </label>
                    <select
                      {...register('category')}
                      className={`w-full bg-titan-surface border p-3 text-titan-text focus:outline-none focus:border-titan-accent uppercase tracking-widest text-sm font-bold cursor-pointer ${errors.category ? 'border-red-500' : 'border-titan-border'}`}
                    >
                      <option value="">Selecciona...</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                  </div>
                </section>

                {/* ── Precios ── */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-titan-text-muted uppercase tracking-[0.25em] border-b border-titan-border pb-3">
                    Precios
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                        Precio de Venta ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('price')}
                        className={`w-full bg-titan-surface border p-3 text-titan-text focus:outline-none focus:border-titan-accent font-heading text-xl ${errors.price ? 'border-red-500' : 'border-titan-border'}`}
                        placeholder="0.00"
                      />
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                        Precio Comparación ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('comparePrice')}
                        className="w-full bg-titan-surface border border-titan-border p-3 text-titan-text focus:outline-none focus:border-titan-accent font-heading text-xl text-titan-text-muted"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </section>

                {/* ── Inventario ── */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-titan-text-muted uppercase tracking-[0.25em] border-b border-titan-border pb-3">
                    Inventario
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                        SKU
                      </label>
                      <input
                        {...register('sku')}
                        className={`w-full bg-titan-surface border p-3 text-titan-text font-mono focus:outline-none focus:border-titan-accent ${errors.sku ? 'border-red-500' : 'border-titan-border'}`}
                        placeholder="PR-WHEY-001"
                      />
                      {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        {...register('stock')}
                        className={`w-full bg-titan-surface border p-3 text-titan-text focus:outline-none focus:border-titan-accent font-heading text-xl ${errors.stock ? 'border-red-500' : 'border-titan-border'}`}
                        placeholder="0"
                      />
                      {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                    </div>
                  </div>
                </section>

                {/* ── Imágenes ── */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-titan-text-muted uppercase tracking-[0.25em] border-b border-titan-border pb-3">
                    Imágenes
                  </h3>

                  {/* Imagen actual */}
                  {newImages.length === 0 && product.image && (
                    <div className="flex items-center gap-3 p-3 bg-titan-surface border border-titan-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover border border-titan-border flex-shrink-0"
                      />
                      <p className="text-xs text-titan-text-muted">
                        Imagen actual — sube nuevas para reemplazarla
                      </p>
                    </div>
                  )}

                  {/* Drop zone */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Zona de carga de imágenes"
                    className={`relative w-full h-32 border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${
                      dragActive
                        ? 'border-titan-accent bg-titan-accent/5'
                        : 'border-titan-border bg-titan-surface hover:border-titan-text-muted'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
                  >
                    {uploading
                      ? <Loader2 size={28} className="animate-spin text-titan-accent" />
                      : <>
                          <UploadCloud size={28} className={`mb-2 transition-colors ${dragActive ? 'text-titan-accent' : 'text-titan-text-muted'}`} />
                          <p className="text-xs font-bold text-titan-text-muted uppercase tracking-widest">
                            Arrastra o haz clic para subir
                          </p>
                        </>
                    }
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      aria-hidden="true"
                      tabIndex={-1}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </div>

                  {/* Preview de nuevas imágenes */}
                  {newImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {newImages.map((url, i) => (
                        <div key={url} className="relative group aspect-square">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`Nueva imagen ${i + 1}`}
                            className="w-full h-full object-cover border border-titan-border"
                          />
                          <button
                            type="button"
                            onClick={() => setNewImages((prev) => prev.filter((_, idx) => idx !== i))}
                            aria-label={`Quitar imagen ${i + 1}`}
                            className="absolute top-1 right-1 p-0.5 bg-titan-bg/80 border border-titan-border text-titan-text-muted hover:text-red-500 hover:border-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* ── Variantes ── */}
                <section className="space-y-4">
                  <div className="flex justify-between items-center border-b border-titan-border pb-3">
                    <h3 className="text-xs font-bold text-titan-text-muted uppercase tracking-[0.25em]">
                      Variantes
                    </h3>
                    <button
                      type="button"
                      onClick={() => append({ name: '', options: '' })}
                      className="text-xs text-titan-accent uppercase tracking-widest font-bold hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Plus size={12} /> Añadir
                    </button>
                  </div>

                  {variantFields.length === 0
                    ? <p className="text-xs text-titan-text-muted italic">Sin variantes (talla, sabor, etc.)</p>
                    : variantFields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 items-start">
                          <div className="flex-1">
                            <input
                              {...register(`variants.${index}.name`)}
                              className="w-full bg-titan-surface border border-titan-border p-2.5 text-sm text-titan-text focus:outline-none focus:border-titan-accent"
                              placeholder="Sabor"
                            />
                          </div>
                          <div className="flex-[2] flex gap-2">
                            <input
                              {...register(`variants.${index}.options`)}
                              className="w-full bg-titan-surface border border-titan-border p-2.5 text-sm text-titan-text focus:outline-none focus:border-titan-accent"
                              placeholder="Vainilla, Chocolate, Fresa"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              aria-label={`Eliminar variante ${index + 1}`}
                              className="p-2.5 bg-titan-surface border border-titan-border text-titan-text-muted hover:text-red-500 hover:border-red-500 transition-colors flex-shrink-0"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                  }
                </section>

              </div>

              {/* ─── Footer sticky ─────────────────────────────── */}
              <div className="sticky bottom-0 bg-titan-surface border-t border-titan-border px-6 py-4 flex gap-3 justify-end flex-shrink-0">
                <button
                  type="button"
                  onClick={() => { if (!saving) onClose(); }}
                  disabled={saving}
                  className="px-6 py-2.5 bg-titan-bg border border-titan-border text-titan-text text-sm font-bold uppercase tracking-wider hover:bg-titan-surface transition-colors disabled:opacity-40"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-6 py-2.5 bg-titan-accent text-white text-sm font-bold uppercase tracking-wider hover:bg-titan-accent-hover transition-colors shadow-[0_0_15px_rgba(255,94,0,0.2)] flex items-center gap-2 disabled:opacity-50"
                >
                  {saving
                    ? <><Loader2 size={16} className="animate-spin" /> Guardando...</>
                    : <><Save size={16} /> Guardar Cambios</>
                  }
                </button>
              </div>

            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
