/**
 * lib/supabase/client.ts
 * ─────────────────────────────────────────────────────────────────
 * Cliente Supabase para componentes 'use client' en Next.js 15+.
 * Singleton para evitar múltiples instancias en el navegador.
 *
 * USAR EN: componentes con 'use client', hooks de React, Zustand stores
 * NO USAR EN: Server Components, Server Actions → usar lib/supabase/server.ts
 */

'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
