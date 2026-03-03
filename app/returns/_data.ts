/**
 * app/returns/_data.ts — Datos estáticos de la Política de Devoluciones
 * ────────────────────────────────────────────────────────────────────────
 * Centraliza los cuatro arrays que antes vivían inline en el JSX de page.tsx.
 * Mismo patrón que about/_data.ts, privacy/_data.ts, faq/_data.ts, etc.
 *
 * EN PRODUCCIÓN: PASOS y condiciones podrían venir de un CMS para que
 * el equipo de soporte actualice la política sin tocar código.
 */

import { Package, RefreshCw, ShieldCheck, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface Paso {
  numero:  string;
  icon:    LucideIcon;
  titulo:  string;
  detalle: string;
  plazo:   string;
}

export interface Garantia {
  valor: string;
  desc:  string;
}

// ─── Hero — métricas destacadas ───────────────────────────────────────────────

export const GARANTIAS: Garantia[] = [
  { valor: '30 días', desc: 'Para solicitar devolución' },
  { valor: '48h',     desc: 'Respuesta garantizada' },
  { valor: '100%',    desc: 'Reembolso si aplica' },
];

// ─── Sección proceso — 4 pasos ────────────────────────────────────────────────

export const PASOS: Paso[] = [
  {
    numero:  '01',
    icon:    Package,
    titulo:  'Solicita tu devolución',
    detalle: 'Entra a tu cuenta en "Mis Pedidos" y selecciona el producto a devolver. También puedes contactarnos en soporte@titansupps.com con tu número de pedido y motivo.',
    plazo:   'Dentro de los 30 días',
  },
  {
    numero:  '02',
    icon:    ShieldCheck,
    titulo:  'Validamos tu caso',
    detalle: 'Nuestro equipo revisa tu solicitud en un máximo de 48 horas hábiles. En caso de producto defectuoso, podemos pedirte evidencia fotográfica.',
    plazo:   'Hasta 48 horas',
  },
  {
    numero:  '03',
    icon:    RefreshCw,
    titulo:  'Envía el producto',
    detalle: 'Una vez aprobada, recibirás una etiqueta de envío prepagada por correo. Empaca el producto en su embalaje original (si es posible) y deposítalo en cualquier punto de envío.',
    plazo:   '5 días tras aprobación',
  },
  {
    numero:  '04',
    icon:    Clock,
    titulo:  'Recibe tu reembolso',
    detalle: 'Al recibir el producto en nuestro almacén y verificar su estado, procesamos el reembolso al método de pago original. Los tiempos dependen de tu banco (3-7 días hábiles típicamente).',
    plazo:   '3–7 días hábiles',
  },
];

// ─── Sección condiciones — qué aplica / qué no ───────────────────────────────

export const ACEPTA: string[] = [
  'Producto sellado, sin abrir y en perfectas condiciones',
  'Producto defectuoso o con error en la fórmula demostrable',
  'Error en el pedido por parte de TitanSupps (producto equivocado)',
  'Producto dañado durante el envío (con evidencia fotográfica)',
  'Alergias o intolerancias documentadas no señaladas en el etiquetado',
];

export const NO_ACEPTA: string[] = [
  'Productos abiertos o con el sello de garantía roto (por seguridad alimentaria)',
  'Solicitudes pasadas los 30 días desde la entrega',
  'Productos adquiridos en promociones de liquidación o "final de serie"',
  'Cambio de opinión después de consumir el 20% o más del producto',
  'Productos sin embalaje original cuando el empaque no fue dañado en el envío',
];
