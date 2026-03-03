/**
 * actions/admin.ts
 * ─────────────────────────────────────────────────────────────────
 * Server Actions exclusivas del panel de administración.
 * Todas requieren rol 'admin' (verificado por RLS + check explícito).
 *
 * Cubre:
 *  - Dashboard: métricas y estadísticas
 *  - Gestión de pedidos (cambiar estado, asignar tracking)
 *  - Gestión de usuarios (ver, cambiar segmento)
 *  - Gestión de cupones (CRUD)
 *  - Gestión de configuración de tienda
 */

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

type ActionResult<T = void> = { success: true; data?: T } | { error: string };

// ─── Helper: verificar admin ──────────────────────────────────────
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/');
  return supabase;
}

// ══════════════════════════════════════════════════════════════════
// DASHBOARD — MÉTRICAS
// ══════════════════════════════════════════════════════════════════
export async function getDashboardMetrics() {
  const supabase = await requireAdmin();

  const [ordersRes, revenueRes, usersRes, productsRes] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'procesando'),
    supabase.from('orders').select('total').in('status', ['procesando', 'enviado', 'entregado']),
    supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'user'),
    supabase.from('products').select('id', { count: 'exact' }).in('status', ['low_stock', 'out_of_stock']),
  ]);

  const totalRevenue = (revenueRes.data ?? []).reduce((acc: number, o: { total: number }) => acc + o.total, 0);

  return {
    pendingOrders:   ordersRes.count ?? 0,
    totalRevenue,
    totalUsers:      usersRes.count ?? 0,
    stockAlerts:     productsRes.count ?? 0,
  };
}

// ══════════════════════════════════════════════════════════════════
// GESTIÓN DE PEDIDOS
// ══════════════════════════════════════════════════════════════════
export async function getAdminOrders({
  status,
  search,
  page = 1,
  limit = 20,
  sortBy = 'created_at',
  sortDir = 'desc',
}: {
  status?: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
} = {}) {
  const supabase = await requireAdmin();
  const from = (page - 1) * limit;

  let query = supabase
    .from('orders')
    .select('*, order_items(name, quantity, variant)', { count: 'exact' })
    .order(sortBy, { ascending: sortDir === 'asc' })
    .range(from, from + limit - 1);

  if (status)         query = query.eq('status', status);
  if (search?.trim()) query = query.or(
    `customer_email.ilike.%${search.trim()}%,customer_name.ilike.%${search.trim()}%`
  );

  const { data, count, error } = await query;
  if (error) return { orders: [], total: 0 };
  return { orders: data ?? [], total: count ?? 0 };
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado',
  trackingCode?: string
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  const updateData: Record<string, unknown> = { status };
  if (trackingCode) updateData.tracking_code = trackingCode;

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);

  if (error) return { error: 'No se pudo actualizar el estado del pedido.' };

  revalidatePath('/admin/orders');
  return { success: true };
}

// ══════════════════════════════════════════════════════════════════
// GESTIÓN DE USUARIOS / CLIENTES
// ══════════════════════════════════════════════════════════════════
export async function getAdminUsers({
  segment,
  search,
  page = 1,
  limit = 20,
  sortBy = 'created_at',
  sortDir = 'desc',
}: {
  segment?: 'vip' | 'activo' | 'nuevo' | 'suspendido';
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
} = {}) {
  const supabase = await requireAdmin();
  const from = (page - 1) * limit;

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('role', 'user')
    .order(sortBy, { ascending: sortDir === 'asc' })
    .range(from, from + limit - 1);

  if (segment)        query = query.eq('segment', segment);
  if (search?.trim()) query = query.or(
    `name.ilike.%${search.trim()}%`
  );

  const { data, count, error } = await query;
  if (error) return { users: [], total: 0 };
  return { users: data ?? [], total: count ?? 0 };
}

export async function updateUserSegment(
  userId: string,
  segment: 'vip' | 'activo' | 'nuevo' | 'suspendido'
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from('profiles')
    .update({ segment })
    .eq('id', userId);

  if (error) return { error: 'No se pudo actualizar el segmento.' };

  revalidatePath('/admin/users');
  return { success: true };
}

// ══════════════════════════════════════════════════════════════════
// GESTIÓN DE CUPONES
// ══════════════════════════════════════════════════════════════════
const CouponSchema = z.object({
  code:      z.string().min(3).toUpperCase().trim(),
  type:      z.enum(['percent', 'fixed']),
  value:     z.coerce.number().min(0.01),
  min_order: z.coerce.number().min(0).default(0),
  max_uses:  z.coerce.number().int().positive().optional(),
  active:    z.coerce.boolean().default(true),
  expires:   z.string().optional(),
});

export async function createCoupon(formData: FormData): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = CouponSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error } = await supabase.from('coupons').insert({
    ...parsed.data,
    expires: parsed.data.expires ? new Date(parsed.data.expires).toISOString() : null,
  });

  if (error) {
    if (error.message.includes('unique')) return { error: 'Ya existe un cupón con ese código.' };
    return { error: 'No se pudo crear el cupón.' };
  }

  revalidatePath('/admin/settings');
  return { success: true };
}

export async function toggleCoupon(couponId: string, active: boolean): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from('coupons')
    .update({ active })
    .eq('id', couponId);

  if (error) return { error: 'No se pudo actualizar el cupón.' };
  revalidatePath('/admin/settings');
  return { success: true };
}

export async function deleteCoupon(couponId: string): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const { error } = await supabase.from('coupons').delete().eq('id', couponId);
  if (error) return { error: 'No se pudo eliminar el cupón.' };
  revalidatePath('/admin/settings');
  return { success: true };
}

// ══════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE TIENDA
// ══════════════════════════════════════════════════════════════════
export async function getStoreSettings() {
  const supabase = await requireAdmin();
  const { data } = await supabase.from('store_settings').select('*').eq('id', 1).single();
  return data;
}

export async function updateStoreSettings(formData: FormData): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const raw = Object.fromEntries(formData);

  // Filtrar solo campos válidos (evitar inyección de columnas)
  const ALLOWED_FIELDS = [
    'name', 'tagline', 'email', 'phone', 'address', 'city',
    'currency', 'vat_rate', 'support_hours',
    'notif_new_order', 'notif_order_shipped', 'notif_order_cancelled',
    'notif_low_stock', 'notif_new_user', 'notif_newsletter_sub', 'notif_weekly_report',
    'free_shipping_threshold', 'standard_days', 'express_days',
  ];

  const filteredRaw = Object.fromEntries(
    Object.entries(raw).filter(([k]) => ALLOWED_FIELDS.includes(k))
  );

  // Convertir booleans de checkbox
  const boolFields = ['notif_new_order', 'notif_order_shipped', 'notif_order_cancelled',
    'notif_low_stock', 'notif_new_user', 'notif_newsletter_sub', 'notif_weekly_report'];

  const filtered: Record<string, unknown> = { ...filteredRaw };
  for (const field of boolFields) {
    filtered[field] = filteredRaw[field] === 'on' || filteredRaw[field] === 'true';
  }

  const { error } = await supabase.from('store_settings').update(filtered).eq('id', 1);
  if (error) return { error: 'No se pudo guardar la configuración.' };

  revalidatePath('/admin/settings');
  return { success: true };
}
