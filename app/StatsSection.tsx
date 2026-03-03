/**
 * StatsSection.tsx — Barra de métricas / social proof
 * ──────────────────────────────────────────────────────
 * ARQUITECTURA (actualizado):
 * Ahora es un async Server Component que obtiene stats reales de Supabase
 * a través de getHomeStats(). Si la query falla, getHomeStats() devuelve
 * valores de fallback — esta sección nunca rompe la build.
 *
 * DATOS REALES:
 *  - Atletas Activos: conteo de profiles con role='user' en Supabase
 *  - Entrega Máxima: desde store_settings.express_days (configurable por admin)
 *
 * DATOS EDITORIALES (sin tabla aún):
 *  - Pureza Certificada: 99.2% (certificación de laboratorio)
 *  - Rating Promedio: 4.9★ (hasta implementar tabla de reseñas)
 *
 * Posición en el flujo: entre el Hero y los Productos Destacados.
 * Función psicológica: anclar credibilidad antes de que el usuario
 * vea los productos. Responde las 4 objeciones de compra más comunes:
 * comunidad, calidad, satisfacción y velocidad de entrega.
 *
 * cv-section-stats: clase de content-visibility en globals.css.
 */

import { Trophy, FlaskConical, Star, Zap } from 'lucide-react';
import { getHomeStats } from '@/actions/home';

export default async function StatsSection() {
  // Fetch de datos reales — con fallback automático si Supabase no está listo
  const stats = await getHomeStats();

  const STATS = [
    {
      value: stats.totalAthletes,
      label: 'Atletas Activos',
      icon:  Trophy,
    },
    {
      value: stats.purityCertified,
      label: 'Pureza Certificada',
      icon:  FlaskConical,
    },
    {
      value: stats.avgRating,
      label: 'Rating Promedio',
      icon:  Star,
    },
    {
      value: stats.maxDelivery,
      label: 'Entrega Express',
      icon:  Zap,
    },
  ];

  return (
    <section
      className="cv-section-stats border-y border-titan-border bg-titan-surface/40"
      aria-label="Estadísticas de TitanSupps"
    >
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-3 group"
            >
              {/* Icono en recuadro con hover sutil */}
              <div className="w-10 h-10 flex items-center justify-center border border-titan-border text-titan-accent group-hover:border-titan-accent/50 group-hover:bg-titan-accent/5 transition-all duration-300">
                <Icon size={18} aria-hidden="true" />
              </div>

              {/* Valor principal */}
              <span className="font-heading text-fluid-2xl text-titan-text leading-none">
                {value}
              </span>

              {/* Etiqueta descriptiva */}
              <span className="text-xs text-titan-text-muted uppercase tracking-widest font-bold">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
