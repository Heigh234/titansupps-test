/**
 * app/blog/[slug]/RenderSection.tsx
 *
 * Renderizador de bloques de contenido del artículo.
 * Recibe un PostSection y devuelve el elemento JSX correspondiente
 * según su type: paragraph, h2, h3, highlight, warning, callout, list, divider.
 *
 * Decisión de diseño: switch puro sin estado — componente ligero y predecible.
 * Si el sistema de bloques crece mucho, considerar un Map de renderers.
 */

import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { PostSection } from './types';

export default function RenderSection({ section }: { section: PostSection }) {
  switch (section.type) {

    case 'paragraph':
      return (
        <p className="text-titan-text-muted leading-relaxed text-[1.05rem]">
          {section.content}
        </p>
      );

    case 'h2':
      return (
        <h2 className="font-heading text-2xl md:text-3xl uppercase text-titan-text pt-4 border-b border-titan-border pb-3">
          {section.content}
        </h2>
      );

    case 'h3':
      return (
        <h3 className="font-heading text-xl uppercase text-titan-text">
          {section.content}
        </h3>
      );

    case 'highlight':
      return (
        <blockquote className="border-l-4 border-titan-accent bg-titan-accent/5 px-6 py-5 my-2">
          <p className="text-titan-text leading-relaxed font-medium italic">
            {section.content}
          </p>
        </blockquote>
      );

    case 'warning':
      return (
        <div className="flex gap-4 bg-yellow-500/5 border border-yellow-500/20 p-5 my-2">
          <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            {section.label && (
              <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-1">
                {section.label}
              </p>
            )}
            <p className="text-titan-text-muted text-sm leading-relaxed">{section.content}</p>
          </div>
        </div>
      );

    case 'callout':
      return (
        <div className="flex gap-4 bg-titan-accent/5 border border-titan-accent/30 p-5 my-2">
          <CheckCircle2 size={18} className="text-titan-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            {section.label && (
              <p className="text-xs font-bold text-titan-accent uppercase tracking-widest mb-1">
                {section.label}
              </p>
            )}
            <p className="text-titan-text-muted text-sm leading-relaxed">{section.content}</p>
          </div>
        </div>
      );

    case 'list':
      return (
        <ul className="space-y-2.5">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-titan-text-muted text-sm leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-titan-accent flex-shrink-0 mt-[0.45rem]" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      );

    case 'divider':
      return <hr className="border-titan-border" />;

    default:
      return null;
  }
}
