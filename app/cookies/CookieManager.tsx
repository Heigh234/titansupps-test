'use client';

/**
 * CookieManager.tsx — Layout interactivo completo de la página de cookies
 * ─────────────────────────────────────────────────────────────────────────
 * EXTRACCIÓN: Separado de page.tsx para que este pueda ser Server Component
 * (el hero se renderiza en servidor, sin hidratación innecesaria).
 *
 * DECISIÓN DE ARQUITECTURA — Un solo Client Component vs. múltiples:
 * ─────────────────────────────────────────────────────────────────
 * El sidebar de preferencias y el acordeón del documento COMPARTEN estado:
 *   - `preferences[id]`  → el sidebar lo modifica; el acordeón lo muestra
 *                          ("Activadas" / "Desactivadas" en cada categoría)
 *   - `expandedCategory` → exclusivo del acordeón
 *
 * Alternativas evaluadas:
 *   A) Dos Client Components separados + Context → más archivos, más
 *      indirección, ningún beneficio real de performance en una página legal.
 *   B) Prop-drilling desde page.tsx con 'use client' → page.tsx perdería
 *      su condición de Server Component, el objetivo principal.
 *   C) Un solo Client Component que encapsula ambas columnas [ELEGIDA] →
 *      todo el estado en un único lugar, relación explícita entre partes,
 *      page.tsx permanece Server Component puro.
 *
 * TODO producción: savePreferences debe persistir en localStorage y
 * notificar al sistema de gestión de consentimientos (ej: Cookiebot, OneTrust).
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle, ToggleLeft, ToggleRight,
  Settings2,
} from 'lucide-react';
import { CATEGORIAS_COOKIES, NAVEGADORES } from './_data';

export default function CookieManager() {

  // ── Estado: preferencias de consentimiento ──────────────────────────────
  // 'necesarias' siempre true y no modificable (no requiere consentimiento).
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    necesarias:  true,
    analiticas:  false,
    marketing:   false,
    funcionales: false,
  });
  const [saved, setSaved]                       = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const toggleCategory = (id: string) => {
    if (id === 'necesarias') return;
    setPreferences((prev) => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  };

  const acceptAll = () => {
    setPreferences({ necesarias: true, analiticas: true, marketing: true, funcionales: true });
    setSaved(true);
  };

  const rejectAll = () => {
    setPreferences({ necesarias: true, analiticas: false, marketing: false, funcionales: false });
    setSaved(true);
  };

  const savePreferences = () => {
    setSaved(true);
    // TODO: localStorage.setItem('titan_cookie_prefs', JSON.stringify(preferences));
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

        {/* ══════════════════════════════════════════════════
            COLUMNA IZQUIERDA — Panel de preferencias (sticky)
            ══════════════════════════════════════════════════ */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="lg:sticky lg:top-28 space-y-4">

            {/* Panel de toggles */}
            <div className="border border-titan-border bg-titan-surface p-6">
              <div className="flex items-center gap-3 mb-5">
                <Settings2 size={18} className="text-titan-accent" />
                <h2 className="font-heading text-xl text-titan-text uppercase tracking-wider">
                  Mis Preferencias
                </h2>
              </div>

              {/* Toggle por categoría */}
              <div className="space-y-4">
                {CATEGORIAS_COOKIES.map(({ id, icon: Icon, nombre, obligatoria }) => (
                  <div key={id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon size={14} className="text-titan-text-muted" />
                      <span className="text-sm font-bold text-titan-text">{nombre}</span>
                      {obligatoria && (
                        <span className="text-[10px] font-bold text-titan-accent uppercase tracking-widest">
                          Req.
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleCategory(id)}
                      disabled={obligatoria}
                      aria-label={`${preferences[id] ? 'Desactivar' : 'Activar'} cookies de ${nombre}`}
                      aria-pressed={preferences[id]}
                      className={`transition-colors ${
                        obligatoria
                          ? 'opacity-40 cursor-not-allowed'
                          : 'cursor-pointer hover:opacity-80'
                      }`}
                    >
                      {preferences[id]
                        ? <ToggleRight size={28} className="text-titan-accent" />
                        : <ToggleLeft  size={28} className="text-titan-text-muted" />
                      }
                    </button>
                  </div>
                ))}
              </div>

              {/* Botones de acción */}
              <div className="space-y-2 mt-6">
                {saved ? (
                  <div className="flex items-center justify-center gap-2 w-full py-3 border border-green-500/30 bg-green-500/10 text-green-500 text-sm font-bold uppercase tracking-widest animate-[fadeIn_0.2s_ease-out]">
                    <CheckCircle size={16} />
                    Preferencias guardadas
                  </div>
                ) : (
                  <button
                    onClick={savePreferences}
                    className="w-full py-3 bg-titan-accent text-white font-heading text-lg uppercase tracking-widest hover:bg-titan-accent-hover transition-colors"
                  >
                    Guardar selección
                  </button>
                )}

                <button
                  onClick={acceptAll}
                  className="w-full py-2.5 border border-titan-border text-titan-text-muted font-bold text-xs uppercase tracking-widest hover:border-titan-accent hover:text-titan-accent transition-colors"
                >
                  Aceptar todas
                </button>
                <button
                  onClick={rejectAll}
                  className="w-full py-2.5 border border-titan-border text-titan-text-muted font-bold text-xs uppercase tracking-widest hover:border-red-500/50 hover:text-red-400 transition-colors"
                >
                  Solo necesarias
                </button>
              </div>
            </div>

            {/* Marco legal */}
            <div className="p-4 border border-titan-border bg-titan-surface/20">
              <p className="text-[10px] font-bold text-titan-text-muted uppercase tracking-widest mb-2">
                Marco legal
              </p>
              <p className="text-xs text-titan-text-muted">
                Cumplimos con el RGPD (UE) 2016/679 y la Directiva ePrivacy (2002/58/CE).
                Tus preferencias se respetan de inmediato.
              </p>
            </div>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════
            COLUMNA DERECHA — Documento legal + acordeón
            ══════════════════════════════════════════════════ */}
        <article className="flex-1 max-w-3xl">
          <div className="space-y-10 text-titan-text-muted text-sm leading-relaxed">

            {/* Intro */}
            <div className="p-6 border-l-4 border-titan-accent bg-titan-surface/30">
              <p className="text-titan-text leading-relaxed">
                Una cookie es un pequeño archivo de texto que los sitios web guardan en tu
                dispositivo. Esta página te explica exactamente qué cookies usamos, para qué
                sirven y cómo puedes controlarlas. Puedes modificar tus preferencias en cualquier
                momento usando el panel de la izquierda.
              </p>
            </div>

            {/* ¿Qué es una cookie? */}
            <section>
              <h2 className="font-heading text-2xl text-titan-text uppercase tracking-wider mb-4">
                ¿Qué es una Cookie?
              </h2>
              <p className="mb-3">
                Las cookies son pequeños archivos de texto que se almacenan en tu navegador o
                dispositivo cuando visitas un sitio web. Su función principal es recordar
                información entre visitas: si estás conectado, qué hay en tu carrito, o qué
                preferencias tienes.
              </p>
              <p>
                Existen cookies de sesión (se eliminan al cerrar el navegador) y cookies
                persistentes (permanecen durante un período definido). También las hay propias
                (establecidas por nosotros) y de terceros (establecidas por servicios externos
                que usamos).
              </p>
            </section>

            <div className="h-px bg-titan-border" />

            {/* Categorías con acordeón */}
            <section>
              <h2 className="font-heading text-2xl text-titan-text uppercase tracking-wider mb-6">
                Cookies que Usamos
              </h2>

              <div className="space-y-4">
                {CATEGORIAS_COOKIES.map(({ id, icon: Icon, nombre, descripcion, obligatoria, cookies }) => {
                  const isExpanded = expandedCategory === id;

                  return (
                    <div
                      key={id}
                      className={`border transition-colors ${
                        isExpanded
                          ? 'border-titan-accent/40 bg-titan-surface'
                          : 'border-titan-border hover:border-titan-accent/20'
                      }`}
                    >
                      {/* Header del acordeón */}
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : id)}
                        className="w-full flex items-start justify-between gap-4 p-5 text-left"
                        aria-expanded={isExpanded}
                        aria-controls={`cookie-detail-${id}`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Icono de categoría */}
                          <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center border transition-all ${
                            isExpanded
                              ? 'border-titan-accent/50 bg-titan-accent/10 text-titan-accent'
                              : 'border-titan-border text-titan-text-muted'
                          }`}>
                            <Icon size={15} />
                          </div>

                          <div>
                            {/* Nombre + badge de estado */}
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className={`font-heading text-lg uppercase tracking-wider transition-colors ${
                                isExpanded ? 'text-titan-accent' : 'text-titan-text'
                              }`}>
                                {nombre}
                              </h3>
                              {/* Badge: "Siempre activas" | "Activadas" | "Desactivadas"
                                  Necesita preferences[id] → razón por la que el estado
                                  se eleva a este componente y no se separa en dos. */}
                              {obligatoria
                                ? (
                                  <span className="text-[10px] font-bold text-titan-accent border border-titan-accent/30 px-2 py-0.5 uppercase tracking-widest">
                                    Siempre activas
                                  </span>
                                ) : (
                                  <span className={`text-[10px] font-bold border px-2 py-0.5 uppercase tracking-widest ${
                                    preferences[id]
                                      ? 'text-green-500 border-green-500/30 bg-green-500/5'
                                      : 'text-titan-text-muted border-titan-border'
                                  }`}>
                                    {preferences[id] ? 'Activadas' : 'Desactivadas'}
                                  </span>
                                )
                              }
                            </div>
                            <p className="text-xs text-titan-text-muted leading-relaxed">
                              {descripcion}
                            </p>
                          </div>
                        </div>

                        {/* Chevron animado */}
                        <span
                          className={`flex-shrink-0 text-lg leading-none transition-transform duration-200 text-titan-text-muted mt-1 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        >
                          ⌄
                        </span>
                      </button>

                      {/* Tabla de cookies — animación CSS grid rows */}
                      <div
                        id={`cookie-detail-${id}`}
                        className="overflow-hidden transition-[grid-template-rows] duration-200 ease-in-out grid"
                        style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
                      >
                        <div className="min-h-0">
                          <div className="border-t border-titan-border overflow-x-auto">
                            <table className="w-full text-xs min-w-[500px]">
                              <thead>
                                <tr className="border-b border-titan-border bg-titan-bg">
                                  <th className="text-left px-4 py-3 font-bold text-titan-text-muted uppercase tracking-widest">Cookie</th>
                                  <th className="text-left px-4 py-3 font-bold text-titan-text-muted uppercase tracking-widest">Proveedor</th>
                                  <th className="text-left px-4 py-3 font-bold text-titan-text-muted uppercase tracking-widest">Propósito</th>
                                  <th className="text-left px-4 py-3 font-bold text-titan-text-muted uppercase tracking-widest">Expiración</th>
                                </tr>
                              </thead>
                              <tbody>
                                {cookies.map((c, i) => (
                                  <tr
                                    key={c.nombre}
                                    className={`border-b border-titan-border/50 last:border-b-0 ${i % 2 !== 0 ? 'bg-titan-surface/30' : ''}`}
                                  >
                                    <td className="px-4 py-3 font-mono text-titan-accent text-[11px]">{c.nombre}</td>
                                    <td className="px-4 py-3 text-titan-text-muted">{c.proveedor}</td>
                                    <td className="px-4 py-3 text-titan-text-muted">{c.proposito}</td>
                                    <td className="px-4 py-3 text-titan-text font-medium whitespace-nowrap">{c.expiracion}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="h-px bg-titan-border" />

            {/* Gestión desde el navegador */}
            <section>
              <h2 className="font-heading text-2xl text-titan-text uppercase tracking-wider mb-4">
                Gestión desde el Navegador
              </h2>
              <p className="mb-4">
                Además del panel de preferencias de esta página, puedes gestionar o eliminar
                cookies directamente desde la configuración de tu navegador. Ten en cuenta que
                deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {NAVEGADORES.map(({ browser, url }) => (
                  <a
                    key={browser}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 border border-titan-border hover:border-titan-accent/50 transition-colors text-xs group"
                  >
                    <span className="font-bold text-titan-text group-hover:text-titan-accent transition-colors">
                      {browser}
                    </span>
                    <span className="text-titan-accent group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                      →
                    </span>
                  </a>
                ))}
              </div>
            </section>

            <div className="h-px bg-titan-border" />

            {/* Contacto */}
            <section>
              <h2 className="font-heading text-2xl text-titan-text uppercase tracking-wider mb-4">
                Contacto
              </h2>
              <p>
                Para cualquier consulta sobre esta política de cookies, escríbenos a{' '}
                <a
                  href="mailto:privacidad@titansupps.com"
                  className="text-titan-accent hover:text-white transition-colors font-bold"
                >
                  privacidad@titansupps.com
                </a>
                . También puedes consultar la{' '}
                <Link
                  href="/privacy"
                  className="text-titan-accent hover:text-white transition-colors border-b border-titan-accent/40 pb-0.5"
                >
                  Política de Privacidad completa
                </Link>{' '}
                o los{' '}
                <Link
                  href="/terms"
                  className="text-titan-accent hover:text-white transition-colors border-b border-titan-accent/40 pb-0.5"
                >
                  Términos y Condiciones
                </Link>.
              </p>
            </section>

          </div>
        </article>
      </div>
    </div>
  );
}
