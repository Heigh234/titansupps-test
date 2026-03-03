'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertOctagon, Info } from 'lucide-react';
import { useToastStore, type Toast, ToastType } from '@/store/useToastStore';

const ICONS = {
  success: <CheckCircle className="text-green-500" size={20} />,
  error: <AlertOctagon className="text-red-500" size={20} />,
  info: <Info className="text-titan-accent" size={20} />
};

const BORDERS = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  info: 'border-l-titan-accent'
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  // Auto-descartar después de 4 segundos
  useEffect(() => {
    const timer = setTimeout(() => onRemove(), 4000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto w-80 bg-titan-surface border border-titan-border border-l-4 ${BORDERS[toast.type as ToastType]} p-4 shadow-2xl flex items-start gap-3`}
    >
      <div className="mt-0.5">{ICONS[toast.type as ToastType]}</div>
      <div className="flex-1">
        <h4 className="font-heading text-lg uppercase tracking-wider text-titan-text leading-tight mb-1">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-xs text-titan-text-muted leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>
      <button 
        onClick={onRemove} 
        className="text-titan-text-muted hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}