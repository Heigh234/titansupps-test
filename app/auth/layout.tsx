import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-titan-bg flex flex-col lg:flex-row">
      
      {/* Mitad Izquierda: El Formulario (Contenido Dinámico) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 relative z-10">
        <Link 
          href="/" 
          className="absolute top-8 left-6 sm:left-12 flex items-center gap-2 text-titan-text-muted hover:text-white transition-colors text-sm uppercase tracking-widest font-bold"
        >
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
        
        <div className="w-full max-w-md mx-auto mt-12 lg:mt-0">
          <div className="mb-10 text-center lg:text-left">
            <Link href="/" className="inline-block text-4xl font-heading tracking-widest text-titan-text mb-2">
              TITAN<span className="text-titan-accent">SUPPS</span>
            </Link>
          </div>
          
          {children}
        </div>
      </div>

      {/* Mitad Derecha: Visual Branding (Sticky en Desktop) */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] relative items-end p-16">
        {/* Imagen LCP Optimizada */}
        <Image 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400&auto=format&fit=crop"
          alt="Atleta entrenando en la oscuridad"
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-60 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-titan-bg via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-lg border-l-4 border-titan-accent pl-8">
          <h2 className="font-heading text-5xl text-white uppercase leading-[0.9] text-glow mb-4">
            El dolor es temporal. <br /> El orgullo es para siempre.
          </h2>
          <p className="text-titan-text-muted text-lg">
            Únete a más de 50,000 atletas que ya han llevado su rendimiento al siguiente nivel. Accede a tu historial, rastrea tus pedidos y obtén recompensas exclusivas.
          </p>
        </div>
      </div>

    </div>
  );
}