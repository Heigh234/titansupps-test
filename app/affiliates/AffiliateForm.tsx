'use client';

/**
 * app/affiliates/AffiliateForm.tsx — Formulario de solicitud al programa
 * ─────────────────────────────────────────────────────────────────────────
 * Client Component — único nodo con interactividad en toda la página.
 *
 * ESTADO INTERNO:
 * · `isSubmitting` — bloquea el botón y muestra spinner durante la petición.
 * · `isSubmitted`  — conmuta al estado de éxito post-envío.
 * Ninguno de los dos necesita subir al padre: page.tsx no tiene que saber
 * si el formulario fue enviado o no.
 *
 * FLUJO DE SUBMIT:
 * 1. Usuario envía → isSubmitting = true, botón disabled + spinner.
 * 2. Petición simulada (1500ms) → en producción: POST /api/affiliates/apply.
 * 3. Resolución → isSubmitting = false, isSubmitted = true.
 * 4. AnimatePresence intercambia el formulario por el estado de éxito
 *    con transición opacity + y suave (mode="wait" garantiza que el
 *    form salga antes de que el éxito entre, evitando solapamiento).
 *
 * MEJORAS DE ACCESIBILIDAD vs ORIGINAL:
 * · Todos los inputs tienen id + <label htmlFor> explícito.
 * · El botón de submit tiene aria-busy durante isSubmitting.
 * · El spinner tiene aria-hidden="true" (es decorativo, el status lo
 *   transmite el texto SR-only "Enviando…" sería el siguiente paso).
 *
 * NOTA SOBRE FRAMER MOTION:
 * AnimatePresence está justificado aquí para la transición form→éxito
 * porque es la acción de conversión principal de la página — el usuario
 * debe percibir que "algo sucedió" de forma inequívoca.
 */

import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AffiliateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: POST /api/affiliates/apply con los datos del formulario
    await new Promise((res) => setTimeout(res, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section
      id="solicitar"
      className="container mx-auto px-6 py-20"
      aria-labelledby="solicitar-heading"
    >
      <div className="max-w-2xl mx-auto">

        {/* Encabezado de la sección */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
            Únete ahora
          </p>
          <h2
            id="solicitar-heading"
            className="font-heading text-fluid-4xl text-titan-text uppercase leading-[0.9]"
          >
            Solicitar<br />
            <span className="text-titan-accent">Acceso</span>
          </h2>
          <p className="text-titan-text-muted mt-4">
            Revisamos cada solicitud manualmente. Respuesta en menos de 24 horas.
          </p>
        </div>

        {/* Contenedor del form / estado de éxito */}
        <div className="border border-titan-border bg-titan-surface p-8">
          <AnimatePresence mode="wait">

            {/* ── Estado de éxito ── */}
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-center py-12 flex flex-col items-center gap-5"
              >
                <div className="w-16 h-16 rounded-full border-2 border-green-500 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <div>
                  <h3 className="font-heading text-3xl text-titan-text uppercase mb-2">
                    Solicitud Enviada
                  </h3>
                  <p className="text-titan-text-muted max-w-sm">
                    Revisaremos tu perfil y nos pondremos en contacto antes de 24 horas hábiles.
                    Prepárate para el batallón.
                  </p>
                </div>
              </motion.div>

            ) : (
              /* ── Formulario ── */
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Nombre + Correo */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="aff-nombre"
                      className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2"
                    >
                      Nombre *
                    </label>
                    <input
                      id="aff-nombre"
                      type="text"
                      required
                      placeholder="Tu nombre"
                      className="w-full bg-titan-bg border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder-titan-text-muted text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="aff-email"
                      className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2"
                    >
                      Correo *
                    </label>
                    <input
                      id="aff-email"
                      type="email"
                      required
                      placeholder="atleta@dominio.com"
                      className="w-full bg-titan-bg border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder-titan-text-muted text-sm"
                    />
                  </div>
                </div>

                {/* Canal / comunidad */}
                <div>
                  <label
                    htmlFor="aff-canal"
                    className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2"
                  >
                    Tu canal o comunidad principal *
                  </label>
                  <input
                    id="aff-canal"
                    type="url"
                    required
                    placeholder="https://instagram.com/tu_perfil"
                    className="w-full bg-titan-bg border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder-titan-text-muted text-sm"
                  />
                </div>

                {/* Tamaño de comunidad */}
                <div>
                  <label
                    htmlFor="aff-tamano"
                    className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2"
                  >
                    Tamaño aproximado de tu comunidad *
                  </label>
                  <select
                    id="aff-tamano"
                    className="w-full bg-titan-bg border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors text-sm appearance-none"
                  >
                    <option value="">Selecciona un rango</option>
                    <option value="1k-5k">1.000 – 5.000 seguidores</option>
                    <option value="5k-20k">5.000 – 20.000 seguidores</option>
                    <option value="20k-100k">20.000 – 100.000 seguidores</option>
                    <option value="100k+">Más de 100.000 seguidores</option>
                  </select>
                </div>

                {/* Motivación */}
                <div>
                  <label
                    htmlFor="aff-motivacion"
                    className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2"
                  >
                    ¿Por qué quieres representar a TitanSupps? *
                  </label>
                  <textarea
                    id="aff-motivacion"
                    required
                    rows={4}
                    placeholder="Cuéntanos sobre tu relación con el fitness, por qué usas o te interesan nuestros productos y qué tipo de contenido creas."
                    className="w-full bg-titan-bg border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder-titan-text-muted text-sm resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="w-full h-[56px] bg-titan-accent text-white font-heading text-2xl uppercase tracking-widest hover:bg-titan-accent-hover transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,94,0,0.15)]"
                >
                  {isSubmitting ? (
                    <span
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <>Enviar Solicitud <ArrowRight size={18} /></>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
