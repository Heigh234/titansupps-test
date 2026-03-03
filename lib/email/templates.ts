/**
 * lib/email/templates.ts
 * ─────────────────────────────────────────────────────────────────
 * Templates HTML de emails transaccionales para TitanSupps.
 *
 * DECISIONES DE DISEÑO:
 *  - Inline styles: máxima compatibilidad con clientes de email
 *    (Gmail, Outlook, Apple Mail, Yahoo — todos strips <style> tags)
 *  - Table-based layout: Outlook 2007-2019 no soporta flexbox/grid
 *  - Dark luxury: fondo #050505 + acento #ff5e00 + tipografía system-safe
 *  - max-width: 600px — estándar de la industria para emails
 *  - preheader text invisible: mejora open rate mostrando texto en el preview
 *    del cliente de email antes de abrir el mensaje
 *
 * NOTA: Las fuentes web (Bebas Neue, DM Sans) no son confiables en email.
 *  Usamos Arial + Georgia como fallbacks seguros para todos los clientes.
 */

// ─── Paleta ───────────────────────────────────────────────────────
const C = {
  bg:           '#050505',
  surface:      '#121212',
  border:       '#2a2a2a',
  accent:       '#ff5e00',
  accentDark:   '#cc4b00',
  text:         '#fafafa',
  textMuted:    '#a1a1aa',
} as const;

// ─── Wrapper base compartido por todos los templates ─────────────
function baseWrapper(preheader: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>TitanSupps</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${C.bg};font-family:Arial,Helvetica,sans-serif;">

  <!-- Preheader invisible: aparece en el preview del cliente de email -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${preheader}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;
  </div>

  <!-- Wrapper principal -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.bg};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        
        <!-- Contenedor central 600px -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
          
          <!-- HEADER: Logo + barra de acento -->
          <tr>
            <td style="background-color:${C.surface};border-bottom:2px solid ${C.accent};padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:900;color:${C.text};letter-spacing:4px;text-transform:uppercase;">
                      TITAN<span style="color:${C.accent};">SUPPS</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size:10px;color:${C.textMuted};letter-spacing:2px;text-transform:uppercase;">
                      Elite Performance
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background-color:${C.surface};padding:40px;">
              ${body}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:${C.bg};border-top:1px solid ${C.border};padding:32px 40px;text-align:center;">
              <p style="margin:0 0 12px;font-size:12px;color:${C.textMuted};">
                © ${new Date().getFullYear()} TitanSupps. Todos los derechos reservados.
              </p>
              <p style="margin:0 0 12px;font-size:11px;color:${C.border};">
                Has recibido este email porque tienes cuenta en TitanSupps.
              </p>
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="font-size:11px;color:${C.textMuted};text-decoration:none;">
                      Tienda
                    </a>
                  </td>
                  <td style="color:${C.border};font-size:11px;">|</td>
                  <td style="padding:0 8px;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account" style="font-size:11px;color:${C.textMuted};text-decoration:none;">
                      Mi Cuenta
                    </a>
                  </td>
                  <td style="color:${C.border};font-size:11px;">|</td>
                  <td style="padding:0 8px;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact" style="font-size:11px;color:${C.textMuted};text-decoration:none;">
                      Soporte
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`.trim();
}

// ─── Helper: botón CTA ───────────────────────────────────────────
function ctaButton(text: string, href: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
  <tr>
    <td style="background-color:${C.accent};border-radius:0;">
      <a href="${href}" style="display:inline-block;padding:16px 36px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;text-transform:uppercase;letter-spacing:2px;">
        ${text}
      </a>
    </td>
  </tr>
</table>`;
}

// ─── Helper: divisor ─────────────────────────────────────────────
function divider(): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
    <tr><td style="border-top:1px solid ${C.border};"></td></tr>
  </table>`;
}

// ─── Helper: fila de datos del pedido ────────────────────────────
function orderRow(label: string, value: string, highlight = false): string {
  return `
