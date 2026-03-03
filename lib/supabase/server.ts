/**
 * lib/supabase/server.ts
 * ─────────────────────────────────────────────────────────────────
 * Cliente Supabase para Server Components y Server Actions en Next.js 15+.
 * Usa @supabase/ssr para gestión de cookies automática.
 *
 * USAR EN: app/ server components, actions/, middleware.ts
 * NO USAR EN: componentes 'use client' → usar lib/supabase/client.ts
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll puede fallar en Server Components (solo lectura).
            // Se ignora porque el middleware se encarga de refrescar la sesión.
          }
        },
      },
    }
  );
}

/**
 * createAdminClient — usa la Service Role Key (solo server-side seguro).
 * NUNCA llamar desde el cliente. Bypasses RLS.
 * Usar solo para: webhooks de Stripe, cron jobs, migraciones.
 */
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: { getAll: () => [], setAll: () => {} },
      auth: { persistSession: false },
    }
  );
}
