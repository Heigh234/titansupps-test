/**
 * PrivacyContent.tsx — Contenido de las 11 secciones legales
 * ────────────────────────────────────────────────────────────
 * EXTRACCIÓN: Separado de page.tsx porque concentra ~300 líneas
 * de JSX de contenido puro que no pertenecen al layout de la página.
 *
 * RELACIÓN CON page.tsx:
 * page.tsx   → hero + sidebar sticky de navegación (layout)
 * este archivo → el <article> con las 11 secciones (contenido)
 *
 * Ambos son Server Components: cero JS enviado al cliente para
 * esta página — todo el HTML se genera en servidor.
 *
 * Los datos (arrays de items, tabla de conservación, etc.) viven
 * en _data.ts para que puedan actualizarse sin tocar JSX.
 */

import Link from 'next/link';
import {
  DATOS_CATEGORIAS,
  FINALIDADES,
  BASE_LEGAL,
  CONSERVACION_TABLA,
  DESTINATARIOS,
  DERECHOS,
} from './_data';

// ─── Componente auxiliar: cabecera numerada de cada sección ──────────────────
// Encapsula el patrón repetido (número decorativo + h2) para evitar
// duplicar el mismo bloque 11 veces en el JSX.
function SectionHeader({ numero, titulo }: { numero: string; titulo: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span
        className="font-heading text-5xl text-titan-accent/20 leading-none select-none"
        aria-hidden="true"
      >
        {numero}
      </span>
      <h2 className="font-heading text-2xl text-titan-text uppercase tracking-wider">
        {titulo}
      </h2>
    </div>
  );
}

// ─── Componente auxiliar: divisor entre secciones ────────────────────────────
function Divider() {
  return <div className="h-px bg-titan-border" />;
}

