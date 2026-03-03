'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

// framer-motion eliminado.
// El spring scale del ícono de éxito se reemplaza con fadeScaleIn CSS.

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(Math.random() > 0.2 ? 'success' : 'error');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="animate-[fadeSlideUp_0.4s_ease-out_both] text-center py-12">
      
      {status === 'loading' && (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 size={48} className="text-titan-accent animate-spin" />
          <h1 className="font-heading text-3xl text-titan-text uppercase">Verificando ADN...</h1>
          <p className="text-titan-text-muted text-sm">Comprobando tus credenciales en el sistema.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center space-y-6">
          {/* fadeScaleIn replica el efecto spring de framer-motion */}
          <div className="animate-[fadeScaleIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)_both]">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h1 className="font-heading text-4xl text-titan-text uppercase">Cuenta Verificada</h1>
          <p className="text-titan-text-muted text-sm">Bienvenido a la élite. Tu cuenta está activa y lista para forjar tu leyenda.</p>
          <Link href="/catalog" className="mt-4 px-8 py-3 bg-titan-accent text-white font-heading text-xl uppercase tracking-widest hover:bg-titan-accent-hover transition-colors shadow-[0_0_15px_rgba(255,94,0,0.3)] flex items-center gap-2">
            Ver Catálogo <ArrowRight size={18} />
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center space-y-6">
          <XCircle size={64} className="text-red-500" />
          <h1 className="font-heading text-3xl text-titan-text uppercase">Enlace Caducado</h1>
          <p className="text-titan-text-muted text-sm">El enlace de verificación es inválido o ha expirado. Solicita uno nuevo.</p>
          <button className="mt-4 px-8 py-3 border border-titan-border text-titan-text font-heading text-xl uppercase tracking-widest hover:border-titan-accent transition-colors">
            Reenviar Correo
          </button>
        </div>
      )}

    </div>
  );
}
