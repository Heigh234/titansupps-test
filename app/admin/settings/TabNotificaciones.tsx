'use client';

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2 — NOTIFICACIONES — app/admin/settings/TabNotificaciones.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Store, Truck, X, AlertTriangle, Globe, Lock, Mail, RefreshCw } from 'lucide-react';
import { Toggle, SaveButton } from './_components';
import { useSaveState } from './_hooks';
import { INIT_NOTIF } from './_data';
import type { NotifSettings } from './_types';

const NOTIF_ITEMS: { key: keyof NotifSettings; label: string; desc: string; icon: React.ElementType }[] = [
  { key: 'newOrder',       label: 'Nuevo pedido',              desc: 'Recibe un email cuando se confirme un pedido.',                   icon: Store        },
  { key: 'orderShipped',   label: 'Pedido enviado',            desc: 'Notificación cuando se marca como enviado.',                       icon: Truck        },
  { key: 'orderCancelled', label: 'Pedido cancelado',          desc: 'Alerta inmediata ante cualquier cancelación.',                     icon: X            },
  { key: 'lowStock',       label: 'Stock bajo',                desc: 'Aviso cuando un producto cae por debajo de 15 unidades.',          icon: AlertTriangle },
  { key: 'newUser',        label: 'Nuevo registro de usuario', desc: 'Email cuando un cliente crea una cuenta.',                         icon: Globe        },
  { key: 'userSuspended',  label: 'Cliente suspendido',        desc: 'Notificación al marcar una cuenta como suspendida.',               icon: Lock         },
  { key: 'newsletterSub',  label: 'Suscripción newsletter',    desc: 'Aviso por cada nuevo suscriptor al newsletter.',                   icon: Mail         },
  { key: 'weeklyReport',   label: 'Resumen semanal',           desc: 'Informe de ventas y métricas cada lunes a las 8:00.',              icon: RefreshCw    },
];

export default function TabNotificaciones() {
  const [notif, setNotif] = useState<NotifSettings>(INIT_NOTIF);
  const { saving, saved, trigger } = useSaveState();

  const toggle = (key: keyof NotifSettings) =>
    setNotif((n) => ({ ...n, [key]: !n[key] }));

  const allOn  = Object.values(notif).every(Boolean);
  const allOff = Object.values(notif).every((v) => !v);

  // Usamos reduce tipado para evitar el error de TypeScript con Object.fromEntries
  const setAll = (value: boolean) =>
    setNotif((Object.keys(notif) as (keyof NotifSettings)[]).reduce(
      (acc, k) => ({ ...acc, [k]: value }),
      {} as NotifSettings
    ));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-2xl uppercase tracking-wider text-titan-text">Notificaciones por Email</h3>
          <p className="text-titan-text-muted text-sm mt-1">
            Todas las alertas se envían a <span className="text-titan-accent font-bold">admin@titansupps.com</span>
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setAll(true)}
            disabled={allOn}
            className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 border border-titan-border text-titan-text-muted hover:border-titan-accent hover:text-titan-accent transition-colors disabled:opacity-30"
          >
            Activar todo
          </button>
          <button
            onClick={() => setAll(false)}
            disabled={allOff}
            className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 border border-titan-border text-titan-text-muted hover:border-red-500/50 hover:text-red-400 transition-colors disabled:opacity-30"
          >
            Desactivar todo
          </button>
        </div>
      </div>

      <div className="bg-titan-surface border border-titan-border divide-y divide-titan-border">
        {NOTIF_ITEMS.map(({ key, label, desc, icon: Icon }) => (
          <div key={key} className="flex items-center justify-between px-6 py-4 gap-4 hover:bg-titan-bg/40 transition-colors">
            <div className="flex items-start gap-4">
              <div className={`p-2 border flex-shrink-0 mt-0.5 transition-colors ${
                notif[key]
                  ? 'border-titan-accent/40 bg-titan-accent/10 text-titan-accent'
                  : 'border-titan-border text-titan-text-muted'
              }`}>
                <Icon size={14} />
              </div>
              <div>
                <p className="text-sm font-bold text-titan-text">{label}</p>
                <p className="text-xs text-titan-text-muted mt-0.5">{desc}</p>
              </div>
            </div>
            <Toggle enabled={notif[key]} onChange={() => toggle(key)} label={label} />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <SaveButton onSave={trigger} saving={saving} saved={saved} />
      </div>
    </div>
  );
}
