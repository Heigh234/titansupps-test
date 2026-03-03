/**
 * app/auth/callback/route.ts
 * COPIAR A: app/auth/callback/route.ts
 *
 * Maneja el callback de Supabase Auth despues de:
 *  - Verificacion de email al registrarse (emailRedirectTo)
 *  - Enlace magico de login
 *  - OAuth (Google, GitHub, etc. si se anade en el futuro)
 *
 * COMO FUNCIONA:
 *  1. Usuario recibe email -> hace click en el enlace
 *  2. Supabase redirige a: tu-dominio.com/auth/callback?code=xxx
 *  3. Este route intercambia el 'code' por una sesion de Supabase
 *  4. Redirige al usuario a /account (o a redirectTo si se especifico)
 *
 * CONFIGURACION REQUERIDA en Supabase Dashboard:
 *  Authentication > URL Configuration > Redirect URLs
 *  Anadir: https://tu-dominio.com/auth/callback
 *          http://localhost:3000/auth/callback (para desarrollo)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/supabase/types';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(req.url);

  // Parametros que Supabase incluye en el callback URL
  const code       = searchParams.get('code');
  const next       = searchParams.get('next') ?? '/account';
  const redirectTo = searchParams.get('redirectTo') ?? next;

  if (!code) {
    // Si no hay code, probablemente ya se proceso o es un acceso directo invalido
    console.warn('[Auth Callback] No se recibio code en el callback.');
    return NextResponse.redirect(new URL('/auth/login?error=invalid_callback', origin));
  }

  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()         { return cookieStore.getAll(); },
        setAll(toSet)    {
          try {
            toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Ignorar en Server Components de solo lectura
          }
        },
      },
    }
  );

  // Intercambiar el code por una sesion autenticada
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[Auth Callback] Error al intercambiar code:', error.message);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, origin)
    );
  }

  // Sesion creada exitosamente -> redirigir al destino
  const forwardedHost = req.headers.get('x-forwarded-host');
  const isLocalEnv    = process.env.NODE_ENV === 'development';

  if (isLocalEnv) {
    return NextResponse.redirect(new URL(redirectTo, origin));
  } else if (forwardedHost) {
    return NextResponse.redirect(new URL(redirectTo, `https://${forwardedHost}`));
  } else {
    return NextResponse.redirect(new URL(redirectTo, origin));
  }
}
