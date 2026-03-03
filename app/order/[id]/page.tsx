'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Truck, AlertCircle, Loader2 } from 'lucide-react';

import { getOrderDetail } from '@/actions/account';
import { STATUS_CONFIG }  from './types';
import OrderTimeline      from './OrderTimeline';
import OrderItems         from './OrderItems';
import OrderSidebar       from './OrderSidebar';
import type { OrderData, OrderStatus } from './types';

// Mapea pedido de Supabase al shape que espera la UI
function mapOrderData(raw: Record<string, unknown>): OrderData {
  const items = ((raw.order_items as Record<string, unknown>[]) ?? []).map((item) => ({
    id:       String(item.id),
    nombre:   String(item.name     || ''),
    variante: String(item.variant  || ''),
    precio:   Number(item.price    || 0),
    cantidad: Number(item.quantity || 1),
    image:    String(item.image_url || ''),
    slug:     String(item.slug     || ''),
  }));

  const timeline = ((raw.order_timeline as Record<string, unknown>[]) ?? []).map((t) => ({
    estado:     String(t.status      || ''),
    fecha:      String(t.created_at  || ''),
    completado: true,
    desc:       String(t.description || ''),
  }));

  // Mapear status de Supabase al status de la UI
  const statusMap: Record<string, OrderStatus> = {
    pendiente:  'confirmado',
    procesando: 'preparacion',
    enviado:    'en_camino',
    entregado:  'entregado',
    cancelado:  'confirmado',
  };

  return {
    id:             String(raw.id),
    fecha:          new Date(String(raw.created_at)).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
    fechaEstimada:  null,
    status:         statusMap[String(raw.status)] || 'confirmado',
    tracking:       String(raw.tracking_code || ''),
    transportista:  'DHL',
    items,
    envio: {
      nombre:    String(raw.ship_name    || ''),
      direccion: String(raw.ship_street  || ''),
      ciudad:    String(raw.ship_city    || ''),
      pais:      String(raw.ship_country || ''),
      cp:        String(raw.ship_zip     || ''),
    },
    pago: {
      metodo:     String(raw.payment_method || 'Tarjeta'),
      subtotal:   Number(raw.subtotal        || raw.total || 0),
      costoEnvio: Number(raw.shipping_cost   || 0),
      descuento:  Number(raw.discount_amount || 0),
      total:      Number(raw.total           || 0),
      moneda:     'EUR',
    },
    timeline,
  };
}

export default function OrderDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const [order, setOrder]   = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const orderId = String(params?.id || '');

  useEffect(() => {
    if (!orderId) return;
    getOrderDetail(orderId)
      .then((data) => {
        if (data) {
          setOrder(mapOrderData(data as Record<string, unknown>));
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-titan-bg flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-titan-accent" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-titan-bg flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="text-titan-accent mx-auto mb-6" />
          <h1 className="font-heading text-4xl text-titan-text uppercase mb-3">Pedido no encontrado</h1>
          <p className="text-titan-text-muted mb-8">
            No encontramos el pedido <strong className="text-titan-text">{params?.id}</strong> asociado a tu cuenta.
          </p>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 px-8 py-4 bg-titan-accent text-white font-heading text-xl uppercase tracking-wider hover:bg-titan-accent-hover transition-colors"
          >
            <ArrowLeft size={16} />
            Volver a Mis Pedidos
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status];

  return (
    <div className="min-h-screen bg-titan-bg pt-28 pb-24">
      <div className="container mx-auto px-6">

        <div className="mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-titan-text-muted hover:text-titan-accent transition-colors text-xs font-bold uppercase tracking-widest mb-6 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Volver a mis pedidos
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-titan-border pb-8">
            <div>
              <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-2">Detalle de operación</p>
              <h1 className="font-heading text-fluid-4xl text-titan-text uppercase leading-none">
                {order.id.substring(0, 8).toUpperCase()}
              </h1>
              <p className="text-titan-text-muted text-sm mt-2">{order.fecha}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1.5 border text-xs font-bold uppercase tracking-widest ${statusConfig.bg} ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
              {order.status === 'en_camino' && order.tracking && (
                <a
                  href={`https://www.dhl.com/es-es/home/rastreo.html?tracking-id=${order.tracking}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-titan-border text-titan-text-muted hover:border-titan-accent hover:text-titan-accent transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  <Truck size={12} />
                  Rastrear envío
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <OrderTimeline order={order} />
            <OrderItems    order={order} />
          </div>
          <OrderSidebar order={order} />
        </div>

      </div>
    </div>
  );
}
