'use client';

/*
 * NAVBAR — Sin Framer Motion
 * ─────────────────────────────────────────────────────────────────────────────
 * MOTIVACIÓN DEL CAMBIO:
 * El Navbar vive en el layout raíz (app/layout.tsx), lo que significa que su
 * bundle se descarga en TODAS las páginas del sitio en el primer load.
 * Framer Motion pesa ~117KB y en Coverage aparecía con 89.9% sin usar en la
 * homepage, contaminando el LCP y el bundle inicial de todas las rutas.
 *
 * ESTRATEGIA DE REEMPLAZO:
 * Cada animación de FM se reemplaza con una equivalente en CSS/Tailwind:
 *
 *  FM motion.div (opacity:0,y:8 → opacity:1,y:0)   →  CSS transition + translate-y + opacity
 *  FM AnimatePresence exit (opacity:0, y:8)         →  pointer-events-none + opacity-0 (siempre en DOM)
 *  FM mobile drawer (x:'-100%' spring)              →  CSS translate-x + transition-transform 300ms
 *  FM backdrop (opacity:0→1)                        →  CSS opacity transition 300ms
 *  FM badge (scale:0→1 spring)                      →  @keyframes fadeScaleIn (ya en globals.css)
 *  FM motion.li stagger (x:-16,opacity:0 → 0,1)    →  @keyframes fadeSlideUp con animation-delay inline
 *
 * RESULTADO VISUAL: prácticamente idéntico al original.
 * RESULTADO TÉCNICO: FM deja de ser parte del bundle crítico de la homepage.
 * FM seguirá cargando lazy en las rutas que sí lo necesitan (auth, catalog, etc.)
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingCart, User, Search, Menu, X,
  ChevronRight, ChevronDown, Dumbbell, LogOut, LayoutDashboard,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import SearchModal from '@/components/ui/SearchModal';

const CATEGORIES = [
  { label: 'Proteínas',       href: '/catalog?category=proteina',    desc: 'Máxima absorción' },
  { label: 'Pre-Workout',     href: '/catalog?category=pre-workout',  desc: 'Energía extrema' },
  { label: 'Creatina',        href: '/catalog?category=creatina',     desc: 'Potencia pura' },
  { label: 'Vitaminas',       href: '/catalog?category=vitaminas',    desc: 'Salud integral' },
  { label: 'Recuperación',    href: '/catalog?category=recuperacion', desc: 'Regeneración' },
  { label: 'Pérdida de Peso', href: '/catalog?category=perdida-peso', desc: 'Definición' },
];

const NAV_LINKS = [
  { label: 'Nosotros', href: '/about' },
  { label: 'Blog',     href: '/blog' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled]           = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen]         = useState(false);
  const [isShopOpen, setShopOpen]             = useState(false);
  const [isUserMenuOpen, setUserMenuOpen]     = useState(false);
  const [mounted, setMounted]                 = useState(false);
  const shopDropdownRef                        = useRef<HTMLDivElement>(null);
  const userMenuRef                            = useRef<HTMLDivElement>(null);
  const pathname                               = usePathname();
  const router                                 = useRouter();
  const { toggleCart, getTotalItems }          = useCartStore();
  const { user, isAuthenticated, logout }      = useAuthStore();
  const addToast                               = useToastStore((state) => state.addToast);
  const totalItems                             = mounted ? getTotalItems() : 0;

  useEffect(() => { setMounted(true); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Cerrar todos los menús al cambiar de ruta
    setMobileMenuOpen(false); // eslint-disable-line react-hooks/set-state-in-effect
    setSearchOpen(false);     // eslint-disable-line react-hooks/set-state-in-effect
    setShopOpen(false);       // eslint-disable-line react-hooks/set-state-in-effect
    setUserMenuOpen(false);   // eslint-disable-line react-hooks/set-state-in-effect
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname?.startsWith('/auth') || pathname?.startsWith('/admin') || pathname?.startsWith('/checkout')) {
    return null;
  }

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href.split('?')[0]));

  const handleLogout = () => {
    logout();
    addToast({ title: 'Sesión cerrada', message: 'Nos vemos en tu próximo entrenamiento.', type: 'info' });
    setUserMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'glass-panel py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between gap-6">

          {/* Hamburguesa mobile */}
          <button
            className="lg:hidden text-titan-text hover:text-titan-accent transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menú de navegación"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" className="text-3xl font-heading tracking-widest text-titan-text flex items-center flex-shrink-0">
            TITAN<span className="text-titan-accent">SUPPS</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navegación principal">

            {/* ── TIENDA — dropdown con CSS transition ───────────────────────────
                Reemplaza AnimatePresence + motion.div.
                El div del dropdown está SIEMPRE en el DOM pero:
                  - opacity-0 / translate-y-2 / pointer-events-none → invisible e inactivo
                  - opacity-100 / translate-y-0 / pointer-events-auto → visible y activo
                transition-all 150ms ease-out imita el timing original de FM (duration:0.15).
            ─────────────────────────────────────────────────────────────────── */}
            <div
              ref={shopDropdownRef}
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <Link
                href="/catalog"
                className={`flex items-center gap-1.5 text-sm font-medium uppercase tracking-widest transition-colors relative group ${
                  isActive('/catalog') ? 'text-titan-accent' : 'text-titan-text-muted hover:text-white'
                }`}
                aria-haspopup="true"
                aria-expanded={isShopOpen}
              >
                Tienda
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isShopOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-titan-accent transition-all duration-300 group-hover:w-full" aria-hidden="true" />
              </Link>

              {/*
               * CSS DROPDOWN — siempre en DOM, oculto con opacity + translate + pointer-events.
               * mt-3 se logra con top-[calc(100%+12px)] para que el gap no rompa el hover.
               */}
              <div
                className={`absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-72 bg-titan-surface border border-titan-border shadow-2xl shadow-black/60 z-50 transition-all duration-150 ease-out ${
                  isShopOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
                role="menu"
                aria-label="Categorías de productos"
              >
                <Link
                  href="/catalog"
                  className="flex items-center justify-between px-5 py-4 border-b border-titan-border bg-titan-accent/5 hover:bg-titan-accent/10 transition-colors group"
                  role="menuitem"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-titan-accent/20 border border-titan-accent/30 flex items-center justify-center">
                      <Dumbbell size={14} className="text-titan-accent" />
                    </div>
                    <div>
                      <p className="font-heading text-sm uppercase tracking-wider text-titan-text">Ver Todo el Arsenal</p>
                      <p className="text-[10px] text-titan-text-muted uppercase tracking-widest">Catálogo completo</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-titan-accent group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="p-2">
                  <p className="text-[9px] font-bold text-titan-text-muted uppercase tracking-[0.2em] px-3 py-2">
                    Acceso Rápido
                  </p>
                  {CATEGORIES.map(({ label, href, desc }) => (
                    <Link
                      key={label}
                      href={href}
                      className="flex items-center justify-between px-3 py-2.5 hover:bg-titan-surface-hover transition-colors group"
                      role="menuitem"
                    >
                      <div>
                        <p className="text-sm font-bold text-titan-text group-hover:text-titan-accent transition-colors">
                          {label}
                        </p>
                        <p className="text-[10px] text-titan-text-muted">{desc}</p>
                      </div>
                      <ChevronRight
                        size={12}
                        className="text-titan-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Links informativos */}
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium uppercase tracking-widest transition-colors relative group ${
                  isActive(item.href) ? 'text-titan-accent' : 'text-titan-text-muted hover:text-white'
                }`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-titan-accent transition-all duration-300 group-hover:w-full" aria-hidden="true" />
              </Link>
            ))}
          </nav>

          {/* Iconos de acción */}
          <div className="flex items-center gap-3 lg:gap-6">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-titan-text hover:text-titan-accent transition-colors"
              aria-label="Abrir buscador de productos"
            >
              <Search size={20} />
            </button>

            {/* ── MENÚ DE USUARIO — dropdown con CSS transition ──────────────────
                Mismo patrón que el dropdown de tienda:
                siempre en DOM, visible/oculto con opacity + translate + pointer-events.
            ─────────────────────────────────────────────────────────────────── */}
            {isAuthenticated && user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-titan-text hover:text-titan-accent transition-colors"
                  aria-label="Menú de usuario"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-titan-accent/20 border border-titan-accent/40 flex items-center justify-center text-titan-accent font-heading text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <div
                  className={`absolute top-[calc(100%+12px)] right-0 w-56 bg-titan-surface border border-titan-border shadow-2xl shadow-black/60 z-50 transition-all duration-150 ease-out ${
                    isUserMenuOpen
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="px-4 py-3 border-b border-titan-border">
                    <p className="text-xs text-titan-text-muted uppercase tracking-widest">Conectado como</p>
                    <p className="font-bold text-titan-text truncate">{user.name}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/account"
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-titan-text hover:bg-titan-accent/10 hover:text-titan-accent transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      <span className="font-medium">Mi Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <LogOut size={14} />
                      <span className="font-medium">Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-titan-text hover:text-titan-accent transition-colors"
                aria-label="Iniciar sesión"
              >
                <User size={20} />
              </Link>
            )}

            {/* ── CARRITO — badge con @keyframes fadeScaleIn ──────────────────────
                Reemplaza motion.span con scale:0→1 spring.
                fadeScaleIn ya está definido en globals.css con la misma curva
                cubic-bezier(0.34,1.56,0.64,1) que imita el overshoot del spring.
                La animación de salida (scale→0) se omite: el badge desaparece
                instantáneamente al llegar a 0 items, diferencia imperceptible.
            ─────────────────────────────────────────────────────────────────── */}
            <button
              onClick={() => toggleCart(true)}
              className="relative text-titan-text hover:text-titan-accent transition-colors"
              aria-label={`Carrito, ${totalItems} artículo${totalItems !== 1 ? 's' : ''}`}
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span
                  key={totalItems}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-titan-accent text-black text-[10px] font-bold flex items-center justify-center rounded-full"
                  style={{ animation: 'fadeScaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both' }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── MOBILE MENU — backdrop + drawer con CSS transition ──────────────────
          Reemplaza dos AnimatePresence + motion.div con CSS puro.
          Ambos elementos están SIEMPRE en el DOM para que las transiciones de
          salida (fade/slide out) funcionen correctamente.
          
          Backdrop: opacity-0/100 + pointer-events-none/auto
          Drawer:   -translate-x-full / translate-x-0 con transition-transform
          
          transition duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ≈
          spring(damping:28, stiffness:220) del original de FM.
      ─────────────────────────────────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-sm bg-titan-surface border-r border-titan-border z-50 flex flex-col shadow-2xl lg:hidden transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-titan-border">
          <Link href="/" className="text-2xl font-heading tracking-widest text-titan-text">
            TITAN<span className="text-titan-accent">SUPPS</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-11 h-11 flex items-center justify-center text-titan-text-muted hover:text-white hover:bg-titan-bg rounded-full transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar p-6">
          <p className="text-[10px] font-bold text-titan-text-muted uppercase tracking-[0.2em] mb-4">Tienda</p>

          <Link
            href="/catalog"
            className="flex items-center justify-between py-4 border-b border-titan-border/50 text-titan-text hover:text-titan-accent transition-colors group mb-1"
          >
            <span className="font-heading text-2xl uppercase tracking-wider">Todo el Arsenal</span>
            <ChevronRight size={18} className="text-titan-text-muted group-hover:text-titan-accent group-hover:translate-x-1 transition-all" />
          </Link>

          {/* ── MOBILE CATEGORIES — stagger con CSS animation-delay ─────────────
              Reemplaza motion.li con initial:{opacity:0,x:-16} y transition delay.
              Usamos fadeSlideUp (ya en globals.css) + animation-delay inline.
              El drawer siempre está en DOM, así que la animación se ejecuta 1 vez
              al montar. Para que se repita cada vez que se abre el menú, usamos
              key={isMobileMenuOpen ? 'open' : 'closed'} en la lista — esto fuerza
              a React a remontar los <li> cuando cambia el estado.
          ─────────────────────────────────────────────────────────────────── */}
          <ul
            key={isMobileMenuOpen ? 'open' : 'closed'}
            className="space-y-0 mb-8"
            role="list"
          >
            {CATEGORIES.map((cat, i) => (
              <li
                key={cat.label}
                style={{
                  animationDelay: `${0.04 * i}s`,
                  animation: isMobileMenuOpen
                    ? `fadeSlideUp 0.2s ease-out ${0.04 * i}s both`
                    : undefined,
                }}
              >
                <Link
                  href={cat.href}
                  className="flex items-center justify-between py-3 border-b border-titan-border/20 text-titan-text-muted hover:text-white transition-colors group pl-3"
                >
                  <div>
                    <span className="text-sm font-bold uppercase tracking-wider">{cat.label}</span>
                    <span className="text-[10px] text-titan-text-muted block opacity-70">{cat.desc}</span>
                  </div>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-[10px] font-bold text-titan-text-muted uppercase tracking-[0.2em] mb-4">Más</p>
          <div className="space-y-0">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center justify-between py-3 border-b border-titan-border/30 text-titan-text-muted hover:text-white transition-colors group"
              >
                <span className="font-heading text-xl uppercase tracking-wider">{label}</span>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>

          {/* Cuenta */}
          <div className="mt-8 pt-6 border-t border-titan-border">
            <p className="text-[10px] font-bold text-titan-text-muted uppercase tracking-[0.2em] mb-4">Mi Cuenta</p>

            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 mb-4 px-1">
                  <div className="w-9 h-9 rounded-full bg-titan-accent/20 border border-titan-accent/40 flex items-center justify-center text-titan-accent font-heading">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-titan-text">{user.name}</p>
                    <p className="text-[10px] text-titan-text-muted">{user.email}</p>
                  </div>
                </div>
                <Link href="/account" className="flex items-center gap-3 text-sm text-titan-text-muted hover:text-white transition-colors py-2">
                  <ChevronRight size={14} className="text-titan-accent" />
                  Mi Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-sm text-red-400 hover:text-red-300 transition-colors py-2 w-full"
                >
                  <LogOut size={14} className="text-red-400" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                {[
                  { label: 'Iniciar Sesión', href: '/auth/login' },
                  { label: 'Crear Cuenta',   href: '/auth/register' },
                  { label: 'Mis Pedidos',    href: '/account' },
                ].map(({ label, href }) => (
                  <Link key={label} href={href} className="flex items-center gap-3 text-sm text-titan-text-muted hover:text-white transition-colors py-2">
                    <ChevronRight size={14} className="text-titan-accent" />
                    {label}
                  </Link>
                ))}
              </>
            )}
          </div>
        </nav>

        <div className="p-6 border-t border-titan-border space-y-3">
          <Link
            href="/catalog"
            className="block w-full py-4 bg-titan-accent text-white font-heading text-xl uppercase tracking-widest text-center hover:bg-titan-accent-hover transition-colors shadow-[0_0_20px_rgba(255,94,0,0.2)]"
          >
            Ver Todo el Arsenal
          </Link>
          <button
            onClick={() => { setMobileMenuOpen(false); toggleCart(true); }}
            className="block w-full py-3 border border-titan-border text-titan-text font-heading text-lg uppercase tracking-widest text-center hover:border-titan-accent hover:text-titan-accent transition-colors relative"
          >
            Mi Carrito
            {totalItems > 0 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-titan-accent rounded-full text-white text-xs flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
