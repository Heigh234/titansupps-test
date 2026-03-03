'use client';

// ─────────────────────────────────────────────────────────────────────────────
// TAB 3 — ENVÍOS — app/admin/settings/TabEnvios.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Field, AdminInput, Toggle, SaveButton } from './_components';
import { useSaveState } from './_hooks';
import { INIT_SHIPPING } from './_data';
import type { ShippingSettings } from './_types';

export default function TabEnvios() {
  const [ship, setShip] = useState<ShippingSettings>(INIT_SHIPPING);
  const { saving, saved, trigger } = useSaveState();

  const setField = (key: keyof Omit<ShippingSettings, 'zones'>) => (v: string) =>
    setShip((s) => ({ ...s, [key]: v }));

  const toggleZone = (id: string) =>
    setShip((s) => ({
      ...s,
      zones: s.zones.map((z) => z.id === id ? { ...z, enabled: !z.enabled } : z),
    }));

  const setZonePrice = (id: string, price: string) =>
    setShip((s) => ({
      ...s,
      zones: s.zones.map((z) => z.id === id ? { ...z, price } : z),
    }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-2xl uppercase tracking-wider text-titan-text">Política de Envíos</h3>
        <p className="text-titan-text-muted text-sm mt-1">Configura los umbrales, tiempos y zonas de entrega.</p>
      </div>

      {/* Parámetros generales */}
      <div className="bg-titan-surface border border-titan-border px-6">
        <Field label="Envío gratuito desde" hint="Pedidos que superen este importe no pagan gastos de envío.">
          <AdminInput value={ship.freeThreshold} onChange={setField('freeThreshold')} type="number" prefix="€" suffix="o más" />
        </Field>
        <Field label="Tiempo estándar" hint="Días hábiles para envío normal.">
          <AdminInput value={ship.standardDays} onChange={setField('standardDays')} suffix="días hábiles" />
        </Field>
        <Field label="Tiempo exprés" hint="Días hábiles para envío exprés.">
          <AdminInput value={ship.expressDays} onChange={setField('expressDays')} suffix="horas" />
        </Field>
      </div>

      {/* Zonas */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-titan-text-muted mb-3">Zonas de envío</p>
        <div className="bg-titan-surface border border-titan-border divide-y divide-titan-border">
          {ship.zones.map((zone) => (
            <div
              key={zone.id}
              className={`flex items-center gap-4 px-6 py-4 transition-colors ${zone.enabled ? '' : 'opacity-50'}`}
            >
              <Toggle enabled={zone.enabled} onChange={() => toggleZone(zone.id)} label={zone.name} />
              <div className="flex-1">
                <p className="text-sm font-bold text-titan-text">{zone.name}</p>
              </div>
              <div className="flex items-center border border-titan-border focus-within:border-titan-accent transition-colors bg-titan-bg">
                <span className="px-3 text-xs text-titan-text-muted border-r border-titan-border select-none">€</span>
                <input
                  type="number"
                  value={zone.price}
                  onChange={(e) => setZonePrice(zone.id, e.target.value)}
                  disabled={!zone.enabled}
                  className="w-20 px-3 py-2 bg-transparent text-sm text-titan-text focus:outline-none disabled:opacity-40"
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-titan-text-muted mt-2">
          Las zonas desactivadas no aparecen como opción en el checkout.
        </p>
      </div>

      <div className="flex justify-end">
        <SaveButton onSave={trigger} saving={saving} saved={saved} />
      </div>
    </div>
  );
}