<tr>
  <td style="padding:10px 0;font-size:13px;color:${C.textMuted};border-bottom:1px solid ${C.border};">
    ${label}
  </td>
  <td style="padding:10px 0;font-size:13px;font-weight:700;color:${highlight ? C.accent : C.text};text-align:right;border-bottom:1px solid ${C.border};">
    ${value}
  </td>
</tr>`;
}

// ══════════════════════════════════════════════════════════════════
// 1. BIENVENIDA TRAS REGISTRO
// ══════════════════════════════════════════════════════════════════
export function welcomeEmailTemplate(name: string): string {
  const firstName = name?.split(' ')[0] ?? 'Atleta';

  const body = `
<!-- Hero de bienvenida -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;background:linear-gradient(135deg,#1a0a00,#0d0d0d);border:1px solid ${C.border};">
  <tr>
    <td style="padding:36px;text-align:center;">
      <div style="display:inline-block;width:64px;height:64px;background-color:${C.accent};margin-bottom:16px;">
        <!-- Icono bolt/rayo en ASCII art -->
        <table width="100%" height="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center" valign="middle" style="font-size:32px;color:#000;font-weight:900;">⚡</td></tr>
        </table>
      </div>
      <p style="margin:0;font-size:11px;color:${C.accent};letter-spacing:4px;text-transform:uppercase;font-weight:700;">
        Bienvenido al batallón
      </p>
    </td>
  </tr>
</table>

<h1 style="margin:0 0 8px;font-size:28px;font-weight:900;color:${C.text};text-transform:uppercase;letter-spacing:2px;line-height:1.1;">
  Hola, ${firstName}.
</h1>
<p style="margin:0 0 24px;font-size:32px;font-weight:900;color:${C.accent};text-transform:uppercase;letter-spacing:1px;line-height:1.0;">
  Tu cuenta está lista.
</p>
<p style="margin:0 0 24px;font-size:15px;color:${C.textMuted};line-height:1.7;">
  Acabas de unirte a la comunidad de atletas que eligen la suplementación sin filtros. 
  Rendimiento real, ciencia real, resultados reales.
</p>

${ctaButton('Explorar productos', `${process.env.NEXT_PUBLIC_SITE_URL}/catalog`)}

${divider()}

<!-- Beneficios de la cuenta -->
<p style="margin:0 0 16px;font-size:12px;color:${C.textMuted};text-transform:uppercase;letter-spacing:3px;font-weight:700;">
  Qué puedes hacer ahora
</p>

<table width="100%" cellpadding="0" cellspacing="0" border="0">
  ${[
    ['🛒', 'Añadir productos a tu lista de deseos'],
    ['📦', 'Ver el estado de tus pedidos en tiempo real'],
    ['🏠', 'Guardar direcciones de envío'],
    ['🎟️', 'Usar códigos de cupón exclusivos'],
  ].map(([icon, text]) => `
  <tr>
    <td style="padding:8px 0;vertical-align:top;width:32px;font-size:18px;">${icon}</td>
    <td style="padding:8px 0;font-size:14px;color:${C.textMuted};padding-left:12px;">${text}</td>
  </tr>`).join('')}
</table>

${divider()}

<p style="margin:0;font-size:13px;color:${C.border};">
  ¿Tienes dudas? Escríbenos a 
  <a href="mailto:soporte@titansupps.com" style="color:${C.accent};text-decoration:none;">
    soporte@titansupps.com
  </a>
</p>
`;

  return baseWrapper(
    `Bienvenido a TitanSupps, ${firstName}. Tu cuenta está lista — empieza a forjar tu leyenda.`,
    body
  );
}

// ══════════════════════════════════════════════════════════════════
// 2. CONFIRMACIÓN DE PEDIDO
// ══════════════════════════════════════════════════════════════════
export interface OrderEmailData {
  orderId:         string;
  customerName:    string;
  customerEmail:   string;
  items:           { name: string; variant?: string | null; quantity: number; price: number }[];
  subtotal:        number;
  shippingCost:    number;
  discount:        number;
  total:           number;
  shipStreet:      string;
  shipCity:        string;
  shipCountry:     string;
  shipCp?:         string | null;
  couponCode?:     string | null;
}

export function orderConfirmationEmailTemplate(data: OrderEmailData): string {
  const firstName = data.customerName?.split(' ')[0] ?? 'Atleta';
  const orderId   = data.orderId.split('-')[0].toUpperCase(); // primeros 8 chars del UUID

  const itemsHtml = data.items.map(item => `
<tr>
  <td style="padding:12px 0;font-size:14px;color:${C.text};border-bottom:1px solid ${C.border};">
    <span style="font-weight:700;">${item.name}</span>
    ${item.variant ? `<br/><span style="font-size:12px;color:${C.textMuted};">${item.variant}</span>` : ''}
  </td>
  <td style="padding:12px 0;font-size:13px;color:${C.textMuted};text-align:center;border-bottom:1px solid ${C.border};">
    ×${item.quantity}
  </td>
  <td style="padding:12px 0;font-size:14px;font-weight:700;color:${C.text};text-align:right;border-bottom:1px solid ${C.border};">
    ${(item.price * item.quantity).toFixed(2)}€
  </td>
</tr>`).join('');

  const body = `
<!-- Confirmación hero -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;border-left:3px solid ${C.accent};padding-left:20px;">
  <tr>
    <td>
      <p style="margin:0 0 4px;font-size:11px;color:${C.accent};letter-spacing:4px;text-transform:uppercase;font-weight:700;">
        Pedido confirmado
      </p>
      <h1 style="margin:0;font-size:30px;font-weight:900;color:${C.text};text-transform:uppercase;letter-spacing:1px;">
        ¡Está en camino,<br/>${firstName}!
      </h1>
    </td>
  </tr>
</table>

<p style="margin:0 0 24px;font-size:15px;color:${C.textMuted};line-height:1.7;">
  Hemos recibido tu pedido y ya estamos preparándolo. Te notificaremos cuando salga de nuestro almacén.
</p>

<!-- Referencia del pedido -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;background-color:${C.bg};border:1px solid ${C.border};padding:20px;">
  <tr>
    <td style="padding:16px 20px;">
      <p style="margin:0 0 4px;font-size:10px;color:${C.textMuted};letter-spacing:3px;text-transform:uppercase;">
        Número de pedido
      </p>
      <p style="margin:0;font-size:20px;font-weight:900;color:${C.accent};letter-spacing:2px;text-transform:uppercase;">
        #${orderId}
      </p>
    </td>
  </tr>
</table>

<!-- Productos -->
<p style="margin:0 0 16px;font-size:12px;color:${C.textMuted};text-transform:uppercase;letter-spacing:3px;font-weight:700;">
  Resumen del pedido
</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
  <thead>
    <tr>
      <td style="font-size:11px;color:${C.border};text-transform:uppercase;letter-spacing:2px;padding-bottom:8px;border-bottom:1px solid ${C.border};">Producto</td>
      <td style="font-size:11px;color:${C.border};text-transform:uppercase;letter-spacing:2px;padding-bottom:8px;text-align:center;border-bottom:1px solid ${C.border};">Uds</td>
      <td style="font-size:11px;color:${C.border};text-transform:uppercase;letter-spacing:2px;padding-bottom:8px;text-align:right;border-bottom:1px solid ${C.border};">Precio</td>
    </tr>
  </thead>
  <tbody>
    ${itemsHtml}
  </tbody>
</table>

<!-- Totales -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
  ${orderRow('Subtotal', `${data.subtotal.toFixed(2)}€`)}
  ${data.discount > 0 ? orderRow(`Descuento${data.couponCode ? ` (${data.couponCode})` : ''}`, `-${data.discount.toFixed(2)}€`) : ''}
  ${orderRow('Envío', data.shippingCost === 0 ? '¡GRATIS!' : `${data.shippingCost.toFixed(2)}€`)}
  ${orderRow('TOTAL', `${data.total.toFixed(2)}€`, true)}
</table>

${divider()}

<!-- Dirección de envío -->
<p style="margin:0 0 12px;font-size:12px;color:${C.textMuted};text-transform:uppercase;letter-spacing:3px;font-weight:700;">
  Dirección de envío
</p>
<p style="margin:0 0 24px;font-size:14px;color:${C.text};line-height:1.8;">
  ${data.customerName}<br/>
  ${data.shipStreet}<br/>
  ${data.shipCp ? `${data.shipCp} ` : ''}${data.shipCity}<br/>
  ${data.shipCountry}
</p>

${ctaButton('Ver estado del pedido', `${process.env.NEXT_PUBLIC_SITE_URL}/account`)}

${divider()}

<p style="margin:0;font-size:13px;color:${C.border};">
  ¿Algún problema con tu pedido? 
  <a href="mailto:soporte@titansupps.com" style="color:${C.accent};text-decoration:none;">
    Contáctanos
  </a>
  y lo resolvemos en menos de 24h.
</p>
`;

  return baseWrapper(
    `Pedido #${orderId} confirmado — Total: ${data.total.toFixed(2)}€. Gracias por tu confianza, ${firstName}.`,
    body
  );
}

