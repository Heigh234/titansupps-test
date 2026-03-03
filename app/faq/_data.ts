/**
 * app/faq/_data.ts — Datos estáticos de la FAQ
 * ──────────────────────────────────────────────
 * Centraliza FAQ_DATA que antes vivía inline en page.tsx.
 * Mismo patrón que about/_data.ts, privacy/_data.ts, etc.
 *
 * TIPOS EXPORTADOS:
 * FaqPregunta y FaqCategoria se exportan para tipar correctamente
 * las props de FaqAccordion sin duplicar definiciones.
 *
 * EN PRODUCCIÓN: reemplazar este array por una llamada a CMS o API.
 * La firma de los tipos ya está preparada para esa migración.
 */

import { Package, FlaskConical, CreditCard, Truck, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface FaqPregunta {
  q: string;
  a: string;
}

export interface FaqCategoria {
  categoria:  string;
  icon:       LucideIcon;
  preguntas:  FaqPregunta[];
}

// ─── Datos ───────────────────────────────────────────────────────────────────

export const FAQ_DATA: FaqCategoria[] = [
  {
    categoria: 'Pedidos y Envíos',
    icon: Truck,
    preguntas: [
      {
        q: '¿Cuánto tarda en llegar mi pedido?',
        a: 'El tiempo de entrega estándar es de 24 a 48 horas hábiles para la mayoría de destinos nacionales. Pedidos realizados antes de las 14:00h se procesan el mismo día. Recibirás un correo con el número de seguimiento en cuanto tu pedido salga de nuestro almacén.',
      },
      {
        q: '¿Tienen envío gratuito?',
        a: 'Sí. Todos los pedidos iguales o superiores a $60 USD tienen envío gratuito incluido. Para pedidos menores, el costo de envío se calcula automáticamente en el checkout según tu ubicación.',
      },
      {
        q: '¿Puedo cambiar la dirección de envío después de realizar el pedido?',
        a: 'Puedes modificar la dirección de envío hasta 1 hora después de realizar el pedido, siempre que no haya sido procesado aún. Contacta a soporte@titansupps.com inmediatamente con tu número de pedido.',
      },
      {
        q: '¿Hacen envíos internacionales?',
        a: 'Actualmente hacemos envíos a 24 países. En el checkout, si tu país aparece en el selector, hacemos envío a esa dirección. Los tiempos internacionales varían entre 5 y 12 días hábiles según el destino y aduanas.',
      },
    ],
  },
  {
    categoria: 'Productos y Fórmulas',
    icon: FlaskConical,
    preguntas: [
      {
        q: '¿Los productos de TitanSupps tienen certificaciones de terceros?',
        a: 'Sí. Todos nuestros productos son analizados por laboratorios independientes antes de cada lanzamiento de lote. Publicamos los Certificados de Análisis (COA) en nuestra web. Puedes encontrar el COA de cualquier producto en su página de descripción, en la pestaña "Certificaciones".',
      },
      {
        q: '¿Son seguros para competidores testados?',
        a: 'Nuestras fórmulas no contienen sustancias prohibidas por WADA. Sin embargo, te recomendamos siempre verificar cada ingrediente contra la lista vigente de tu federación, ya que las regulaciones pueden cambiar. Para competidores de alto rendimiento, nuestros productos con sello "Informed Sport" son los más recomendados.',
      },
      {
        q: '¿Cuál es la fecha de caducidad de los productos?',
        a: 'Nuestros productos tienen una vida útil de 18 a 24 meses desde la fecha de fabricación. Siempre encontrarás la fecha de caducidad impresa en el fondo del contenedor. Los productos que enviamos tienen mínimo 12 meses de vida útil restante.',
      },
      {
        q: '¿Puedo tomar varios productos al mismo tiempo?',
        a: 'La mayoría de combinaciones son seguras (ej: proteína + creatina es el stack más estudiado de la historia). Para stacks más complejos, consulta nuestra guía de apilamiento en el blog o contacta a nuestro equipo de nutrición. Si tomas medicación recetada, consulta con tu médico antes.',
      },
    ],
  },
  {
    categoria: 'Pagos y Facturación',
    icon: CreditCard,
    preguntas: [
      {
        q: '¿Qué métodos de pago aceptan?',
        a: 'Aceptamos tarjetas de crédito y débito Visa, Mastercard y American Express, PayPal, y transferencia bancaria. Todos los pagos se procesan con encriptación SSL de 256 bits. En ningún momento almacenamos los datos completos de tu tarjeta.',
      },
      {
        q: '¿Emiten facturas?',
        a: 'Sí. La factura o comprobante de compra se genera automáticamente al completar el pedido y se envía a tu correo registrado. Si necesitas una factura fiscal con datos empresariales, contáctanos en facturacion@titansupps.com dentro de los 30 días del pedido.',
      },
      {
        q: '¿Cuándo se realiza el cobro?',
        a: 'El cobro se realiza en el momento en que confirmas el pedido. No realizamos pre-autorizaciones ni cobros en diferido. Si tu tarjeta es rechazada, el pedido no se procesa y no se realiza ningún cargo.',
      },
    ],
  },
  {
    categoria: 'Cuenta y Privacidad',
    icon: User,
    preguntas: [
      {
        q: '¿Es obligatorio crear una cuenta para comprar?',
        a: 'No. Puedes realizar compras como invitado. Sin embargo, tener una cuenta te permite hacer seguimiento de pedidos en tiempo real, guardar direcciones, acumular puntos de fidelidad y acceder a ofertas exclusivas para miembros.',
      },
      {
        q: '¿Cómo eliminan mis datos si quiero darme de baja?',
        a: 'Puedes solicitar la eliminación completa de tu cuenta y todos tus datos personales enviando un correo a privacidad@titansupps.com. Procesamos estas solicitudes en un máximo de 72 horas hábiles, en cumplimiento con el RGPD / GDPR.',
      },
      {
        q: '¿Venden mis datos a terceros?',
        a: 'Nunca. Los datos que recopilamos se utilizan exclusivamente para gestionar tu pedido, mejorar tu experiencia de compra y (si lo autorizas) enviarte comunicaciones de marketing propias. No compartimos, vendemos ni cedemos tu información a ningún tercero sin tu consentimiento expreso.',
      },
    ],
  },
  {
    categoria: 'Devoluciones',
    icon: Package,
    preguntas: [
      {
        q: '¿Cuánto tiempo tengo para devolver un producto?',
        a: 'Tienes 30 días desde la fecha de entrega para solicitar una devolución. El producto debe estar en las condiciones indicadas en nuestra política de devoluciones (sellado, sin abrir, en buen estado).',
      },
      {
        q: '¿Cuánto tarda en hacerse el reembolso?',
        a: 'Una vez que recibimos y verificamos el producto devuelto, procesamos el reembolso en 24 horas. El tiempo en que el dinero aparece en tu cuenta depende de tu banco o procesador de pago (generalmente 3-7 días hábiles).',
      },
    ],
  },
];
