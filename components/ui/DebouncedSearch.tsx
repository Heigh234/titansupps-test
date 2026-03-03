'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';

/**
 * DebouncedSearch — Búsqueda con 300ms de debounce
 *
 * CORRECCIÓN DE BUG (bucle infinito GET /catalog):
 * La versión anterior tenía `searchParams` en el array de dependencias del useEffect.
 * Flujo del bug:
 *   1. El efecto llama router.push() con el nuevo query
 *   2. router.push() cambia la URL → Next actualiza el objeto searchParams
 *   3. searchParams cambia → el efecto se dispara de nuevo
 *   4. El efecto llama router.push() otra vez → bucle infinito
 *
 * FIX: Leer los params actuales desde window.location.search dentro del timer
 * (no reactivo, solo se lee en el momento de ejecutar). Se elimina searchParams
 * del array de dependencias para que el efecto solo reaccione a cambios del
 * input del usuario (inputValue) y no a los cambios de URL que él mismo produce.
 */

export default function DebouncedSearch() {
  const router   = useRouter();
  const pathname = usePathname();

  // Inicializar desde la URL actual (SSR-safe: solo en cliente)
  const [inputValue, setInputValue] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('q') || '';
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      // Leemos window.location.search en el momento de ejecutar, no de forma reactiva.
      // Esto preserva los otros params (category, brand, sort) sin crear dependencia
      // circular con el objeto searchParams de Next.js.
      const current = new URLSearchParams(window.location.search);

      if (inputValue.trim() === '') {
        current.delete('q');
      } else {
        current.set('q', inputValue.trim());
      }

      const route  = pathname === '/catalog' ? pathname : '/catalog';
      const search = current.toString();
      const qs     = search ? `?${search}` : '';

      router.push(`${route}${qs}`, { scroll: false });
    }, 300);

    return () => clearTimeout(timer);
    // ⚠️ searchParams excluido intencionalmente de las deps para evitar el bucle:
    // este efecto solo debe reaccionar a lo que el usuario escribe, no a los
    // cambios de URL que el propio efecto produce.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, router, pathname]);

  return (
    <div className="relative w-full max-w-md group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-titan-text-muted group-focus-within:text-titan-accent transition-colors">
        <Search size={18} />
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Buscar suplementos..."
        className="w-full bg-titan-surface border border-titan-border rounded-none py-3 pl-12 pr-10 text-titan-text placeholder-titan-text-muted focus:outline-none focus:border-titan-accent focus:shadow-[0_0_15px_rgba(255,94,0,0.1)] transition-all"
        aria-label="Buscador"
      />

      {inputValue && (
        <button
          onClick={() => setInputValue('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-titan-text-muted hover:text-white transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
