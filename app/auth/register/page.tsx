'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { register as registerAction } from '@/actions/auth';
import { useToastStore } from '@/store/useToastStore';

// framer-motion eliminado — reemplazado por CSS fadeSlideUp (globals.css)

const registerSchema = z.object({
  name: z.string().min(2, "Ingresa un nombre válido"),
  email: z.string().email("Formato de correo inválido"),
  password: z.string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe contener una mayúscula")
    .regex(/[0-9]/, "Debe contener un número"),
  confirmPassword: z.string(),
  terms: z.literal(true, { errorMap: () => ({ message: "Debes aceptar las reglas del juego" }) }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  const addToast = useToastStore((state) => state.addToast);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });

  const passwordValue = watch('password', '');

  useEffect(() => {
    let score = 0;
    if (!passwordValue) return setPasswordStrength(0);
    if (passwordValue.length >= 8) score += 1;
    if (/[A-Z]/.test(passwordValue)) score += 1;
    if (/[0-9]/.test(passwordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1;
    setPasswordStrength(score);
  }, [passwordValue]);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);

    const result = await registerAction(formData);

    if ('error' in result) {
      addToast({ title: 'Error', message: result.error, type: 'error' });
      setIsLoading(false);
      return;
    }

    addToast({
      title: '¡Cuenta creada!',
      message: `Bienvenido al batallón, ${data.name}. Verifica tu email para continuar.`,
      type: 'success',
    });
    setIsLoading(false);
    router.push('/auth/verify-email');
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="animate-[fadeSlideUp_0.4s_ease-out_both]">
      <h1 className="font-heading text-4xl text-titan-text uppercase mb-2">Forja tu Leyenda</h1>
      <p className="text-titan-text-muted mb-8">Crea tu cuenta para gestionar pedidos y obtener beneficios.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">Nombre Completo</label>
          <input 
            {...register('name')}
            disabled={isLoading}
            className={`w-full bg-titan-surface border ${errors.name ? 'border-red-500' : 'border-titan-border'} p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors`}
            placeholder="Ej: Arnold Schwarzenegger"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">Correo Electrónico</label>
          <input 
            {...register('email')}
            type="email"
            disabled={isLoading}
            className={`w-full bg-titan-surface border ${errors.email ? 'border-red-500' : 'border-titan-border'} p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors`}
            placeholder="atleta@dominio.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">Contraseña</label>
          <div className="relative">
            <input 
              {...register('password')}
              type={showPassword ? "text" : "password"}
              disabled={isLoading}
              className={`w-full bg-titan-surface border ${errors.password ? 'border-red-500' : 'border-titan-border'} p-4 pr-12 text-titan-text focus:outline-none focus:border-titan-accent transition-colors`}
              placeholder="••••••••"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-titan-text-muted hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="mt-2 flex gap-1 h-1.5 w-full bg-titan-bg rounded-full overflow-hidden">
            {[1, 2, 3, 4].map((level) => (
              <div 
                key={level} 
                className={`flex-1 transition-colors duration-300 ${passwordStrength >= level ? getStrengthColor() : 'bg-transparent'}`} 
              />
            ))}
          </div>
          <p className="text-xs text-titan-text-muted mt-2 text-right">
            {passwordStrength === 0 && "Ingresa una contraseña"}
            {passwordStrength === 1 && "Débil (Faltan requisitos)"}
            {passwordStrength === 2 && "Media (Casi lista)"}
            {passwordStrength >= 3 && "Fuerte (Nivel Titán)"}
          </p>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">Confirmar Contraseña</label>
          <input 
            {...register('confirmPassword')}
            type={showPassword ? "text" : "password"}
            disabled={isLoading}
            className={`w-full bg-titan-surface border ${errors.confirmPassword ? 'border-red-500' : 'border-titan-border'} p-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors`}
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>}
        </div>

        <div className="flex items-start gap-3 mt-4">
          <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
            <input 
              type="checkbox" 
              {...register('terms')}
              className="peer appearance-none w-5 h-5 border border-titan-border bg-titan-surface checked:bg-titan-accent checked:border-titan-accent transition-colors cursor-pointer"
            />
            <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
          </div>
          <label className="text-sm text-titan-text-muted leading-tight cursor-pointer">
            He leído y acepto los <a href="/terms" className="text-titan-text underline hover:text-titan-accent">Términos de Servicio</a> y la <a href="/privacy" className="text-titan-text underline hover:text-titan-accent">Política de Privacidad</a>.
          </label>
        </div>
        {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message as string}</p>}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-[60px] bg-titan-accent text-white font-heading text-2xl uppercase tracking-widest hover:bg-titan-accent-hover transition-colors shadow-[0_0_20px_rgba(255,94,0,0.15)] hover:shadow-[0_0_30px_rgba(255,94,0,0.3)] mt-6 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Crear Cuenta'}
        </button>
      </form>

      <p className="mt-8 text-center text-titan-text-muted text-sm">
        ¿Ya tienes cuenta?{' '}
        <Link href="/auth/login" className="text-titan-text font-bold hover:text-titan-accent transition-colors border-b border-titan-text hover:border-titan-accent pb-1">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
