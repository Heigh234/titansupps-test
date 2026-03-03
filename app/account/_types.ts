// ─────────────────────────────────────────────────────────────────────────────
// TIPOS Y DATOS — app/account/_types.ts
// ─────────────────────────────────────────────────────────────────────────────

export type Tab = 'profile' | 'orders' | 'addresses' | 'favorites';

export interface Address {
  id:        number;
  title:     string;
  address:   string;
  city:      string;
  isDefault: boolean;
}

export type AddressFormData = Omit<Address, 'id' | 'isDefault'>;

/** Formulario vacío para crear una nueva dirección */
export const emptyForm: AddressFormData = { title: '', address: '', city: '' };

/** Direcciones iniciales mock (en producción vendrían de la API del usuario) */
export const INITIAL_ADDRESSES: Address[] = [
  { id: 1, title: 'Gimnasio (Principal)', address: 'Av. Hierro 123, Sector Norte', city: 'Metrópolis', isDefault: true  },
  { id: 2, title: 'Casa',                 address: 'Calle Progreso 45, Depto 2B',  city: 'Metrópolis', isDefault: false },
];

/** Pedidos mock (en producción: fetch a /api/orders?userId=xxx) */
export const MOCK_ORDERS = [
  { id: 'ORD-2099', date: '22 Feb 2026', total: 124.98, status: 'en_camino', items: 2 },
  { id: 'ORD-1084', date: '15 Ene 2026', total:  64.99, status: 'entregado', items: 1 },
  { id: 'ORD-0992', date: '02 Nov 2025', total: 210.50, status: 'entregado', items: 4 },
];
