/**
 * app/affiliates/_data.ts — Datos estáticos del programa de afiliados
 * ──────────────────────────────────────────────────────────────────────
 * Centraliza los cuatro arrays de contenido de la página:
 *
 *  · HERO_STATS     — 4 cifras de impacto del hero (antes inline en page.tsx)
 *  · BENEFICIOS     — 6 tarjetas del grid "Lo que Obtienes"
 *  · PASOS          — 4 pasos del proceso "Cómo Funciona"
 *  · TESTIMONIOS    — 3 tarjetas de embajadores reales
 *
 * En producción: TESTIMONIOS y POSICIONES pueden venir de un CMS
 * (Contentful, Sanity) para que marketing los actualice sin tocar código.
 * El helper no es necesario aquí porque todos los datos son arrays, no
 * records — se consumen directamente con .map().
 */

import {
  Percent, DollarSign, Package, TrendingUp, Users, Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ─── TIPOS ──────────────────────────────────────────────────────── */

export interface HeroStat {
  val: string;
  label: string;
}

export interface Beneficio {
  icon: LucideIcon;
  valor: string;
  titulo: string;
  desc: string;
}

export interface Paso {
  numero: string;
  titulo: string;
  desc: string;
}

export interface Testimonio {
  nombre: string;
  perfil: string;
  texto: string;
  comision: string;
}

/* ─── HERO STATS ─────────────────────────────────────────────────── */

export const HERO_STATS: HeroStat[] = [
  { val: '15%',    label: 'Comisión'           },
  { val: '1,200+', label: 'Afiliados activos'  },
  { val: '$850',   label: 'Pago promedio/mes'  },
  { val: '30 días',label: 'Ventana de cookie'  },
];

/* ─── BENEFICIOS DEL PROGRAMA ────────────────────────────────────── */

export const BENEFICIOS: Beneficio[] = [
  {
    icon: Percent,
    valor: '15%',
    titulo: 'Comisión por Venta',
    desc: 'Sobre cada compra generada a través de tu enlace único. Sin tope de ganancias mensuales.',
  },
  {
    icon: DollarSign,
    valor: '30 días',
    titulo: 'Cookie de Seguimiento',
    desc: 'Si alguien hace clic en tu enlace y compra en los próximos 30 días, la comisión es tuya.',
  },
  {
    icon: Package,
    valor: '100%',
    titulo: 'Productos Gratis',
    desc: 'Acceso a nuestro catálogo con descuento de embajador del 40% y productos de muestra para reseñas.',
  },
  {
    icon: TrendingUp,
    valor: 'Real-time',
    titulo: 'Dashboard de Stats',
    desc: 'Clics, conversiones y comisiones en tiempo real. Pago mensual directo a tu cuenta.',
  },
  {
    icon: Users,
    valor: '2 tiers',
    titulo: 'Comisiones Secundarias',
    desc: 'Si refieres a otro afiliado, ganas un 5% de sus comisiones de por vida. Red que crece, ingreso pasivo.',
  },
  {
    icon: Zap,
    valor: '24h',
    titulo: 'Onboarding Rápido',
    desc: 'Revisamos las solicitudes en 24 horas hábiles. Sin esperas eternas ni procesos kafkianos.',
  },
];

/* ─── PASOS DEL PROCESO ──────────────────────────────────────────── */

export const PASOS: Paso[] = [
  {
    numero: '01',
    titulo: 'Solicita tu acceso',
    desc: 'Rellena el formulario. Buscamos personas auténticas con comunidad real, sin importar el tamaño.',
  },
  {
    numero: '02',
    titulo: 'Revisión en 24h',
    desc: 'Nuestro equipo revisa tu perfil y te da una respuesta directa. Sin respuestas automáticas.',
  },
  {
    numero: '03',
    titulo: 'Accede al panel',
    desc: 'Obtén tu enlace único, materiales visuales de alta calidad y tu cupón personalizado.',
  },
  {
    numero: '04',
    titulo: 'Genera y cobra',
    desc: 'Comparte con tu comunidad. Las comisiones se pagan el día 1 de cada mes vía transferencia o PayPal.',
  },
];

/* ─── TESTIMONIOS DE EMBAJADORES ─────────────────────────────────── */

export const TESTIMONIOS: Testimonio[] = [
  {
    nombre: 'Alex R.',
    perfil: 'Atleta y creador de contenido',
    texto: 'Llevo 8 meses en el programa. El dashboard es claro, los pagos son puntuales y los productos se venden solos porque son genuinamente buenos. Sin drama.',
    comision: '$1,240 último mes',
  },
  {
    nombre: 'Marcos F.',
    perfil: 'Entrenador personal',
    texto: 'Recomiendo TitanSupps a mis clientes porque confío en la calidad. El programa de afiliados es solo un bono extra que se convirtió en un ingreso real.',
    comision: '$890 último mes',
  },
  {
    nombre: 'Valentina C.',
    perfil: 'Influencer de fitness',
    texto: 'A diferencia de otras marcas, aquí no te piden contenido de "posado" falso. Comparto lo que uso y funciona. La audiencia lo nota y convierte.',
    comision: '$2,100 último mes',
  },
];
