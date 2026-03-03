/**
 * lib/email/index.ts
 * ─────────────────────────────────────────────────────────────────
 * Capa de abstracción sobre Resend para envío de emails transaccionales.
 *
 * USO SEGURO:
 *  - Solo llamar desde Server Components, Server Actions o API Routes.
 *  - NUNCA importar en componentes 'use client' — expone la API key.
 *
 * RESEND:
 *  - Free tier: 100 emails/día, 3000/mes
 *  - API key: RESEND_API_KEY en .env.local
 *  - From address: debe ser un dominio verificado en Resend
 *
 * CONFIGURACIÓN REQUERIDA:
 *  RESEND_API_KEY=re_xxxxxxxxxxxxx
 *  EMAIL_FROM="TitanSupps <no-reply@titansupps.com>"
 *  EMAIL_ADMIN=admin@titansupps.com
 */

import { Resend } from 'resend';
import {
  welcomeEmailTemplate,
  orderConfirmationEmailTemplate,
  newsletterWelcomeEmailTemplate,
  contactNotificationEmailTemplate,
  affiliateNotificationEmailTemplate,
  type OrderEmailData,
  type ContactEmailData,
  type AffiliateEmailData,
} from './templates';

// ─── Lazy initialization: no instantiate at module load time ─────
// Evita errores de build si la variable de entorno no está definida
// durante la compilación de Next.js.
function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('[Email] RESEND_API_KEY no está configurada en las variables de entorno.');
  }
  return new Resend(process.env.RESEND_API_KEY);
}

// ─── Constantes ───────────────────────────────────────────────────
const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'TitanSupps <no-reply@titansupps.com>';
const ADMIN_EMAIL  = process.env.EMAIL_ADMIN ?? 'admin@titansupps.com';

// ─── Tipo de resultado uniforme ───────────────────────────────────
type EmailResult = { success: true; id?: string } | { success: false; error: string };

// ─── Helper interno con manejo de errores ─────────────────────────
async function sendEmail(opts: {
  to:      string | string[];
  subject: string;
  html:    string;
}): Promise<EmailResult> {
  // Si no hay API key configurada (entorno dev sin Resend), loguear y simular éxito
  if (!process.env.RESEND_API_KEY) {
    console.warn(`[Email DEV] No RESEND_API_KEY — email simulado:
  To:      ${Array.isArray(opts.to) ? opts.to.join(', ') : opts.to}
  Subject: ${opts.subject}`);
    return { success: true };
  }

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from:    FROM_ADDRESS,
      to:      opts.to,
      subject: opts.subject,
      html:    opts.html,
    });

    if (error) {
      console.error('[Email] Error de Resend:', error);
      return { success: false, error: error.message ?? 'Error desconocido de Resend' };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error inesperado';
    console.error('[Email] Excepción:', message);
    return { success: false, error: message };
  }
}

// ══════════════════════════════════════════════════════════════════
// EMAILS PÚBLICOS (dirigidos al usuario/cliente)
// ══════════════════════════════════════════════════════════════════

/**
 * Envía el email de bienvenida tras el registro.
 * Llamar desde: actions/auth.ts → register()
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<EmailResult> {
  return sendEmail({
    to:      email,
    subject: '⚡ Bienvenido a TitanSupps — Tu cuenta está lista',
    html:    welcomeEmailTemplate(name),
  });
}

/**
 * Envía la confirmación de pedido al cliente.
 * Llamar desde: actions/checkout.ts → confirmOrderPayment()
 */
export async function sendOrderConfirmationEmail(
  data: OrderEmailData
): Promise<EmailResult> {
  const shortId = data.orderId.split('-')[0].toUpperCase();
  return sendEmail({
    to:      data.customerEmail,
    subject: `✅ Pedido #${shortId} confirmado — TitanSupps`,
    html:    orderConfirmationEmailTemplate(data),
  });
}

/**
 * Envía el email de bienvenida a newsletter con el cupón TITAN10.
 * Llamar desde: actions/forms.ts → subscribeNewsletter()
 */
export async function sendNewsletterWelcomeEmail(
  email: string
): Promise<EmailResult> {
  return sendEmail({
    to:      email,
    subject: '🔥 Tu 10% de descuento está listo — TitanSupps Newsletter',
    html:    newsletterWelcomeEmailTemplate(email),
  });
}

// ══════════════════════════════════════════════════════════════════
// EMAILS DE NOTIFICACIÓN INTERNA (dirigidos al equipo admin)
// ══════════════════════════════════════════════════════════════════

/**
 * Notifica al equipo cuando llega un nuevo mensaje de contacto.
 * Llamar desde: actions/forms.ts → submitContact()
 */
export async function sendContactNotificationEmail(
  data: ContactEmailData
): Promise<EmailResult> {
  return sendEmail({
    to:      ADMIN_EMAIL,
    subject: `💬 Nuevo contacto: ${data.subject ?? data.name} — TitanSupps`,
    html:    contactNotificationEmailTemplate(data),
  });
}

/**
 * Notifica al equipo cuando llega una solicitud de afiliado.
 * Llamar desde: actions/forms.ts → submitAffiliateApplication()
 */
export async function sendAffiliateNotificationEmail(
  data: AffiliateEmailData
): Promise<EmailResult> {
  return sendEmail({
    to:      ADMIN_EMAIL,
    subject: `🤝 Nueva solicitud de afiliado: ${data.name} — TitanSupps`,
    html:    affiliateNotificationEmailTemplate(data),
  });
}
