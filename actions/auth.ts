/**
 * actions/auth.ts
 * ─────────────────────────────────────────────────────────────────
 * Server Actions de autenticación.
 * Reemplaza el useAuthStore (Zustand + localStorage) del frontend
 * con sesiones reales de Supabase Auth.
 *
 * FLUJO:
 *  register → Supabase crea user → trigger crea profile → email de verificación
 *  login    → Supabase valida credentials → cookie de sesión
 *  logout   → limpia sesión server-side
 */

'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { sendWelcomeEmail } from '@/lib/email';

// ─── Schemas de validación ────────────────────────────────────────

const RegisterSchema = z.object({
  name:     z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email:    z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
              .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
              .regex(/[0-9]/, 'Debe contener al menos un número'),
});

const LoginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

const ResetPasswordSchema = z.object({
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirm:  z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm'],
});

// ─── Tipo de respuesta estándar ───────────────────────────────────
type ActionResult = { success: true } | { error: string };

// ══════════════════════════════════════════════════════════════════
// REGISTER
// ══════════════════════════════════════════════════════════════════
export async function register(formData: FormData): Promise<ActionResult> {
  const raw = {
    name:     formData.get('name'),
    email:    formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email:    parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email`,
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Este email ya está registrado. ¿Quieres iniciar sesión?' };
    }
    return { error: 'Error al crear la cuenta. Inténtalo de nuevo.' };
  }

  // Enviar email de bienvenida de forma no bloqueante.
  // No esperamos el resultado para no ralentizar la respuesta al usuario.
  // Si falla, se loguea en servidor pero no afecta al registro.
  sendWelcomeEmail(parsed.data.email, parsed.data.name).catch(err =>
    console.error('[register] sendWelcomeEmail failed:', err)
  );

  return { success: true };
}

// ══════════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════════
export async function login(formData: FormData): Promise<ActionResult> {
  const raw = {
    email:    formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email:    parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Email o contraseña incorrectos.' };
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.' };
    }
    return { error: 'Error al iniciar sesión. Inténtalo de nuevo.' };
  }

  revalidatePath('/', 'layout');
  redirect('/account');
}

// ══════════════════════════════════════════════════════════════════
// LOGOUT
// ══════════════════════════════════════════════════════════════════
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

// ══════════════════════════════════════════════════════════════════
// FORGOT PASSWORD
// ══════════════════════════════════════════════════════════════════
export async function forgotPassword(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;

  if (!email || !z.string().email().safeParse(email).success) {
    return { error: 'Introduce un email válido.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  // No revelar si el email existe o no (seguridad)
  if (error) {
    console.error('[forgotPassword]', error.message);
  }

  return { success: true }; // Siempre success para no exponer emails existentes
}

// ══════════════════════════════════════════════════════════════════
// RESET PASSWORD (tras verificar el token del email)
// ══════════════════════════════════════════════════════════════════
export async function resetPassword(formData: FormData): Promise<ActionResult> {
  const raw = {
    password: formData.get('password'),
    confirm:  formData.get('confirm'),
  };

  const parsed = ResetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: 'No se pudo actualizar la contraseña. El enlace puede haber expirado.' };
  }

  redirect('/auth/login?reset=success');
}

// ══════════════════════════════════════════════════════════════════
// GET CURRENT USER (helper para Server Components)
// ══════════════════════════════════════════════════════════════════
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile };
}
