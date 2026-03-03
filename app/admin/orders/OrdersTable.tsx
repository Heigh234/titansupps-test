'use client';

/**
 * app/admin/orders/OrdersTable.tsx
 *
 * Tabla de pedidos con cabeceras ordenables, filas, estado vacío y paginación.
 *
 * Responsabilidades de este componente:
 *   - Renderizar la tabla con los pedidos de la página actual (prop `paginated`)
 *   - Mostrar los botones de ordenación con su ícono de dirección activo
 *   - Renderizar las miniaturas de productos (máx 3 + contador de excedente)
 *   - Mostrar el estado vacío con botón para limpiar filtros
 *   - Renderizar la paginación con ellipsis para muchas páginas
 *
 * El componente NO tiene estado propio. Todo (sort, page, filter) vive en
 * page.tsx y se comunica hacia abajo via props + callbacks.
 *
 * Props:
 *   paginated       → Pedidos de la página actual (ya filtrados y ordenados)
 *   processed       → Total de pedidos tras filtros (para el contador de paginación)
 *   page            → Página activa
 *   totalPages      → Total de páginas calculado en el padre
 *   pageSize        → Pedidos por página (para calcular el rango mostrado)
 *   sortField       → Campo de ordenación activo
 *   sortDir         → Dirección de ordenación activa
 *   onSort          → Toggle de ordenación por campo
 *   onPageChange    → Cambio de página
 *   onViewOrder     → Abre el modal de detalle con el pedido seleccionado
 *   onClearFilters  → Limpia búsqueda y filtro de estado
 *   onStatusChange  → Cambia el estado inline desde la tabla
 */

import {
  ChevronUp, ChevronDown, Hash, Eye, Package,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { formatDate, formatTime } from './utils';
import StatusChanger from './StatusChanger';
import type { Order, OrderStatus, SortField, SortDir } from './types';

// ── SortIcon — definido fuera del componente para evitar recrearlo en cada render ──
function SortIcon({
  field, sortField, sortDir,
}: {
  field: SortField; sortField: SortField; sortDir: SortDir;
}) {
  if (sortField !== field) {
    return <ChevronDown size={12} className="text-titan-text-muted opacity-30" aria-hidden="true" />;
  }
  return sortDir === 'asc'
    ? <ChevronUp   size={12} className="text-titan-accent" aria-label="Orden ascendente" />
    : <ChevronDown size={12} className="text-titan-accent" aria-label="Orden descendente" />;
}

interface OrdersTableProps {
  paginated:      Order[];
  processed:      Order[];
  page:           number;
  totalPages:     number;
  pageSize:       number;
  sortField:      SortField;
  sortDir:        SortDir;
  onSort:         (field: SortField) => void;
  onPageChange:   (page: number) => void;
  onViewOrder:    (order: Order) => void;
  onClearFilters: () => void;
  onStatusChange: (id: string, next: OrderStatus) => void;
}

export default function OrdersTable({
  paginated,
  processed,
  page,
  totalPages,
  pageSize,
  sortField,
  sortDir,
  onSort,
  onPageChange,
  onViewOrder,
  onClearFilters,
  onStatusChange,
}: OrdersTableProps) {

  return (
    <div className="bg-titan-surface border border-titan-border overflow-hidden">

      {/* ── TABLA ── */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">

          {/* Cabeceras */}
          <thead>
            <tr className="bg-titan-bg border-b border-titan-border">

              {/* ID — ordenable */}
              <th className="px-5 py-4">
                <button
                  onClick={() => onSort('id')}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-titan-text-muted hover:text-white transition-colors"
                >
                  <Hash size={12} aria-hidden="true" /> ID <SortIcon field="id" sortField={sortField} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-titan-text-muted">
                Cliente
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-titan-text-muted">
                Productos
              </th>

              {/* Total — ordenable */}
              <th className="px-5 py-4">
                <button
                  onClick={() => onSort('total')}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-titan-text-muted hover:text-white transition-colors"
                >
                  Total <SortIcon field="total" sortField={sortField} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-titan-text-muted">
                Estado
              </th>

              {/* Fecha — ordenable */}
              <th className="px-5 py-4">
                <button
                  onClick={() => onSort('date')}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-titan-text-muted hover:text-white transition-colors"
                >
                  Fecha <SortIcon field="date" sortField={sortField} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-titan-text-muted text-right">
                Acción
              </th>

            </tr>
          </thead>

          {/* Filas */}
          <tbody className="divide-y divide-titan-border">

            {/* Estado vacío */}
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-titan-text-muted">
                    <Package size={36} className="opacity-30" aria-hidden="true" />
                    <p className="font-heading text-xl uppercase tracking-wider">Sin resultados</p>
                    <p className="text-sm">Prueba con otro término de búsqueda o estado.</p>
                    <button
                      onClick={onClearFilters}
                      className="mt-2 text-xs font-bold uppercase tracking-widest text-titan-accent hover:text-white transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-titan-bg/60 transition-colors group"
                >
                  {/* ID */}
                  <td className="px-5 py-4">
                    <span className="font-heading text-base text-titan-accent">{order.id}</span>
                  </td>

                  {/* Cliente */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-titan-text">{order.customer.name}</p>
                    <p className="text-[11px] text-titan-text-muted">{order.customer.email}</p>
                  </td>

                  {/* Miniaturas de productos (máx 3 + excedente) */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-titan-bg border border-titan-border overflow-hidden flex-shrink-0"
                          title={item.name}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-[10px] text-titan-text-muted font-bold ml-1">
                          +{order.items.length - 3}
                        </span>
                      )}
                      <span className="text-[11px] text-titan-text-muted ml-2">
                        {order.items.reduce((s, i) => s + i.qty, 0)} ud.
                      </span>
                    </div>
                  </td>

                  {/* Total */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-titan-text">
                      €{order.total.toFixed(2)}
                    </span>
                  </td>

                  {/* Estado — con dropdown inline */}
                  <td className="px-5 py-4">
                    <StatusChanger
                      orderId={order.id}
                      current={order.status}
                      onChange={onStatusChange}
                    />
                  </td>

                  {/* Fecha y hora */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-titan-text">{formatDate(order.date)}</p>
                    <p className="text-[11px] text-titan-text-muted">{formatTime(order.date)}</p>
                  </td>

                  {/* Ver detalle */}
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="p-2 text-titan-text-muted hover:text-titan-accent hover:bg-titan-accent/10 transition-colors"
                      aria-label={`Ver detalle de ${order.id}`}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── PAGINACIÓN ── */}
      {processed.length > 0 && (
        <div className="px-5 py-4 border-t border-titan-border flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-titan-text-muted">

          {/* Contador de resultados */}
          <span>
            Mostrando{' '}
            <strong className="text-titan-text">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, processed.length)}
            </strong>
            {' '}de{' '}
            <strong className="text-titan-text">{processed.length}</strong>
            {' '}pedidos
          </span>

          {/* Controles de página */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 border border-titan-border hover:bg-titan-bg hover:border-titan-accent/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Página anterior"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Números de página con ellipsis */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-titan-text-muted">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => onPageChange(item as number)}
                    className={`w-8 h-8 text-xs font-bold border transition-colors ${
                      page === item
                        ? 'border-titan-accent bg-titan-accent/10 text-titan-accent'
                        : 'border-titan-border hover:bg-titan-bg hover:border-titan-accent/40 text-titan-text-muted'
                    }`}
                    aria-current={page === item ? 'page' : undefined}
                  >
                    {item}
                  </button>
                )
              )
            }

            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-1.5 border border-titan-border hover:bg-titan-bg hover:border-titan-accent/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Página siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
