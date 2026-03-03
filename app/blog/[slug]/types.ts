/**
 * app/blog/[slug]/types.ts
 *
 * Tipos compartidos para el sistema de blog.
 * Importados por data.ts, RenderSection.tsx, y todos los
 * componentes que necesiten tipar props relacionadas con posts.
 */

export interface PostSection {
  type: 'paragraph' | 'h2' | 'h3' | 'highlight' | 'warning' | 'list' | 'divider' | 'callout';
  content?: string;
  items?: string[];
  label?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  categoryValue: string;
  excerpt: string;
  image: string;
  author: string;
  authorRole: string;
  authorInitial: string;
  date: string;
  readTime: string;
  tags: string[];
  toc: string[];
  body: PostSection[];
  relatedSlugs: string[];
}
