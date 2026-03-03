/**
 * TermsContent.tsx — Contenido de las 11 secciones legales
 * ──────────────────────────────────────────────────────────
 * EXTRACCIÓN: Separado de page.tsx para limpiar el orquestador
 * y concentrar el contenido legal en su propio archivo.
 *
 * RELACIÓN CON page.tsx:
 * page.tsx    → metadata + hero + sidebar sticky de navegación
 * este archivo → el <article> con las 11 secciones
 *
 * Server Component puro — cero JS al cliente para esta ruta.
 *
 * COMPONENTES AUXILIARES INTERNOS:
 * SectionHeader y Divider se definen aquí (no en un archivo separado)
 * porque son detalles de implementación locales, no componentes
 * reutilizables en otras partes del proyecto. Mismo patrón que PrivacyContent.
 */

import Link from 'next/link';
import {
  SERVICIOS,
  COMPROMISOS_REGISTRO,
  PASOS_COMPRA,
  TABLA_ENVIOS,
  DECLARACIONES_USO,
  EXCLUSIONES_RESPONSABILIDAD,
} from './_data';

// ─── Componentes auxiliares locales ──────────────────────────────────────────

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

function Divider() {
  return <div className="h-px bg-titan-border" />;
}

// ─── Contenido principal ──────────────────────────────────────────────────────

