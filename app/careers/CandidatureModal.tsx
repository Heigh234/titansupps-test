'use client';

/**
 * app/careers/CandidatureModal.tsx — Modal de candidatura espontánea
 * ────────────────────────────────────────────────────────────────────
 * Client Component — gestiona el ciclo de vida del formulario de solicitud.
 *
 * ESTADO INTERNO:
 * · `isSubmitting` — bloquea el botón y muestra spinner durante el envío.
 * · `isSubmitted`  — muestra el estado de éxito post-envío.
 * Ambos son exclusivos de este componente y no necesitan subir al padre.
 *
 * PROPS EXTERNAS:
 * · `isOpen`   — controlado por page.tsx (showForm state).
 * · `onClose`  — callback para cerrar; page.tsx setea showForm(false).
 *
 * COMPORTAMIENTO:
 * · Click en backdrop cierra el modal, EXCEPTO si ya se envió el form
 *   (para que el usuario lea el mensaje de éxito antes de cerrar).
 * · Al cerrar se hace reset del estado interno con un pequeño delay
 *   para que la animación de salida termine antes de limpiar.
 *
 * ANIMACIÓN:
 * Framer Motion AnimatePresence anima entrada/salida del backdrop y del
 * panel. El panel usa scale + opacity + y para un efecto de "aparición
 * desde el centro" coherente con el modal de otros admin pages.
 *
 * ACCESIBILIDAD:
 * · role="dialog" + aria-modal="true" en el panel.
 * · aria-labelledby apunta al h2 del título.
 * · El botón × tiene aria-label="Cerrar modal de candidatura".
 * · El focus debería traparse dentro del modal — pendiente implementar
 *   FocusTrap si se decide usar este modal en producción real.
 */

import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { POSICIONES } from './_data';

interface CandidatureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CandidatureModal({ isOpen, onClose }: CandidatureModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: conectar con API real (POST /api/careers/apply)
    await new Promise((res) => setTimeout(res, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    // Reset del estado interno con delay para que la animación de salida
    // (300ms aprox) termine antes de limpiar el contenido del modal.
    setTimeout(() => {
      setIsSubmitted(false);
      setIsSubmitting(false);
    }, 350);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            onClick={() => !isSubmitted && handleClose()}
            aria-hidden="true"
          />

          {/* ── Panel del modal ── */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-[60] bg-titan-bg border border-titan-border shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="p-8">

              {/* ── Estado de éxito ── */}
              {isSubmitted ? (
                <div className="text-center py-10 flex flex-col items-center gap-5">
                  <div className="w-16 h-16 rounded-full border-2 border-green-500 flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl text-titan-text uppercase mb-2">
                      Candidatura Recibida
                    </h3>
                    <p className="text-titan-text-muted max-w-sm">
                      Revisamos cada candidatura personalmente. Si encajas, te contactaremos en los próximos 5 días hábiles.
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 border border-titan-border text-titan-text font-bold text-sm uppercase tracking-widest hover:border-titan-accent hover:text-titan-accent transition-colors"
                  >
                    Cerrar
                  </button>
                </div>

              ) : (
                /* ── Formulario ── */
                <>
                  {/* Cabecera del modal */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-1">
                        Reclutamiento
                      </p>
                      <h2
                        id="modal-title"
                        className="font-heading text-3xl text-titan-text uppercase"
                      >
                        Tu Candidatura
                      </h2>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 flex items-center justify-center border border-titan-border text-titan-text-muted hover:border-titan-accent hover:text-titan-accent transition-colors text-xl"
                      aria-label="Cerrar modal de candidatura"
                    >
                      ×
                    </button>
                  </div>

                  {/* Formulario de candidatura */}
                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Nombre + Correo */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="cand-nombre"
                          className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2"
                        >
                          Nombre *
                        </label>
                        <input
                          id="cand-nombre"
                          type="text"
                          required
                          placeholder="Tu nombre completo"
                          className="w-full bg-titan-surface border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder-titan-text-muted text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cand-email"
                          className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2"
                        >
                          Correo *
                        </label>
                        <input
                          id="cand-email"
                          type="email"
                          required
                          placeholder="tu@correo.com"
                          className="w-full bg-titan-surface border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder-titan-text-muted text-sm"
                        />
                      </div>
                    </div>

                    {/* Posición de interés */}
                    <div>
                      <label
                        htmlFor="cand-posicion"
                        className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2"
                      >
                        Posición de interés *
                      </label>
                      <select
                        id="cand-posicion"
                        className="w-full bg-titan-surface border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors text-sm appearance-none"
                      >
                        <option value="">Selecciona una posición</option>
                        {POSICIONES.map((j) => (
                          <option key={j.id} value={j.id}>{j.titulo}</option>
                        ))}
                        <option value="espontanea">Candidatura Espontánea</option>
                      </select>
                    </div>

                    {/* LinkedIn / Portfolio */}
                    <div>
                      <label
                        htmlFor="cand-portfolio"
                        className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2"
                      >
                        LinkedIn o portfolio *
                      </label>
                      <input
                        id="cand-portfolio"
                        type="url"
                        required
                        placeholder="https://linkedin.com/in/tu-perfil"
                        className="w-full bg-titan-surface border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder-titan-text-muted text-sm"
                      />
                    </div>

                    {/* Motivación */}
                    <div>
                      <label
                        htmlFor="cand-motivacion"
                        className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2"
                      >
                        ¿Por qué TitanSupps? *
                      </label>
                      <textarea
                        id="cand-motivacion"
                        required
                        rows={4}
                        placeholder="Cuéntanos en 3-5 oraciones por qué eres la persona correcta para esta posición. Sin plantillas corporativas."
                        className="w-full bg-titan-surface border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder-titan-text-muted text-sm resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-[56px] bg-titan-accent text-white font-heading text-2xl uppercase tracking-widest hover:bg-titan-accent-hover transition-colors flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                      ) : (
                        <>Enviar Candidatura <ArrowRight size={18} /></>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
