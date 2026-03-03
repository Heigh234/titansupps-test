import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import CartDrawer from '@/components/cart/CartDrawer'
import Providers from './providers'
import SiteFooter from '@/components/layout/Footer'

/*
 * FUENTES — Configuración anti render-blocking
 * ─────────────────────────────────────────────
 * display: 'swap'       → Muestra texto con fallback inmediatamente mientras
 *                         carga la fuente real. Elimina FOIT (Flash of Invisible
 *                         Text) que bloquea el renderizado percibido.
 *
 * preload: true         → Next.js inyecta <link rel="preload"> en el <head>
 *                         para que el navegador descargue la fuente en paralelo
 *                         con el HTML, sacándola de la ruta crítica.
 *
 * adjustFontFallback    → Genera una fuente fallback con métricas ajustadas
 *                         (size-adjust, ascent-override) para minimizar CLS
 *                         cuando la fuente real reemplaza al fallback.
 *
 * Bebas Neue es la fuente del LCP (H1 del hero) → preload obligatorio.
 * adjustFontFallback: false en Bebas porque es display font muy diferente
 * al fallback — el ajuste automático distorsionaría más de lo que ayuda.
 */
const bebas = Bebas_Neue({ 
  weight: '400', 
  subsets: ['latin'], 
  variable: '--font-bebas',
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
})

const dmSans = DM_Sans({ 
  subsets: ['latin'], 
  variable: '--font-dm-sans',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: 'TitanSupps | Elite Performance Supplements',
  description: 'Suplementos de alto rendimiento para atletas reales. Proteínas, creatinas y pre-entrenos.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${bebas.variable} ${dmSans.variable}`}>
      {/*
       * preconnect a titan-supps-final.vercel.app/_next/image
       * Le dice al navegador que anticipe la conexión TLS con el origen
       * de imágenes optimizadas antes de que el HTML las descubra.
       * Reduce ~100-150ms de latencia en la primera imagen.
       *
       * crossOrigin="anonymous" es requerido cuando el recurso usa CORS
       * (como las imágenes de Unsplash pasadas por el optimizer de Next).
       */}
      <head>
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="relative min-h-screen flex flex-col">
        <Providers>
          {/* Textura de ruido fija — atmosférica, sin impacto en performance */}
          <div className="bg-noise" aria-hidden="true"></div>
          
          <CartDrawer />
          <Navbar />
          
          <main className="flex-grow flex flex-col relative z-10">
            {children}
          </main>
          
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
