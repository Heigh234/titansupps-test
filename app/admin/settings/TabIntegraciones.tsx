'use client';

// ─────────────────────────────────────────────────────────────────────────────
// TAB 6 — INTEGRACIONES — app/admin/settings/TabIntegraciones.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Key, ExternalLink, AlertTriangle } from 'lucide-react';
import { Modal } from './_components';
import { INIT_INTEGRATIONS } from './_data';
import type { Integration } from './_types';

export default function TabIntegraciones() {
  const [integrations, setIntegrations] = useState<Integration[]>(INIT_INTEGRATIONS);
  const [connecting, setConnecting]     = useState<Integration | null>(null);
  const [disconnecting, setDisconn]     = useState<Integration | null>(null);
  const [apiKeyInput, setApiKeyInput]   = useState('');
  const [apiKeyError, setApiKeyError]   = useState('');
  const [connectSaving, setConnSaving]  = useState(false);

  const handleConnect = () => {
    if (!apiKeyInput.trim() || apiKeyInput.length < 8) {
      setApiKeyError('Introduce una API key válida (mínimo 8 caracteres).');
      return;
    }
    setConnSaving(true);
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === connecting?.id
            ? { ...i, connected: true, apiKey: apiKeyInput.replace(/.(?=.{4})/g, '•'), status: 'Conectado y activo' }
            : i
        )
      );
      setConnSaving(false);
      setConnecting(null);
      setApiKeyInput('');
      setApiKeyError('');
    }, 900);
  };

  const handleDisconnect = () => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === disconnecting?.id
          ? { ...i, connected: false, apiKey: undefined, status: undefined }
          : i
      )
    );
    setDisconn(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-2xl uppercase tracking-wider text-titan-text">Integraciones</h3>
        <p className="text-titan-text-muted text-sm mt-1">Conecta herramientas externas para potenciar tu tienda.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {integrations.map((intg) => (
          <div
            key={intg.id}
            className={`bg-titan-surface border p-5 transition-colors ${
              intg.connected ? 'border-titan-accent/30' : 'border-titan-border'
            }`}
          >
            {/* Cabecera */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl leading-none" aria-hidden="true">{intg.icon}</span>
                <div>
                  <p className="text-sm font-bold text-titan-text">{intg.name}</p>
                  {intg.connected && intg.status && (
                    <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider mt-0.5">
                      ● {intg.status}
                    </p>
                  )}
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 border flex-shrink-0 ${
                intg.connected
                  ? 'text-green-400 bg-green-400/10 border-green-400/20'
                  : 'text-titan-text-muted border-titan-border'
              }`}>
                {intg.connected ? 'Conectado' : 'Sin conectar'}
              </span>
            </div>

            <p className="text-xs text-titan-text-muted mb-4 leading-relaxed">{intg.desc}</p>

            {/* API Key enmascarada */}
            {intg.connected && intg.apiKey && (
              <div className="flex items-center gap-2 px-3 py-2 bg-titan-bg border border-titan-border mb-4">
                <Key size={12} className="text-titan-text-muted flex-shrink-0" />
                <span className="text-xs text-titan-text-muted font-mono flex-1 truncate">{intg.apiKey}</span>
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-2">
              {intg.connected ? (
                <>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-titan-text-muted hover:text-titan-accent transition-colors"
                  >
                    <ExternalLink size={12} /> Ver dashboard
                  </a>
                  <button
                    onClick={() => setDisconn(intg)}
                    className="ml-auto text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 border border-red-500/20 hover:bg-red-500/10"
                  >
                    Desconectar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setConnecting(intg); setApiKeyInput(''); setApiKeyError(''); }}
                  className="w-full py-2.5 bg-titan-accent text-white text-xs font-bold uppercase tracking-wider hover:bg-titan-accent-hover transition-colors"
                >
                  Conectar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: conectar integración */}
      {connecting && (
        <Modal title={`Conectar ${connecting.name}`} onClose={() => setConnecting(null)}>
          <div className="space-y-4">
            <p className="text-sm text-titan-text-muted">{connecting.desc}</p>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-titan-text-muted block mb-1.5">
                {connecting.id === 'analytics' ? 'Measurement ID' : 'API Key'}
              </label>
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => { setApiKeyInput(e.target.value); setApiKeyError(''); }}
                placeholder={connecting.id === 'analytics' ? 'G-XXXXXXXXXX' : 'sk_live_xxxxxxxxxxxxxxxx'}
                className="w-full bg-titan-bg border border-titan-border px-4 py-2.5 text-sm text-titan-text focus:outline-none focus:border-titan-accent transition-colors placeholder:text-titan-text-muted font-mono"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
              {apiKeyError && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1.5">
                  <AlertTriangle size={11} /> {apiKeyError}
                </p>
              )}
              <p className="text-[10px] text-titan-text-muted mt-1.5">
                Encuentra tu key en el panel de {connecting.name} → Ajustes → API.
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setConnecting(null)}
                className="flex-1 py-2.5 border border-titan-border text-titan-text-muted text-sm font-bold uppercase tracking-wider hover:border-titan-accent hover:text-titan-accent transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConnect}
                disabled={connectSaving}
                className="flex-1 py-2.5 bg-titan-accent text-white text-sm font-bold uppercase tracking-wider hover:bg-titan-accent-hover transition-colors disabled:opacity-50"
              >
                {connectSaving ? 'Conectando…' : 'Conectar'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: confirmar desconexión */}
      {disconnecting && (
        <Modal title={`Desconectar ${disconnecting.name}`} onClose={() => setDisconn(null)}>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border border-red-500/20 bg-red-500/5">
              <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-titan-text-muted">
                Se eliminará la API key y{' '}
                <strong className="text-titan-text">{disconnecting.name}</strong>{' '}
                dejará de funcionar hasta que la vuelvas a conectar.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDisconn(null)}
                className="flex-1 py-2.5 border border-titan-border text-titan-text-muted text-sm font-bold uppercase tracking-wider hover:border-titan-accent hover:text-titan-accent transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDisconnect}
                className="flex-1 py-2.5 bg-red-500 text-white text-sm font-bold uppercase tracking-wider hover:bg-red-600 transition-colors"
              >
                Desconectar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
