'use client';

/**
 * app/admin/products/ProductsTable.tsx
 *
 * Tabla de inventario con barra de búsqueda, filtros, filas de producto
 * y paginación. Estructura análoga a OrdersTable.tsx y ClientsTable.tsx.
 *
 * Responsabilidades de este componente:
 *   - Barra de búsqueda (input controlado) + botón de filtros
 *   - Renderizar thead con columnas fijas
 *   - Renderizar tbody con thumbnail, datos y acciones por fila
 *   - Estado vacío cuando la búsqueda no tiene resultados
 *   - Paginación con contador de resultados
 *
 * El componente NO tiene estado propio. Todo (searchTerm, page, filtered)
 * vive en page.tsx y se comunica hacia abajo via props + callbacks.
 * Esto mantiene la tabla pura y testeable de forma aislada.
 *
 * Props:
 *   filtered      → Productos ya filtrados por búsqueda (calculados en page.tsx)
 *   paginated     → Subconjunto de `filtered` para la página actual
 *   searchTerm    → Valor del input de búsqueda (string controlado)
 *   page          → Página activa
 *   totalPages    → Total de páginas
 *   onSearch      → Callback de cambio en el input de búsqueda
 *   onPageChange  → Callback de cambio de página
 *   onEdit        → Callback del botón de edición por fila
 *   onDelete      → Callback del botón de eliminación por fila
 */

import Image from 'next/image';
import { Search, Filter, Edit, Trash2, Package } from 'lucide-react';
import { LOW_STOCK_LIMIT } from './data';
import ProductStatusBadge from './ProductStatusBadge';
import type { Product } from './types';

interface ProductsTableProps {
  filtered:     Product[];
  paginated:    Product[];
  searchTerm:   string;
  page:         number;
  totalPages:   number;
  onSearch:     (term: string) => void;
  onPageChange: (page: number) => void;
  onEdit:       (product: Product) => void;
  onDelete:     (product: Product) => void;
}

export default function ProductsTable({
  filtered,
  paginated,
  searchTerm,
  page,
  totalPages,
  onSearch,
  onPageChange,
  onEdit,
  onDelete,
}: ProductsTableProps) {

  // Rango de filas mostradas en el pie de tabla ("Mostrando X a Y de Z")
  const pageSize    = paginated.length;
  const rangeStart  = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd    = rangeStart + paginated.length - 1;

  return (
    <div className="space-y-4">

      {/* ── BARRA DE BÚSQUEDA Y ACCIONES ─────────────────────────────────── */}
      <div className="bg-titan-surface border border-titan-border p-4 flex flex-col md:flex-row gap-4">
        {/* Input de búsqueda */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-titan-text-muted" aria-hidden="true" />
          <label htmlFor="product-search" className="sr-only">Buscar productos</label>
          <input
            id="product-search"
            type="search"
            placeholder="Buscar por nombre, SKU o categoría..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-titan-bg border border-titan-border py-2 pl-10 pr-4 text-sm text-titan-text focus:outline-none focus:border-titan-accent transition-colors"
          />
        </div>

        {/* Botón de filtros avanzados — preparado para expansión */}
        <button
          className="flex items-center justify-center gap-2 px-4 py-2 bg-titan-bg border border-titan-border text-titan-text text-sm hover:border-titan-accent transition-colors uppercase font-bold tracking-wider"
          aria-label="Abrir filtros avanzados"
        >
          <Filter size={16} /> Filtros
        </button>
      </div>

      {/* ── TABLA ─────────────────────────────────────────────────────────── */}
      <div className="bg-titan-surface border border-titan-border overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]" aria-label="Tabla de inventario de productos">
            <thead>
              <tr className="bg-titan-bg border-b border-titan-border">
                <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-titan-text-muted">Producto</th>
                <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-titan-text-muted">SKU</th>
                <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-titan-text-muted">Categoría</th>
                <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-titan-text-muted">Precio</th>
                <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-titan-text-muted">Stock</th>
                <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-titan-text-muted">Estado</th>
                <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-titan-text-muted text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-titan-border">
              {paginated.length > 0 ? (
                paginated.map((product) => (
                  <tr key={product.id} className="hover:bg-titan-bg/50 transition-colors group">

                    {/* Thumbnail + nombre */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-titan-bg border border-titan-border relative flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <span className="font-bold text-sm text-titan-text group-hover:text-titan-accent transition-colors">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-titan-text-muted font-mono">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-titan-text-muted">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-bold text-titan-text">${product.price.toFixed(2)}</td>

                    {/* Stock — rojo si está por debajo del umbral crítico */}
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${product.stock < LOW_STOCK_LIMIT ? 'text-red-500' : 'text-titan-text'}`}>
                        {product.stock}
                      </span>
                    </td>

                    {/* Estado — badge via STATUS_CONFIG */}
                    <td className="px-6 py-4">
                      <ProductStatusBadge status={product.status} />
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 text-titan-text-muted hover:text-titan-accent hover:bg-titan-accent/10 transition-colors rounded"
                          aria-label={`Editar ${product.name}`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(product)}
                          className="p-2 text-titan-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors rounded"
                          aria-label={`Eliminar ${product.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // Estado vacío — búsqueda sin resultados
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-titan-text-muted">
                      <Package size={32} className="opacity-40" />
                      <p className="text-sm font-bold uppercase tracking-widest">Sin resultados</p>
                      <p className="text-xs">
                        No hay productos que coincidan con{' '}
                        <span className="text-titan-text">&quot;{searchTerm}&quot;</span>
                      </p>
                      <button
                        onClick={() => onSearch('')}
                        className="text-xs font-bold text-titan-accent hover:underline uppercase tracking-widest mt-1"
                      >
                        Limpiar búsqueda
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINACIÓN ──────────────────────────────────────────────────── */}
        <div className="p-4 border-t border-titan-border flex items-center justify-between text-sm text-titan-text-muted">
          <span>
            {filtered.length === 0
              ? 'Sin resultados'
              : `Mostrando ${rangeStart} a ${rangeEnd} de ${filtered.length} productos`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1 border border-titan-border hover:bg-titan-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Página anterior"
            >
              Ant
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1 border border-titan-border hover:bg-titan-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Página siguiente"
            >
              Sig
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
