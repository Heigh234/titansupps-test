/**
 * app/terms/_data.ts — Datos estáticos de Términos y Condiciones
 * ────────────────────────────────────────────────────────────────
 * Centraliza los arrays que antes vivían inline en el JSX de page.tsx.
 * Mismo patrón que about/_data.ts, privacy/_data.ts, cookies/_data.ts.
 *
 * En producción: migrar a un CMS o archivos MDX para que el equipo legal
 * pueda actualizar el contenido sin tocar código.
 */

// ─── Meta ─────────────────────────────────────────────────────────────────────

export const ULTIMA_ACTUALIZACION = '1 de enero de 2026';

// ─── Índice lateral ───────────────────────────────────────────────────────────

export const SECCIONES = [
  { id: 'aceptacion',      titulo: '1. Aceptación de los Términos' },
  { id: 'descripcion',     titulo: '2. Descripción del Servicio' },
  { id: 'registro',        titulo: '3. Registro y Cuenta de Usuario' },
  { id: 'pedidos',         titulo: '4. Pedidos y Contrato de Compra' },
  { id: 'precios',         titulo: '5. Precios y Pagos' },
  { id: 'envios',          titulo: '6. Envíos y Entrega' },
  { id: 'devolucion',      titulo: '7. Derecho de Desistimiento' },
  { id: 'productos',       titulo: '8. Uso de los Productos' },
  { id: 'propiedad',       titulo: '9. Propiedad Intelectual' },
  { id: 'responsabilidad', titulo: '10. Limitación de Responsabilidad' },
  { id: 'ley',             titulo: '11. Ley Aplicable y Jurisdicción' },
] as const;

// ─── Sección 2 — Servicios ofrecidos ─────────────────────────────────────────

export const SERVICIOS = [
  'Venta de productos de suplementación vía catálogo online',
  'Asesoramiento general sobre productos (sin fines médicos ni terapéuticos)',
  'Gestión de pedidos, envíos y devoluciones',
  'Programa de fidelización y sistema de afiliados',
  'Contenido informativo sobre nutrición deportiva (Blog & Ciencia)',
];

// ─── Sección 3 — Compromisos del usuario registrado ──────────────────────────

export const COMPROMISOS_REGISTRO = [
  {
    titulo: 'Datos verídicos',
    desc: 'Proporcionar información real, precisa y actualizada durante el registro.',
  },
  {
    titulo: 'Seguridad de credenciales',
    desc: 'Mantener la confidencialidad de tu contraseña. Cualquier actividad realizada bajo tu cuenta es tu responsabilidad.',
  },
  {
    titulo: 'Notificación de brechas',
    desc: 'Informarnos inmediatamente si sospechas que tu cuenta ha sido comprometida.',
  },
  {
    titulo: 'Uso personal',
    desc: 'No ceder ni transferir tu cuenta a terceros. Una cuenta por persona.',
  },
];

// ─── Sección 4 — Pasos del proceso de compra ─────────────────────────────────

export const PASOS_COMPRA = [
  'El usuario añade productos al carrito y completa el proceso de checkout con sus datos de envío y pago.',
  'Al hacer clic en "Confirmar Pedido", el usuario realiza una oferta de compra firme.',
  'TitanSupps envía un correo de confirmación de recepción del pedido. Esto NO constituye aceptación del contrato.',
  'El contrato se perfecciona cuando TitanSupps envía la confirmación de despacho con el número de seguimiento.',
  'Si algún producto no estuviera disponible o hubiera un error de precio, contactaremos al usuario antes de procesar el pedido.',
];

// ─── Sección 6 — Tabla de envíos ─────────────────────────────────────────────

export const TABLA_ENVIOS = [
  { dest: 'Nacional (España)', plazo: '24–48h hábiles',      gratis: '$60 USD' },
  { dest: 'Europa (UE)',       plazo: '3–5 días hábiles',    gratis: '$100 USD' },
  { dest: 'Internacional',     plazo: '5–12 días hábiles',   gratis: '$150 USD' },
];

// ─── Sección 8 — Declaraciones de uso de productos ───────────────────────────

export const DECLARACIONES_USO = [
  'Los suplementos son complementos a una dieta equilibrada y no sustituyen una alimentación variada.',
  'Ha consultado con un profesional de la salud si padece alguna condición médica preexistente.',
  'Ha leído y comprende la información sobre alérgenos indicada en el etiquetado.',
  'No está embarazada, en período de lactancia, ni suministrará los productos a menores.',
  'Los productos se almacenarán en las condiciones indicadas en el envase (lugar fresco, seco y alejado de la luz solar directa).',
];

// ─── Sección 10 — Exclusiones de responsabilidad ─────────────────────────────

export const EXCLUSIONES_RESPONSABILIDAD = [
  'Daños indirectos, incidentales o consecuentes derivados del uso o imposibilidad de uso de los productos.',
  'Reacciones adversas derivadas de un uso incorrecto o no conforme a las instrucciones del etiquetado.',
  'Daños causados por circunstancias de fuerza mayor (catástrofes naturales, huelgas, etc.).',
  'Contenido de sitios web de terceros enlazados desde nuestra plataforma.',
];
