/**
 * components/layout/Footer.tsx — Server Component
 * ─────────────────────────────────────────────────
 * ANTES: 'use client' completo por dos useState del formulario de newsletter.
 * Todo el footer — trust signals, columnas de nav, redes sociales, barra
 * legal — se renderizaba en el cliente innecesariamente.
 *
 * AHORA: Server Component puro. Solo FooterNewsletterForm (Client Component
 * hoja) envía JS al cliente. El resto es HTML estático generado en servidor.
 *
 * Patrón aplicado: "push client components to the leaves" (Next.js docs).
 * Mismo patrón ya aplicado en BlogNewsletterSection + BlogNewsletterForm.
 *
 * Los datos (NAV_LINKS, SOCIAL_LINKS, TRUST_SIGNALS) se mantienen en este
 * archivo — son datos de layout exclusivos del footer que no se comparten
 * con ninguna otra parte del proyecto, por lo que no justifican un _data.ts.
 */

import Link from 'next/link';
import {
  Instagram, Youtube, Twitter, Facebook,
  Dumbbell, Zap, Shield, Truck,
} from 'lucide-react';
import FooterNewsletterForm from '@/components/layout/FooterNewsletterForm';

// ─── Datos ────────────────────────────────────────────────────────────────────

const NAV_LINKS = {
  productos: [
    { label: 'Proteínas',       href: '/catalog?category=proteina' },
    { label: 'Pre-Workouts',    href: '/catalog?category=pre-workout' },
    { label: 'Creatinas',       href: '/catalog?category=creatina' },
    { label: 'Vitaminas & Salud', href: '/catalog?category=vitaminas' },
    { label: 'Accesorios',      href: '/catalog?category=accesorios' },
  ],
  soporte: [
    { label: 'Seguimiento de pedido', href: '/account' },
    { label: 'Devoluciones',          href: '/returns' },
    { label: 'Guía de tamaños',       href: '/sizing' },
    { label: 'Preguntas frecuentes',  href: '/faq' },
    { label: 'Contacto',              href: '/contact' },
  ],
  empresa: [
    { label: 'Sobre TitanSupps',      href: '/about' },
    { label: 'Blog & Ciencia',        href: '/blog' },
    { label: 'Afiliados',             href: '/affiliates' },
    { label: 'Trabaja con nosotros',  href: '/careers' },
  ],
};

const SOCIAL_LINKS = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Youtube,   href: 'https://youtube.com',   label: 'YouTube' },
  { icon: Twitter,   href: 'https://twitter.com',   label: 'Twitter / X' },
  { icon: Facebook,  href: 'https://facebook.com',  label: 'Facebook' },
];

const TRUST_SIGNALS = [
  { icon: Truck,    title: 'Envío Rápido',          desc: 'En tu base en 24–48h' },
  { icon: Shield,   title: 'Pago 100% Seguro',      desc: 'Encriptación SSL' },
  { icon: Zap,      title: 'Fórmulas Certificadas', desc: 'Laboratorio independiente' },
  { icon: Dumbbell, title: '+50.000 Atletas',       desc: 'Comunidad real activa' },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function SiteFooter() {
  return (
    <footer className="relative mt-20" role="contentinfo">

      {/*
        SEPARADOR SUPERIOR: gradiente naranja → transparente.
        Ancla visualmente el footer al sistema de acento del sitio.
        El blur genera un halo sutil que da calidez sin ser obvio.
      */}
      <div className="relative h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-titan-accent/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-titan-accent/20 to-transparent blur-sm" />
      </div>

      {/* ── BANDA DE TRUST SIGNALS ──────────────────────────────────────────── */}
      <div className="bg-titan-surface border-b border-titan-border">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_SIGNALS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 group">
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-titan-border bg-titan-bg text-titan-accent group-hover:border-titan-accent/50 group-hover:bg-titan-accent/5 transition-all duration-300">
                  <Icon size={18} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-titan-text">{title}</p>
                  <p className="text-xs text-titan-text-muted mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CUERPO PRINCIPAL ────────────────────────────────────────────────── */}
      <div className="bg-titan-bg">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

            {/* COLUMNA 1: Marca + Newsletter + Redes (ocupa 2 cols en desktop) */}
            <div className="lg:col-span-2 flex flex-col gap-8">

              {/* Logo */}
              <Link href="/" className="font-heading text-4xl tracking-widest text-titan-text w-fit">
                TITAN<span className="text-titan-accent">SUPPS</span>
              </Link>

              <p className="text-titan-text-muted text-sm leading-relaxed max-w-sm">
                Suplementación de grado élite para atletas reales. Sin ingredientes baratos,
                sin promesas vacías. Solo ciencia, potencia y resultados medibles.
              </p>

              {/* Newsletter */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-titan-text-muted mb-3">
                  Únete al batallón — descuento del 10% en tu primer pedido
                </p>

                {/* Client Component hoja — solo él envía JS al cliente */}
                <FooterNewsletterForm />

                <p className="text-[10px] text-titan-text-muted mt-2 uppercase tracking-widest">
                  Sin spam. Puedes darte de baja cuando quieras.
                </p>
              </div>

              {/* Redes Sociales */}
              <div className="flex items-center gap-4">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 flex items-center justify-center border border-titan-border text-titan-text-muted hover:text-titan-accent hover:border-titan-accent/50 hover:bg-titan-accent/5 transition-all duration-200"
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* COLUMNAS DE NAVEGACIÓN */}
            {Object.entries(NAV_LINKS).map(([section, links]) => (
              <div key={section} className="flex flex-col gap-5">
                <h3 className="font-heading text-sm uppercase tracking-[0.2em] text-titan-text">
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </h3>
                <ul className="flex flex-col gap-3" role="list">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-sm text-titan-text-muted hover:text-white transition-colors relative group w-fit block"
                      >
                        {/* Micro-interacción: acento deslizante antes del texto */}
                        <span
                          className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-[1px] bg-titan-accent transition-all duration-200 group-hover:w-2"
                          aria-hidden="true"
                        />
                        <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                          {label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── BARRA LEGAL INFERIOR ────────────────────────────────────────────── */}
        <div className="border-t border-titan-border">
          <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

            <p className="text-xs text-titan-text-muted order-2 sm:order-1">
              &copy; {new Date().getFullYear()} TitanSupps. Todos los derechos reservados. Forja tu leyenda.
            </p>

            <nav aria-label="Legal" className="flex items-center gap-6 order-1 sm:order-2">
              {[
                { label: 'Privacidad', href: '/privacy' },
                { label: 'Términos',   href: '/terms' },
                { label: 'Cookies',    href: '/cookies' },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-xs text-titan-text-muted hover:text-white transition-colors uppercase tracking-widest font-bold"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

    </footer>
  );
}
