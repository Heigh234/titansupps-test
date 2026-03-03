'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: Conectar con plataforma de email marketing (Mailchimp, Klaviyo, etc.)
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="flex items-center justify-center gap-3 py-4 px-6 border border-green-500/30 bg-green-500/5 w-full max-w-md">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" aria-hidden="true" />
        <p className="text-sm text-green-500 font-bold uppercase tracking-widest">
          ¡Bienvenido al batallón! Revisa tu correo.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-0 w-full max-w-md"
      aria-label="Formulario de suscripción al newsletter"
    >
      <label htmlFor="newsletter-email" className="sr-only">Tu correo electrónico</label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="atleta@dominio.com"
        className="flex-1 bg-titan-surface border border-titan-border sm:border-r-0 px-5 py-4 text-titan-text placeholder-titan-text-muted focus:outline-none focus:border-titan-accent transition-colors"
      />
      <button
        type="submit"
        className="px-6 py-4 bg-[#c44800] text-white font-heading text-xl uppercase tracking-wider hover:bg-[#a33c00] transition-colors flex items-center justify-center gap-2 group border border-[#c44800]"
      >
        {/*
          #c44800 (naranja oscuro) sobre blanco = ratio 4.7:1 ✅ (WCAG AA).
          #ff5e00 (titan-accent original) sobre blanco = ratio 2.9:1 ✗.
          El tono sigue siendo inconfundiblemente naranja — identidad visual intacta.
        */}
        Suscribirme
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </form>
  );
}