// ══════════════════════════════════════════════════════════════════
// 3. BIENVENIDA A NEWSLETTER
// ══════════════════════════════════════════════════════════════════
export function newsletterWelcomeEmailTemplate(email: string): string {
  const body = `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;text-align:center;">
  <tr>
    <td style="padding:36px;background:linear-gradient(135deg,#1a0600,#0d0d0d);border:1px solid ${C.border};">
      <p style="margin:0 0 16px;font-size:40px;">🔥</p>
      <p style="margin:0;font-size:11px;color:${C.accent};letter-spacing:4px;text-transform:uppercase;font-weight:700;">
        Ya eres parte del batallón
      </p>
    </td>
  </tr>
</table>

<h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:${C.text};text-transform:uppercase;letter-spacing:2px;">
  Suscripción confirmada.
</h1>
<p style="margin:0 0 24px;font-size:18px;font-weight:700;color:${C.accent};text-transform:uppercase;">
  Tu 10% de descuento está esperando.
</p>
<p style="margin:0 0 24px;font-size:15px;color:${C.textMuted};line-height:1.7;">
  Recibirás lo mejor de TitanSupps directamente en tu bandeja: 
  ofertas exclusivas, nuevos lanzamientos y contenido de entrenamiento 
  antes que nadie.
</p>

<!-- Cupón destacado -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
  <tr>
    <td style="background-color:${C.bg};border:2px dashed ${C.accent};padding:24px;text-align:center;">
      <p style="margin:0 0 8px;font-size:11px;color:${C.textMuted};letter-spacing:3px;text-transform:uppercase;">
        Tu código de bienvenida
      </p>
      <p style="margin:0 0 8px;font-size:28px;font-weight:900;color:${C.accent};letter-spacing:6px;text-transform:uppercase;">
        TITAN10
      </p>
      <p style="margin:0;font-size:12px;color:${C.border};">
        10% de descuento en tu primer pedido
      </p>
    </td>
  </tr>
</table>

${ctaButton('Usar mi descuento ahora', `${process.env.NEXT_PUBLIC_SITE_URL}/catalog`)}

${divider()}

<p style="margin:0 0 8px;font-size:12px;color:${C.border};">
  Email registrado: ${email}
</p>
<p style="margin:0;font-size:12px;color:${C.border};">
  Si no te suscribiste a esta newsletter, puedes ignorar este email.
</p>
`;

  return baseWrapper(
    'Tu 10% de descuento en TitanSupps está listo. Usa TITAN10 en tu próximo pedido.',
    body
  );
}

