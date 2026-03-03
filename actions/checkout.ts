/**
 * actions/checkout.ts
 * ─────────────────────────────────────────────────────────────────
 * Server Actions para el flujo de checkout:
 *  1. Validar cupón
 *  2. Calcular totales (con zona de envío)
 *  3. Crear PaymentIntent de Stripe
 *  4. Confirmar pedido tras pago exitoso (webhook)
 *
 * STACK: Supabase + Stripe
 */

'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

// ─── Schema del checkout (alineado con app/checkout/_schema.ts) ──
const CheckoutSchema = z.object({
  email:     z.string().email('Email inválido'),
  firstName: z.string().min(2, 'Nombre requerido'),
  lastName:  z.string().min(2, 'Apellido requerido'),
  phone:     z.string().optional(),
  address:   z.string().min(5, 'Dirección requerida'),
  city:      z.string().min(2, 'Ciudad requerida'),
  country:   z.string().default('ES'),
  cp:        z.string().optional(),
  coupon:    z.string().optional(),
});

type CheckoutInput = z.infer<typeof CheckoutSchema>;

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  image?: string;
  slug?: string;
};

type ActionResult<T = void> = { success: true; data?: T } | { error: string };

// ══════════════════════════════════════════════════════════════════
// VALIDAR CUPÓN
// ══════════════════════════════════════════════════════════════════
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<ActionResult<{ discount: number; type: 'percent' | 'fixed'; value: number }>> {
  if (!code?.trim()) return { error: 'Introduce un código de cupón.' };

  const supabase = await createClient();
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('active', true)
    .single();

  if (error || !coupon) return { error: 'Cupón inválido o expirado.' };

  // Verificar expiración
  if (coupon.expires && new Date(coupon.expires) < new Date()) {
    return { error: 'Este cupón ha expirado.' };
  }

  // Verificar máximo de usos
  if (coupon.max_uses !== null && coupon.uses >= coupon.max_uses) {
    return { error: 'Este cupón ya ha alcanzado su límite de uso.' };
  }

  // Verificar pedido mínimo
  if (subtotal < coupon.min_order) {
    return { error: `Pedido mínimo de ${coupon.min_order}€ para usar este cupón.` };
  }

  const discount = coupon.type === 'percent'
    ? (subtotal * coupon.value) / 100
    : Math.min(coupon.value, subtotal);

  return { success: true, data: { discount, type: coupon.type, value: coupon.value } };
}

// ══════════════════════════════════════════════════════════════════
// CALCULAR COSTE DE ENVÍO
// ══════════════════════════════════════════════════════════════════
export async function getShippingCost(
  country: string,
  subtotal: number
): Promise<{ shipping: number; isFree: boolean }> {
  const supabase = await createClient();

  // Verificar umbral de envío gratis
  const { data: settings } = await supabase
    .from('store_settings')
    .select('free_shipping_threshold')
    .eq('id', 1)
    .single();

  const threshold = settings?.free_shipping_threshold ?? 50;
  if (subtotal >= threshold) return { shipping: 0, isFree: true };

  // Buscar zona de envío
  const COUNTRY_ZONE_MAP: Record<string, string> = {
    ES: 'España Peninsular',
    PT: 'Portugal',
  };

  const zoneName = COUNTRY_ZONE_MAP[country] ?? 'Europa';
  const { data: zone } = await supabase
    .from('shipping_zones')
    .select('price')
    .ilike('name', `%${zoneName}%`)
    .eq('enabled', true)
    .single();

  return { shipping: zone?.price ?? 4.99, isFree: false };
}

