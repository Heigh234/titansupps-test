'use client';

/*
 * app/account/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Shell del dashboard de usuario. Solo responsabilidades de orquestación:
 *   1. Auth guard — redirige a /auth/login si no hay sesión
 *   2. Header con nombre del usuario y botón logout (desktop)
 *   3. Sidebar de navegación entre tabs
 *   4. Renderizado de la tab activa
 *
 * Estructura de módulos:
 *   _types.ts         → tipos, constantes y datos mock
 *   AddressModal.tsx  → modal de añadir/editar dirección
 *   TabOrders.tsx     → historial de pedidos
 *   TabProfile.tsx    → formulario de datos personales y seguridad
 *   TabAddresses.tsx  → CRUD de direcciones (estado y handlers propios)
 *   TabFavorites.tsx  → lista de favoritos (conectada a stores globales)
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';
import { useToastStore }   from '@/store/useToastStore';
import { useAuthStore }    from '@/store/useAuthStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import TabOrders    from './TabOrders';
import TabProfile   from './TabProfile';
import TabAddresses from './TabAddresses';
import TabFavorites from './TabFavorites';
import type { Tab } from './_types';

const NAV_ITEMS: { id: Tab; icon: React.ElementType; label: string; badge?: boolean }[] = [
  { id: 'orders',    icon: Package, label: 'Mis Pedidos'       },
  { id: 'profile',   icon: User,    label: 'Datos Personales'  },
  { id: 'addresses', icon: MapPin,  label: 'Direcciones'       },
  { id: 'favorites', icon: Heart,   label: 'Favoritos', badge: true },
];

const TAB_COMPONENTS: Record<Tab, React.ComponentType> = {
  orders:    TabOrders,
  profile:   TabProfile,
  addresses: TabAddresses,
  favorites: TabFavorites,
};

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  const router             = useRouter();
  const addToast           = useToastStore((state) => state.addToast);
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const favoritesCount     = useFavoritesStore((state) => state.items.length);
  const clearFavorites     = useFavoritesStore((state) => state.clearFavorites);

  // Auth guard — esperar a que initialize() termine antes de redirigir
  // Sin este check, redirige en el primer render (isAuthenticated = false inicial)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    clearFavorites(); // Limpiar favoritos del store al cerrar sesión
    addToast({ title: 'Sesión finalizada', message: 'Nos vemos en tu próximo entrenamiento.', type: 'info' });
    router.push('/');
  };

  if (isLoading || !isAuthenticated || !user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-titan-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const ActiveTab = TAB_COMPONENTS[activeTab];

  return (
    <div className="min-h-screen pt-28 pb-24 container mx-auto px-6">

      {/* ── HEADER ── */}
      <header className="mb-12 border-b border-titan-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-2">
            Panel de Control
          </p>
          <h1 className="text-fluid-4xl font-heading text-titan-text uppercase">
            Cuartel <span className="text-titan-accent">General</span>
          </h1>
          <p className="text-titan-text-muted mt-2">
            Bienvenido de vuelta, <strong className="text-titan-text">{user.name}</strong>.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 px-4 py-2 border border-titan-border text-titan-text-muted hover:border-red-500/50 hover:text-red-400 transition-colors text-sm font-bold uppercase tracking-widest"
        >
          <LogOut size={14} /> Cerrar Sesión
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">

        {/* ── SIDEBAR ── */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <nav
            className="flex lg:flex-col overflow-x-auto lg:overflow-visible no-scrollbar border-b lg:border-b-0 lg:border-r border-titan-border lg:pr-6 pb-4 lg:pb-0 gap-2 lg:gap-4"
            aria-label="Secciones del panel"
          >
            {NAV_ITEMS.map(({ id, icon: Icon, label, badge }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-4 py-3 whitespace-nowrap transition-colors text-sm font-bold uppercase tracking-wider ${
                  activeTab === id
                    ? 'bg-titan-accent/10 text-titan-accent border-b-2 lg:border-b-0 lg:border-l-2 border-titan-accent'
                    : 'text-titan-text-muted hover:text-white border-transparent'
                }`}
              >
                <Icon size={18} />
                {label}
                {/* Badge de contador para favoritos */}
                {badge && favoritesCount > 0 && (
                  <span className="ml-auto bg-titan-accent text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {favoritesCount}
                  </span>
                )}
              </button>
            ))}

            <div className="hidden lg:block h-px bg-titan-border my-2" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 whitespace-nowrap transition-colors text-sm font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10"
            >
              <LogOut size={18} /> Cerrar Sesión
            </button>
          </nav>
        </aside>

        {/* ── CONTENIDO DINÁMICO ── */}
        <main className="flex-1 min-h-[400px]">
          <AnimatePresence mode="wait">
            <ActiveTab key={activeTab} />
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
