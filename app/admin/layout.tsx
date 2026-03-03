'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  Settings, LogOut, Menu, X, Bell 
} from 'lucide-react';

const ADMIN_LINKS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Inventario', href: '/admin/products', icon: Package },
  { name: 'Pedidos', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Clientes', href: '/admin/users', icon: Users },
  { name: 'Configuración', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-titan-bg flex">
      
      {/* OVERLAY MOBILE */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR (Navegación) */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-titan-surface border-r border-titan-border z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Logo Admin */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-titan-border">
          <Link href="/admin" className="font-heading text-2xl tracking-widest text-titan-text">
            TITAN<span className="text-titan-accent">ADMIN</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-titan-text-muted hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
          {ADMIN_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                  isActive 
                    ? 'bg-titan-accent/10 text-titan-accent border-l-2 border-titan-accent' 
                    : 'text-titan-text-muted hover:bg-titan-bg hover:text-white border-l-2 border-transparent'
                }`}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Mini */}
        <div className="p-4 border-t border-titan-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-titan-accent flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-titan-text truncate">Admin Titán</p>
              <p className="text-xs text-titan-text-muted truncate">admin@titansupps.com</p>
            </div>
          </div>
          <button className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 transition-colors">
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOPBAR (Header Utilitario) */}
        <header className="h-20 bg-titan-surface/50 backdrop-blur-md border-b border-titan-border sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-titan-text hover:text-titan-accent">
              <Menu size={24} />
            </button>
            <h1 className="font-heading text-xl uppercase tracking-wider text-titan-text hidden sm:block">Centro de Comando</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-xs font-bold uppercase tracking-widest text-titan-text-muted hover:text-titan-accent hidden sm:block transition-colors">
              Ver Tienda ↗
            </Link>
            <button className="relative p-2 text-titan-text-muted hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-titan-accent animate-pulse" />
            </button>
          </div>
        </header>

        {/* MAIN AREA */}
        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
          {children}
        </main>
      </div>

    </div>
  );
}