// ══════════════════════════════════════════════════════════════════
// CREAR PAYMENTINTENT (Stripe)
// ══════════════════════════════════════════════════════════════════
export async function createPaymentIntent(
  items: CartItem[],
  shippingData: Partial<CheckoutInput>,
  couponCode?: string
): Promise<ActionResult<{ clientSecret: string; orderId: string }>> {

  if (!items?.length) return { error: 'El carrito está vacío.' };

  // Calcular subtotal
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Validar cupón si existe
  let discount = 0;
  let validCouponCode: string | undefined;
  if (couponCode) {
    const couponResult = await validateCoupon(couponCode, subtotal);
    if ('error' in couponResult) return { error: couponResult.error };
    discount = couponResult.data!.discount;
    validCouponCode = couponCode.toUpperCase().trim();
  }

  // Calcular envío
  const { shipping } = await getShippingCost(shippingData.country ?? 'ES', subtotal);
  const total = Math.max(0, subtotal - discount + shipping);

  // Stripe PaymentIntent
  const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100), // céntimos
    currency: 'eur',
    automatic_payment_methods: { enabled: true },
    metadata: {
      customer_email: shippingData.email ?? '',
      coupon_code:    validCouponCode ?? '',
    },
  });

  // Pre-crear orden en estado "pendiente" con el PI ID
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id:        user?.id ?? null,
      customer_name:  `${shippingData.firstName ?? ''} ${shippingData.lastName ?? ''}`.trim(),
      customer_email: shippingData.email ?? '',
      customer_phone: shippingData.phone ?? null,
      ship_street:    shippingData.address ?? '',
      ship_city:      shippingData.city ?? '',
      ship_country:   shippingData.country ?? 'ES',
      ship_cp:        shippingData.cp ?? null,
      subtotal,
      shipping_cost:  shipping,
      discount,
      total,
      payment_method: 'card',
      payment_status: 'pending',
      stripe_pi_id:   paymentIntent.id,
      coupon_code:    validCouponCode ?? null,
      status:         'pendiente',
    })
    .select('id')
    .single();

  if (orderError) {
    console.error('[createPaymentIntent] order insert error:', orderError.message);
    return { error: 'No se pudo crear el pedido. Inténtalo de nuevo.' };
  }

  // Insertar items del pedido
  await supabase.from('order_items').insert(
    items.map(item => ({
      order_id:   order.id,
      product_id: item.id,
      name:       item.name,
      variant:    item.variant ?? null,
      price:      item.price,
      quantity:   item.quantity,
      image_url:  item.image ?? null,
      slug:       item.slug ?? null,
    }))
  );

  // Insertar entrada inicial en timeline
  await supabase.from('order_timeline').insert({
    order_id:    order.id,
    status:      'pendiente',
    description: 'Pedido recibido y pendiente de confirmación de pago.',
  });

  return { success: true, data: { clientSecret: paymentIntent.client_secret!, orderId: order.id } };
}

// ══════════════════════════════════════════════════════════════════
// WEBHOOK DE STRIPE (confirmar pago)
// Se llama desde app/api/webhooks/stripe/route.ts
// ══════════════════════════════════════════════════════════════════
export async function confirmOrderPayment(stripePaymentIntentId: string): Promise<void> {
  const supabase = createAdminClient(); // Admin para bypassear RLS en webhook

  // Encontrar la orden por el PI ID
  const { data: order, error } = await supabase
    .from('orders')
    .select('id, coupon_code')
    .eq('stripe_pi_id', stripePaymentIntentId)
    .single();

  if (error || !order) {
    console.error('[confirmOrderPayment] Order not found for PI:', stripePaymentIntentId);
    return;
  }

  // Actualizar a procesando + pago confirmado
  await supabase
    .from('orders')
    .update({ status: 'procesando', payment_status: 'paid' })
    .eq('id', order.id);

  // Incrementar uso del cupón si aplica
  if (order.coupon_code) {
    await supabase.rpc('increment_coupon_uses', { coupon_code: order.coupon_code });
  }

  // Reducir stock de los productos
  const { data: items } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', order.id);

  for (const item of items ?? []) {
    if (item.product_id) {
      await supabase.rpc('decrement_product_stock', {
        p_product_id: item.product_id,
        p_quantity:   item.quantity,
      });
    }
  }

  // Enviar confirmación al cliente con los detalles del pedido
  const { data: fullOrder } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', order.id)
    .single();

  if (fullOrder) {
    sendOrderConfirmationEmail({
      orderId:         fullOrder.id,
      customerName:    fullOrder.customer_name,
      customerEmail:   fullOrder.customer_email,
      items:           (fullOrder.order_items ?? []).map((i: {
        name: string; variant: string | null; quantity: number; price: number;
      }) => ({
        name:     i.name,
        variant:  i.variant,
        quantity: i.quantity,
        price:    i.price,
      })),
      subtotal:        fullOrder.subtotal,
      shippingCost:    fullOrder.shipping_cost,
      discount:        fullOrder.discount,
      total:           fullOrder.total,
      shipStreet:      fullOrder.ship_street,
      shipCity:        fullOrder.ship_city,
      shipCountry:     fullOrder.ship_country,
      shipCp:          fullOrder.ship_cp,
      couponCode:      fullOrder.coupon_code,
    }).catch(err => console.error('[confirmOrderPayment] sendOrderConfirmationEmail failed:', err));
  }
}
