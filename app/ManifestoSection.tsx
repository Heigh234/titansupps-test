/**
 * ManifestoSection.tsx — Sección editorial de marca
 * ────────────────────────────────────────────────────
 * CONCEPTO: La sección que más define la personalidad de TitanSupps.
 * Fondo: imagen atlética en baja opacidad (20%) — atmosférica, no distrae.
 * Gradiente: de izquierda a derecha, asegura que el texto de la izquierda
 * siempre tenga suficiente contraste independientemente del contenido.
 *
 * ELEMENTO DE DISEÑO — borde izquierdo naranja en el blockquote:
 * `border-l-4 border-titan-accent` ancla visualmente la cita, comunica
 * que es contenido destacado y mantiene coherencia con el lenguaje
 * de acento naranja del resto del sistema de diseño.
 *
 * SEMÁNTICA:
 * <blockquote> es correcto aquí — es una cita/declaración de marca
 * que se presenta como tal visualmente.
 * El <h2> dentro del blockquote es semánticamente válido en HTML5.
 *
 * cv-section-manifesto: content-visibility en globals.css.
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ManifestoSection() {
  return (
    <section
      className="cv-section-manifesto relative overflow-hidden my-8"
      aria-labelledby="manifesto-heading"
    >
      {/* Imagen de fondo atmosférica */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1800&auto=format&fit=crop"
          alt="Atleta entrenando con intensidad"
          fill
          sizes="100vw"
          className="object-cover opacity-20"
          loading="lazy"
        />
        {/*
          Gradiente horizontal: de sólido a semi-transparente.
          Garantiza contraste del texto en el lado izquierdo sin
          bloquear completamente la imagen en el lado derecho.
        */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-titan-bg via-titan-bg/95 to-titan-bg/60"
          aria-hidden="true"
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 container mx-auto px-6 py-24 lg:py-32">
        <div className="max-w-3xl">
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-8">
            Nuestra filosofía
          </p>

          {/* Cita editorial anclada con borde naranja */}
          <blockquote className="border-l-4 border-titan-accent pl-8 mb-8">
            <p
              id="manifesto-heading"
              className="font-heading text-fluid-2xl lg:text-fluid-4xl text-titan-text uppercase leading-[0.95]"
            >
              Los mediocres toman atajos.<br />
              <span className="text-titan-accent">Los Titanes</span> forjan resultados.
            </p>
          </blockquote>

          <p className="text-titan-text-muted text-lg leading-relaxed max-w-xl mb-8">
            Cada fórmula que desarrollamos parte de evidencia científica real, no de marketing
            vacío. Testeamos en laboratorios independientes, publicamos nuestros COAs y no
            añadimos ingredientes de relleno. Si está en la etiqueta, está en el producto.
          </p>

          <Link
            href="/about"
            className="inline-flex items-center gap-3 text-titan-text font-heading text-xl uppercase tracking-wider border-b border-titan-accent pb-1 hover:text-titan-accent transition-colors group"
          >
            Conoce nuestro proceso
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
