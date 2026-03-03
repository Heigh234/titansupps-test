/**
 * app/admin/users/utils.ts
 *
 * Funciones de utilidad puras para el módulo de Gestión de Clientes.
 * Ninguna tiene efectos secundarios ni estado — son 100% testeables de forma aislada.
 *
 *   formatDate()    → Fecha legible en español (ej: "14 feb. 2025")
 *   formatTime()    → Hora en formato HH:MM
 *   timeAgo()       → Tiempo relativo (ej: "Hace 3 días")
 *   initials()      → Iniciales del nombre para el avatar (máx 2 caracteres)
 *   avatarColor()   → Color de fondo del avatar determinístico por ID de cliente
 *   downloadCSV()   → Genera y descarga un archivo .csv con los clientes recibidos
 */

import { SEGMENT_CONFIG } from './data';
import type { Client } from './types';

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

export function timeAgo(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime();
  const days  = Math.floor(diff / 86_400_000);
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 30)  return `Hace ${days} días`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
  const years = Math.floor(months / 12);
  return `Hace ${years} año${years > 1 ? 's' : ''}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────────────────────────────────────

/** Iniciales para el avatar — máximo 2 caracteres */
export function initials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

/**
 * Color de fondo del avatar determinístico basado en el ID numérico del cliente.
 * Garantiza que el mismo cliente siempre tenga el mismo color en todos los renders.
 */
const AVATAR_COLORS = [
  'bg-orange-500', 'bg-purple-500', 'bg-blue-500',   'bg-green-500',
  'bg-pink-500',   'bg-teal-500',   'bg-red-500',    'bg-indigo-500',
];

export function avatarColor(id: string): string {
  const idx = parseInt(id.replace('CLI-', ''), 10) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTACIÓN CSV
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Genera y descarga un archivo .csv con el array de clientes recibido.
 * Incluye BOM UTF-8 (\uFEFF) para compatibilidad con Excel en Windows.
 * Escapa comillas dobles dentro de los valores (RFC 4180).
 */
export function downloadCSV(clients: Client[]): void {
  const headers = [
    'ID', 'Nombre', 'Email', 'Teléfono', 'Ciudad',
    'Segmento', 'Pedidos', 'Gasto Total (€)', 'Ticket Medio (€)',
    'Última Compra', 'Registrado', 'Producto Favorito',
  ];

  const rows = clients.map((c) => [
    c.id, c.name, c.email, c.phone, c.city,
    SEGMENT_CONFIG[c.segment].label,
    c.totalOrders,
    c.totalSpent.toFixed(2),
    c.avgOrderValue.toFixed(2),
    formatDate(c.lastPurchase),
    formatDate(c.registered),
    c.favoriteProduct,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `titansupps-clientes-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
