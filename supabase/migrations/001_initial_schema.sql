-- ═══════════════════════════════════════════════════════════════════
-- TITANSUPPS — SCHEMA INICIAL
-- Migration: 001_initial_schema.sql
-- ═══════════════════════════════════════════════════════════════════

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- ─── HELPER: updated_at automático ──────────────────────────────────
-- Se aplica con trigger en cada tabla que lo necesite.

-- ══════════════════════════════════════════════════════════════
-- 1. PROFILES (extiende auth.users de Supabase)
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  phone       TEXT,
  city        TEXT,
  country     TEXT DEFAULT 'ES',
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  segment     TEXT NOT NULL DEFAULT 'nuevo'
                   CHECK (segment IN ('vip', 'activo', 'nuevo', 'suspendido')),
  notes       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- Auto-crear perfil al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ══════════════════════════════════════════════════════════════
-- 2. PRODUCTS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_price NUMERIC(10,2),
  sku           TEXT NOT NULL UNIQUE,
  stock         INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('active', 'low_stock', 'out_of_stock', 'draft', 'archived')),
  featured      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- Auto-actualizar status según stock
CREATE OR REPLACE FUNCTION public.update_product_status()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.stock = 0 THEN
    NEW.status = 'out_of_stock';
  ELSIF NEW.stock <= 10 AND NEW.status NOT IN ('draft', 'archived') THEN
    NEW.status = 'low_stock';
  ELSIF NEW.stock > 10 AND NEW.status = 'low_stock' THEN
    NEW.status = 'active';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_product_status
  BEFORE UPDATE OF stock ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_product_status();

