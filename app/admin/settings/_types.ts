// ─────────────────────────────────────────────────────────────────────────────
// TIPOS — app/admin/settings/_types.ts
// ─────────────────────────────────────────────────────────────────────────────

export type Tab = 'tienda' | 'notificaciones' | 'envios' | 'cupones' | 'seguridad' | 'integraciones';

export interface StoreSettings {
  name:         string;
  tagline:      string;
  email:        string;
  phone:        string;
  address:      string;
  city:         string;
  currency:     string;
  vatRate:      string;
  supportHours: string;
}

export interface NotifSettings {
  newOrder:       boolean;
  orderShipped:   boolean;
  orderCancelled: boolean;
  lowStock:       boolean;
  newUser:        boolean;
  userSuspended:  boolean;
  newsletterSub:  boolean;
  weeklyReport:   boolean;
}

export interface ShippingSettings {
  freeThreshold: string;
  standardDays:  string;
  expressDays:   string;
  zones: {
    id:      string;
    name:    string;
    price:   string;
    enabled: boolean;
  }[];
}

export interface Coupon {
  id:       string;
  code:     string;
  type:     'percent' | 'fixed';
  value:    string;
  minOrder: string;
  uses:     number;
  maxUses:  string;
  active:   boolean;
  expires:  string;
}

export interface Integration {
  id:        string;
  name:      string;
  desc:      string;
  icon:      string;
  connected: boolean;
  apiKey?:   string;
  status?:   string;
}
