-- ═══════════════════════════════════════════════════════════════════
-- TITANSUPPS — DATOS DE PRUEBA
-- Migration: 004_seed_data.sql
-- ADVERTENCIA: Ejecutar solo en entornos de desarrollo / staging.
-- ═══════════════════════════════════════════════════════════════════

-- ─── PRODUCTOS ──────────────────────────────────────────────────────
INSERT INTO public.products
  (name, slug, description, price, compare_price, sku, stock, category, status, featured)
VALUES
  ('Whey Isolate Pro',
   'whey-isolate-pro',
   'Proteína de suero aislada de máxima pureza. 90% de proteína por porción, mínima lactosa y grasa.',
   49.99, 64.99, 'WIP-001', 142, 'proteinas', 'active', TRUE),

  ('Creatina Monohidrato',
   'creatina-monohidrato',
   'Creatina de grado farmacéutico. Aumenta la fuerza, potencia y masa muscular.',
   24.99, 34.99, 'CRE-001', 87, 'creatinas', 'active', TRUE),

  ('Pre-Workout Titan Blast',
   'pre-workout-titan-blast',
   'Fórmula pre-entreno con cafeína, beta-alanina, citrulina y L-arginina.',
   39.99, 54.99, 'PRE-001', 63, 'pre-workout', 'active', FALSE),

  ('BCAA Recovery Complex',
   'bcaa-recovery-complex',
   'Aminoácidos de cadena ramificada en ratio 2:1:1 para máxima recuperación muscular.',
   34.99, 44.99, 'BCA-001', 9, 'aminoacidos', 'low_stock', FALSE),

  ('Mass Gainer Ultra',
   'mass-gainer-ultra',
   'Ganador de masa con 1200 kcal por porción, proteínas de alta calidad y carbohidratos complejos.',
   54.99, 69.99, 'MAS-001', 0, 'gainers', 'out_of_stock', FALSE),

  ('Omega-3 Premium',
   'omega-3-premium',
   'Aceite de pescado de alta concentración con EPA y DHA para salud cardiovascular y articular.',
   19.99, NULL, 'OME-001', 210, 'vitaminas', 'active', FALSE)
ON CONFLICT (slug) DO NOTHING;

-- ─── IMÁGENES DE PRODUCTOS ─────────────────────────────────────────
-- [FIX] El seed anterior nunca insertaba filas en product_images,
-- causando que todas las cards mostraran imagen rota.
-- Se usan URLs de Unsplash temáticas por producto.
-- position = 0 es la imagen principal (portada de la card).
-- Cuando el admin suba imágenes reales desde el panel, las reemplazará.

INSERT INTO public.product_images (product_id, url, alt, position)
SELECT id,
  'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80&auto=format&fit=crop',
  'Whey Isolate Pro — Proteína de suero en polvo',
  0
FROM public.products WHERE slug = 'whey-isolate-pro'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt, position)
SELECT id,
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80&auto=format&fit=crop',
  'Whey Isolate Pro — Batido de proteína preparado',
  1
FROM public.products WHERE slug = 'whey-isolate-pro'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt, position)
SELECT id,
  'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80&auto=format&fit=crop',
  'Creatina Monohidrato — Suplemento en polvo',
  0
FROM public.products WHERE slug = 'creatina-monohidrato'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt, position)
SELECT id,
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80&auto=format&fit=crop',
  'Creatina Monohidrato — Atleta de alto rendimiento',
  1
FROM public.products WHERE slug = 'creatina-monohidrato'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt, position)
SELECT id,
  'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80&auto=format&fit=crop',
  'Pre-Workout Titan Blast — Fórmula pre-entreno',
  0
FROM public.products WHERE slug = 'pre-workout-titan-blast'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt, position)
SELECT id,
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
  'Pre-Workout Titan Blast — Entreno de alta intensidad',
  1
FROM public.products WHERE slug = 'pre-workout-titan-blast'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt, position)
SELECT id,
  'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80&auto=format&fit=crop',
  'BCAA Recovery Complex — Aminoácidos en polvo',
  0
FROM public.products WHERE slug = 'bcaa-recovery-complex'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt, position)
SELECT id,
  'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80&auto=format&fit=crop',
  'BCAA Recovery Complex — Recuperación muscular',
  1
