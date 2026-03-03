'use client';

/**
 * app/checkout/page.tsx — Orquestador del checkout
 * ──────────────────────────────────────────────────
 * ARQUITECTURA POST-MODULARIZACIÓN:
 * Este archivo es el único punto que sabe en qué paso está el usuario
 * y posee la instancia de React Hook Form. Sus responsabilidades:
 *   1. Estado del paso activo (step)
 *   2. Instanciar useForm con zodResolver
 *   3. nextStep — dispara la validación parcial antes de avanzar
 *   4. onSubmit — punto de entrada para integración con Stripe/pasarela
 *   5. Componer el layout: CheckoutHeader + main(StepIndicator + form) + OrderSummary
 *
 * MÓDULOS EXTRAÍDOS:
 *   → _schema.ts          Zod schema + CheckoutFormValues type
 *   → CheckoutHeader.tsx  Header minimalista de conversión (tunnel checkout)
 *   → StepIndicator.tsx   Indicador de progreso 01→02
 *   → ShippingForm.tsx    Campos de envío con validación (Paso 1)
 *   → PaymentForm.tsx     Panel de pago + botón de confirmación (Paso 2)
 *   → OrderSummary.tsx    Sidebar sticky con items reales del cart + totales
 *
 * DECISIÓN — 'use client' en el page:
 * El page mantiene 'use client' porque es el coordinador del estado del form
 * (step, useForm). No existe una forma de delegar este estado a un Server Component
 * sin perder la gestión centralizada del formulario multi-step.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence } from 'framer-motion';

import { checkoutSchema, type CheckoutFormValues } from './_schema';
import CheckoutHeader  from './CheckoutHeader';
import StepIndicator   from './StepIndicator';
import ShippingForm    from './ShippingForm';
import PaymentForm     from './PaymentForm';
import OrderSummary    from './OrderSummary';

export default function CheckoutPage() {
  const [step, setStep] = useState<1 | 2>(1);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
  });

  // Valida solo los campos del paso 1 antes de avanzar al paso 2
  const nextStep = async () => {
    const isValid = await trigger(['email', 'firstName', 'lastName', 'address', 'city']);
    if (isValid) setStep(2);
  };

  const onSubmit = (data: CheckoutFormValues) => {
    console.log('Procesando pago de élite:', data);
    // TODO: Integración con Stripe / Pasarela de pago
  };

  return (
    <div className="min-h-screen bg-titan-bg flex flex-col">

      <CheckoutHeader />

      <main className="flex-grow container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">

        {/* Columna izquierda: indicador de pasos + formulario */}
        <div className="flex-1 lg:max-w-2xl">
          <StepIndicator step={step} onGoToStep={setStep} />

          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <ShippingForm
                  register={register}
                  errors={errors}
                  onNext={nextStep}
                />
              )}
              {step === 2 && <PaymentForm />}
            </AnimatePresence>
          </form>
        </div>

        {/* Columna derecha: resumen del pedido con datos reales del carrito */}
        <OrderSummary />

      </main>
    </div>
  );
}
