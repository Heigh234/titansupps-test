-- ═══════════════════════════════════════════════════════════════════
-- TITANSUPPS — FUNCIONES RPC (llamadas desde el cliente con supabase.rpc())
-- Migration: 005_rpc_functions.sql
-- ═══════════════════════════════════════════════════════════════════

-- ─── Decrementar stock de producto tras confirmar pago ────────────
CREATE OR REPLACE FUNCTION public.decrement_product_stock(
  p_product_id UUID,
  p_quantity   INTEGER
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(0, stock - p_quantity)
  WHERE id = p_product_id;
END;
$$;

-- ─── Incrementar usos de cupón tras confirmar pago ────────────────
CREATE OR REPLACE FUNCTION public.increment_coupon_uses(
  coupon_code TEXT
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.coupons
  SET uses = uses + 1
  WHERE code = coupon_code;
END;
$$;

-- ─── Estadísticas de ventas para el dashboard admin ──────────────
CREATE OR REPLACE FUNCTION public.get_sales_by_period(
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  date   DATE,
  orders BIGINT,
  revenue NUMERIC
)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT
    DATE(created_at) AS date,
    COUNT(*)         AS orders,
    SUM(total)       AS revenue
  FROM public.orders
  WHERE
    created_at >= NOW() - (p_days || ' days')::INTERVAL
    AND payment_status = 'paid'
  GROUP BY DATE(created_at)
  ORDER BY date;
$$;

-- ─── Top productos más vendidos ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_top_products(
  p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
  product_id   UUID,
  product_name TEXT,
  total_sold   BIGINT,
  total_revenue NUMERIC
)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT
    oi.product_id,
    oi.name          AS product_name,
    SUM(oi.quantity) AS total_sold,
    SUM(oi.price * oi.quantity) AS total_revenue
  FROM public.order_items oi
  JOIN public.orders o ON o.id = oi.order_id
  WHERE o.payment_status = 'paid'
  GROUP BY oi.product_id, oi.name
  ORDER BY total_sold DESC
  LIMIT p_limit;
$$;

-- Permisos para invocar las funciones como usuario autenticado
GRANT EXECUTE ON FUNCTION public.decrement_product_stock  TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_coupon_uses    TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_sales_by_period      TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_top_products         TO authenticated;
