'use client';

/**
 * BlogNewsletterForm — Client Component
 * ──────────────────────────────────────
 * Extraído del blog/page.tsx (Server Component) para que el onSubmit
 * y el estado de éxito funcionen sin convertir toda la página a client.
 * Patrón recomendado por Next.js: "push client components to the leaves".
 */

import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function BlogNewsletterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    // Simulación de red — reemplazar con integración real (Mailchimp, Klaviyo, etc.)
    await new Promise((res) => setTimeout(res, 1000));
    setIsSubmitting(false);
    setIsSubscribed(true);
  };

  if (isSubscribed) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-5 text-center border border-green-500/20 bg-green-500/5 p-8">
        <div className="w-14 h-14 rounded-full border-2 border-green-500 flex items-center justify-center">
          <CheckCircle size={28} className="text-green-500" />
        </div>
        <div>
          <h3 className="font-heading text-2xl text-titan-text uppercase mb-1">¡Ya estás dentro!</h3>
          <p className="text-sm text-titan-text-muted">
            {name ? `Bienvenido, ${name}.` : 'Bienvenido.'} El próximo domingo recibes tu primer resumen científico.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="blog-newsletter-name"
          className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2"
        >
          Tu nombre
        </label>
        <input
          id="blog-newsletter-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Carlos"
          className="w-full bg-titan-surface border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder-titan-text-muted"
        />
      </div>

      <div>
        <label
          htmlFor="blog-newsletter-email"
          className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2"
        >
          Correo electrónico
        </label>
        <input
          id="blog-newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="atleta@dominio.com"
          required
          className="w-full bg-titan-surface border border-titan-border p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder-titan-text-muted"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-titan-accent text-white font-heading text-xl uppercase tracking-widest hover:bg-titan-accent-hover transition-colors shadow-[0_0_20px_rgba(255,94,0,0.15)] hover:shadow-[0_0_30px_rgba(255,94,0,0.3)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Suscribirme al Laboratorio
            <ArrowRight size={18} />
          </>
        )}
      </button>

      <p className="text-[10px] text-titan-text-muted uppercase tracking-widest text-center">
        Sin spam. Baja cuando quieras. Sin venta de datos.
      </p>
    </form>
  );
}
