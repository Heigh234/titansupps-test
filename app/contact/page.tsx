/**
 * app/contact/page.tsx — Página de Contacto
 * ───────────────────────────────────────────
 * CONCEPTO: "El Puesto de Mando"
 *
 * ARQUITECTURA POST-MODULARIZACIÓN:
 * Este archivo es ahora un Server Component (sin 'use client').
 * Solo contiene el layout estático: hero, canales de soporte,
 * horarios de atención y el shortcut a la FAQ.
 *
 * La única pieza interactiva (el formulario con estado propio)
 * fue extraída a → ContactForm.tsx  (Client Component)
 *
 * El beneficio es doble:
 *   1. El layout estático se renderiza en servidor (0 JS enviado al cliente
 *      para la columna izquierda).
 *   2. La hidratación de React solo aplica a ContactForm, no a toda la página.
 */

import Link from 'next/link';
import { Mail, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import ContactForm from './ContactForm';

// ─── Datos estáticos ─────────────────────────────────────────────────────────
// Definidos aquí porque son específicos de esta página.
// Si en el futuro se alimentan de un CMS/API, moverlos a _data.ts.
const CANALES = [
  {
    icon: Mail,
    titulo: 'Email Directo',
    detalle: 'soporte@titansupps.com',
    tiempo: 'Respuesta < 4h hábiles',
    href: 'mailto:soporte@titansupps.com',
  },
  {
    icon: MessageSquare,
    titulo: 'WhatsApp Soporte',
    detalle: '+1 (555) 234-5678',
    tiempo: 'L–V: 9:00 – 18:00h',
    href: 'https://wa.me/15552345678',
  },
];

const HORARIOS = [
  { dia: 'Lunes – Viernes', horas: '09:00 – 19:00 h' },
  { dia: 'Sábados',         horas: '10:00 – 14:00 h' },
  { dia: 'Domingos / Festivos', horas: 'Respuesta diferida' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-titan-bg">

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[50vw] h-[55vh] bg-titan-accent/5 blur-[130px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.3em] mb-4">
            Soporte — TitanSupps
          </p>
          <h1 className="font-heading text-fluid-hero text-titan-text uppercase leading-[0.85] mb-6">
            Puesto de<br />
            <span className="text-titan-accent">Mando</span>
          </h1>
          <p className="text-titan-text-muted text-lg leading-relaxed max-w-xl">
            ¿Tienes una duda, un problema o una idea? Aquí está nuestro equipo.
            Sin bots, sin respuestas automáticas vacías.
          </p>
        </div>
      </section>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* ── COLUMNA IZQUIERDA: Canales + Horarios ── */}
          <aside className="lg:col-span-2 space-y-8">

            {/* Canales directos */}
            <div>
              <p className="text-xs font-bold text-titan-text-muted uppercase tracking-[0.25em] mb-5">
                Canales directos
              </p>
              <div className="space-y-4">
                {CANALES.map(({ icon: Icon, titulo, detalle, tiempo, href }) => (
                  <a
                    key={titulo}
                    href={href}
                    className="group flex items-start gap-4 p-5 border border-titan-border hover:border-titan-accent/50 bg-titan-surface hover:bg-titan-surface/80 transition-all"
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-titan-border text-titan-accent group-hover:border-titan-accent/50 group-hover:bg-titan-accent/5 transition-all">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-titan-text text-sm uppercase tracking-wider group-hover:text-titan-accent transition-colors">
                        {titulo}
                      </p>
                      <p className="text-titan-text-muted text-sm mt-0.5 truncate">{detalle}</p>
                      <p className="flex items-center gap-1.5 text-[10px] text-titan-accent uppercase tracking-widest font-bold mt-2">
                        <Clock size={10} /> {tiempo}
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-titan-text-muted group-hover:text-titan-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Horario de atención */}
            <div className="border border-titan-border p-6">
              <div className="flex items-center gap-3 mb-5">
                <Clock size={16} className="text-titan-accent" />
                <h3 className="font-heading text-xl text-titan-text uppercase tracking-wider">
                  Horario de Operaciones
                </h3>
              </div>
              <div className="space-y-0">
                {HORARIOS.map(({ dia, horas }, i) => (
                  <div
                    key={dia}
                    className={`flex items-center justify-between py-3 ${
                      i < HORARIOS.length - 1 ? 'border-b border-titan-border/50' : ''
                    }`}
                  >
                    <span className="text-sm text-titan-text-muted">{dia}</span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      dia.includes('Domingos') ? 'text-titan-text-muted' : 'text-titan-text'
                    }`}>
                      {horas}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-titan-border flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-500 font-bold uppercase tracking-widest">
                  Equipo activo ahora
                </span>
              </div>
            </div>

            {/* FAQ shortcut */}
            <Link
              href="/faq"
              className="group flex items-center justify-between p-5 border border-titan-border hover:border-titan-accent/50 transition-colors bg-titan-surface/30"
            >
              <div>
                <p className="font-bold text-titan-text text-sm uppercase tracking-wider group-hover:text-titan-accent transition-colors">
                  ¿Ya revisaste la FAQ?
                </p>
                <p className="text-xs text-titan-text-muted mt-1">
                  Tenemos 20+ respuestas inmediatas
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-titan-text-muted group-hover:text-titan-accent group-hover:translate-x-1 transition-all"
              />
            </Link>
          </aside>

          {/* ── COLUMNA DERECHA: Formulario (Client Component) ── */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

        </div>
      </section>
    </div>
  );
}
