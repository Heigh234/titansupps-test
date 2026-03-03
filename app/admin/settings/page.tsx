'use client';

/*
 * ADMIN — CONFIGURACIÓN GENERAL — app/admin/settings/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Shell de navegación por pestañas. Solo orquesta: no contiene lógica de negocio.
 *
 * Estructura de módulos:
 *  _types.ts           → interfaces TypeScript compartidas
 *  _data.ts            → constantes de estado inicial + helpers
 *  _hooks.ts           → useSaveState (ciclo saving → saved → idle)
 *  _components.tsx     → Field, AdminInput, Toggle, SaveButton, Modal
 *  TabTienda.tsx        → [1] Perfil de tienda, contacto, moneda, IVA
 *  TabNotificaciones.tsx→ [2] 8 toggles de alertas por email
 *  TabEnvios.tsx        → [3] Umbral gratuito, tiempos, zonas
 *  TabCupones.tsx       → [4] CRUD completo de cupones de descuento
 *  TabSeguridad.tsx     → [5] Contraseña, modo mantenimiento, sesiones
 *  TabIntegraciones.tsx → [6] Stripe, Klaviyo, Analytics, Meta Pixel
 */

import { useState } from 'react';
import { Store, Bell, Truck, Tag, ShieldCheck, Zap } from 'lucide-react';
import type { Tab } from './_types';
import TabTienda         from './TabTienda';
import TabNotificaciones from './TabNotificaciones';
import TabEnvios         from './TabEnvios';
import TabCupones        from './TabCupones';
import TabSeguridad      from './TabSeguridad';
import TabIntegraciones  from './TabIntegraciones';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'tienda',         label: 'Tienda',         icon: Store       },
  { id: 'notificaciones', label: 'Notificaciones',  icon: Bell        },
  { id: 'envios',         label: 'Envíos',          icon: Truck       },
  { id: 'cupones',        label: 'Cupones',         icon: Tag         },
  { id: 'seguridad',      label: 'Seguridad',       icon: ShieldCheck },
  { id: 'integraciones',  label: 'Integraciones',   icon: Zap         },
];

const TAB_COMPONENTS: Record<Tab, React.ComponentType> = {
  tienda:         TabTienda,
  notificaciones: TabNotificaciones,
  envios:         TabEnvios,
  cupones:        TabCupones,
  seguridad:      TabSeguridad,
  integraciones:  TabIntegraciones,
};

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<Tab>('tienda');
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div>
        <h2 className="font-heading text-3xl uppercase text-titan-text tracking-wider">Configuración</h2>
        <p className="text-titan-text-muted text-sm mt-1">Gestiona todas las opciones operativas de TitanSupps.</p>
      </div>

      {/* TABS — scroll horizontal en mobile */}
      <div className="border-b border-titan-border overflow-x-auto no-scrollbar">
        <nav className="flex gap-0 min-w-max" aria-label="Secciones de configuración" role="tablist">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 -mb-px whitespace-nowrap ${
                  isActive
                    ? 'border-titan-accent text-titan-accent'
                    : 'border-transparent text-titan-text-muted hover:text-white hover:border-titan-border'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* CONTENIDO — key fuerza remount al cambiar de tab (limpia estado interno) */}
      <div role="tabpanel" key={activeTab}>
        <ActiveComponent />
      </div>
    </div>
  );
}
