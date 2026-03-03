'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Download, X, Loader2 } from 'lucide-react';

import { STATUS_CONFIG, ALL_STATUSES, PAGE_SIZE } from './data';
import { downloadCSV } from './utils';
import { getAdminOrders, updateOrderStatus } from '@/actions/admin';
import OrdersTable from './OrdersTable';
import OrderDetailModal from './OrderDetailModal';
import type { Order, OrderStatus, SortField, SortDir } from './types';

// Mapea el pedido de Supabase al shape que espera la UI
function mapOrder(raw: Record<string, unknown>): Order {
  return {
    id:            String(raw.id),
    customer: {
      name:  String(raw.customer_name  || ''),
      email: String(raw.customer_email || ''),
      phone: String(raw.customer_phone || ''),
    },
    address: {
      street:  String(raw.ship_street  || ''),
      city:    String(raw.ship_city    || ''),
      country: String(raw.ship_country || ''),
    },
    items: ((raw.order_items as { name: string; quantity: number; variant?: string }[]) ?? []).map((item) => ({
      id:      String(Math.random()),
      name:    item.name,
      variant: item.variant || '',
      qty:     item.quantity,
      price:   0,
      image:   '',
    })),
    total:         Number(raw.total || 0),
    status:        (raw.status as OrderStatus) || 'pendiente',
    paymentMethod: String(raw.payment_method || ''),
    date:          String(raw.created_at || ''),
    trackingCode:  raw.tracking_code ? String(raw.tracking_code) : undefined,
    notes:         raw.notes ? String(raw.notes) : undefined,
  };
}

export default function AdminOrders() {
  const [orders, setOrders]          = useState<Order[]>([]);
  const [loading, setLoading]        = useState(true); // true desde el inicio — no setLoading en el effect
  const [search, setSearch]          = useState('');
  const [statusFilter, setFilter]    = useState<OrderStatus | 'all'>('all');
  const [sortField, setSortField]    = useState<SortField>('date');
  const [sortDir, setSortDir]        = useState<SortDir>('desc');
  const [page, setPage]              = useState(1);
  const [selectedOrder, setSelected] = useState<Order | null>(null);

  // Cargar pedidos reales
  useEffect(() => {
    getAdminOrders({ limit: 100 })
      .then((data) => {
        setOrders(data.orders.map(mapOrder));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Cambiar estado — actualiza en BD y en UI
  const handleStatusChange = useCallback(async (id: string, next: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: next } : o));
    setSelected((prev) => prev?.id === id ? { ...prev, status: next } : prev);
    await updateOrderStatus(id, next);
  }, []);

  const processed = useMemo(() => {
    let result = orders;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((o) =>
        o.id.toLowerCase().includes(q)            ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }
    return [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date')  cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortField === 'total') cmp = a.total - b.total;
      if (sortField === 'id')    cmp = a.id.localeCompare(b.id);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [orders, search, statusFilter, sortField, sortDir]);

  const stats = useMemo(() => {
    const counts = { pendiente: 0, procesando: 0, enviado: 0, entregado: 0, cancelado: 0 } as Record<OrderStatus, number>;
    for (const o of orders) counts[o.status]++;
    const revenue = orders.filter((o) => o.status !== 'cancelado').reduce((s, o) => s + o.total, 0);
    return { counts, revenue };
  }, [orders]);

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const paginated  = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, statusFilter, sortField, sortDir]); // eslint-disable-line react-hooks/set-state-in-effect

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-titan-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl uppercase text-titan-text tracking-wider">Gestión de Pedidos</h2>
          <p className="text-titan-text-muted text-sm mt-1">
            {orders.length} pedidos en total · Ingresos netos:{' '}
            <span className="text-titan-accent font-bold">€{stats.revenue.toFixed(2)}</span>
          </p>
        </div>
        <button
          onClick={() => downloadCSV(processed)}
          className="flex items-center gap-2 px-4 py-2.5 bg-titan-surface border border-titan-border text-titan-text text-sm font-bold uppercase tracking-wider hover:border-titan-accent hover:text-titan-accent transition-colors w-full sm:w-auto justify-center"
        >
          <Download size={16} />
          Exportar CSV ({processed.length})
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ALL_STATUSES.map((s) => {
          const cfg   = STATUS_CONFIG[s];
          const Icon  = cfg.icon;
          const count = stats.counts[s];
          const isActive = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(isActive ? 'all' : s)}
              className={`p-3 border text-left transition-all duration-200 ${isActive ? `${cfg.bg} ${cfg.border} ${cfg.color}` : 'bg-titan-surface border-titan-border text-titan-text-muted hover:border-titan-accent/40'}`}
              aria-pressed={isActive}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon size={14} className={isActive ? cfg.color : ''} aria-hidden="true" />
                <span className={`font-heading text-2xl ${isActive ? cfg.color : 'text-titan-text'}`}>{count}</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest truncate">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-titan-surface border border-titan-border p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-titan-text-muted" aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar por nº pedido, cliente o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-titan-bg border border-titan-border py-2.5 pl-10 pr-4 text-sm text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder:text-titan-text-muted"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-titan-text-muted hover:text-white transition-colors" aria-label="Limpiar">
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setFilter(e.target.value as OrderStatus | 'all')}
          className="sm:hidden bg-titan-bg border border-titan-border py-2.5 px-3 text-sm text-titan-text focus:outline-none focus:border-titan-accent"
        >
          <option value="all">Todos los estados</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
        </select>
      </div>

      <OrdersTable
        paginated={paginated}
        processed={processed}
        page={page}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        sortField={sortField}
        sortDir={sortDir}
        onSort={handleSort}
        onPageChange={setPage}
        onViewOrder={setSelected}
        onClearFilters={() => { setSearch(''); setFilter('all'); }}
        onStatusChange={handleStatusChange}
      />

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
