-- ═══════════════════════════════════════════════════════════════════
-- TITANSUPPS — ROW LEVEL SECURITY (RLS)
-- Migration: 002_rls_policies.sql
-- ═══════════════════════════════════════════════════════════════════
-- PRINCIPIO: RLS activo en TODAS las tablas con datos de usuario.
-- Helper: auth.uid() = ID del usuario autenticado.
-- ═══════════════════════════════════════════════════════════════════

-- ─── HELPER: verificar si el usuario actual es admin ─────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ══════════════════════════════════════════════════════════════
-- PROFILES
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- No permitir que un user se auto-promueva a admin
    role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "profiles_admin_all"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- ══════════════════════════════════════════════════════════════
-- PRODUCTS (lectura pública, escritura solo admin)
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_public_read"
  ON public.products FOR SELECT
  USING (status IN ('active', 'low_stock', 'out_of_stock') OR public.is_admin());

CREATE POLICY "products_admin_write"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "products_admin_update"
  ON public.products FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "products_admin_delete"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- PRODUCT_VARIANTS — igual que products
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "variants_public_read"
  ON public.product_variants FOR SELECT
  USING (TRUE);

CREATE POLICY "variants_admin_write"
  ON public.product_variants FOR ALL
  USING (public.is_admin());

-- PRODUCT_IMAGES — igual que products
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "images_public_read"
  ON public.product_images FOR SELECT
  USING (TRUE);

CREATE POLICY "images_admin_write"
  ON public.product_images FOR ALL
  USING (public.is_admin());

-- ══════════════════════════════════════════════════════════════
-- ADDRESSES
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "addresses_own"
  ON public.addresses FOR ALL
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- ══════════════════════════════════════════════════════════════
-- FAVORITES
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_own"
  ON public.favorites FOR ALL
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- ══════════════════════════════════════════════════════════════
-- ORDERS — usuario ve solo los suyos; admin ve todos
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_own_select"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "orders_insert"
  ON public.orders FOR INSERT
  WITH CHECK (
    -- Usuarios autenticados crean pedidos propios
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    -- Compra como invitado (user_id = null)
    (user_id IS NULL) OR
    -- Admin
    public.is_admin()
  );

CREATE POLICY "orders_admin_update"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "orders_admin_delete"
  ON public.orders FOR DELETE
  USING (public.is_admin());

-- ORDER_ITEMS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_via_order"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_items.order_id
        AND (user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "order_items_insert"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_items.order_id
    )
  );

CREATE POLICY "order_items_admin_all"
  ON public.order_items FOR ALL
  USING (public.is_admin());

-- ORDER_TIMELINE (solo lectura para usuarios, escritura para admin/triggers)
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "timeline_read_own"
  ON public.order_timeline FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_timeline.order_id
        AND (user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "timeline_admin_insert"
  ON public.order_timeline FOR INSERT
  WITH CHECK (public.is_admin() OR auth.uid() IS NOT NULL);

-- ══════════════════════════════════════════════════════════════
-- COUPONS — admin gestiona; usuarios solo pueden validar
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Usuarios autenticados pueden leer cupones activos (para validar en checkout)
CREATE POLICY "coupons_authenticated_read"
  ON public.coupons FOR SELECT
  USING (auth.uid() IS NOT NULL AND active = TRUE);

CREATE POLICY "coupons_admin_all"
  ON public.coupons FOR ALL
  USING (public.is_admin());

-- ══════════════════════════════════════════════════════════════
-- BLOG_POSTS — lectura pública de publicados; admin gestiona
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_public_read"
  ON public.blog_posts FOR SELECT
  USING (published = TRUE OR public.is_admin());

CREATE POLICY "blog_admin_write"
  ON public.blog_posts FOR ALL
  USING (public.is_admin());

-- ══════════════════════════════════════════════════════════════
-- NEWSLETTER_SUBSCRIBERS — inserción pública; lectura solo admin
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "newsletter_public_insert"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "newsletter_admin_all"
  ON public.newsletter_subscribers FOR ALL
  USING (public.is_admin());

-- ══════════════════════════════════════════════════════════════
-- CONTACT_MESSAGES — inserción pública; lectura solo admin
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_public_insert"
  ON public.contact_messages FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "contact_admin_all"
  ON public.contact_messages FOR ALL
  USING (public.is_admin());

-- ══════════════════════════════════════════════════════════════
-- AFFILIATE_APPLICATIONS — inserción pública; lectura solo admin
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.affiliate_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "affiliates_public_insert"
  ON public.affiliate_applications FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "affiliates_admin_all"
  ON public.affiliate_applications FOR ALL
  USING (public.is_admin());

-- ══════════════════════════════════════════════════════════════
-- CAREER_APPLICATIONS — inserción pública; lectura solo admin
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "careers_public_insert"
  ON public.career_applications FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "careers_admin_all"
  ON public.career_applications FOR ALL
  USING (public.is_admin());

-- ══════════════════════════════════════════════════════════════
-- STORE_SETTINGS — solo lectura admin
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_admin_all"
  ON public.store_settings FOR ALL
  USING (public.is_admin());

-- ══════════════════════════════════════════════════════════════
-- SHIPPING_ZONES — lectura pública; escritura solo admin
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shipping_public_read"
  ON public.shipping_zones FOR SELECT
  USING (enabled = TRUE OR public.is_admin());

CREATE POLICY "shipping_admin_write"
  ON public.shipping_zones FOR ALL
  USING (public.is_admin());
