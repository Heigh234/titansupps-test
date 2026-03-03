/**
 * actions/account.ts
 * ─────────────────────────────────────────────────────────────────
 * Server Actions para el área de cuenta del usuario:
 *  - Ver y actualizar perfil
 *  - Gestionar direcciones
 *  - Ver pedidos propios
 *  - Gestionar favoritos (sync con Supabase, reemplaza Zustand local)
 */

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

type ActionResult<T = void> = { success: true; data?: T } | { error: string };

// ─── Schemas ─────────────────────────────────────────────────────
const ProfileSchema = z.object({
  name:    z.string().min(2, 'Nombre requerido'),
  phone:   z.string().optional(),
  city:    z.string().optional(),
  country: z.string().optional(),
});

const AddressSchema = z.object({
  title:      z.string().min(1, 'Título requerido'),
  address:    z.string().min(5, 'Dirección requerida'),
  city:       z.string().min(2, 'Ciudad requerida'),
  country:    z.string().default('ES'),
  cp:         z.string().optional(),
  is_default: z.coerce.boolean().optional().default(false),
});

// ══════════════════════════════════════════════════════════════════
// PERFIL
// ══════════════════════════════════════════════════════════════════
export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return data;
}

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const raw = Object.fromEntries(formData);
  const parsed = ProfileSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase
    .from('profiles')
    .update(parsed.data)
    .eq('id', user.id);

  if (error) return { error: 'No se pudo actualizar el perfil.' };

  revalidatePath('/account');
  return { success: true };
}

// ══════════════════════════════════════════════════════════════════
// PEDIDOS DEL USUARIO
// ══════════════════════════════════════════════════════════════════
export async function getUserOrders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data, error } = await supabase
    .from('orders')
    .select('id, status, total, created_at, order_items(name, quantity)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('[getUserOrders]', error.message);
    return [];
  }
  return data ?? [];
}

export async function getOrderDetail(orderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*),
      order_timeline(status, description, created_at)
    `)
    .eq('id', orderId)
    .eq('user_id', user.id) // RLS también lo protege, pero doble seguridad
    .single();

  if (error) return null;
  return data;
}

// ══════════════════════════════════════════════════════════════════
// DIRECCIONES
// ══════════════════════════════════════════════════════════════════
export async function getAddresses() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false });

  return data ?? [];
}

export async function createAddress(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const raw = Object.fromEntries(formData);
  const parsed = AddressSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error } = await supabase
    .from('addresses')
    .insert({ ...parsed.data, user_id: user.id });

  if (error) return { error: 'No se pudo crear la dirección.' };

  revalidatePath('/account');
  return { success: true };
}

export async function updateAddress(
  addressId: string,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const raw = Object.fromEntries(formData);
  const parsed = AddressSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error } = await supabase
    .from('addresses')
    .update(parsed.data)
    .eq('id', addressId)
    .eq('user_id', user.id); // verificar propiedad

  if (error) return { error: 'No se pudo actualizar la dirección.' };

  revalidatePath('/account');
  return { success: true };
}

export async function deleteAddress(addressId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', user.id);

  if (error) return { error: 'No se pudo eliminar la dirección.' };

  revalidatePath('/account');
  return { success: true };
}

export async function setDefaultAddress(addressId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const { error } = await supabase
    .from('addresses')
    .update({ is_default: true })
    .eq('id', addressId)
    .eq('user_id', user.id);

  if (error) return { error: 'No se pudo actualizar la dirección.' };
  // El trigger SQL enforce_single_default_address se encarga del resto

  revalidatePath('/account');
  return { success: true };
}

// ══════════════════════════════════════════════════════════════════
// FAVORITOS (sync server — reemplaza useFavoritesStore)
// ══════════════════════════════════════════════════════════════════
export async function getFavorites() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('favorites')
    .select('product_id, products(id, name, slug, price, product_images(url, alt))')
    .eq('user_id', user.id);

  return data ?? [];
}

export async function toggleFavorite(productId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Inicia sesión para guardar favoritos.' };

  // Verificar si ya existe
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single();

  if (existing) {
    await supabase.from('favorites').delete()
      .eq('user_id', user.id).eq('product_id', productId);
  } else {
    await supabase.from('favorites').insert({ user_id: user.id, product_id: productId });
  }

  revalidatePath('/account');
  return { success: true };
}
