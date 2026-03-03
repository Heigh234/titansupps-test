/**
 * app/admin/orders/types.ts
 *
 * Tipos compartidos para el módulo de Gestión de Pedidos.
 * Importados por data.ts, utils.ts y todos los componentes del módulo.
 *
 * En producción estos tipos se alinearían con los DTOs de la API de pedidos.
 */

export type OrderStatus = 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
export type SortField   = 'date' | 'total' | 'id';
export type SortDir     = 'asc' | 'desc';

export interface OrderItem {
  id:      string;
  name:    string;
  variant: string;
  qty:     number;
  price:   number;
  image:   string;
}

export interface Order {
  id:            string;
  customer: {
    name:  string;
    email: string;
    phone: string;
  };
  address: {
    street:  string;
    city:    string;
    country: string;
  };
  items:         OrderItem[];
  total:         number;
  status:        OrderStatus;
  paymentMethod: string;
  date:          string;           // ISO 8601
  trackingCode?: string;
  notes?:        string;
}
