'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Download, X, Loader2 } from 'lucide-react';

import { SEGMENT_CONFIG, ALL_SEGMENTS, PAGE_SIZE } from './data';
import { downloadCSV } from './utils';
import { getAdminUsers, updateUserSegment } from '@/actions/admin';
import ClientsTable from './ClientsTable';
import ClientProfileModal from './ClientProfileModal';
import type { Client, Segment, SortField, SortDir } from './types';

function mapClient(raw: Record<string, unknown>): Client {
  return {
    id:              String(raw.id),
    name:            String(raw.name         || ''),
    email:           String(raw.email        || ''),
    phone:           String(raw.phone        || ''),
    city:            String(raw.city         || ''),
    country:         String(raw.country      || 'ES'),
    segment:         (raw.segment as Segment) || 'nuevo',
    totalOrders:     Number(raw.total_orders || 0),
    totalSpent:      Number(raw.total_spent  || 0),
    avgOrderValue:   Number(raw.total_orders ? Number(raw.total_spent || 0) / Number(raw.total_orders) : 0),
    lastPurchase:    raw.last_order ? String(raw.last_order) : String(raw.created_at || ''),
    registered:      String(raw.created_at   || ''),
    favoriteProduct: String(raw.favorite_product || ''),
    notes:           raw.notes ? String(raw.notes) : undefined,
    orders:          [],
  };
}

export default function AdminUsers() {
  const [clients, setClients]         = useState<Client[]>([]);
  const [loading, setLoading]         = useState(true); // true desde el inicio
  const [search, setSearch]           = useState('');
  const [segmentFilter, setFilter]    = useState<Segment | 'all'>('all');
  const [sortField, setSortField]     = useState<SortField>('registered');
  const [sortDir, setSortDir]         = useState<SortDir>('desc');
  const [page, setPage]               = useState(1);
  const [selectedClient, setSelected] = useState<Client | null>(null);

  useEffect(() => {
    getAdminUsers({ limit: 100 })
      .then((data) => {
        setClients((data.users as Record<string, unknown>[]).map(mapClient));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSegmentChange = useCallback(async (id: string, next: Segment) => {
    setClients((prev) => prev.map((c) => c.id === id ? { ...c, segment: next } : c));
    setSelected((prev) => prev?.id === id ? { ...prev, segment: next } : prev);
    await updateUserSegment(id, next);
  }, []);

  const processed = useMemo(() => {
    let result = clients;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(q)  ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)               ||
        c.city.toLowerCase().includes(q)
      );
    }
    if (segmentFilter !== 'all') result = result.filter((c) => c.segment === segmentFilter);
    return [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name')       cmp = a.name.localeCompare(b.name, 'es');
      if (sortField === 'spent')      cmp = a.totalSpent - b.totalSpent;
      if (sortField === 'orders')     cmp = a.totalOrders - b.totalOrders;
      if (sortField === 'registered') cmp = new Date(a.registered).getTime() - new Date(b.registered).getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [clients, search, segmentFilter, sortField, sortDir]);

  const stats = useMemo(() => {
    const counts = { vip: 0, activo: 0, nuevo: 0, suspendido: 0 } as Record<Segment, number>;
    let totalRevenue = 0;
    for (const c of clients) { counts[c.segment]++; totalRevenue += c.totalSpent; }
    return { counts, totalRevenue, avgLTV: clients.length > 0 ? totalRevenue / clients.length : 0 };
  }, [clients]);

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const paginated  = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, segmentFilter, sortField, sortDir]); // eslint-disable-line react-hooks/set-state-in-effect

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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl uppercase text-titan-text tracking-wider">Gestión de Clientes</h2>
          <p className="text-titan-text-muted text-sm mt-1">
            {clients.length} clientes · LTV medio:{' '}
            <span className="text-titan-accent font-bold">€{stats.avgLTV.toFixed(0)}</span>
            {' '}· Revenue:{' '}
            <span className="text-titan-accent font-bold">€{stats.totalRevenue.toFixed(0)}</span>
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ALL_SEGMENTS.map((s) => {
          const cfg = SEGMENT_CONFIG[s];
          const Icon = cfg.icon;
          const count = stats.counts[s];
          const isActive = segmentFilter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(isActive ? 'all' : s)}
              className={`p-4 border text-left transition-all duration-200 ${isActive ? `${cfg.bg} ${cfg.border} ${cfg.color}` : 'bg-titan-surface border-titan-border text-titan-text-muted hover:border-titan-accent/40'}`}
              aria-pressed={isActive}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon size={16} className={isActive ? cfg.color : 'text-titan-text-muted'} aria-hidden="true" />
                <span className={`font-heading text-3xl leading-none ${isActive ? cfg.color : 'text-titan-text'}`}>{count}</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest">{cfg.label}</p>
              <p className="text-[9px] text-titan-text-muted mt-0.5 leading-tight">{cfg.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-titan-surface border border-titan-border p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-titan-text-muted" />
          <input
            type="search"
            placeholder="Buscar por nombre, email, teléfono o ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-titan-bg border border-titan-border py-2.5 pl-10 pr-4 text-sm text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder:text-titan-text-muted"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-titan-text-muted hover:text-white transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={segmentFilter}
          onChange={(e) => setFilter(e.target.value as Segment | 'all')}
          className="sm:hidden bg-titan-bg border border-titan-border py-2.5 px-3 text-sm text-titan-text focus:outline-none"
        >
          <option value="all">Todos los segmentos</option>
          {ALL_SEGMENTS.map((s) => <option key={s} value={s}>{SEGMENT_CONFIG[s].label}</option>)}
        </select>
      </div>

      <ClientsTable
        paginated={paginated}
        processed={processed}
        page={page}
        totalPages={totalPages}
        sortField={sortField}
        sortDir={sortDir}
        onSort={handleSort}
        onPageChange={setPage}
        onViewClient={setSelected}
        onClearFilters={() => { setSearch(''); setFilter('all'); }}
        onSegmentChange={handleSegmentChange}
      />

      {selectedClient && (
        <ClientProfileModal
          client={selectedClient}
          onClose={() => setSelected(null)}
          onSegmentChange={handleSegmentChange}
        />
      )}
    </div>
  );
}
