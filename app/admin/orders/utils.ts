/**
 * app/admin/orders/utils.ts
 *
 * Funciones de utilidad puras para el módulo de Gestión de Pedidos.
 * Sin efectos secundarios ni estado — 100% testeables de forma aislada.
 *
 *   formatDate()   → Fecha legible en español (ej: "14 feb. 2025")
 *   formatTime()   → Hora en formato HH:MM
 *   downloadCSV()  → Genera y descarga un .csv con los pedidos recibidos
 */

import { STATUS_CONFIG } from './data';
import type { Order } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// FORMATEO DE FECHAS
// ─────────────────────────────────────────────────────────────────────────────

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTACIÓN CSV
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Genera y descarga un archivo .csv con el array de pedidos recibido.
 * Incluye BOM UTF-8 (\uFEFF) para compatibilidad con Excel en Windows.
 * Escapa comillas dobles dentro de los valores (RFC 4180).
 */
export function downloadCSV(orders: Order[]): void {
  const headers = [
    'ID', 'Cliente', 'Email', 'Teléfono', 'Ciudad',
    'Total (€)', 'Estado', 'Método de Pago', 'Fecha', 'Tracking',
  ];

  const rows = orders.map((o) => [
    o.id,
    o.customer.name,
    o.customer.email,
    o.customer.phone,
    o.address.city,
    o.total.toFixed(2),
    STATUS_CONFIG[o.status].label,
    o.paymentMethod,
    formatDate(o.date),
    o.trackingCode ?? '',
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `titansupps-pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
