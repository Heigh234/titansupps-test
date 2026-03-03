'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { getProducts } from '@/actions/products';

interface ProductFromDB {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  status: string;
  featured: boolean;
  created_at: string;
  product_images?: { url: string; alt: string | null; position: number }[];
}

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value.split(',').map((v) => v.trim().toLowerCase()).filter(Boolean);
}

export default function CatalogGrid() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductFromDB[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);

      const activeCategories = parseList(searchParams.get('category'));
      const maxPrice         = Number(searchParams.get('price') || 9999);
      const sortOrder        = searchParams.get('sort') || 'popular';
      const query            = searchParams.get('q') || '';

      const sortMap: Record<string, { sortBy: 'created_at' | 'price' | 'name'; sortDir: 'asc' | 'desc' }> = {
        popular:    { sortBy: 'created_at', sortDir: 'desc' },
        price_asc:  { sortBy: 'price',      sortDir: 'asc'  },
        price_desc: { sortBy: 'price',      sortDir: 'desc' },
        new:        { sortBy: 'created_at', sortDir: 'desc' },
      };
      const { sortBy, sortDir } = sortMap[sortOrder] ?? sortMap.popular;

      // FIX: cuando hay 1 categoría la pasamos al servidor directamente.
      // Cuando hay múltiples, fetching sin category y filtramos client-side
      // (Supabase no soporta .in() vía Server Action con el tipo actual).
      const { products: data, total: count } = await getProducts({
        category: activeCategories.length === 1 ? activeCategories[0] : undefined,
        search:   query || undefined,
        sortBy,
        sortDir,
        limit:    100, // subido a 100 para que el filtro client-side no pierda resultados
      });

      if (cancelled) return;

      let filtered = data as ProductFromDB[];

      // Filtro client-side de múltiples categorías
      if (activeCategories.length > 1) {
        filtered = filtered.filter((p) =>
          activeCategories.includes(p.category.toLowerCase())
        );
      }

      // Filtro client-side de precio máximo (solo activo si != 200 o 9999)
      if (maxPrice < 200) {
        filtered = filtered.filter((p) => p.price <= maxPrice);
      }

      setProducts(filtered);
      setTotal(count);
      setLoading(false);
    };

    run();
    return () => { cancelled = true; };
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-titan-accent" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
        <div className="w-16 h-16 border border-titan-border flex items-center justify-center text-titan-text-muted">
          <SlidersHorizontal size={28} />
        </div>
        <div>
          <h3 className="font-heading text-2xl uppercase text-titan-text mb-2">Sin resultados</h3>
          <p className="text-titan-text-muted text-sm max-w-xs">
            Ningún producto coincide con los filtros actuales.
          </p>
        </div>
        <Link
          href="/catalog"
          className="px-6 py-3 border border-titan-border text-titan-text hover:border-titan-accent hover:text-titan-accent transition-colors font-heading uppercase tracking-wider text-sm"
        >
          Limpiar filtros
        </Link>
      </div>
    );
  }

  const sortOrder = searchParams.get('sort') || 'popular';
  const query     = searchParams.get('q') || '';

  return (
    <div>
      <div className="flex justify-between items-center mb-6 text-sm text-titan-text-muted">
        <p>
          Mostrando <span className="text-white font-bold">{products.length}</span> de{' '}
          <span className="text-white font-bold">{total}</span> armamentos
          {query && <span className="ml-2 text-titan-accent font-bold">para &ldquo;{query}&rdquo;</span>}
        </p>
        {/* FIX: SortSelect ahora usa useRouter en vez de window.history.pushState */}
        <SortSelect current={sortOrder} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {products.map((product) => {
          const firstImage = product.product_images
            ?.sort((a, b) => a.position - b.position)[0];

          return (
            <ProductCard
              key={product.id}
              id={product.slug}
              title={product.name}
              price={product.price}
              category={product.category}
              brand="TitanSupps"
              image={firstImage?.url || 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80&auto=format&fit=crop'}
            />
          );
        })}
      </div>
    </div>
  );
}

// FIX: Reemplaza window.history.pushState por useRouter de Next.js.
// El método anterior disparaba PopStateEvent manualmente, que Next.js
// no escucha de forma confiable — el sort fallaba en ~50% de los casos.
function SortSelect({ current }: { current: string }) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <select
      value={current}
      onChange={handleChange}
      className="bg-titan-bg border border-titan-border text-titan-text py-2 px-4 focus:outline-none focus:border-titan-accent cursor-pointer uppercase tracking-widest text-xs font-bold"
      aria-label="Ordenar productos"
    >
      <option value="popular">Más Populares</option>
      <option value="price_asc">Precio: Menor a Mayor</option>
      <option value="price_desc">Precio: Mayor a Menor</option>
      <option value="new">Novedades</option>
    </select>
  );
}