-- ──────────────────────────────────────────────────────────────
-- 2a. PRODUCT_VARIANTS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_variants (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,  -- "Sabor", "Tamaño"
  options    TEXT[] NOT NULL, -- ["Vainilla", "Chocolate", "Sin sabor"]
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ──────────────────────────────────────────────────────────────
-- 2b. PRODUCT_IMAGES
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_images (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  alt        TEXT,
  position   INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ══════════════════════════════════════════════════════════════
-- 3. ADDRESSES (del usuario)
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.addresses (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  address    TEXT NOT NULL,
  city       TEXT NOT NULL,
  country    TEXT NOT NULL DEFAULT 'ES',
  cp         TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- Solo una dirección por defecto por usuario
CREATE OR REPLACE FUNCTION public.ensure_single_default_address()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE public.addresses
    SET is_default = FALSE
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_single_default_address
  AFTER INSERT OR UPDATE OF is_default ON public.addresses
  FOR EACH ROW WHEN (NEW.is_default = TRUE)
  EXECUTE FUNCTION public.ensure_single_default_address();

-- ══════════════════════════════════════════════════════════════
-- 4. FAVORITES
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.favorites (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, product_id)
);

-- ══════════════════════════════════════════════════════════════
-- 5. ORDERS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.orders (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  -- Datos de cliente (guardados para historial aunque se borre el user)
  customer_name   TEXT NOT NULL,
  customer_email  TEXT NOT NULL,
  customer_phone  TEXT,
  -- Dirección de envío (snapshot, no FK)
  ship_street     TEXT NOT NULL,
  ship_city       TEXT NOT NULL,
  ship_country    TEXT NOT NULL DEFAULT 'ES',
  ship_cp         TEXT,
  -- Totales
  subtotal        NUMERIC(10,2) NOT NULL,
  shipping_cost   NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount        NUMERIC(10,2) NOT NULL DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL,
  -- Estado y pago
  status          TEXT NOT NULL DEFAULT 'pendiente'
                       CHECK (status IN ('pendiente','procesando','enviado','entregado','cancelado')),
  payment_method  TEXT NOT NULL DEFAULT 'card',
  payment_status  TEXT NOT NULL DEFAULT 'pending'
                       CHECK (payment_status IN ('pending','paid','failed','refunded')),
  stripe_pi_id    TEXT,              -- Stripe PaymentIntent ID
  coupon_code     TEXT,
  tracking_code   TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ──────────────────────────────────────────────────────────────
-- 5a. ORDER_ITEMS (snapshot del producto al momento de la compra)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id   UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name       TEXT NOT NULL,   -- snapshot
  variant    TEXT,
  price      NUMERIC(10,2) NOT NULL,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  image_url  TEXT,
  slug       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ──────────────────────────────────────────────────────────────
-- 5b. ORDER_TIMELINE (historial de estados del pedido)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_timeline (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id   UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status     TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auto-insertar entrada en timeline cuando cambia el status
CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  desc_map JSONB := '{
    "pendiente":   "Pedido recibido y pendiente de confirmación.",
    "procesando":  "Pago confirmado. Estamos preparando tu pedido.",
    "enviado":     "Tu pedido ha salido de nuestro almacén.",
    "entregado":   "Pedido entregado exitosamente.",
    "cancelado":   "El pedido ha sido cancelado."
  }';
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.order_timeline (order_id, status, description)
    VALUES (NEW.id, NEW.status, desc_map->>NEW.status);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER track_order_status
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.log_order_status_change();

-- ══════════════════════════════════════════════════════════════
-- 6. COUPONS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.coupons (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code      TEXT NOT NULL UNIQUE,
  type      TEXT NOT NULL CHECK (type IN ('percent', 'fixed')),
  value     NUMERIC(10,2) NOT NULL CHECK (value > 0),
  min_order NUMERIC(10,2) DEFAULT 0,
  uses      INTEGER NOT NULL DEFAULT 0,
  max_uses  INTEGER,
  active    BOOLEAN DEFAULT TRUE,
  expires   TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ══════════════════════════════════════════════════════════════
-- 7. BLOG_POSTS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  excerpt     TEXT,
  cover_url   TEXT,
  category    TEXT NOT NULL DEFAULT 'general',
  author_name TEXT NOT NULL DEFAULT 'TitanSupps',
  author_avatar TEXT,
  content     JSONB,           -- array de secciones tipadas (como _data.ts)
  published   BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ══════════════════════════════════════════════════════════════
-- 8. NEWSLETTER_SUBSCRIBERS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE,
  confirmed    BOOLEAN DEFAULT FALSE,
  source       TEXT DEFAULT 'footer', -- 'footer' | 'blog' | 'popup'
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ══════════════════════════════════════════════════════════════
-- 9. CONTACT_MESSAGES
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  read       BOOLEAN DEFAULT FALSE,
  replied    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ══════════════════════════════════════════════════════════════
-- 10. AFFILIATE_APPLICATIONS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.affiliate_applications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  instagram   TEXT,
  followers   TEXT,
  platform    TEXT,   -- 'instagram' | 'tiktok' | 'youtube' | 'blog' | 'otro'
  motivation  TEXT,
  status      TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ══════════════════════════════════════════════════════════════
-- 11. CAREER_APPLICATIONS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.career_applications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id      TEXT NOT NULL,
  job_title   TEXT NOT NULL,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  cv_url      TEXT,           -- Supabase Storage URL
  cover_letter TEXT,
  status      TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'reviewing', 'interview', 'rejected', 'hired')),
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ══════════════════════════════════════════════════════════════
-- 12. STORE_SETTINGS (singleton — siempre 1 fila)
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.store_settings (
  id            INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- singleton
  name          TEXT NOT NULL DEFAULT 'TitanSupps',
  tagline       TEXT,
  email         TEXT,
  phone         TEXT,
  address       TEXT,
  city          TEXT,
  currency      TEXT DEFAULT 'EUR',
  vat_rate      NUMERIC(5,2) DEFAULT 21,
  support_hours TEXT DEFAULT 'Lun–Vie 9:00–18:00',
  -- Notificaciones
  notif_new_order       BOOLEAN DEFAULT TRUE,
  notif_order_shipped   BOOLEAN DEFAULT TRUE,
  notif_order_cancelled BOOLEAN DEFAULT TRUE,
  notif_low_stock       BOOLEAN DEFAULT TRUE,
  notif_new_user        BOOLEAN DEFAULT FALSE,
  notif_newsletter_sub  BOOLEAN DEFAULT FALSE,
  notif_weekly_report   BOOLEAN DEFAULT TRUE,
  -- Envíos
  free_shipping_threshold NUMERIC(10,2) DEFAULT 50,
  standard_days TEXT DEFAULT '3-5',
  express_days  TEXT DEFAULT '1-2',
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_store_settings_updated_at
  BEFORE UPDATE ON public.store_settings
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- Insertar settings por defecto
INSERT INTO public.store_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════
-- 13. SHIPPING_ZONES
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.shipping_zones (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  price      NUMERIC(10,2) NOT NULL DEFAULT 0,
  enabled    BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_shipping_zones_updated_at
  BEFORE UPDATE ON public.shipping_zones
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- Zonas por defecto
INSERT INTO public.shipping_zones (name, price, enabled) VALUES
  ('España Peninsular', 4.99,  true),
  ('Islas Baleares',    7.99,  true),
  ('Islas Canarias',   12.99,  true),
  ('Portugal',          6.99,  true),
  ('Europa',           14.99,  true)
ON CONFLICT DO NOTHING;
