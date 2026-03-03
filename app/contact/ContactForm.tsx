'use client';

/**
 * ContactForm.tsx — Formulario de contacto interactivo
 * ──────────────────────────────────────────────────────
 * EXTRACCIÓN: Separado de page.tsx porque tiene responsabilidad propia:
 *   - Estado local: categoria, isSubmitting, isSubmitted
 *   - Lógica de submit (async con simulación de red)
 *   - Renderizado condicional form ↔ success con AnimatePresence
 *
 * page.tsx se queda con el layout estático (hero, canales, horarios).
 * Esta separación permite que page.tsx sea un Server Component en el futuro
 * si se extrae la lógica de datos de CANALES/HORARIOS a un archivo _data.ts.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Package, FlaskConical, CreditCard, Truck, MessageSquare } from 'lucide-react';

// ─── Datos locales del formulario ───────────────────────────────────────────
// Colocados aquí (y no en _data.ts) porque pertenecen 100% a este componente
// y no se reutilizan en ninguna otra parte de la aplicación.
const CATEGORIAS_CONTACTO = [
  { value: 'pedido',     label: 'Mi pedido o envío',    icon: Truck },
  { value: 'producto',   label: 'Consulta de producto', icon: FlaskConical },
  { value: 'pago',       label: 'Pagos / Facturación',  icon: CreditCard },
  { value: 'devolucion', label: 'Devolución',            icon: Package },
  { value: 'otro',       label: 'Otro tema',             icon: MessageSquare },
];

// ─── Componente ──────────────────────────────────────────────────────────────
export default function ContactForm() {
  const [categoria, setCategoria]     = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Reemplazar con llamada real a API/server action
    await new Promise((res) => setTimeout(res, 1400));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="border border-titan-border bg-titan-surface p-8">
      <div className="mb-8">
        <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-2">
          Formulario de contacto
        </p>
        <h2 className="font-heading text-3xl text-titan-text uppercase">
          Envíanos tu Reporte
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          /* ── Estado de éxito ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center gap-6"
          >
            <div className="w-16 h-16 rounded-full border-2 border-green-500 flex items-center justify-center">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <div>
              <h3 className="font-heading text-3xl text-titan-text uppercase mb-2">
                Mensaje Recibido
              </h3>
              <p className="text-titan-text-muted max-w-sm">
                Nuestro equipo revisará tu mensaje y responderá en menos de 4 horas en días hábiles.
              </p>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 border border-titan-border text-titan-text-muted font-bold text-sm uppercase tracking-widest hover:border-titan-accent hover:text-titan-accent transition-colors"
            >
              Enviar otro mensaje
            </button>
          </motion.div>
        ) : (
          /* ── Formulario ── */
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Categoría — chips seleccionables */}
            <div>
              <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-3">
                Asunto *
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS_CONTACTO.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCategoria(value)}
                    className={`flex items-center gap-2 px-4 py-2.5 border text-xs font-bold uppercase tracking-widest transition-all ${
                      categoria === value
                        ? 'bg-titan-accent text-white border-titan-accent'
                        : 'border-titan-border text-titan-text-muted hover:border-titan-accent/50 hover:text-white'
                    }`}
                  >
                    <Icon size={12} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de campos básicos */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre"
                  className="w-full bg-titan-bg border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder-titan-text-muted text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                  Correo *
                </label>
                <input
                  type="email"
                  required
                  placeholder="atleta@dominio.com"
                  className="w-full bg-titan-bg border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder-titan-text-muted text-sm"
                />
              </div>
            </div>

            {/* Número de pedido */}
            <div>
              <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                Número de pedido (si aplica)
              </label>
              <input
                type="text"
                placeholder="Ej: ORD-2099"
                className="w-full bg-titan-bg border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder-titan-text-muted text-sm"
              />
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                Mensaje *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Describe tu situación con el mayor detalle posible. Esto nos permitirá darte una respuesta más útil y rápida."
                className="w-full bg-titan-bg border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder-titan-text-muted text-sm resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[56px] bg-titan-accent text-white font-heading text-2xl uppercase tracking-widest hover:bg-titan-accent-hover transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,94,0,0.15)] hover:shadow-[0_0_30px_rgba(255,94,0,0.3)]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </span>
              ) : (
                <>Enviar Mensaje <ArrowRight size={18} /></>
              )}
            </button>

            <p className="text-[10px] text-titan-text-muted uppercase tracking-widest text-center">
              Respondemos en menos de 4 horas en días hábiles.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
