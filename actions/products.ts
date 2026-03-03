/**
 * actions/products.ts
 * ─────────────────────────────────────────────────────────────────
 * Server Actions para productos: catálogo, detalle, búsqueda y
 * CRUD de administración (crear, editar, archivar, gestionar stock).
 */

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

// ─── Schema de creación/edición de producto ───────────────────────
const ProductSchema = z.object({
  name:          z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description:   z.string().min(20, 'La descripción es muy corta'),
  price:         z.coerce.number().min(0.01, 'El precio debe ser mayor a 0'),
  compare_price: z.coerce.number().optional(),
  sku:           z.string().min(3, 'SKU requerido'),
  stock:         z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
  category:      z.string().min(1, 'Selecciona una categoría'),
  status:        z.enum(['active', 'draft', 'archived']),
  featured:      z.coerce.boolean().optional().default(false),
});

// ══════════════════════════════════════════════════════════════════
// LECTURA — CATÁLOGO PÚBLICO
// ══════════════════════════════════════════════════════════════════

/**
 * getProducts — para la página de catálogo con filtros
 */
export async function getProducts({
  category,
  status,
  search,
  page = 1,
  limit = 12,
  sortBy = 'created_at',
  sortDir = 'desc',
}: {
  category?: string;
  status?: ('active' | 'low_stock' | 'out_of_stock' | 'draft' | 'archived')[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'price' | 'name';
  sortDir?: 'asc' | 'desc';
} = {}) {
  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let query = supabase
    .from('products')
    .select('*, product_images(url, alt, position), product_variants(name, options)', { count: 'exact' })
    .in('status', status ?? ['active', 'low_stock'])
    .order(sortBy, { ascending: sortDir === 'asc' })
    .range(from, to);

  if (category)             query = query.eq('category', category);
  if (search?.trim())       query = query.ilike('name', `%${search.trim()}%`);

  const { data, count, error } = await query;

  if (error) {
    console.error('[getProducts]', error.message);
    return { products: [], total: 0 };
  }

  return { products: data ?? [], total: count ?? 0 };
}

/**
 * getFeaturedProducts — para la home (máx. 4 productos)
 * Fallback automático: si no hay productos con featured=true,
 * devuelve los últimos productos activos para que la sección
 * nunca quede vacía.
 */
export async function getFeaturedProducts() {
  const supabase = await createClient();

  // Intento 1: productos marcados como destacados
  const { data: featured, error } = await supabase
    .from('products')
    .select('*, product_images(url, alt, position)')
    .eq('featured', true)
    .in('status', ['active', 'low_stock'])
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) {
    console.error('[getFeaturedProducts]', error.message);
    return [];
  }

  if (featured && featured.length > 0) return featured;

  // Intento 2 (fallback): últimos productos activos si no hay destacados
  const { data: fallback } = await supabase
    .from('products')
    .select('*, product_images(url, alt, position)')
    .in('status', ['active', 'low_stock'])
    .order('created_at', { ascending: false })
    .limit(4);

  return fallback ?? [];
}

/**
 * getProductBySlug — para la página de detalle de producto
 */
export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(url, alt, position), product_variants(name, options)')
    .eq('slug', slug)
    .in('status', ['active', 'low_stock', 'out_of_stock'])
    .single();

  if (error) return null;
  return data;
}

// ══════════════════════════════════════════════════════════════════
// ADMINISTRACIÓN — CRUD (requiere rol admin, protegido por RLS)
// ══════════════════════════════════════════════════════════════════

/**
 * createProduct — admin/products/new/page.tsx
 */
export async function createProduct(
  formData: FormData,
  imageUrls: string[],
  variants: { name: string; options: string[] }[]
): Promise<{ success?: true; error?: string }> {
  const supabase = await createClient();

  // Verificar sesión y rol
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const raw: Record<string, unknown> = {};
  formData.forEach((v, k) => { raw[k] = v; });

  const parsed = ProductSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  // Generar slug único
  const slug = parsed.data.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({ ...parsed.data, slug })
    .select('id')
    .single();

  if (productError) {
    if (productError.message.includes('unique')) return { error: 'SKU o nombre ya existente.' };
    return { error: 'Error al crear el producto.' };
  }

  // Insertar imágenes
  if (imageUrls.length > 0) {
    await supabase.from('product_images').insert(
      imageUrls.map((url, i) => ({ product_id: product.id, url, position: i }))
    );
  }

  // Insertar variantes
  if (variants.length > 0) {
    await supabase.from('product_variants').insert(
      variants.map(v => ({ product_id: product.id, name: v.name, options: v.options }))
    );
  }

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
  redirect('/admin/products');
}

