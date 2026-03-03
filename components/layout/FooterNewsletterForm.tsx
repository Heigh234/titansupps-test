'use client';

/**
 * components/layout/FooterNewsletterForm.tsx — Client Component
 * ──────────────────────────────────────────────────────────────
 * Formulario de suscripción al newsletter del footer.
 * Extraído de Footer.tsx para que sus dos useState no fuercen
 * a todo el footer a ser un Client Component.
 *
 * Patrón: "push client components to the leaves" (Next.js docs).
 * El árbol de UI estático (trust signals, nav links, redes sociales,
 * barra legal) se renderiza ahora en servidor → 0 JS extra al cliente
 * por esas secciones.
 *
 * TODO: reemplazar el setTimeout simulado por integración real
 * con Mailchimp, Klaviyo o la plataforma de email marketing elegida.
 */

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function FooterNewsletterForm() {
  const [email, setEmail]           = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: conectar con plataforma de email marketing (Mailchimp, Klaviyo, etc.)
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 border border-green-500/30 bg-green-500/5">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" aria-hidden="true" />
        <p className="text-sm text-green-500 font-bold uppercase tracking-widest">
          ¡Bienvenido al batallón!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubscribe} className="flex gap-0 group">
      {/*
        FIX accesibilidad: label con htmlFor asociado al input.
        sr-only lo oculta visualmente sin romper el diseño.
        Un <label> visible asociado es mejor práctica WCAG 1.3.1
        que aria-label solitario — permite además clic en label → foco en input.
      */}
      <label htmlFor="footer-email" className="sr-only">
        Tu correo electrónico
      </label>
      <input
        id="footer-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="atleta@dominio.com"
        required
        className="flex-1 min-w-0 bg-titan-surface border border-titan-border border-r-0 px-4 py-3 text-sm text-titan-text placeholder-titan-text-muted focus:outline-none focus:border-titan-accent transition-colors"
      />
      <button
        type="submit"
        className="px-4 py-3 bg-titan-accent text-white border border-titan-accent hover:bg-titan-accent-hover transition-colors flex-shrink-0 group-focus-within:bg-titan-accent-hover"
        aria-label="Suscribirse al newsletter"
      >
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
