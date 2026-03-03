'use client';

// ─────────────────────────────────────────────────────────────────────────────
// TAB 5 — SEGURIDAD — app/admin/settings/TabSeguridad.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Lock, Key, Eye, EyeOff, Power, AlertTriangle } from 'lucide-react';
import { Toggle, SaveButton, Modal } from './_components';

const MOCK_SESSIONS = [
  { id: 's1', device: 'Chrome · MacBook Pro',  ip: '88.12.45.102', location: 'Madrid, ES',    active: true,  last: 'Ahora mismo'  },
  { id: 's2', device: 'Safari · iPhone 15',    ip: '88.12.45.103', location: 'Madrid, ES',    active: false, last: 'Hace 2 horas' },
  { id: 's3', device: 'Firefox · Windows 11',  ip: '213.97.14.8',  location: 'Barcelona, ES', active: false, last: 'Hace 3 días'  },
];

type PwKey = 'current' | 'next' | 'confirm';

export default function TabSeguridad() {
  const [maintenanceMode, setMaintenance]   = useState(false);
  const [showMaintConfirm, setMaintConfirm] = useState(false);
  const [sessions, setSessions]             = useState(MOCK_SESSIONS);

  const [pw, setPw]         = useState<Record<PwKey, string>>({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState<Record<PwKey, boolean>>({ current: false, next: false, confirm: false });
  const [pwError, setPwError]   = useState('');
  const [pwSaved, setPwSaved]   = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const pwStrength = (() => {
    const p = pw.next;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8)          score++;
    if (p.length >= 12)         score++;
    if (/[A-Z]/.test(p))        score++;
    if (/[0-9]/.test(p))        score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: 'Débil',  color: 'bg-red-500',    pct: '25%'  };
    if (score <= 3) return { label: 'Media',  color: 'bg-yellow-500', pct: '60%'  };
    return                 { label: 'Fuerte', color: 'bg-green-500',  pct: '100%' };
  })();

  const handlePwSave = () => {
    if (!pw.current)           { setPwError('Introduce tu contraseña actual.'); return; }
    if (pw.next.length < 8)    { setPwError('La nueva contraseña debe tener al menos 8 caracteres.'); return; }
    if (pw.next !== pw.confirm) { setPwError('Las contraseñas no coinciden.'); return; }
    setPwError('');
    setPwSaving(true);
    setTimeout(() => {
      setPwSaving(false);
      setPwSaved(true);
      setPw({ current: '', next: '', confirm: '' });
      setTimeout(() => setPwSaved(false), 2500);
    }, 800);
  };

  const revokeSession = (id: string) =>
    setSessions((ss) => ss.filter((s) => s.id === 's1' || s.id !== id));

  const toggleMaintenance = () => {
    if (!maintenanceMode) { setMaintConfirm(true); return; }
    setMaintenance(false);
  };

  const PW_FIELDS: { key: PwKey; label: string }[] = [
    { key: 'current', label: 'Contraseña actual'            },
    { key: 'next',    label: 'Nueva contraseña'             },
    { key: 'confirm', label: 'Confirmar nueva contraseña'   },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-heading text-2xl uppercase tracking-wider text-titan-text">Seguridad de la Cuenta</h3>
        <p className="text-titan-text-muted text-sm mt-1">Gestiona el acceso, las contraseñas y el estado operativo de la tienda.</p>
      </div>

      {/* ── Cambio de contraseña ── */}
      <div className="bg-titan-surface border border-titan-border">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-titan-border">
          <Lock size={16} className="text-titan-accent" />
          <h4 className="font-heading text-lg uppercase tracking-wider text-titan-text">Cambiar Contraseña</h4>
        </div>
        <div className="px-6 py-5 space-y-4">
          {PW_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="text-[10px] font-bold uppercase tracking-widest text-titan-text-muted block mb-1.5">{label}</label>
              <div className="flex items-center border border-titan-border focus-within:border-titan-accent transition-colors bg-titan-bg">
                <input
                  type={showPw[key] ? 'text' : 'password'}
                  value={pw[key]}
                  onChange={(e) => { setPw((p) => ({ ...p, [key]: e.target.value })); setPwError(''); }}
                  placeholder="••••••••••"
                  className="flex-1 px-4 py-2.5 bg-transparent text-sm text-titan-text focus:outline-none placeholder:text-titan-text-muted"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => ({ ...s, [key]: !s[key] }))}
                  className="px-3 text-titan-text-muted hover:text-white transition-colors"
                  aria-label="Mostrar/ocultar contraseña"
                >
                  {showPw[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {key === 'next' && pw.next && pwStrength && (
                <div className="mt-2">
                  <div className="h-1 bg-titan-border rounded-full overflow-hidden">
                    <div className={`h-full ${pwStrength.color} transition-all duration-300`} style={{ width: pwStrength.pct }} />
                  </div>
                  <p className="text-[10px] text-titan-text-muted mt-1">
                    Fortaleza: <strong className="text-titan-text">{pwStrength.label}</strong>
                  </p>
                </div>
              )}
            </div>
          ))}

          {pwError && (
            <div className="flex items-center gap-2 p-3 border border-red-500/30 bg-red-500/5">
              <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-400">{pwError}</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <SaveButton onSave={handlePwSave} saving={pwSaving} saved={pwSaved} />
          </div>
        </div>
      </div>

      {/* ── Modo mantenimiento ── */}
      <div className={`bg-titan-surface border transition-colors ${maintenanceMode ? 'border-yellow-500/40' : 'border-titan-border'}`}>
        <div className="flex items-center justify-between px-6 py-5 gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-2.5 border flex-shrink-0 mt-0.5 ${maintenanceMode ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400' : 'border-titan-border text-titan-text-muted'}`}>
              <Power size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-titan-text">Modo Mantenimiento</p>
              <p className="text-xs text-titan-text-muted mt-0.5">
                {maintenanceMode
                  ? '⚠️ Activo — la tienda muestra una página de mantenimiento a los visitantes.'
                  : 'La tienda está online y accesible para todos los usuarios.'}
              </p>
            </div>
          </div>
          <Toggle enabled={maintenanceMode} onChange={toggleMaintenance} label="Modo mantenimiento" />
        </div>
      </div>

      {/* ── Sesiones activas ── */}
      <div className="bg-titan-surface border border-titan-border">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-titan-border">
          <Key size={16} className="text-titan-accent" />
          <h4 className="font-heading text-lg uppercase tracking-wider text-titan-text">Sesiones Activas</h4>
        </div>
        <div className="divide-y divide-titan-border">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-6 py-4 gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${s.active ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]' : 'bg-titan-border'}`} />
                <div>
                  <p className="text-sm font-bold text-titan-text">{s.device}</p>
                  <p className="text-xs text-titan-text-muted">{s.ip} · {s.location} · {s.last}</p>
                </div>
              </div>
              {s.active ? (
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1">
                  Esta sesión
                </span>
              ) : (
                <button
                  onClick={() => revokeSession(s.id)}
                  className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 border border-red-500/20 hover:bg-red-500/10"
                >
                  Revocar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal: confirmar modo mantenimiento */}
      {showMaintConfirm && (
        <Modal title="Activar modo mantenimiento" onClose={() => setMaintConfirm(false)}>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border border-yellow-500/20 bg-yellow-500/5">
              <AlertTriangle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-titan-text-muted">
                La tienda quedará <strong className="text-titan-text">inaccesible para todos los visitantes</strong>.
                Los administradores seguirán pudiendo entrar. Confirma para continuar.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setMaintConfirm(false)}
                className="flex-1 py-2.5 border border-titan-border text-titan-text-muted text-sm font-bold uppercase tracking-wider hover:border-titan-accent hover:text-titan-accent transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => { setMaintenance(true); setMaintConfirm(false); }}
                className="flex-1 py-2.5 bg-yellow-500 text-black text-sm font-bold uppercase tracking-wider hover:bg-yellow-400 transition-colors"
              >
                Activar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
