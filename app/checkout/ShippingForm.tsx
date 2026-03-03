/**
 * ShippingForm.tsx — Formulario de información de envío (Paso 1)
 * ───────────────────────────────────────────────────────────────
 * RESPONSABILIDAD ÚNICA: renderizar los campos del paso 1 y el botón
 * "Continuar al Pago". No sabe nada de React Hook Form internamente —
 * recibe las utilidades del form como props desde page.tsx.
 *
 * DECISIÓN DE PASAR PROPS vs useFormContext:
 * Consistente con la decisión en admin/products/new/page.tsx →
 * VariantsFieldArray.tsx. Pasar `register` y `errors` explícitamente hace
 * la dependencia visible en la firma del componente. useFormContext ocultaría
 * esa relación y requeriría un <FormProvider> adicional en page.tsx.
 *
 * CAMPO errors.lastName:
 * El original no mostraba el error de apellido aunque estaba en el schema.
 * Añadido aquí para consistencia con el resto de campos validados.
 *
 * ANIMACIÓN:
 * motion.div con entry desde izquierda (x: -20) y exit hacia derecha (x: 20).
 * Crea la ilusión de avance hacia adelante al pasar al paso 2.
 */

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { CheckoutFormValues } from './_schema';

interface ShippingFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  onNext: () => void;
}

// Clase base reutilizada en todos los inputs del formulario
const inputBase =
  'w-full bg-titan-surface border py-3 px-4 text-titan-text focus:outline-none focus:border-titan-accent transition-colors';

export default function ShippingForm({ register, errors, onNext }: ShippingFormProps) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Email — ocupa ancho completo */}
        <div className="md:col-span-2">
          <label htmlFor="checkout-email" className="block text-sm text-titan-text-muted uppercase tracking-wider mb-2">
            Email
          </label>
          <input
            id="checkout-email"
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="atleta@dominio.com"
            className={`${inputBase} ${errors.email ? 'border-red-500' : 'border-titan-border'}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1" role="alert">{errors.email.message}</p>}
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="checkout-firstName" className="block text-sm text-titan-text-muted uppercase tracking-wider mb-2">
            Nombre
          </label>
          <input
            id="checkout-firstName"
            {...register('firstName')}
            type="text"
            autoComplete="given-name"
            className={`${inputBase} ${errors.firstName ? 'border-red-500' : 'border-titan-border'}`}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1" role="alert">{errors.firstName.message}</p>}
        </div>

        {/* Apellido */}
        <div>
          <label htmlFor="checkout-lastName" className="block text-sm text-titan-text-muted uppercase tracking-wider mb-2">
            Apellido
          </label>
          <input
            id="checkout-lastName"
            {...register('lastName')}
            type="text"
            autoComplete="family-name"
            className={`${inputBase} ${errors.lastName ? 'border-red-500' : 'border-titan-border'}`}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1" role="alert">{errors.lastName.message}</p>}
        </div>

        {/* Dirección — ocupa ancho completo */}
        <div className="md:col-span-2">
          <label htmlFor="checkout-address" className="block text-sm text-titan-text-muted uppercase tracking-wider mb-2">
            Dirección Completa
          </label>
          <input
            id="checkout-address"
            {...register('address')}
            type="text"
            autoComplete="street-address"
            placeholder="Calle, Número, Piso/Depto"
            className={`${inputBase} ${errors.address ? 'border-red-500' : 'border-titan-border'}`}
          />
          {errors.address && <p className="text-red-500 text-xs mt-1" role="alert">{errors.address.message}</p>}
        </div>

        {/* Ciudad */}
        <div>
          <label htmlFor="checkout-city" className="block text-sm text-titan-text-muted uppercase tracking-wider mb-2">
            Ciudad
          </label>
          <input
            id="checkout-city"
            {...register('city')}
            type="text"
            autoComplete="address-level2"
            className={`${inputBase} ${errors.city ? 'border-red-500' : 'border-titan-border'}`}
          />
          {errors.city && <p className="text-red-500 text-xs mt-1" role="alert">{errors.city.message}</p>}
        </div>

      </div>

      {/* CTA — avance al paso 2 tras validación */}
      <button
        type="button"
        onClick={onNext}
        className="w-full md:w-auto mt-8 px-8 py-4 bg-titan-text text-titan-bg font-heading text-xl uppercase tracking-wider hover:bg-white transition-colors flex items-center justify-center gap-2"
      >
        Continuar al Pago <ChevronRight size={20} />
      </button>
    </motion.div>
  );
}
