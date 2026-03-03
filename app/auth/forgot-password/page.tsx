'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

// framer-motion eliminado — reemplazado por CSS fadeSlideUp y fadeScaleIn (globals.css)

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="animate-[fadeSlideUp_0.4s_ease-out_both]">
      {!isSent ? (
        <>
          <h1 className="font-heading text-4xl text-titan-text uppercase mb-2">Recupera tu acceso</h1>
          <p className="text-titan-text-muted mb-8 text-sm">Ingresa tu correo. Si estás en nuestra base de datos, te enviaremos un enlace táctico para forjar una nueva contraseña.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-titan-text-muted" size={18} />
                <input 
                  type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-titan-surface border border-titan-border p-4 pl-12 text-titan-text focus:outline-none focus:border-titan-accent transition-colors"
                  placeholder="atleta@dominio.com"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="w-full h-[60px] bg-titan-text text-titan-bg font-heading text-xl uppercase tracking-widest hover:bg-titan-accent hover:text-white transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Enviando protocolo...' : 'Enviar enlace'}
            </button>
          </form>
        </>
      ) : (
        /* Estado de éxito — fadeScaleIn para el ícono de confirmación */
        <div className="text-center space-y-6 py-8 animate-[fadeSlideUp_0.3s_ease-out_both]">
          <div className="animate-[fadeScaleIn_0.4s_ease-out_0.1s_both]">
            <CheckCircle className="text-titan-accent mx-auto" size={64} />
          </div>
          <h2 className="font-heading text-3xl uppercase text-titan-text">Enlace Enviado</h2>
          <p className="text-titan-text-muted text-sm">Revisa tu bandeja de entrada (y la carpeta de spam). Hemos enviado las instrucciones a <strong className="text-white">{email}</strong>.</p>
        </div>
      )}

      <div className="mt-8">
        <Link href="/auth/login" className="flex items-center justify-center gap-2 text-xs font-bold text-titan-text-muted hover:text-titan-accent uppercase tracking-widest transition-colors">
          <ArrowLeft size={14} /> Volver al Login
        </Link>
      </div>
    </div>
  );
}
