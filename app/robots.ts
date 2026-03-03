import { MetadataRoute } from 'next';

/*
  robots.ts — Control de indexación para e-commerce
  
  Rutas bloqueadas:
  - /admin → panel interno, nunca indexar
  - /checkout → página transaccional, no aporta SEO
  - /auth/* → flujos de autenticación privados
  - /account → área privada del usuario
  - /api → endpoints internos
*/

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/checkout', '/auth', '/account', '/api'],
      },
    ],
    sitemap: 'https://titansupps.com/sitemap.xml',
    host: 'https://titansupps.com',
  };
}
