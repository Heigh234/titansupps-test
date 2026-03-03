import type { NextConfig } from 'next';

/**
 * ⚡ NEXT.JS CONFIG — OPTIMIZACIÓN DE PERFORMANCE
 * ─────────────────────────────────────────────────
 * Cambios vs versión anterior:
 *
 * 1. optimizePackageImports → Tree-shaking profundo para lucide-react y
 *    framer-motion. Solo se incluye lo que realmente se usa. Ahorro: ~50–80 KiB.
 *
 * 2. images.formats AVIF+WebP → AVIF es ~50% más ligero que WebP en fotos.
 *    Next.js servirá el formato óptimo según el navegador.
 *
 * 3. images.minimumCacheTTL → 30 días para imágenes de Unsplash.
 *    El default de 60s forzaba re-descargas innecesarias.
 *
 * 4. optimizeCss → Minificación y deduplicación de CSS en build.
 *
 * 5. poweredByHeader: false → Elimina header X-Powered-By (seguridad + limpieza).
 *
 * 6. compress: true → Gzip/brotli en assets estáticos.
 *
 * [FIX] Añadido remotePattern para *.supabase.co — necesario para que
 *       Next.js Image optimizer acepte las URLs de Supabase Storage.
 */

const nextConfig: NextConfig = {
  // ── IMÁGENES ──────────────────────────────────────────────────────────────
  images: {
    // Servir AVIF primero, WebP como fallback universal
    formats: ['image/avif', 'image/webp'],

    // Variantes responsivas ajustadas a los breakpoints reales del proyecto
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2560],

    // Tamaños para imágenes fill/fixed (cards, thumbnails, avatares)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache de 30 días — Unsplash no muta sus URLs
    minimumCacheTTL: 60 * 60 * 24 * 30,

    remotePatterns: [
      // Unsplash — imágenes de seed y categorías
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Supabase Storage — imágenes de productos subidas desde el admin
      // El subdominio varía por proyecto: xxxxxxxx.supabase.co
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // ── BUNDLE & PERFORMANCE ──────────────────────────────────────────────────
  experimental: {
    /**
     * CRÍTICO: lucide-react exporta ~1500 iconos (~300 KiB sin tree-shaking).
     * Con esta opción, importar { ArrowRight } solo incluye ese icono (~0.3 KiB).
     * Framer Motion pasa de ~100 KiB a solo las features usadas.
     */
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
    ],

    // Minificación de CSS en build: elimina duplicados de Tailwind
    optimizeCss: true,
  },

  // ── MISCELÁNEA ────────────────────────────────────────────────────────────
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