export default function TermsContent() {
  return (
    <article className="flex-1 max-w-3xl">
      <div className="space-y-16 text-titan-text-muted text-sm leading-relaxed">

        {/* Intro — callout destacado */}
        <div className="p-6 border-l-4 border-titan-accent bg-titan-surface/30">
          <p className="text-titan-text leading-relaxed">
            Al acceder y usar titansupps.com o realizar una compra, aceptas estos Términos y
            Condiciones en su totalidad. Si no estás de acuerdo con alguna parte, te pedimos
            que no utilices nuestros servicios. Si tienes alguna duda antes de comprar, nuestro
            equipo de soporte está disponible para aclarártela.
          </p>
        </div>

        {/* ── 01. Aceptación de los Términos ── */}
        <section id="aceptacion">
          <SectionHeader numero="01" titulo="Aceptación de los Términos" />
          <p>
            El acceso a este sitio web y la utilización de sus servicios implica la aceptación
            plena y sin reservas de todas las disposiciones incluidas en estos Términos y
            Condiciones, así como en la Política de Privacidad y la Política de Cookies, que
            forman parte integral del acuerdo entre el usuario y TitanSupps. Estos términos son
            aplicables a todas las transacciones realizadas a través de titansupps.com.
          </p>
        </section>

        <Divider />

        {/* ── 02. Descripción del Servicio ── */}
        <section id="descripcion">
          <SectionHeader numero="02" titulo="Descripción del Servicio" />
          <p className="mb-4">
            TitanSupps es una tienda online dedicada a la venta de suplementos nutricionales
            deportivos. Nuestros servicios incluyen:
          </p>
          <ul className="space-y-2 mb-4">
            {SERVICIOS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs">
                <span className="w-1 h-1 rounded-full bg-titan-accent/60 flex-shrink-0 mt-1.5" />
                {item}
              </li>
            ))}
          </ul>
          {/* Aviso médico — elemento de seguridad crítico, no en _data.ts */}
          <p className="p-4 border border-yellow-500/20 bg-yellow-500/5 text-xs">
            <strong className="text-yellow-400">Aviso importante:</strong> Los suplementos no
            son medicamentos. La información proporcionada en este sitio es de carácter
            informativo y no sustituye el consejo médico profesional. Consulta con un profesional
            de la salud antes de iniciar cualquier plan de suplementación.
          </p>
        </section>

        <Divider />

        {/* ── 03. Registro y Cuenta de Usuario ── */}
        <section id="registro">
          <SectionHeader numero="03" titulo="Registro y Cuenta de Usuario" />
          <p className="mb-4">Al registrarte, te comprometes a:</p>
          <div className="space-y-3 mb-4">
            {COMPROMISOS_REGISTRO.map(({ titulo, desc }) => (
              <div key={titulo} className="flex gap-3 p-4 border border-titan-border text-xs">
                <span className="font-heading text-lg text-titan-accent leading-none flex-shrink-0 mt-0.5">
                  ›
                </span>
                <div>
                  <strong className="text-titan-text uppercase tracking-wider block mb-0.5">
                    {titulo}
                  </strong>
                  {desc}
                </div>
              </div>
            ))}
          </div>
          <p>
            TitanSupps se reserva el derecho de suspender o cancelar cuentas que incumplan estos
            términos, realicen actividades fraudulentas o abusen del servicio.
          </p>
        </section>

        <Divider />

        {/* ── 04. Pedidos y Contrato de Compra ── */}
        <section id="pedidos">
          <SectionHeader numero="04" titulo="Pedidos y Contrato de Compra" />
          <p className="mb-4">El proceso de contratación funciona de la siguiente manera:</p>
          <ol className="space-y-4">
            {PASOS_COMPRA.map((step, i) => (
              <li key={i} className="flex gap-4 text-xs">
                <span className="flex-shrink-0 w-6 h-6 border border-titan-accent/40 flex items-center justify-center text-titan-accent font-heading text-sm">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <Divider />

        {/* ── 05. Precios y Pagos ── */}
        <section id="precios">
          <SectionHeader numero="05" titulo="Precios y Pagos" />
          <div className="space-y-3">
            <p>
              Los precios mostrados en la web incluyen el IVA aplicable para el país del usuario
              (cuando corresponda según legislación vigente). Los precios no incluyen gastos de
              envío, que se calculan en el checkout.
            </p>
            <p>
              TitanSupps se reserva el derecho de modificar los precios en cualquier momento.
              El precio aplicable es el vigente en el momento de la confirmación del pedido.
            </p>
            <p>
              Aceptamos pagos mediante tarjeta de crédito/débito (Visa, Mastercard, Amex),
              PayPal y transferencia bancaria. El pago se procesa de forma segura a través de
              Stripe, con certificación PCI DSS Nivel 1.
            </p>
            <p>
              En caso de error manifiesto en el precio (por ejemplo, un producto de $60 listado
              a $0.60), TitanSupps se reserva el derecho de cancelar el pedido notificando al
              cliente y ofreciendo un reembolso completo o la corrección del precio.
            </p>
          </div>
        </section>

        <Divider />

        {/* ── 06. Envíos y Entrega ── */}
        <section id="envios">
          <SectionHeader numero="06" titulo="Envíos y Entrega" />
          <p className="mb-4">
            Los plazos de entrega son estimados y pueden variar por factores externos (aduanas,
            huelgas, condiciones meteorológicas). TitanSupps no se hace responsable de retrasos
            ajenos a su control. Para información detallada sobre envíos, consulta nuestra{' '}
            <Link
              href="/faq"
              className="text-titan-accent hover:text-white transition-colors border-b border-titan-accent/40 pb-0.5"
            >
              FAQ
            </Link>.
          </p>
          <div className="border border-titan-border overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-titan-border bg-titan-surface">
                  <th className="text-left px-4 py-3 font-bold text-titan-text uppercase tracking-widest">Destino</th>
                  <th className="text-left px-4 py-3 font-bold text-titan-text uppercase tracking-widest">Plazo estimado</th>
                  <th className="text-left px-4 py-3 font-bold text-titan-text uppercase tracking-widest">Envío gratis desde</th>
                </tr>
              </thead>
              <tbody>
                {TABLA_ENVIOS.map((row, i) => (
                  <tr
                    key={row.dest}
                    className={`border-b border-titan-border last:border-b-0 ${i % 2 !== 0 ? 'bg-titan-surface/30' : ''}`}
                  >
                    <td className="px-4 py-3 text-titan-text font-medium">{row.dest}</td>
                    <td className="px-4 py-3 text-titan-accent font-bold">{row.plazo}</td>
                    <td className="px-4 py-3">{row.gratis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Divider />

        {/* ── 07. Derecho de Desistimiento ── */}
        <section id="devolucion">
          <SectionHeader numero="07" titulo="Derecho de Desistimiento" />
          <p className="mb-4">
            Conforme al artículo 102 del Real Decreto Legislativo 1/2007 (Ley de Consumidores y
            Usuarios), tienes derecho a desistir del contrato en un plazo de{' '}
            <strong className="text-titan-text">14 días naturales</strong> desde la recepción
            del producto, sin necesidad de justificación y sin penalización.
          </p>
          <p className="mb-4">
            TitanSupps amplía voluntariamente este plazo a{' '}
            <strong className="text-titan-text">30 días</strong> como señal de confianza en
            nuestros productos. Para ejercer este derecho, consulta nuestra{' '}
            <Link
              href="/returns"
              className="text-titan-accent hover:text-white transition-colors border-b border-titan-accent/40 pb-0.5"
            >
              Política de Devoluciones
            </Link>.
          </p>
          <p className="p-4 border border-titan-border text-xs bg-titan-surface/20">
            <strong className="text-titan-text">Excepción:</strong> El derecho de desistimiento
            no aplica a productos alimenticios o de higiene que hayan sido abiertos, por razones
            de salud y seguridad (Art. 103.d TRLGCU).
          </p>
        </section>

        <Divider />

        {/* ── 08. Uso de los Productos ── */}
        <section id="productos">
          <SectionHeader numero="08" titulo="Uso de los Productos" />
          <p className="mb-3">
            Al adquirir productos de TitanSupps, el comprador declara ser mayor de 18 años y
            reconoce que:
          </p>
          <ul className="space-y-2">
            {DECLARACIONES_USO.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs">
                <span className="w-1 h-1 rounded-full bg-titan-accent/60 flex-shrink-0 mt-1.5" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <Divider />

        {/* ── 09. Propiedad Intelectual ── */}
        <section id="propiedad">
          <SectionHeader numero="09" titulo="Propiedad Intelectual" />
          <p>
            Todos los contenidos de titansupps.com (textos, imágenes, logotipos, diseño, código
            fuente, fórmulas y cualquier otro material) son propiedad de TitanSupps International
            S.L. o de sus licenciantes y están protegidos por la legislación de propiedad
            intelectual. Queda expresamente prohibida su reproducción, distribución o uso
            comercial sin autorización escrita previa.
          </p>
        </section>

        <Divider />

        {/* ── 10. Limitación de Responsabilidad ── */}
        <section id="responsabilidad">
          <SectionHeader numero="10" titulo="Limitación de Responsabilidad" />
          <p className="mb-3">TitanSupps no será responsable de:</p>
          <ul className="space-y-2 mb-4">
            {EXCLUSIONES_RESPONSABILIDAD.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs">
                <span className="w-1 h-1 rounded-full bg-red-500/60 flex-shrink-0 mt-1.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-xs">
            En cualquier caso, la responsabilidad máxima de TitanSupps no excederá el importe
            abonado por el usuario en la transacción específica que dio origen al daño.
          </p>
        </section>

        <Divider />

        {/* ── 11. Ley Aplicable y Jurisdicción ── */}
        <section id="ley">
          <SectionHeader numero="11" titulo="Ley Aplicable y Jurisdicción" />
          <p className="mb-3">
            Estos Términos y Condiciones se rigen por la legislación española. Para la resolución
            de conflictos, las partes se someten a los Juzgados y Tribunales de Barcelona,
            renunciando a cualquier otro fuero que pudiera corresponderles, salvo que la
            legislación de protección al consumidor aplicable en el país de residencia del usuario
            establezca lo contrario.
          </p>
          <p className="text-xs">
            Conforme al Reglamento (UE) 524/2013, el usuario puede acceder a la plataforma de
            resolución de litigios en línea de la Comisión Europea:{' '}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-titan-accent hover:text-white transition-colors"
            >
              ec.europa.eu/consumers/odr
            </a>
          </p>
        </section>

      </div>
    </article>
  );
}
