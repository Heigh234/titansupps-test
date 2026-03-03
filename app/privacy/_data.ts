/**
 * app/privacy/_data.ts — Datos estáticos de la Política de Privacidad
 * ─────────────────────────────────────────────────────────────────────
 * CONVENCIÓN: prefijo "_" indica archivo de infraestructura/soporte,
 * no un componente ni una página. Mismo patrón que about/_data.ts,
 * careers/_data.ts, etc.
 *
 * Centralizar los datos aquí permite actualizar el contenido legal
 * sin tener que navegar por el JSX. En producción, estos datos
 * vendrían de un CMS (Contentful, Sanity) o de archivos MDX.
 */

// ─── Meta ─────────────────────────────────────────────────────────────────────

export const ULTIMA_ACTUALIZACION = '1 de enero de 2026';

// ─── Índice lateral ───────────────────────────────────────────────────────────
// Usado tanto en el <nav> del sidebar como para renderizar las secciones.

export const SECCIONES = [
  { id: 'responsable',    titulo: '1. Responsable del Tratamiento' },
  { id: 'datos-recogidos', titulo: '2. Datos que Recopilamos' },
  { id: 'finalidades',    titulo: '3. Para qué Usamos tus Datos' },
  { id: 'base-legal',     titulo: '4. Base Legal del Tratamiento' },
  { id: 'conservacion',   titulo: '5. Cuánto Tiempo Conservamos tus Datos' },
  { id: 'destinatarios',  titulo: '6. Compartir Datos con Terceros' },
  { id: 'derechos',       titulo: '7. Tus Derechos' },
  { id: 'cookies',        titulo: '8. Cookies' },
  { id: 'menores',        titulo: '9. Menores de Edad' },
  { id: 'cambios',        titulo: '10. Cambios en esta Política' },
  { id: 'contacto',       titulo: '11. Contacto' },
] as const;

// ─── Sección 2 — Datos que Recopilamos ───────────────────────────────────────

export const DATOS_CATEGORIAS = [
  {
    cat: 'Datos de registro',
    items: [
      'Nombre completo',
      'Dirección de correo electrónico',
      'Contraseña (almacenada en formato hash bcrypt)',
      'Fecha de registro',
    ],
  },
  {
    cat: 'Datos de compra',
    items: [
      'Dirección de envío y facturación',
      'Historial de pedidos',
      'Método de pago (solo los últimos 4 dígitos de la tarjeta — nunca almacenamos el número completo)',
      'Preferencias de productos',
    ],
  },
  {
    cat: 'Datos de navegación',
    items: [
      'Dirección IP (anonimizada tras 90 días)',
      'Tipo de dispositivo y navegador',
      'Páginas visitadas y tiempo en cada sección',
      'Fuente de tráfico (cómo llegaste a nuestra web)',
    ],
  },
  {
    cat: 'Comunicaciones',
    items: [
      'Correos enviados a soporte',
      'Respuestas a encuestas de satisfacción (siempre voluntarias)',
    ],
  },
];

// ─── Sección 3 — Finalidades ──────────────────────────────────────────────────

export const FINALIDADES = [
  {
    fin: 'Gestión de pedidos',
    desc: 'Procesar tu compra, coordinar el envío, emitir facturas y gestionar devoluciones.',
  },
  {
    fin: 'Atención al cliente',
    desc: 'Responder a tus consultas, resolver incidencias y mejorar la calidad de nuestro soporte.',
  },
  {
    fin: 'Comunicaciones de marketing',
    desc: 'Enviarte newsletters, ofertas y novedades. Solo si das tu consentimiento explícito. Puedes darte de baja en cualquier momento desde el enlace en cada correo.',
  },
  {
    fin: 'Mejora del servicio',
    desc: 'Analizar cómo se usa la web para mejorar la experiencia de usuario. Usamos datos anonimizados y agregados.',
  },
  {
    fin: 'Cumplimiento legal',
    desc: 'Conservar registros de transacciones según obliga la legislación fiscal y mercantil.',
  },
];

// ─── Sección 4 — Base Legal ───────────────────────────────────────────────────

export const BASE_LEGAL = [
  {
    base: 'Ejecución de contrato',
    art:  'Art. 6.1.b RGPD',
    desc: 'Para gestionar tu pedido y la relación comercial.',
  },
  {
    base: 'Consentimiento',
    art:  'Art. 6.1.a RGPD',
    desc: 'Para enviarte comunicaciones de marketing.',
  },
  {
    base: 'Interés legítimo',
    art:  'Art. 6.1.f RGPD',
    desc: 'Para análisis de uso del servicio y prevención del fraude.',
  },
  {
    base: 'Obligación legal',
    art:  'Art. 6.1.c RGPD',
    desc: 'Para cumplir con normativas fiscales y contables.',
  },
];

// ─── Sección 5 — Conservación de datos ───────────────────────────────────────

export const CONSERVACION_TABLA = [
  { tipo: 'Datos de cuenta activa',     periodo: 'Mientras la cuenta esté activa',  motivo: 'Prestación del servicio' },
  { tipo: 'Historial de pedidos',       periodo: '7 años',                           motivo: 'Obligación fiscal (Ley del IVA)' },
  { tipo: 'Datos de marketing',         periodo: 'Hasta retirar el consentimiento',  motivo: 'Base: consentimiento revocable' },
  { tipo: 'Logs de acceso',             periodo: '12 meses',                         motivo: 'Seguridad y detección de fraude' },
  { tipo: 'IP anonimizada',             periodo: '90 días',                          motivo: 'Análisis de tráfico agregado' },
  { tipo: 'Datos tras baja',            periodo: '30 días (eliminación total)',       motivo: 'Período de gracia + auditoría' },
];

// ─── Sección 6 — Destinatarios / Terceros ────────────────────────────────────

export const DESTINATARIOS = [
  { proveedor: 'Proveedor logístico',          uso: 'Gestión de envíos y seguimiento',                          pais: 'UE' },
  { proveedor: 'Pasarela de pago (Stripe)',    uso: 'Procesamiento seguro de pagos',                           pais: 'UE/EEUU (cláusulas SCCs)' },
  { proveedor: 'Plataforma email (Klaviyo)',   uso: 'Envío de newsletters (solo si consentimiento)',            pais: 'EEUU (Privacy Shield + SCCs)' },
  { proveedor: 'Análisis web (Plausible)',     uso: 'Métricas de tráfico anonimizadas (sin cookies)',          pais: 'UE' },
  { proveedor: 'Soporte (Gorgias)',            uso: 'Gestión de tickets de soporte',                           pais: 'EEUU (SCCs)' },
];

// ─── Sección 7 — Derechos RGPD ───────────────────────────────────────────────

export const DERECHOS = [
  { derecho: 'Acceso',       desc: 'Saber qué datos tenemos sobre ti.' },
  { derecho: 'Rectificación', desc: 'Corregir datos inexactos o incompletos.' },
  { derecho: 'Supresión',    desc: 'Solicitar el borrado de tus datos ("derecho al olvido").' },
  { derecho: 'Portabilidad', desc: 'Recibir tus datos en formato estructurado (CSV/JSON).' },
  { derecho: 'Oposición',    desc: 'Oponerte al tratamiento basado en interés legítimo.' },
  { derecho: 'Limitación',   desc: 'Pedir que restrinjamos el tratamiento de tus datos.' },
];
