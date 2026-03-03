'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2, Package } from 'lucide-react';
import { getUserOrders } from '@/actions/account';

interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
  order_items: { name: string; quantity: number }[];
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'entregado':
      return <span className="px-2 py-1 text-[10px] uppercase font-bold bg-green-500/10 text-green-500 border border-green-500/20">Entregado</span>;
    case 'enviado':
      return <span className="px-2 py-1 text-[10px] uppercase font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse">En Camino</span>;
    case 'procesando':
      return <span className="px-2 py-1 text-[10px] uppercase font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Procesando</span>;
    case 'pendiente':
      return <span className="px-2 py-1 text-[10px] uppercase font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Pendiente</span>;
    case 'cancelado':
      return <span className="px-2 py-1 text-[10px] uppercase font-bold bg-red-500/10 text-red-400 border border-red-500/20">Cancelado</span>;
    default:
      return null;
  }
}

export default function TabOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserOrders()
      .then((data) => { setOrders(data as Order[]); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <motion.div
      key="orders"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <h2 className="font-heading text-2xl uppercase tracking-wider text-titan-text border-b border-titan-border pb-4">
        Historial de Operaciones
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-titan-accent" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <Package size={40} className="text-titan-text-muted" />
          <p className="text-titan-text-muted">Aún no tienes pedidos. Es hora de equiparte.</p>
          <Link href="/catalog" className="px-6 py-3 bg-titan-accent text-white font-heading uppercase tracking-wider hover:bg-titan-accent-hover transition-colors">
            Ir al Arsenal
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const itemSummary = order.order_items
              .slice(0, 2)
              .map((i) => `${i.name} ×${i.quantity}`)
              .join(', ');
            const date = new Date(order.created_at).toLocaleDateString('es-ES', {
              day: '2-digit', month: 'short', year: 'numeric',
            });

            return (
              <Link
                key={order.id}
                href={`/order/${order.id}`}
                className="group block bg-titan-surface border border-titan-border hover:border-titan-accent/50 transition-colors p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-heading text-titan-text uppercase tracking-widest text-sm">
                        {String(order.id).toUpperCase().substring(0, 8)}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-titan-text-muted text-xs truncate">{itemSummary}</p>
                    <p className="text-titan-text-muted text-xs mt-1">{date}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-heading text-titan-accent text-lg">€{Number(order.total).toFixed(2)}</span>
                    <ChevronRight size={16} className="text-titan-text-muted group-hover:text-titan-accent transition-colors group-hover:translate-x-0.5 transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
