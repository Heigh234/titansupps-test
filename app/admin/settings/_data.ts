// ─────────────────────────────────────────────────────────────────────────────
// DATOS INICIALES — app/admin/settings/_data.ts
// ─────────────────────────────────────────────────────────────────────────────
// En producción, estos valores vendrían de un fetch a la API.
// Aquí son mocks estáticos para el prototipo funcional.

import type { StoreSettings, NotifSettings, ShippingSettings, Coupon, Integration } from './_types';

export const INIT_STORE: StoreSettings = {
  name:         'TitanSupps',
  tagline:      'Suplementación de grado élite para atletas reales.',
  email:        'info@titansupps.com',
  phone:        '+34 900 123 456',
  address:      'Calle Acero 88, Polígono Industrial Norte',
  city:         'Madrid, 28001',
  currency:     'EUR',
  vatRate:      '21',
  supportHours: 'L–V 9:00–18:00',
};

export const INIT_NOTIF: NotifSettings = {
  newOrder:       true,
  orderShipped:   true,
  orderCancelled: true,
  lowStock:       true,
  newUser:        false,
  userSuspended:  true,
  newsletterSub:  false,
  weeklyReport:   true,
};

export const INIT_SHIPPING: ShippingSettings = {
  freeThreshold: '69',
  standardDays:  '3-5',
  expressDays:   '24',
  zones: [
    { id: 'z1', name: 'España Peninsular', price: '4.99',  enabled: true  },
    { id: 'z2', name: 'Islas Baleares',    price: '7.99',  enabled: true  },
    { id: 'z3', name: 'Islas Canarias',    price: '9.99',  enabled: true  },
    { id: 'z4', name: 'Portugal',          price: '6.99',  enabled: true  },
    { id: 'z5', name: 'Resto de Europa',   price: '14.99', enabled: false },
  ],
};

export const INIT_COUPONS: Coupon[] = [
  { id: 'c1', code: 'TITAN10',      type: 'percent', value: '10', minOrder: '50',  uses: 342, maxUses: '∞',   active: true,  expires: '2025-12-31' },
  { id: 'c2', code: 'BIENVENIDO15', type: 'percent', value: '15', minOrder: '0',   uses: 89,  maxUses: '500', active: true,  expires: '2025-06-30' },
  { id: 'c3', code: 'FLETE0',       type: 'fixed',   value: '5',  minOrder: '30',  uses: 211, maxUses: '∞',   active: false, expires: '2025-03-31' },
  { id: 'c4', code: 'VIP2025',      type: 'percent', value: '20', minOrder: '100', uses: 44,  maxUses: '200', active: true,  expires: '2025-12-31' },
];

export const INIT_INTEGRATIONS: Integration[] = [
  { id: 'stripe',    name: 'Stripe',          desc: 'Procesamiento de pagos y gestión de suscripciones.',   icon: '💳', connected: false },
  { id: 'klaviyo',   name: 'Klaviyo',         desc: 'Email marketing, flows automatizados y segmentación.', icon: '📧', connected: false },
  { id: 'analytics', name: 'Google Analytics',desc: 'Métricas de tráfico, conversión y comportamiento.',    icon: '📊', connected: false },
  { id: 'metapixel', name: 'Meta Pixel',      desc: 'Retargeting, audiencias y conversiones en Meta Ads.',  icon: '📱', connected: false },
];

// Formulario vacío para crear un nuevo cupón
export const EMPTY_COUPON: {
  code: string; type: 'percent' | 'fixed'; value: string;
  minOrder: string; maxUses: string; expires: string;
} = { code: '', type: 'percent', value: '', minOrder: '0', maxUses: '', expires: '' };

// Helpers de cupones (usados en TabCupones)
export function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function copyToClipboard(text: string, onDone: () => void) {
  navigator.clipboard.writeText(text).then(onDone).catch(() => {
    // fallback silencioso
  });
}