// ─── Contenido principal ──────────────────────────────────────────────────────
export default function PrivacyContent() {
  return (
    <article className="flex-1 max-w-3xl prose-titan">
      <div className="space-y-16 text-titan-text-muted text-sm leading-relaxed">

        {/* Intro — callout destacado */}
        <div className="p-6 border-l-4 border-titan-accent bg-titan-surface/30">
          <p className="text-titan-text leading-relaxed">
            En TitanSupps nos tomamos la privacidad en serio. Esta política explica, de manera
            clara y sin lenguaje jurídico innecesario, qué datos recogemos cuando interactúas con
            nosotros, para qué los usamos y cuáles son tus derechos. Si tienes alguna duda,
            siempre puedes contactarnos directamente.
          </p>
        </div>

        {/* ── 01. Responsable del Tratamiento ── */}
        <section id="responsable">
          <SectionHeader numero="01" titulo="Responsable del Tratamiento" />
          <div className="space-y-3">
            <p>El responsable del tratamiento de tus datos personales es:</p>
            <div className="border border-titan-border bg-titan-surface p-5 space-y-2 text-xs">
              <p><strong className="text-titan-text uppercase tracking-wider">Razón social:</strong> TitanSupps International S.L.</p>
              <p><strong className="text-titan-text uppercase tracking-wider">CIF/NIF:</strong> B-12345678</p>
              <p><strong className="text-titan-text uppercase tracking-wider">Domicilio:</strong> Calle del Rendimiento 42, 08001 Barcelona, España</p>
              <p><strong className="text-titan-text uppercase tracking-wider">Email DPO:</strong> privacidad@titansupps.com</p>
              <p><strong className="text-titan-text uppercase tracking-wider">Autoridad supervisora:</strong> Agencia Española de Protección de Datos (AEPD)</p>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── 02. Datos que Recopilamos ── */}
        <section id="datos-recogidos">
          <SectionHeader numero="02" titulo="Datos que Recopilamos" />
          <div className="space-y-6">
            <p>
              Recopilamos únicamente los datos necesarios para ofrecerte nuestros servicios.
              En ningún caso vendemos ni cedemos tus datos a terceros con fines comerciales.
            </p>
            <div className="space-y-4">
              {DATOS_CATEGORIAS.map(({ cat, items }) => (
                <div key={cat} className="border border-titan-border p-5">
                  <h3 className="font-heading text-base text-titan-text uppercase tracking-wider mb-3">
                    {cat}
                  </h3>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs">
                        <span className="w-1 h-1 rounded-full bg-titan-accent/60 flex-shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── 03. Para qué Usamos tus Datos ── */}
        <section id="finalidades">
          <SectionHeader numero="03" titulo="Para qué Usamos tus Datos" />
          <div className="space-y-4">
            {FINALIDADES.map(({ fin, desc }) => (
              <div
                key={fin}
                className="flex gap-4 p-4 border border-titan-border hover:bg-titan-surface/30 transition-colors group"
              >
                <span className="w-1.5 flex-shrink-0 bg-titan-accent/30 group-hover:bg-titan-accent transition-colors mt-1" />
                <div>
                  <p className="font-bold text-titan-text text-xs uppercase tracking-wider mb-1">{fin}</p>
                  <p className="text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── 04. Base Legal del Tratamiento ── */}
        <section id="base-legal">
          <SectionHeader numero="04" titulo="Base Legal del Tratamiento" />
          <p className="mb-4">
            Tratamos tus datos bajo las siguientes bases legales conforme al RGPD
            (Reglamento General de Protección de Datos):
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {BASE_LEGAL.map(({ base, art, desc }) => (
              <div key={base} className="border border-titan-border p-4 bg-titan-surface/20">
                <p className="font-heading text-base text-titan-text uppercase tracking-wider mb-1">{base}</p>
                <p className="text-[10px] text-titan-accent uppercase tracking-widest font-bold mb-2">{art}</p>
                <p className="text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── 05. Cuánto Tiempo Conservamos tus Datos ── */}
        <section id="conservacion">
          <SectionHeader numero="05" titulo="Cuánto Tiempo Conservamos tus Datos" />
          <p className="mb-4">Conservamos tus datos solo el tiempo estrictamente necesario:</p>
          <div className="overflow-x-auto border border-titan-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-titan-border bg-titan-surface">
                  <th className="text-left px-4 py-3 font-bold text-titan-text uppercase tracking-widest">Tipo de dato</th>
                  <th className="text-left px-4 py-3 font-bold text-titan-text uppercase tracking-widest">Período</th>
                  <th className="text-left px-4 py-3 font-bold text-titan-text uppercase tracking-widest">Motivo</th>
                </tr>
              </thead>
              <tbody>
                {CONSERVACION_TABLA.map((row, i) => (
                  <tr
                    key={row.tipo}
                    className={`border-b border-titan-border last:border-b-0 ${i % 2 !== 0 ? 'bg-titan-surface/30' : ''}`}
                  >
                    <td className="px-4 py-3 text-titan-text font-medium">{row.tipo}</td>
                    <td className="px-4 py-3 text-titan-accent font-bold">{row.periodo}</td>
                    <td className="px-4 py-3">{row.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Divider />

        {/* ── 06. Compartir Datos con Terceros ── */}
        <section id="destinatarios">
          <SectionHeader numero="06" titulo="Compartir Datos con Terceros" />
          <p className="mb-4">
            <strong className="text-titan-text">Nunca vendemos tus datos.</strong>{' '}
            Los compartimos únicamente con proveedores que nos ayudan a operar el servicio,
            bajo contratos de encargado de tratamiento conformes al RGPD:
          </p>
          <div className="space-y-3">
            {DESTINATARIOS.map(({ proveedor, uso, pais }) => (
              <div key={proveedor} className="flex items-start gap-4 p-4 border border-titan-border text-xs">
                <div className="flex-1">
                  <p className="font-bold text-titan-text mb-0.5">{proveedor}</p>
                  <p>{uso}</p>
                </div>
                <span className="flex-shrink-0 px-2 py-1 border border-titan-border text-titan-text-muted uppercase tracking-widest font-bold text-[10px]">
                  {pais}
                </span>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── 07. Tus Derechos ── */}
        <section id="derechos">
          <SectionHeader numero="07" titulo="Tus Derechos" />
          <p className="mb-5">
            Bajo el RGPD tienes los siguientes derechos respecto a tus datos personales:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {DERECHOS.map(({ derecho, desc }) => (
              <div
                key={derecho}
                className="border border-titan-border p-4 flex gap-3 group hover:bg-titan-surface/30 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-titan-accent flex-shrink-0 mt-1.5" />
                <div>
                  <p className="font-heading text-base text-titan-text uppercase tracking-wider mb-1">{derecho}</p>
                  <p className="text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Callout para ejercer derechos */}
          <div className="mt-5 p-5 border border-titan-accent/20 bg-titan-accent/5">
            <p className="text-xs">
              Para ejercer cualquiera de estos derechos, envía un correo a{' '}
              <a
                href="mailto:privacidad@titansupps.com"
                className="text-titan-accent hover:text-white transition-colors font-bold"
              >
                privacidad@titansupps.com
              </a>{' '}
              con el asunto &ldquo;Ejercicio de Derechos RGPD&rdquo; e indica el derecho que deseas
              ejercer. Responderemos en un máximo de 30 días hábiles.
            </p>
          </div>
        </section>

        <Divider />

        {/* ── 08. Cookies ── */}
        <section id="cookies">
          <SectionHeader numero="08" titulo="Cookies" />
          <p>
            Usamos cookies propias y de terceros para el funcionamiento del sitio, análisis y
            (si consientes) marketing personalizado. Para información detallada sobre qué cookies
            utilizamos y cómo gestionarlas, consulta nuestra{' '}
            <Link
              href="/cookies"
              className="text-titan-accent hover:text-white transition-colors font-bold border-b border-titan-accent/50 pb-0.5"
            >
              Política de Cookies
            </Link>.
          </p>
        </section>

        <Divider />

        {/* ── 09. Menores de Edad ── */}
        <section id="menores">
          <SectionHeader numero="09" titulo="Menores de Edad" />
          <p>
            Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos
            datos de menores de forma consciente. Si descubres que un menor ha proporcionado
            datos sin consentimiento parental, contáctanos en privacidad@titansupps.com para
            eliminarlos de inmediato.
          </p>
        </section>

        <Divider />

        {/* ── 10. Cambios en esta Política ── */}
        <section id="cambios">
          <SectionHeader numero="10" titulo="Cambios en esta Política" />
          <p>
            Podemos actualizar esta política para reflejar cambios en nuestras prácticas o en
            la legislación aplicable. Cuando lo hagamos, actualizaremos la fecha de &ldquo;última
            actualización&rdquo; en la parte superior. Si los cambios son significativos, te
            notificaremos por correo electrónico con al menos 30 días de antelación.
          </p>
        </section>

        <Divider />

        {/* ── 11. Contacto ── */}
        <section id="contacto">
          <SectionHeader numero="11" titulo="Contacto" />
          <p className="mb-4">
            Para cualquier consulta relacionada con esta política de privacidad o el tratamiento
            de tus datos:
          </p>
          <div className="border border-titan-border bg-titan-surface p-5 space-y-2 text-xs">
            <p>
              <strong className="text-titan-text uppercase tracking-wider">DPO (Delegado de Protección de Datos):</strong>{' '}
              <a href="mailto:privacidad@titansupps.com" className="text-titan-accent hover:text-white transition-colors">
                privacidad@titansupps.com
              </a>
            </p>
            <p>
              <strong className="text-titan-text uppercase tracking-wider">Soporte general:</strong>{' '}
              <a href="mailto:soporte@titansupps.com" className="text-titan-accent hover:text-white transition-colors">
                soporte@titansupps.com
              </a>
            </p>
            <p>
              <strong className="text-titan-text uppercase tracking-wider">Postal:</strong>{' '}
              TitanSupps International S.L. — Calle del Rendimiento 42, 08001 Barcelona, España
            </p>
            <p>
              <strong className="text-titan-text uppercase tracking-wider">Autoridad supervisora:</strong>{' '}
              <a
                href="https://www.aepd.es"
                target="_blank"
                rel="noopener noreferrer"
                className="text-titan-accent hover:text-white transition-colors"
              >
                Agencia Española de Protección de Datos — aepd.es
              </a>
            </p>
          </div>
        </section>

      </div>
    </article>
  );
}
