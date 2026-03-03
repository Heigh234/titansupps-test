import { MetadataRoute } from 'next';

/*
  sitemap.ts — SEO crítico para e-commerce
  En producción: generar dinámicamente desde DB/CMS.
  Por ahora: rutas estáticas conocidas + mock de productos.
*/

const BASE_URL = 'https://titansupps.com';

// Mock de productos — en producción: await fetch('/api/products')
const PRODUCT_SLUGS = ['titan-whey-isolate', 'berserker-pre-workout', 'creatina-mono', 'mass-gainer-colossus'];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = PRODUCT_SLUGS.map((slug) => ({
    url: `${BASE_URL}/product/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