/**
 * updateProductStatus — admin/products/page.tsx (StatusChanger)
 */
export async function updateProductStatus(
  productId: string,
  status: 'active' | 'draft' | 'archived'
): Promise<{ success?: true; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('products')
    .update({ status })
    .eq('id', productId);

  if (error) return { error: 'No se pudo actualizar el estado.' };

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
  return { success: true };
}

/**
 * updateProductStock — admin para ajustes de inventario
 */
export async function updateProductStock(
  productId: string,
  stock: number
): Promise<{ success?: true; error?: string }> {
  if (stock < 0) return { error: 'El stock no puede ser negativo.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .update({ stock })
    .eq('id', productId);

  if (error) return { error: 'No se pudo actualizar el stock.' };

  revalidatePath('/admin/products');
  return { success: true };
}

/**
 * uploadProductImage — Supabase Storage
 */
export async function uploadProductImage(
  file: File
): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();

  // Validar tipo MIME y tamaño en servidor
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  const MAX_SIZE_MB = 5;

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: 'Tipo de archivo no permitido. Usa JPG, PNG, WebP o AVIF.' };
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { error: `La imagen no puede superar ${MAX_SIZE_MB}MB.` };
  }

  const ext = file.name.split('.').pop();
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) return { error: 'Error al subir la imagen.' };

  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return { url: data.publicUrl };
}

// ══════════════════════════════════════════════════════════════════
// ADMIN — EDITAR PRODUCTO
// ══════════════════════════════════════════════════════════════════

/**
 * updateProduct — edición completa de un producto existente.
 * Llamado desde: app/admin/products/ProductEditModal.tsx
 *
 * Reemplaza imágenes y variantes solo si se pasan explícitamente
 * (imageUrls.length > 0 o variants.length > 0). Si no, los deja intactos.
 */
export async function updateProduct(
  productId: string,
  formData: FormData,
  imageUrls: string[],
  variants: { name: string; options: string[] }[]
): Promise<{ success?: true; error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const raw: Record<string, unknown> = {};
  formData.forEach((v, k) => { raw[k] = v; });

  const parsed = ProductSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error: productError } = await supabase
    .from('products')
    .update(parsed.data)
    .eq('id', productId);

  if (productError) {
    if (productError.message.includes('unique')) {
      return { error: 'SKU ya utilizado por otro producto.' };
    }
    return { error: 'Error al actualizar el producto.' };
  }

  // Reemplazar imágenes solo si el admin subió nuevas
  if (imageUrls.length > 0) {
    await supabase.from('product_images').delete().eq('product_id', productId);
    await supabase.from('product_images').insert(
      imageUrls.map((url, i) => ({ product_id: productId, url, position: i }))
    );
  }

  // Reemplazar variantes solo si se modificaron
  if (variants.length > 0) {
    await supabase.from('product_variants').delete().eq('product_id', productId);
    await supabase.from('product_variants').insert(
      variants.map((v) => ({
        product_id: productId,
        name:       v.name,
        options:    v.options,
      }))
    );
  }

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
  return { success: true };
}

// ══════════════════════════════════════════════════════════════════
// ADMIN — ELIMINAR PRODUCTO
// ══════════════════════════════════════════════════════════════════

/**
 * deleteProduct — elimina un producto y sus registros relacionados.
 * product_images y product_variants tienen ON DELETE CASCADE en el schema,
 * por lo que se borran automáticamente con el producto padre.
 * Llamado desde: app/admin/products/ProductDeleteModal.tsx
 */
export async function deleteProduct(
  productId: string
): Promise<{ success?: true; error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) return { error: 'No se pudo eliminar el producto.' };

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
  return { success: true };
}
