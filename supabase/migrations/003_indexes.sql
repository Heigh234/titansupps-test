-- ═══════════════════════════════════════════════════════════════════
-- TITANSUPPS — ÍNDICES DE RENDIMIENTO
-- Migration: 003_indexes.sql
-- ═══════════════════════════════════════════════════════════════════

-- PROFILES
CREATE INDEX IF NOT EXISTS idx_profiles_role     ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_segment  ON public.profiles(segment);

-- PRODUCTS
CREATE INDEX IF NOT EXISTS idx_products_slug     ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status   ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_sku      ON public.products(sku);

-- PRODUCT_VARIANTS
CREATE INDEX IF NOT EXISTS idx_variants_product  ON public.product_variants(product_id);

-- PRODUCT_IMAGES
CREATE INDEX IF NOT EXISTS idx_images_product    ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_images_position   ON public.product_images(product_id, position);

-- ADDRESSES
CREATE INDEX IF NOT EXISTS idx_addresses_user    ON public.addresses(user_id);

-- FAVORITES
CREATE INDEX IF NOT EXISTS idx_favorites_user    ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product ON public.favorites(product_id);

-- ORDERS
CREATE INDEX IF NOT EXISTS idx_orders_user       ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email      ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created    ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_pi  ON public.orders(stripe_pi_id) WHERE stripe_pi_id IS NOT NULL;

-- ORDER_ITEMS
CREATE INDEX IF NOT EXISTS idx_order_items_order   ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);

-- ORDER_TIMELINE
CREATE INDEX IF NOT EXISTS idx_timeline_order ON public.order_timeline(order_id);

-- COUPONS
CREATE INDEX IF NOT EXISTS idx_coupons_code   ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(active) WHERE active = TRUE;

-- BLOG_POSTS
CREATE INDEX IF NOT EXISTS idx_blog_slug      ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON public.blog_posts(published_at DESC) WHERE published = TRUE;
CREATE INDEX IF NOT EXISTS idx_blog_category  ON public.blog_posts(category);

-- NEWSLETTER_SUBSCRIBERS
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);

-- SHIPPING_ZONES
CREATE INDEX IF NOT EXISTS idx_shipping_enabled ON public.shipping_zones(enabled) WHERE enabled = TRUE;