FROM public.products WHERE slug = 'bcaa-recovery-complex'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt, position)
SELECT id,
  'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&q=80&auto=format&fit=crop',
  'Mass Gainer Ultra — Ganador de masa muscular',
  0
FROM public.products WHERE slug = 'mass-gainer-ultra'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, alt, position)
SELECT id,
  'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=800&q=80&auto=format&fit=crop',
  'Omega-3 Premium — Cápsulas de aceite de pescado',
  0
FROM public.products WHERE slug = 'omega-3-premium'
ON CONFLICT DO NOTHING;

-- ─── VARIANTES DE PRODUCTOS ─────────────────────────────────────────
INSERT INTO public.product_variants (product_id, name, options)
SELECT id, 'Sabor', ARRAY['Vainilla', 'Chocolate', 'Fresa', 'Sin sabor']
FROM public.products WHERE slug = 'whey-isolate-pro'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_variants (product_id, name, options)
SELECT id, 'Tamaño', ARRAY['1 kg', '2.5 kg', '5 kg']
FROM public.products WHERE slug = 'whey-isolate-pro'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_variants (product_id, name, options)
SELECT id, 'Sabor', ARRAY['Frutas del bosque', 'Limón', 'Naranja', 'Sin sabor']
FROM public.products WHERE slug = 'pre-workout-titan-blast'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_variants (product_id, name, options)
SELECT id, 'Tamaño', ARRAY['500 g', '1 kg']
FROM public.products WHERE slug = 'creatina-monohidrato'
ON CONFLICT DO NOTHING;

-- ─── CUPONES ─────────────────────────────────────────────────────────
INSERT INTO public.coupons (code, type, value, min_order, max_uses, active, expires)
VALUES
  ('TITAN10',    'percent', 10,  0,    NULL, TRUE,  NOW() + INTERVAL '1 year'),
  ('BIENVENIDO', 'percent', 15,  0,    500,  TRUE,  NOW() + INTERVAL '6 months'),
  ('VERANO25',   'fixed',   25,  100,  200,  TRUE,  NOW() + INTERVAL '3 months'),
  ('BLACKFRIDAY','percent', 30,  50,   1000, FALSE, NOW() + INTERVAL '1 day')
ON CONFLICT (code) DO NOTHING;

-- ─── BLOG POSTS ──────────────────────────────────────────────────────
INSERT INTO public.blog_posts (slug, title, excerpt, category, author_name, published, published_at, content)
VALUES
  ('guia-proteina-whey',
   'Guía Definitiva de Proteína Whey: Todo lo que Necesitas Saber',
   'Descubre los tipos de proteína whey, cuál elegir según tus objetivos y cómo sacarle el máximo partido.',
   'nutricion',
   'Dr. Carlos Ruiz',
   TRUE,
   NOW() - INTERVAL '7 days',
   '[{"type":"heading","text":"¿Qué es la proteína Whey?"},{"type":"paragraph","text":"La proteína whey o proteína de suero de leche es un subproducto del proceso de fabricación del queso..."}]'),

  ('creatina-beneficios-ciencia',
   'Creatina: Beneficios Respaldados por la Ciencia',
   'La creatina es uno de los suplementos más estudiados del mundo. Aquí te contamos qué dice la ciencia.',
   'suplementacion',
   'Equipo TitanSupps',
   TRUE,
   NOW() - INTERVAL '14 days',
   '[{"type":"heading","text":"¿Qué es la creatina?"},{"type":"paragraph","text":"La creatina es un compuesto nitrogenado que se sintetiza naturalmente en el organismo..."}]')
ON CONFLICT (slug) DO NOTHING;

-- ─── STORE SETTINGS ──────────────────────────────────────────────────
UPDATE public.store_settings SET
  name          = 'TitanSupps',
  tagline       = 'Suplementación de élite para atletas de alto rendimiento',
  email         = 'hola@titansupps.com',
  phone         = '+34 900 123 456',
  address       = 'Calle Deportiva 1, Planta 3',
  city          = 'Madrid',
  currency      = 'EUR',
  vat_rate      = 21,
  support_hours = 'Lun–Vie 9:00–18:00'
WHERE id = 1;
