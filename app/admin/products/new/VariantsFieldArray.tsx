'use client';

/**
 * VariantsFieldArray.tsx — Gestión dinámica de variantes de producto
 * ────────────────────────────────────────────────────────────────────
 * EXTRACCIÓN: Separado de page.tsx porque encapsula toda la lógica
 * de useFieldArray (append/remove) y su UI animada.
 *
 * INTEGRACIÓN CON REACT HOOK FORM:
 * Recibe `control`, `register` y `errors` del formulario padre
 * (page.tsx) vía props. Esta es la estrategia más explícita y
 * segura frente a la alternativa de useFormContext, que requiere
 * un Provider adicional y hace la dependencia menos obvia.
 *
 * La firma de los types (Control, UseFormRegister, FieldErrors)
 * se importa de react-hook-form para mantener total type-safety
 * sin duplicar el schema Zod en este archivo.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useFieldArray, type Control, type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { ProductFormValues } from './types';

interface VariantsFieldArrayProps {
  control:  Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors:   FieldErrors<ProductFormValues>;
}

export default function VariantsFieldArray({ control, register, errors }: VariantsFieldArrayProps) {
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: 'variants' });

  return (
    <section className="bg-titan-surface border border-titan-border p-6 space-y-6">
      {/* Header con botón de añadir */}
      <div className="flex justify-between items-center border-b border-titan-border pb-4">
        <h3 className="font-heading text-xl uppercase tracking-wider text-titan-text">
          Variantes
        </h3>
        <button
          type="button"
          onClick={() => appendVariant({ name: '', options: '' })}
          className="text-xs text-titan-accent uppercase tracking-widest font-bold hover:text-white transition-colors flex items-center gap-1"
        >
          <Plus size={14} /> Añadir Opción
        </button>
      </div>

      {/* Lista animada de variantes */}
      <AnimatePresence>
        {variantFields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex gap-4 items-start"
          >
            {/* Campo: nombre de la variante (ej: "Sabor") */}
            <div className="flex-1">
              <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                Nombre (Ej: Sabor)
              </label>
              <input
                {...register(`variants.${index}.name`)}
                className={`w-full bg-titan-bg border p-3 text-titan-text focus:outline-none focus:border-titan-accent transition-colors ${
                  errors.variants?.[index]?.name ? 'border-red-500' : 'border-titan-border'
                }`}
                placeholder="Sabor"
              />
              {errors.variants?.[index]?.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.variants[index].name?.message}
                </p>
              )}
            </div>

            {/* Campo: valores separados por coma (ej: "Vainilla, Chocolate") */}
            <div className="flex-[2]">
              <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                Valores (Separados por coma)
              </label>
              <div className="flex gap-2">
                <input
                  {...register(`variants.${index}.options`)}
                  className={`w-full bg-titan-bg border p-3 text-titan-text focus:outline-none focus:border-titan-accent transition-colors ${
                    errors.variants?.[index]?.options ? 'border-red-500' : 'border-titan-border'
                  }`}
                  placeholder="Vainilla, Chocolate, Fresa"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  aria-label={`Eliminar variante ${index + 1}`}
                  className="p-3 bg-titan-bg border border-titan-border text-titan-text-muted hover:text-red-500 hover:border-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              {errors.variants?.[index]?.options && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.variants[index].options?.message}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {/* Estado vacío */}
        {variantFields.length === 0 && (
          <p className="text-sm text-titan-text-muted italic">
            Este producto no tiene variantes (talla, sabor, etc).
          </p>
        )}
      </AnimatePresence>
    </section>
  );
}
