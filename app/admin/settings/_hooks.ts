'use client';

// ─────────────────────────────────────────────────────────────────────────────
// HOOK — app/admin/settings/_hooks.ts
// ─────────────────────────────────────────────────────────────────────────────
// useSaveState: simula el ciclo saving → saved → idle para botones de guardar.
// En producción, 'trigger' wrappearía el fetch/PATCH real.

import { useState, useRef, useEffect, useCallback } from 'react';

export function useSaveState() {
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      timerRef.current = setTimeout(() => setSaved(false), 2500);
    }, 700);
  }, []);

  // Limpieza del timer al desmontar
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { saving, saved, trigger };
}
