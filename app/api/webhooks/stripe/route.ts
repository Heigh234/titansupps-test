/**
 * app/api/webhooks/stripe/route.ts
 * COPIAR A: app/api/webhooks/stripe/route.ts
 *
 * Webhook handler para eventos de Stripe.
 *
 * SETUP:
 *  1. Stripe Dashboard > Developers > Webhooks > "Add endpoint"
 *     URL: https://tu-dominio.com/api/webhooks/stripe
 *     Eventos a escuchar:
 *       - payment_intent.succeeded
 *       - payment_intent.payment_failed
 *       - charge.refunded
 *  2. Copiar el "Signing secret" (whsec_...) -> STRIPE_WEBHOOK_SECRET en .env.local
 *
 * TEST LOCAL (requiere Stripe CLI):
 *  stripe listen --forward-to localhost:3000/api/webhooks/stripe
 *  stripe trigger payment_intent.succeeded
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { confirmOrderPayment } from '@/actions/checkout';
import { createAdminClient } from '@/lib/supabase/server';

// Cliente Stripe (lazy para evitar errores en build si la key no esta)
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('[Stripe Webhook] STRIPE_SECRET_KEY no configurada.');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Stripe necesita el body como texto RAW para verificar la firma
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET no configurada.');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  // Verificar autenticidad del evento con la firma
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Stripe Webhook] Firma invalida:', msg);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    switch (event.type) {

      /**
       * PAGO EXITOSO
       * confirmOrderPayment (actions/checkout.ts):
       *   -> orders.status        = 'procesando'
       *   -> orders.payment_status= 'paid'
       *   -> decrement_product_stock (RPC) para cada order_item
       *   -> increment_coupon_uses (RPC) si hay cupon aplicado
       *   -> sendOrderConfirmationEmail al cliente via Resend
       */
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.log('[Stripe Webhook] payment_intent.succeeded:', pi.id);
        await confirmOrderPayment(pi.id);
        break;
      }

      /**
       * PAGO FALLIDO
       * Cancela la orden y registra en el timeline.
       */
      case 'payment_intent.payment_failed': {
        const pi    = event.data.object as Stripe.PaymentIntent;
        const admin = createAdminClient();

        await admin
          .from('orders')
          .update({ payment_status: 'failed', status: 'cancelado' })
          .eq('stripe_pi_id', pi.id);

        const { data: ord } = await admin
          .from('orders')
          .select('id')
          .eq('stripe_pi_id', pi.id)
          .single();

        if (ord) {
          await admin.from('order_timeline').insert({
            order_id:    ord.id,
            status:      'cancelado',
            description: 'Pago fallido. Pedido cancelado automaticamente.',
          });
        }
        break;
      }

      /**
       * REEMBOLSO
       * Actualiza payment_status a 'refunded' y registra en timeline.
       */
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        if (!charge.payment_intent) break;

        const admin = createAdminClient();
        const piId  = typeof charge.payment_intent === 'string'
          ? charge.payment_intent
          : charge.payment_intent.id;

        const { data: ord } = await admin
          .from('orders')
          .select('id')
          .eq('stripe_pi_id', piId)
          .single();

        if (ord) {
          await admin
            .from('orders')
            .update({ payment_status: 'refunded' })
            .eq('id', ord.id);

          await admin.from('order_timeline').insert({
            order_id:    ord.id,
            status:      'reembolsado',
            description: `Reembolso procesado desde Stripe. Charge ID: ${charge.id}`,
          });
        }
        break;
      }

      default:
        // Evento no relevante. Responder 200 igualmente.
        break;
    }

    // IMPORTANTE: siempre responder 200 para confirmar recepcion a Stripe
    return NextResponse.json({ received: true });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Stripe Webhook] Error procesando evento:', msg);
    // 500 -> Stripe reintentara el evento automaticamente hasta 3 dias
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
