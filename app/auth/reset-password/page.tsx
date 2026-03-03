'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';

// framer-motion eliminado — reemplazado por CSS fadeSlideUp (globals.css)

const resetSchema = z.object({
  password: z.string().min(8, "Mínimo 8 caracteres").regex(/[A-Z]/, "Debe contener una mayúscula").regex(/[0-9]/, "Debe contener un número"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden", path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema), mode: 'onTouched',
  });

  const pwd = watch('password', '');
  useEffect(() => {
    let s = 0;
    if (pwd.length >= 8) s++; if (/[A-Z]/.test(pwd)) s++; if (/[0-9]/.test(pwd)) s++; if (/[^A-Za-z0-9]/.test(pwd)) s++;
    setStrength(s);
  }, [pwd]);

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 1500));
    addToast({ title: 'Contraseña Actualizada', message: 'Tu acceso ha sido forjado nuevamente.', type: 'success' });
    router.push('/auth/login');
  };

  return (
    <div className="animate-[fadeSlideUp_0.4s_ease-out_both]">
      <h1 className="font-heading text-4xl text-titan-text uppercase mb-2">Nueva Contraseña</h1>
      <p className="text-titan-text-muted mb-8 text-sm">Forja una nueva credencial para tu cuenta. Asegúrate de que sea fuerte.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">Nueva Contraseña</label>
          <div className="relative">
            <input 
              {...register('password')} type={showPassword ? "text" : "password"}
              className={`w-full bg-titan-surface border ${errors.password ? 'border-red-500' : 'border-titan-border'} p-4 pr-12 text-titan-text focus:outline-none focus:border-titan-accent`}
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-titan-text-muted">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="mt-2 flex gap-1 h-1.5 w-full bg-titan-bg rounded-full overflow-hidden">
            {[1, 2, 3, 4].map((l) => (
              <div key={l} className={`flex-1 transition-colors ${strength >= l ? (strength < 2 ? 'bg-red-500' : strength === 2 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-transparent'}`} />
            ))}
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">Confirmar Contraseña</label>
          <input 
            {...register('confirmPassword')} type={showPassword ? "text" : "password"}
            className={`w-full bg-titan-surface border ${errors.confirmPassword ? 'border-red-500' : 'border-titan-border'} p-4 text-titan-text focus:outline-none focus:border-titan-accent`}
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full h-[60px] bg-titan-text text-titan-bg font-heading text-xl uppercase tracking-widest hover:bg-titan-accent hover:text-white transition-colors disabled:opacity-50 flex justify-center items-center">
          {isSubmitting ? <Loader2 className="animate-spin" /> : 'Actualizar Contraseña'}
        </button>
      </form>
    </div>
  );
}
