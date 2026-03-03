/**
 * app/cookies/_data.ts — Datos estáticos de la Política de Cookies
 * ──────────────────────────────────────────────────────────────────
 * Centraliza los tres arrays de datos que antes vivían inline en el JSX:
 *   - CATEGORIAS_COOKIES → categorías con sus cookies individuales
 *   - NAVEGADORES        → enlaces de gestión por navegador
 *
 * DECISIÓN: ULTIMA_ACTUALIZACION también aquí para que todas las páginas
 * legales actualicen su fecha desde un único archivo de datos.
 */

import { Shield, BarChart2, Megaphone, Settings2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface CookieEntry {
  nombre:      string;
  proveedor:   string;
  proposito:   string;
  expiracion:  string;
}

export interface CookieCategoria {
  id:          string;
  icon:        LucideIcon;
  nombre:      string;
  descripcion: string;
  obligatoria: boolean;
  cookies:     CookieEntry[];
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export const ULTIMA_ACTUALIZACION = '1 de enero de 2026';

// ─── Categorías de cookies ────────────────────────────────────────────────────

export const CATEGORIAS_COOKIES: CookieCategoria[] = [
  {
    id:          'necesarias',
    icon:        Shield,
    nombre:      'Necesarias',
    descripcion: 'Imprescindibles para el funcionamiento del sitio. Sin ellas, funciones básicas como el carrito de compras, el inicio de sesión o la navegación segura no funcionarían. No requieren consentimiento.',
    obligatoria: true,
    cookies: [
      { nombre: 'titan_session', proveedor: 'TitanSupps', proposito: 'Mantiene la sesión activa del usuario',              expiracion: 'Sesión' },
      { nombre: 'titan_cart',    proveedor: 'TitanSupps', proposito: 'Guarda el contenido del carrito de compras',          expiracion: '7 días' },
      { nombre: 'titan_csrf',    proveedor: 'TitanSupps', proposito: 'Protección contra ataques CSRF (seguridad)',           expiracion: 'Sesión' },
      { nombre: 'cookie_consent',proveedor: 'TitanSupps', proposito: 'Recuerda tus preferencias de cookies',                expiracion: '12 meses' },
    ],
  },
  {
    id:          'analiticas',
    icon:        BarChart2,
    nombre:      'Analíticas',
    descripcion: 'Nos permiten entender cómo los usuarios interactúan con el sitio (páginas más visitadas, tiempo de sesión, tasa de rebote) para mejorar continuamente la experiencia. Los datos son anonimizados y agregados.',
    obligatoria: false,
    cookies: [
      { nombre: '_plausible',   proveedor: 'Plausible Analytics (UE)', proposito: 'Análisis de tráfico anonimizado, sin tracking de usuario individual', expiracion: 'Ninguna (sin cookies persistentes)' },
      { nombre: '_ga',          proveedor: 'Google Analytics',          proposito: 'Métricas de sesión y comportamiento de usuario (IP anonimizada)',     expiracion: '2 años' },
      { nombre: '_ga_XXXXXX',   proveedor: 'Google Analytics',          proposito: 'Identificador de sesión de Google Analytics',                         expiracion: '2 años' },
    ],
  },
  {
    id:          'marketing',
    icon:        Megaphone,
    nombre:      'Marketing',
    descripcion: 'Usadas para mostrarte publicidad relevante según tus intereses, medir la efectividad de nuestras campañas y evitar que veas el mismo anuncio repetidamente. Solo activas si das tu consentimiento.',
    obligatoria: false,
    cookies: [
      { nombre: '_fbp',    proveedor: 'Meta (Facebook)', proposito: 'Seguimiento de conversiones de anuncios de Facebook/Instagram', expiracion: '90 días' },
      { nombre: '_fbc',    proveedor: 'Meta (Facebook)', proposito: 'Identificador de clic de anuncio en Facebook',                   expiracion: '2 años' },
      { nombre: 'ttclid',  proveedor: 'TikTok',          proposito: 'Atribución de conversiones de anuncios de TikTok',               expiracion: '30 días' },
      { nombre: '_gcl_au', proveedor: 'Google Ads',      proposito: 'Conversiones de Google Ads y remarketing',                       expiracion: '90 días' },
    ],
  },
  {
    id:          'funcionales',
    icon:        Settings2,
    nombre:      'Funcionales',
    descripcion: 'Mejoran la experiencia del usuario recordando preferencias (idioma, divisa, modo oscuro/claro) y habilitando funciones avanzadas como chat de soporte en tiempo real.',
    obligatoria: false,
    cookies: [
      { nombre: 'titan_currency',      proveedor: 'TitanSupps', proposito: 'Recuerda la divisa seleccionada por el usuario', expiracion: '30 días' },
      { nombre: 'intercom-session-*',  proveedor: 'Intercom',   proposito: 'Chat de soporte en tiempo real',                 expiracion: '7 días' },
    ],
  },
];

// ─── Links de gestión de cookies por navegador ───────────────────────────────

export const NAVEGADORES = [
  { browser: 'Google Chrome',   url: 'https://support.google.com/chrome/answer/95647' },
  { browser: 'Mozilla Firefox', url: 'https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies' },
  { browser: 'Safari',          url: 'https://support.apple.com/es-es/guide/safari/sfri11471/mac' },
  { browser: 'Microsoft Edge',  url: 'https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge' },
];
