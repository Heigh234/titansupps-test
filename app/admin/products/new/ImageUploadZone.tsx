'use client';

/**
 * ImageUploadZone.tsx — Zona de carga de imágenes con Drag & Drop
 * ────────────────────────────────────────────────────────────────
 * FIX: La versión anterior solo exponía URLs blob (temporales).
 * Ahora expone también los File originales para que new/page.tsx
 * pueda subirlos a Supabase Storage en el momento del submit.
 *
 * onImagesChange(urls, files):
 *   - urls:  URLs blob para preview inmediato en la UI
 *   - files: File[] originales para uploadProductImage() en el submit
 *
 * Las URLs blob se revocan al eliminar una imagen para liberar memoria.
 */

import { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';

interface ImageUploadZoneProps {
  /** Callback con urls blob (preview) + File[] (para subir al submit) */
  onImagesChange?: (urls: string[], files: File[]) => void;
}

export default function ImageUploadZone({ onImagesChange }: ImageUploadZoneProps) {
  const addToast    = useToastStore((state) => state.addToast);
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews]     = useState<{ url: string; file: File }[]>([]);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const newEntries = Array.from(fileList).map((file) => ({
      url:  URL.createObjectURL(file),
      file,
    }));

    const updated = [...previews, ...newEntries];
    setPreviews(updated);
    onImagesChange?.(
      updated.map((e) => e.url),
      updated.map((e) => e.file)
    );

    addToast({
      title:   'Imágenes listas',
      message: `${fileList.length} imagen${fileList.length > 1 ? 'es' : ''} añadida${fileList.length > 1 ? 's' : ''}. Se subirán al guardar.`,
      type:    'info',
    });
  };

  const handleRemove = (index: number) => {
    URL.revokeObjectURL(previews[index].url);
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onImagesChange?.(
      updated.map((e) => e.url),
      updated.map((e) => e.file)
    );
  };

  return (
    <section className="bg-titan-surface border border-titan-border p-6 space-y-6">
      <h3 className="font-heading text-xl uppercase tracking-wider text-titan-text border-b border-titan-border pb-4">
        Multimedia
      </h3>

      {/* ── Drop Zone ── */}
      <div
        role="button"
        aria-label="Zona de carga de imágenes. Arrastra archivos o haz clic para explorar."
        tabIndex={0}
        className={`relative w-full h-48 border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${
          dragActive
            ? 'border-titan-accent bg-titan-accent/5'
            : 'border-titan-border bg-titan-bg hover:border-titan-text-muted'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <UploadCloud
          size={40}
          className={`mb-4 transition-colors ${dragActive ? 'text-titan-accent' : 'text-titan-text-muted'}`}
        />
        <p className="text-sm font-bold text-titan-text uppercase tracking-widest">
          Arrastra imágenes aquí
        </p>
        <p className="text-xs text-titan-text-muted mt-2">
          o haz clic para explorar · JPG, PNG, WEBP · máx 5MB
        </p>

        {/* Input invisible sobre toda la zona */}
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

      {/* ── Preview ── */}
      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {previews.map(({ url }, i) => (
            <div key={url} className="relative group aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Imagen ${i + 1}`}
                className="w-full h-full object-cover border border-titan-border"
              />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                aria-label={`Eliminar imagen ${i + 1}`}
                className="absolute top-1 right-1 p-0.5 bg-titan-bg/80 border border-titan-border text-titan-text-muted hover:text-red-500 hover:border-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
