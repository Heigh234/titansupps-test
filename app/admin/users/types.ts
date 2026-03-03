/**
 * app/admin/users/types.ts
 *
 * Tipos compartidos para el módulo de Gestión de Clientes.
 * Importados por data.ts, utils.ts y todos los componentes del módulo.
 *
 * En producción estos tipos se alinearían con los DTOs de la API.
 */

export type Segment   = 'vip' | 'activo' | 'nuevo' | 'suspendido';
export type SortField = 'name' | 'spent' | 'orders' | 'registered';
export type SortDir   = 'asc' | 'desc';

export interface ClientOrder {
  id:     string;
  date:   string;   // ISO 8601
  total:  number;
  status: 'entregado' | 'enviado' | 'procesando' | 'cancelado';
  items:  string;   // descripción corta "Whey Isolate ×2, Creatina ×1"
}

export interface Client {
  id:              string;
  name:            string;
  email:           string;
  phone:           string;
  city:            string;
  country:         string;
  segment:         Segment;
  totalOrders:     number;
  totalSpent:      number;        // €
  avgOrderValue:   number;        // €
  lastPurchase:    string;        // ISO 8601
  registered:      string;        // ISO 8601
  favoriteProduct: string;
  notes?:          string;
  orders:          ClientOrder[];
}