// ══════════════════════════════════════════════════════════════════
// 4. NOTIFICACIÓN INTERNA: NUEVO MENSAJE DE CONTACTO
// ══════════════════════════════════════════════════════════════════
export interface ContactEmailData {
  name:    string;
  email:   string;
  subject?: string;
  message: string;
}

export function contactNotificationEmailTemplate(data: ContactEmailData): string {
  const body = `
<p style="margin:0 0 8px;font-size:11px;color:${C.accent};letter-spacing:4px;text-transform:uppercase;font-weight:700;">
  Admin · Contacto
</p>
<h1 style="margin:0 0 24px;font-size:22px;font-weight:900;color:${C.text};text-transform:uppercase;">
  Nuevo mensaje recibido
</h1>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;background-color:${C.bg};border:1px solid ${C.border};">
  ${[
    ['Nombre',  data.name],
    ['Email',   data.email],
    ['Asunto',  data.subject ?? '—'],
  ].map(([k, v]) => `
  <tr>
    <td style="padding:12px 20px;font-size:12px;color:${C.textMuted};text-transform:uppercase;letter-spacing:2px;width:120px;border-bottom:1px solid ${C.border};">
      ${k}
    </td>
    <td style="padding:12px 20px;font-size:14px;color:${C.text};border-bottom:1px solid ${C.border};">
      ${v}
    </td>
  </tr>`).join('')}
</table>

<p style="margin:0 0 12px;font-size:12px;color:${C.textMuted};text-transform:uppercase;letter-spacing:2px;font-weight:700;">
  Mensaje
</p>
<div style="background-color:${C.bg};border-left:3px solid ${C.accent};padding:16px 20px;margin-bottom:28px;">
  <p style="margin:0;font-size:14px;color:${C.text};line-height:1.8;white-space:pre-wrap;">
    ${data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
  </p>
</div>

${ctaButton('Responder mensaje', `${process.env.NEXT_PUBLIC_SITE_URL}/admin`)}
`;

  return baseWrapper(
    `Nuevo contacto de ${data.name}: ${data.subject ?? data.message.substring(0, 60)}...`,
    body
  );
}

