'use client';

import { useState, useEffect } from 'react';
import { Field, AdminInput, SaveButton } from './_components';
import { useSaveState } from './_hooks';
import { INIT_STORE } from './_data';
import { getStoreSettings, updateStoreSettings } from '@/actions/admin';
import type { StoreSettings } from './_types';

export default function TabTienda() {
  const [form, setForm] = useState<StoreSettings>(INIT_STORE);
  const { saving, saved, trigger } = useSaveState();

  useEffect(() => {
    getStoreSettings().then((data) => {
      if (data) {
        setForm((prev) => ({
          ...prev,
          name:         data.name         ?? prev.name,
          tagline:      data.tagline       ?? prev.tagline,
          email:        data.email         ?? prev.email,
          phone:        data.phone         ?? prev.phone,
          address:      data.address       ?? prev.address,
          city:         data.city          ?? prev.city,
          currency:     data.currency      ?? prev.currency,
          vatRate:      String(data.vat_rate ?? prev.vatRate),
          supportHours: data.support_hours ?? prev.supportHours,
        }));
      }
    });
  }, []);

  const set = (key: keyof StoreSettings) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  const handleSave = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)));
    await updateStoreSettings(formData);
    trigger();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-2xl uppercase tracking-wider text-titan-text">Perfil de la Tienda</h3>
        <p className="text-titan-text-muted text-sm mt-1">Información pública y datos de contacto de TitanSupps.</p>
      </div>

      <div className="bg-titan-surface border border-titan-border px-6">
        <Field label="Nombre de la tienda">
          <AdminInput value={form.name} onChange={set('name')} placeholder="TitanSupps" />
        </Field>

        <Field label="Tagline" hint="Aparece en el footer y metadata SEO.">
          <AdminInput value={form.tagline} onChange={set('tagline')} placeholder="Tu eslogan aquí" />
        </Field>

        <Field label="Email de soporte" hint="Los clientes escriben a esta dirección.">
          <AdminInput value={form.email} onChange={set('email')} type="email" prefix="@" />
        </Field>

        <Field label="Teléfono de atención">
          <AdminInput value={form.phone} onChange={set('phone')} type="tel" prefix="📞" />
        </Field>

        <Field label="Dirección física" hint="Usada en la facturación y avisos legales.">
          <AdminInput value={form.address} onChange={set('address')} />
        </Field>

        <Field label="Ciudad / CP">
          <AdminInput value={form.city} onChange={set('city')} />
        </Field>

        <Field label="Moneda" hint="Afecta a todos los precios mostrados.">
          <select
            value={form.currency}
            onChange={(e) => set('currency')(e.target.value)}
            className="w-full bg-titan-bg border border-titan-border px-4 py-2.5 text-sm text-titan-text focus:outline-none focus:border-titan-accent transition-colors"
          >
            <option value="EUR">€ Euro (EUR)</option>
            <option value="USD">$ Dólar (USD)</option>
            <option value="GBP">£ Libra (GBP)</option>
          </select>
        </Field>

        <Field label="IVA por defecto (%)" hint="Se aplica a todos los productos salvo excepción.">
          <AdminInput value={form.vatRate} onChange={set('vatRate')} type="number" suffix="%" />
        </Field>

        <Field label="Horario de atención" hint="Mostrado en la página de contacto.">
          <AdminInput value={form.supportHours} onChange={set('supportHours')} placeholder="L–V 9:00–18:00" />
        </Field>
      </div>

      <div className="flex justify-end">
        <SaveButton onSave={handleSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
}
