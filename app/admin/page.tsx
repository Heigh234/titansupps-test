'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Package, ShoppingCart, Users, Loader2 } from 'lucide-react';
import { getDashboardMetrics } from '@/actions/admin';

interface Metrics {
  pendingOrders: number;
  totalRevenue: number;
  totalUsers: number;
  stockAlerts: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardMetrics()
      .then((data) => { setMetrics(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const CARDS = [
    {
      title: 'Revenue Total',
      value: loading ? '—' : `€${metrics?.totalRevenue.toFixed(0) ?? 0}`,
      sub: 'Pedidos procesados + enviados + entregados',
      icon: DollarSign,
      positive: true,
    },
    {
      title: 'Pedidos Pendientes',
      value: loading ? '—' : String(metrics?.pendingOrders ?? 0),
      sub: 'En estado "procesando"',
      icon: ShoppingCart,
      positive: true,
    },
    {
      title: 'Clientes Registrados',
      value: loading ? '—' : String(metrics?.totalUsers ?? 0),
      sub: 'Total de usuarios activos',
      icon: Users,
      positive: true,
    },
    {
      title: 'Alertas de Stock',
      value: loading ? '—' : String(metrics?.stockAlerts ?? 0),
      sub: 'Productos con stock bajo o agotado',
      icon: Package,
      positive: (metrics?.stockAlerts ?? 0) === 0,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-heading text-3xl uppercase text-titan-text tracking-wider">Métricas Generales</h2>
          <p className="text-titan-text-muted text-sm mt-1">Resumen del rendimiento en tiempo real.</p>
        </div>
        {loading && <Loader2 size={20} className="animate-spin text-titan-accent" />}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CARDS.map((card, idx) => (
          <div key={idx} className="bg-titan-surface border border-titan-border p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className={`p-3 bg-titan-bg border border-titan-border ${card.positive ? 'text-titan-accent' : 'text-red-400'}`}>
                <card.icon size={20} />
              </div>
            </div>
            <div>
              <p className="text-titan-text-muted text-xs uppercase tracking-widest font-bold mb-1">{card.title}</p>
              <p className="font-heading text-4xl text-titan-text">{card.value}</p>
              <p className="text-titan-text-muted text-xs mt-1">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-titan-surface border border-titan-border p-6 min-h-[300px] flex flex-col">
          <h3 className="font-heading text-xl uppercase tracking-wider text-titan-text mb-6">Pedidos Recientes</h3>
          <div className="flex-1 border border-dashed border-titan-border flex items-center justify-center text-titan-text-muted text-sm">
            <div className="text-center">
              <p>Accede a la vista completa en</p>
              <a href="/admin/orders" className="text-titan-accent hover:text-white transition-colors font-bold mt-1 block uppercase tracking-widest text-xs">
                Gestión de Pedidos →
              </a>
            </div>
          </div>
        </div>

        <div className="bg-titan-surface border border-titan-border p-6 flex flex-col">
          <h3 className="font-heading text-xl uppercase tracking-wider text-titan-text mb-6">Accesos Rápidos</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Nuevo Producto',    href: '/admin/products/new' },
              { label: 'Ver Inventario',    href: '/admin/products'     },
              { label: 'Gestionar Pedidos', href: '/admin/orders'       },
              { label: 'Clientes',          href: '/admin/users'        },
              { label: 'Configuración',     href: '/admin/settings'     },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-3 border border-titan-border text-titan-text-muted hover:border-titan-accent hover:text-titan-accent transition-colors text-xs font-bold uppercase tracking-widest"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