// ══════════════════════════════════════════════════════════════════
// 5. NOTIFICACIÓN INTERNA: NUEVA CANDIDATURA DE AFILIADO
// ══════════════════════════════════════════════════════════════════
export interface AffiliateEmailData {
  name:       string;
  email:      string;
  platform?:  string;
  followers?: string;
  motivation: string;
}

export function affiliateNotificationEmailTemplate(data: AffiliateEmailData): string {
  const body = `
<p style="margin:0 0 8px;font-size:11px;color:${C.accent};letter-spacing:4px;text-transform:uppercase;font-weight:700;">
  Admin · Afiliados
</p>
<h1 style="margin:0 0 24px;font-size:22px;font-weight:900;color:${C.text};text-transform:uppercase;">
  Nueva solicitud de afiliado
</h1>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;background-color:${C.bg};border:1px solid ${C.border};">
  ${[
    ['Nombre',      data.name],
    ['Email',       data.email],
    ['Plataforma',  data.platform ?? '—'],
    ['Seguidores',  data.followers ?? '—'],
  ].map(([k, v]) => `
  <tr>
    <td style="padding:12px 20px;font-size:12px;color:${C.textMuted};text-transform:uppercase;letter-spacing:2px;width:130px;border-bottom:1px solid ${C.border};">
      ${k}
    </td>
    <td style="padding:12px 20px;font-size:14px;color:${C.text};border-bottom:1px solid ${C.border};">
      ${v}
    </td>
  </tr>`).join('')}
</table>

<p style="margin:0 0 12px;font-size:12px;color:${C.textMuted};text-transform:uppercase;letter-spacing:2px;font-weight:700;">
  Motivación
</p>
<div style="background-color:${C.bg};border-left:3px solid ${C.accent};padding:16px 20px;margin-bottom:28px;">
  <p style="margin:0;font-size:14px;color:${C.text};line-height:1.8;">
    ${data.motivation.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
  </p>
</div>

${ctaButton('Ver en admin', `${process.env.NEXT_PUBLIC_SITE_URL}/admin`)}
`;

  return baseWrapper(
    `Nueva solicitud de afiliado: ${data.name} (${data.platform ?? 'sin plataforma'}, ${data.followers ?? '?'} seguidores)`,
    body
  );
}
