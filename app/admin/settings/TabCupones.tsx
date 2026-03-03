'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Check, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';
import { Toggle, Modal } from './_components';
import { EMPTY_COUPON, generateCode, copyToClipboard } from './_data';
import { createCoupon, toggleCoupon, deleteCoupon } from '@/actions/admin';
import type { Coupon } from './_types';

// Necesitamos cargar los cupones desde Supabase
import { createClient } from '@/lib/supabase/client';

export default function TabCupones() {
  const [coupons, setCoupons]   = useState<Coupon[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setModal]   = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copied, setCopied]     = useState<string | null>(null);
  const [form, setForm]         = useState(EMPTY_COUPON);
  const [formErr, setFormErr]   = useState('');
  const [saving, setSaving]     = useState(false);

  // Cargar cupones desde Supabase
  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setCoupons(data.map((c) => ({
          id:       c.id,
          code:     c.code,
          type:     c.type,
          value:    String(c.value),
          minOrder: String(c.min_order ?? 0),
          uses:     c.uses,
          maxUses:  c.max_uses ? String(c.max_uses) : "∞",
          active:   c.active,
          expires:  c.expires ? c.expires.substring(0, 10) : "",
        })));
      }
      setLoading(false);
    })();
  }, []);

  const handleToggle = async (id: string) => {
    const coupon = coupons.find((c) => c.id === id);
    if (!coupon) return;
    setCoupons((cs) => cs.map((c) => c.id === id ? { ...c, active: !c.active } : c));
    await toggleCoupon(id, !coupon.active);
  };

  const doDelete = async () => {
    if (!deleteId) return;
    setCoupons((cs) => cs.filter((c) => c.id !== deleteId));
    await deleteCoupon(deleteId);
    setDeleteId(null);
  };

  const handleCopy = (code: string) => {
    copyToClipboard(code, () => {
      setCopied(code);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  const handleAdd = async () => {
    if (!form.code.trim())  { setFormErr('El código no puede estar vacío.');        return; }
    if (!form.value.trim()) { setFormErr('Introduce el valor del descuento.');      return; }
    if (coupons.some((c) => c.code.toUpperCase() === form.code.toUpperCase())) {
      setFormErr('Ese código ya existe.');
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append('code',            form.code.toUpperCase().trim());
    formData.append('discount_type',   form.type);
    formData.append('discount_value',  form.value);
    formData.append('min_order_amount',form.minOrder);
    formData.append('max_uses',        form.maxUses);
    formData.append('expires_at',      form.expires);

    const result = await createCoupon(formData);
    setSaving(false);

    if ('error' in result) { setFormErr(result.error); return; }

    // Recargar lista
    const supabase = createClient();
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    if (data?.[0]) {
      const c = data[0];
      setCoupons((prev) => [{
        id:       c.id,
        code:     c.code,
        type:     c.type,
        value:    String(c.value),
        minOrder: String(c.min_order ?? 0),
        uses:     0,
        maxUses:  c.max_uses ? String(c.max_uses) : '∞',
        active:   true,
        expires:  c.expires ? c.expires.substring(0, 10) : '',
      }, ...prev]);
    }
    setModal(false);
    setForm(EMPTY_COUPON);
    setFormErr('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={28} className="animate-spin text-titan-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-2xl uppercase tracking-wider text-titan-text">Cupones de Descuento</h3>
          <p className="text-titan-text-muted text-sm mt-1">{coupons.length} cupones activos e inactivos.</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-titan-accent text-white text-sm font-bold uppercase tracking-wider hover:bg-titan-accent-hover transition-colors"
        >
          <Plus size={16} /> Nuevo Cupón
        </button>
      </div>

      <div className="bg-titan-surface border border-titan-border divide-y divide-titan-border">
        {coupons.length === 0 ? (
          <div className="px-6 py-12 text-center text-titan-text-muted text-sm">
            No hay cupones aún. Crea el primero.
          </div>
        ) : coupons.map((c) => (
          <div key={c.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-titan-text text-sm tracking-widest">{c.code}</span>
                <button
                  onClick={() => handleCopy(c.code)}
                  className="text-titan-text-muted hover:text-titan-accent transition-colors"
                  aria-label="Copiar código"
                >
                  {copied === c.code ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                </button>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase border border-titan-accent/30 text-titan-accent">
                {c.type === 'percent' ? `${c.value}%` : `€${c.value}`} OFF
              </span>
              {c.minOrder !== '0' && (
                <span className="text-[11px] text-titan-text-muted">Mín. €{c.minOrder}</span>
              )}
              <span className="text-[11px] text-titan-text-muted">{c.uses} usos / {c.maxUses}</span>
              {c.expires && (
                <span className="text-[11px] text-titan-text-muted">Hasta {c.expires}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Toggle enabled={c.active} onChange={() => handleToggle(c.id)} label={`${c.active ? 'Desactivar' : 'Activar'} cupón ${c.code}`} />
              <button
                onClick={() => setDeleteId(c.id)}
                className="text-titan-text-muted hover:text-red-400 transition-colors"
                aria-label="Eliminar cupón"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal nuevo cupón */}
      {showModal && (
        <Modal title="Nuevo Cupón" onClose={() => { setModal(false); setFormErr(''); setForm(EMPTY_COUPON); }}>
          <div className="space-y-4 p-6">
            <div className="flex gap-2">
              <input
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="CÓDIGO"
                className="flex-1 bg-titan-bg border border-titan-border px-4 py-2.5 text-sm text-titan-text font-mono font-bold uppercase focus:outline-none focus:border-titan-accent"
              />
              <button
                onClick={() => setForm((f) => ({ ...f, code: generateCode() }))}
                className="px-3 border border-titan-border text-titan-text-muted hover:text-titan-accent transition-colors"
                title="Generar código aleatorio"
              >
                <RefreshCw size={14} />
              </button>
            </div>
            <div className="flex gap-2">
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'percent' | 'fixed' }))}
                className="bg-titan-bg border border-titan-border px-3 py-2.5 text-sm text-titan-text focus:outline-none focus:border-titan-accent"
              >
                <option value="percent">% Porcentaje</option>
                <option value="fixed">€ Fijo</option>
              </select>
              <input
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                placeholder="Valor"
                type="number"
                className="flex-1 bg-titan-bg border border-titan-border px-4 py-2.5 text-sm text-titan-text focus:outline-none focus:border-titan-accent"
              />
            </div>
            <input
              value={form.minOrder}
              onChange={(e) => setForm((f) => ({ ...f, minOrder: e.target.value }))}
              placeholder="Pedido mínimo (€)"
              type="number"
              className="w-full bg-titan-bg border border-titan-border px-4 py-2.5 text-sm text-titan-text focus:outline-none focus:border-titan-accent"
            />
            <input
              value={form.maxUses}
              onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
              placeholder="Máx. usos (vacío = ilimitado)"
              type="number"
              className="w-full bg-titan-bg border border-titan-border px-4 py-2.5 text-sm text-titan-text focus:outline-none focus:border-titan-accent"
            />
            <input
              value={form.expires}
              onChange={(e) => setForm((f) => ({ ...f, expires: e.target.value }))}
              type="date"
              className="w-full bg-titan-bg border border-titan-border px-4 py-2.5 text-sm text-titan-text focus:outline-none focus:border-titan-accent"
            />
            {formErr && (
              <p className="text-red-400 text-xs flex items-center gap-1.5">
                <AlertTriangle size={12} /> {formErr}
              </p>
            )}
            <button
              onClick={handleAdd}
              disabled={saving}
              className="w-full py-3 bg-titan-accent text-white font-bold uppercase tracking-wider hover:bg-titan-accent-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Crear Cupón
            </button>
          </div>
        </Modal>
      )}

      {/* Modal confirmar eliminación */}
      {deleteId && (
        <Modal title="Eliminar Cupón" onClose={() => setDeleteId(null)}>
          <div className="p-6 space-y-4">
            <p className="text-titan-text-muted text-sm">
              Esta acción es irreversible. El cupón será eliminado permanentemente.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-titan-border text-titan-text-muted hover:border-titan-accent hover:text-white transition-colors text-sm font-bold uppercase">
                Cancelar
              </button>
              <button onClick={doDelete} className="flex-1 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-bold uppercase">
                Eliminar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
