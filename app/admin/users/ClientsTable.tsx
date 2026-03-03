'use client';

/**
 * app/admin/users/ClientsTable.tsx
 *
 * Tabla de clientes con cabeceras ordenables, filas, estado vacío y paginación.
 *
 * Responsabilidades de este componente:
 *   - Renderizar la tabla con los clientes de la página actual (prop `paginated`)
 *   - Mostrar los botones de ordenación con su ícono de dirección activo
 *   - Mostrar el estado vacío con botón para limpiar filtros
 *   - Renderizar la paginación con ellipsis para muchas páginas
 *   - Exponer las acciones de fila: ver perfil (onViewClient) y email directo
 *
 * El componente NO tiene estado propio. Todo el estado (sort, page, filter)
 * vive en el page.tsx padre y se comunica hacia abajo via props + callbacks.
 *
 * Props:
 *   paginated        → Clientes de la página actual (ya filtrados y ordenados)
 *   processed        → Total de clientes tras filtros (para el contador de paginación)
 *   page             → Página activa
 *   totalPages       → Total de páginas calculado en el padre
 *   sortField        → Campo de ordenación activo
 *   sortDir          → Dirección de ordenación activa
 *   onSort           → Toggle de ordenación por campo
 *   onPageChange     → Cambio de página
 *   onViewClient     → Abre el modal de perfil con el cliente seleccionado
 *   onClearFilters   → Limpia búsqueda y segmento (botón en estado vacío)
 *   onSegmentChange  → Cambia el segmento inline desde la tabla
 */

import { ChevronUp, ChevronDown, Hash, Mail, Eye, MapPin, Users } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, timeAgo } from './utils';
import Avatar from './Avatar';
import SegmentChanger from './SegmentChanger';
import type { Client, Segment, SortField, SortDir } from './types';

// ── SortIcon — definido fuera del componente para evitar recrearlo en cada render ──
function SortIcon({
  field, sortField, sortDir,
}: {
  field: SortField; sortField: SortField; sortDir: SortDir;
}) {
  if (sortField !== field) return <ChevronDown size={12} className="text-titan-text-muted opacity-30" aria-hidden="true" />;
  return sortDir === 'asc'
    ? <ChevronUp   size={12} className="text-titan-accent" aria-label="Orden ascendente" />
    : <ChevronDown size={12} className="text-titan-accent" aria-label="Orden descendente" />;
}

interface ClientsTableProps {
  paginated:       Client[];
  processed:       Client[];
  page:            number;
  totalPages:      number;
  sortField:       SortField;
  sortDir:         SortDir;
  onSort:          (field: SortField) => void;
  onPageChange:    (page: number) => void;
  onViewClient:    (client: Client) => void;
  onClearFilters:  () => void;
  onSegmentChange: (id: string, next: Segment) => void;
}

export default function ClientsTable({
  paginated,
  processed,
  page,
  totalPages,
  sortField,
  sortDir,
  onSort,
  onPageChange,
  onViewClient,
  onClearFilters,
  onSegmentChange,
}: ClientsTableProps) {

  return (
    <div className="bg-titan-surface border border-titan-border overflow-hidden">

      {/* ── TABLA ── */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[860px]">

          {/* Cabeceras */}
          <thead>
            <tr className="bg-titan-bg border-b border-titan-border">

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-titan-text-muted w-[90px]">
                <div className="flex items-center gap-1">
                  <Hash size={12} aria-hidden="true" /> ID
                </div>
              </th>

              <th className="px-5 py-4">
                <button
                  onClick={() => onSort('name')}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-titan-text-muted hover:text-white transition-colors"
                >
                  Cliente <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-titan-text-muted">
                Ciudad
              </th>

              <th className="px-5 py-4">
                <button
                  onClick={() => onSort('orders')}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-titan-text-muted hover:text-white transition-colors"
                >
                  Pedidos <SortIcon field="orders" sortField={sortField} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-4">
                <button
                  onClick={() => onSort('spent')}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-titan-text-muted hover:text-white transition-colors"
                >
                  Gasto total <SortIcon field="spent" sortField={sortField} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-titan-text-muted">
                Segmento
              </th>

              <th className="px-5 py-4">
                <button
                  onClick={() => onSort('registered')}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-titan-text-muted hover:text-white transition-colors"
                >
                  Registrado <SortIcon field="registered" sortField={sortField} sortDir={sortDir} />
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
                <td colSpan={8} className="px-5 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-titan-text-muted">
                    <Users size={36} className="opacity-30" aria-hidden="true" />
                    <p className="font-heading text-xl uppercase tracking-wider">Sin resultados</p>
                    <p className="text-sm">Prueba con otro término o segmento.</p>
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
              paginated.map((client) => (
                <tr key={client.id} className="hover:bg-titan-bg/60 transition-colors group">

                  {/* ID */}
                  <td className="px-5 py-4">
                    <span className="text-xs font-bold text-titan-text-muted">{client.id}</span>
                  </td>

                  {/* Cliente: avatar + nombre + email */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar client={client} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-titan-text group-hover:text-titan-accent transition-colors truncate">
                          {client.name}
                        </p>
                        <p className="text-[11px] text-titan-text-muted truncate">{client.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Ciudad */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-titan-text-muted">
                      <MapPin size={12} className="flex-shrink-0" aria-hidden="true" />
                      {client.city}
                    </div>
                  </td>

                  {/* Pedidos */}
                  <td className="px-5 py-4">
                    <span className="font-heading text-xl text-titan-text">{client.totalOrders}</span>
                  </td>

                  {/* Gasto total + ticket medio */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-titan-text">€{client.totalSpent.toFixed(2)}</p>
                    <p className="text-[11px] text-titan-text-muted">Ø €{client.avgOrderValue.toFixed(2)}</p>
                  </td>

                  {/* Segmento — con dropdown inline */}
                  <td className="px-5 py-4">
                    <SegmentChanger
                      clientId={client.id}
                      current={client.segment}
                      onChange={onSegmentChange}
                    />
                  </td>

                  {/* Fecha de registro */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-titan-text">{formatDate(client.registered)}</p>
                    <p className="text-[11px] text-titan-text-muted">{timeAgo(client.registered)}</p>
                  </td>

                  {/* Acciones: email directo + ver perfil */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`mailto:${client.email}?subject=TitanSupps — Mensaje para ${client.name}`}
                        className="p-2 text-titan-text-muted hover:text-titan-accent hover:bg-titan-accent/10 transition-colors"
                        aria-label={`Enviar email a ${client.name}`}
                        title="Enviar email"
                      >
                        <Mail size={15} />
                      </a>
                      <button
                        onClick={() => onViewClient(client)}
                        className="p-2 text-titan-text-muted hover:text-titan-accent hover:bg-titan-accent/10 transition-colors"
                        aria-label={`Ver perfil de ${client.name}`}
                        title="Ver perfil"
                      >
                        <Eye size={15} />
                      </button>
                    </div>
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
              {(page - 1) * 8 + 1}–{Math.min(page * 8, processed.length)}
            </strong>
            {' '}de{' '}
            <strong className="text-titan-text">{processed.length}</strong>
            {' '}clientes
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
                  <span key={`e-${idx}`} className="px-2 text-titan-text-muted">…</span>
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
