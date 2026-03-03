'use client';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTES COMPARTIDOS — app/admin/settings/_components.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Primitivos de UI usados por todas las tabs de Settings.
// Field, AdminInput, Toggle, SaveButton, Modal

import { useEffect } from 'react';
import { Save, Check, RefreshCw, X } from 'lucide-react';

// ── Field ─────────────────────────────────────────────────────────────────────
/** Fila de formulario con label + hint a la izquierda, contenido a la derecha */
export function Field({
  label, hint, children,
}: {
  label: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="grid sm:grid-cols-[220px_1fr] gap-3 sm:gap-6 items-start py-5 border-b border-titan-border last:border-0">
      <div>
        <p className="text-sm font-bold text-titan-text uppercase tracking-wide">{label}</p>
        {hint && <p className="text-xs text-titan-text-muted mt-0.5 leading-relaxed">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

// ── AdminInput ────────────────────────────────────────────────────────────────
/** Input estilizado con prefijo/sufijo opcionales */
export function AdminInput({
  value, onChange, type = 'text', placeholder, prefix, suffix, disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center border border-titan-border focus-within:border-titan-accent transition-colors bg-titan-bg">
      {prefix && (
        <span className="px-3 text-xs text-titan-text-muted border-r border-titan-border select-none">
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-4 py-2.5 bg-transparent text-sm text-titan-text focus:outline-none disabled:opacity-40 placeholder:text-titan-text-muted"
      />
      {suffix && (
        <span className="px-3 text-xs text-titan-text-muted border-l border-titan-border select-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────
/** Switch ON/OFF accesible */
export function Toggle({
  enabled, onChange, label,
}: {
  enabled: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
        enabled ? 'bg-titan-accent' : 'bg-titan-border'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// ── SaveButton ────────────────────────────────────────────────────────────────
/** Botón de guardar con estados: idle → saving → saved → idle */
export function SaveButton({
  onSave, saving, saved,
}: {
  onSave: () => void; saving: boolean; saved: boolean;
}) {
  return (
    <button
      onClick={onSave}
      disabled={saving || saved}
      className={`flex items-center gap-2 px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
        saved
          ? 'bg-green-500/20 border border-green-500/30 text-green-400'
          : 'bg-titan-accent text-white hover:bg-titan-accent-hover shadow-[0_0_15px_rgba(255,94,0,0.2)] disabled:opacity-50'
      }`}
    >
      {saving ? (
        <><RefreshCw size={16} className="animate-spin" /> Guardando…</>
      ) : saved ? (
        <><Check size={16} /> Guardado</>
      ) : (
        <><Save size={16} /> Guardar cambios</>
      )}
    </button>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
/** Modal genérico con backdrop, cierre por Escape y click fuera */
export function Modal({
  title, onClose, children,
}: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md bg-titan-surface border border-titan-border shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-titan-border">
          <h3 className="font-heading text-xl uppercase tracking-wider text-titan-text">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-titan-text-muted hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
