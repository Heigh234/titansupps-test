/**
 * actions/forms.ts
 * ─────────────────────────────────────────────────────────────────
 * Server Actions para formularios públicos:
 *  - Newsletter (footer, blog, popup)
 *  - Contacto
 *  - Afiliados
 *  - Empleo (careers)
 *  - Blog (lectura)
 */

'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  sendNewsletterWelcomeEmail,
  sendContactNotificationEmail,
  sendAffiliateNotificationEmail,
} from '@/lib/email';

type ActionResult = { success: true } | { error: string };

// ══════════════════════════════════════════════════════════════════
// NEWSLETTER
// ══════════════════════════════════════════════════════════════════
const EmailSchema = z.string().email('Email inválido');

export async function subscribeNewsletter(
  formData: FormData,
  source: 'footer' | 'blog' | 'popup' = 'footer'
): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const parsed = EmailSchema.safeParse(email);
  if (!parsed.success) return { error: 'Introduce un email válido.' };

  const supabase = await createClient();
  const { error } = await supabase.from('newsletter_subscribers').insert({
    email:  parsed.data.toLowerCase(),
    source,
  });

  if (error) {
    if (error.message.includes('unique')) {
      return { error: 'Este email ya está suscrito.' };
    }
    return { error: 'No se pudo completar la suscripción.' };
  }

  // Enviar email de bienvenida con cupón TITAN10 de forma no bloqueante
  sendNewsletterWelcomeEmail(parsed.data.toLowerCase()).catch(err =>
    console.error('[subscribeNewsletter] sendNewsletterWelcomeEmail failed:', err)
  );

  return { success: true };
}

// ══════════════════════════════════════════════════════════════════
// FORMULARIO DE CONTACTO
// ══════════════════════════════════════════════════════════════════
const ContactSchema = z.object({
  name:    z.string().min(2, 'Nombre requerido'),
  email:   z.string().email('Email inválido'),
  subject: z.string().optional(),
  message: z.string().min(10, 'El mensaje es demasiado corto'),
});

export async function submitContact(formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from('contact_messages').insert(parsed.data);

  if (error) return { error: 'No se pudo enviar el mensaje. Inténtalo de nuevo.' };

  // Notificar al equipo por email de forma no bloqueante
  sendContactNotificationEmail(parsed.data).catch(err =>
    console.error('[submitContact] sendContactNotificationEmail failed:', err)
  );

  return { success: true };
}

// ══════════════════════════════════════════════════════════════════
// PROGRAMA DE AFILIADOS
// ══════════════════════════════════════════════════════════════════
const AffiliateSchema = z.object({
  name:       z.string().min(2, 'Nombre requerido'),
  email:      z.string().email('Email inválido'),
  instagram:  z.string().optional(),
  followers:  z.string().optional(),
  platform:   z.string().optional(),
  motivation: z.string().min(20, 'Cuéntanos más sobre ti (mínimo 20 caracteres)'),
});

export async function submitAffiliateApplication(formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = AffiliateSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from('affiliate_applications').insert(parsed.data);

  if (error) {
    if (error.message.includes('unique')) {
      return { error: 'Ya tienes una solicitud en proceso con este email.' };
    }
    return { error: 'No se pudo enviar la solicitud.' };
  }

  // Notificar al equipo del nuevo candidato a afiliado
  sendAffiliateNotificationEmail({
    name:       parsed.data.name,
    email:      parsed.data.email,
    platform:   parsed.data.platform,
    followers:  parsed.data.followers,
    motivation: parsed.data.motivation,
  }).catch(err =>
    console.error('[submitAffiliateApplication] sendAffiliateNotificationEmail failed:', err)
  );

  return { success: true };
}

// ══════════════════════════════════════════════════════════════════
// CANDIDATURAS DE EMPLEO
// ══════════════════════════════════════════════════════════════════
const CareerSchema = z.object({
  job_id:       z.string().min(1, 'Puesto requerido'),
  job_title:    z.string().min(1, 'Título del puesto requerido'),
  name:         z.string().min(2, 'Nombre requerido'),
  email:        z.string().email('Email inválido'),
  phone:        z.string().optional(),
  cover_letter: z.string().optional(),
});

export async function submitCareerApplication(
  formData: FormData,
  cvFile?: File
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = CareerSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  let cv_url: string | null = null;

  // Subir CV a Supabase Storage si se adjuntó
  if (cvFile && cvFile.size > 0) {
    const ALLOWED_TYPES = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const MAX_SIZE_MB = 10;

    if (!ALLOWED_TYPES.includes(cvFile.type)) {
      return { error: 'Solo se aceptan CV en formato PDF o Word.' };
    }
    if (cvFile.size > MAX_SIZE_MB * 1024 * 1024) {
      return { error: `El CV no puede superar ${MAX_SIZE_MB}MB.` };
    }

    const supabase = await createClient();
    const ext  = cvFile.name.split('.').pop();
    const path = `cvs/${parsed.data.job_id}/${Date.now()}-${parsed.data.name.replace(/\s/g, '_')}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('career-cvs')
      .upload(path, cvFile, { contentType: cvFile.type });

    if (uploadError) {
      return { error: 'No se pudo subir el CV. Inténtalo de nuevo.' };
    }

    const { data } = supabase.storage.from('career-cvs').getPublicUrl(path);
    cv_url = data.publicUrl;
  }

  const supabase = await createClient();
  const { error } = await supabase.from('career_applications').insert({
    ...parsed.data,
    cv_url,
  });

  if (error) return { error: 'No se pudo enviar la candidatura.' };

  return { success: true };
}

// ══════════════════════════════════════════════════════════════════
// BLOG — LECTURA
// ══════════════════════════════════════════════════════════════════
export async function getBlogPosts({
  category,
  search,
  page = 1,
  limit = 9,
}: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}) {
  const supabase = await createClient();
  const from = (page - 1) * limit;

  let query = supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, cover_url, category, author_name, published_at', { count: 'exact' })
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(from, from + limit - 1);

  if (category) query = query.eq('category', category);
  if (search?.trim()) query = query.ilike('title', `%${search.trim()}%`);

  const { data, count, error } = await query;
  if (error) return { posts: [], total: 0 };
  return { posts: data ?? [], total: count ?? 0 };
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) return null;
  return data;
}

export async function getRelatedPosts(category: string, excludeSlug: string, limit = 3) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, cover_url, published_at, author_name')
    .eq('category', category)
    .eq('published', true)
    .neq('slug', excludeSlug)
    .order('published_at', { ascending: false })
    .limit(limit);

  return data ?? [];
}
