'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';
import { login } from '@/actions/auth';

const loginSchema = z.object({
  email: z.string().email({ message: 'Formato de correo inválido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/account';
  const addToast = useToastStore((state) => state.addToast);

  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    const result = await login(formData);

    if ('error' in result) {
      setError('password', { message: result.error });
      setIsLoading(false);
      return;
    }

    addToast({
      title: '¡Bienvenido de vuelta!',
      message: 'Sesión iniciada. Tu cuartel general te espera.',
      type: 'success',
    });

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="animate-[fadeSlideUp_0.4s_ease-out_both]">
      <h1 className="font-heading text-4xl text-titan-text uppercase mb-2">Acceso a tu cuenta</h1>
      <p className="text-titan-text-muted mb-8">Ingresa tus credenciales para continuar tu progreso.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">Correo Electrónico</label>
          <input
            {...register('email')}
            type="email"
            disabled={isLoading}
            className={`w-full bg-titan-surface border ${errors.email ? 'border-red-500' : 'border-titan-border'} p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors disabled:opacity-50`}
            placeholder="atleta@dominio.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider">Contraseña</label>
            <Link href="/auth/forgot-password" className="text-xs text-titan-accent hover:text-white transition-colors uppercase tracking-widest">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              disabled={isLoading}
              className={`w-full bg-titan-surface border ${errors.password ? 'border-red-500' : 'border-titan-border'} p-4 pr-12 text-titan-text focus:outline-none focus:border-titan-accent transition-colors disabled:opacity-50`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-titan-text-muted hover:text-white transition-colors"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[60px] bg-titan-text text-titan-bg font-heading text-2xl uppercase tracking-widest hover:bg-titan-accent hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Iniciar Sesión'}
        </button>
      </form>

      <p className="mt-8 text-center text-titan-text-muted text-sm">
        ¿Aún no eres miembro?{' '}
        <Link href="/auth/register" className="text-titan-text font-bold hover:text-titan-accent transition-colors border-b border-titan-text hover:border-titan-accent pb-1">
          Forja tu cuenta aquí
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
