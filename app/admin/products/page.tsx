'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToastStore } from '@/store/useToastStore';
import { getProducts, deleteProduct } from '@/actions/products';
import { PAGE_SIZE } from './data';
import ProductsTable from './ProductsTable';
import ProductEditModal from './ProductEditModal';
import ProductDeleteModal from './ProductDeleteModal';
import type { Product } from './types';

function mapProduct(raw: Record<string, unknown>): Product {
  const images    = (raw.product_images as { url: string; position: number }[]) ?? [];
  const firstImage = images.sort((a, b) => a.position - b.position)[0];

  // Extraer variantes si vienen embebidas
  const variants = (raw.product_variants as { name: string; options: string[] }[] | undefined) ?? [];

  return {
    id:           String(raw.id),
    name:         String(raw.name      || ''),
    sku:          String(raw.sku       || ''),
    price:        Number(raw.price     || 0),
    stock:        Number(raw.stock     || 0),
    status:       (raw.status as Product['status']) || 'draft',
    category:     String(raw.category  || ''),
    image:        firstImage?.url || 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80&auto=format&fit=crop',
    description:  raw.description ? String(raw.description) : undefined,
    comparePrice: raw.compare_price ? Number(raw.compare_price) : undefined,
    variants,
  };
}

export default function AdminProducts() {
  const [products, setProducts]       = useState<Product[]>([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearch]       = useState('');
  const [page, setPage]               = useState(1);

  // Estado de modales
  const [editingProduct, setEditing]  = useState<Product | null>(null);
  const [deletingProduct, setDeleting] = useState<Product | null>(null);

  const addToast = useToastStore((s) => s.addToast);

  // ─── Carga inicial de productos ──────────────────────────────
  // NOTA: useState(true) ya inicializa loading=true, por lo que no necesitamos
  // llamar setLoading(true) de forma síncrona dentro del effect.
  // Llamar setState síncronamente en el body de un effect provoca renders en
  // cascada (react-hooks/set-state-in-effect). El fetch y los setState del
  // callback .then() son asíncronos y no disparan el problema.
  useEffect(() => {
    let cancelled = false;
    getProducts({
      limit:  200,
      status: ['active', 'low_stock', 'out_of_stock', 'draft'] as const,
    })
      .then(({ products: data }) => {
        if (cancelled) return;
        setProducts((data as Record<string, unknown>[]).map(mapProduct));
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // ─── Filtrado en cliente ──────────────────────────────────────
  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(q)     ||
      p.sku.toLowerCase().includes(q)      ||
      p.category.toLowerCase().includes(q)
    );
  }, [products, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (term: string) => { setSearch(term); setPage(1); };

  // ─── Edición ─────────────────────────────────────────────────
  const handleEdit = (product: Product) => setEditing(product);

  const handleSaved = (updated: Product) => {
    // Actualizar la lista en memoria sin refetch
    setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
    setEditing(null);
  };

  // ─── Borrado ─────────────────────────────────────────────────
  const handleDelete = (product: Product) => setDeleting(product);

  const handleConfirmDelete = async (product: Product) => {
    const result = await deleteProduct(product.id);

    if (result.error) {
      addToast({ type: 'error', title: 'Error', message: result.error });
      return;
    }

    // Quitar de la lista local inmediatamente
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    setDeleting(null);
    addToast({
      type:    'success',
      title:   'Producto eliminado',
      message: `"${product.name}" ha sido eliminado del arsenal.`,
    });
  };

  // ─── Render ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-titan-accent" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-heading text-3xl uppercase text-titan-text tracking-wider">
            Inventario
          </h2>
          <Link
            href="/admin/products/new"
            className="bg-titan-accent text-white px-4 py-2 font-bold text-sm uppercase tracking-wider hover:bg-titan-accent-hover transition-colors flex items-center gap-2 w-full sm:w-auto justify-center shadow-[0_0_15px_rgba(255,94,0,0.2)]"
          >
            <Plus size={18} /> Nuevo Producto
          </Link>
        </div>

        <ProductsTable
          filtered={filtered}
          paginated={paginated}
          searchTerm={searchTerm}
          page={page}
          totalPages={totalPages}
          onSearch={handleSearch}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* ── Modales ─────────────────────────────────────────── */}
      <ProductEditModal
        key={editingProduct?.id ?? 'empty'}
        product={editingProduct}
        onClose={() => setEditing(null)}
        onSaved={handleSaved}
      />

      <ProductDeleteModal
        product={deletingProduct}
        onClose={() => setDeleting(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
