-- ═══════════════════════════════════════════════════════════════════
-- TITANSUPPS — FIX: Unique constraint en product_variants
-- Migration: 007_fix_variant_unique_constraint.sql
--
-- PROBLEMA:
--   La tabla product_variants no tenía restricción UNIQUE en
--   (product_id, name), lo que permitía insertar múltiples filas
--   con el mismo grupo de variantes para el mismo producto.
--   El seed data (004) podía crear duplicados al re-ejecutarse.
--
-- SOLUCIÓN:
--   1. Eliminar filas duplicadas (conservando la más antigua)
--   2. Añadir UNIQUE constraint en (product_id, name)
--   3. El seed data (004) ya usa ON CONFLICT DO NOTHING correctamente
-- ═══════════════════════════════════════════════════════════════════

-- ─── PASO 1: Eliminar filas duplicadas ───────────────────────────
-- Conserva la fila con el created_at más antiguo (la original).
-- Si hay 3 filas "Tamaño" para creatina, borra las 2 más recientes.

DELETE FROM public.product_variants
WHERE id NOT IN (
  SELECT DISTINCT ON (product_id, name) id
  FROM public.product_variants
  ORDER BY product_id, name, created_at ASC
);

-- ─── PASO 2: Añadir unique constraint ────────────────────────────
-- Garantiza que no pueda volver a ocurrir en el futuro.

ALTER TABLE public.product_variants
  ADD CONSTRAINT uq_product_variants_product_name
  UNIQUE (product_id, name);

-- ─── VERIFICACIÓN (informativa) ──────────────────────────────────
-- Puedes ejecutar esto manualmente para confirmar que no hay duplicados:
-- SELECT product_id, name, COUNT(*) 
-- FROM public.product_variants 
-- GROUP BY product_id, name 
-- HAVING COUNT(*) > 1;
-- → Debe devolver 0 filas.
