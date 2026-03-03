import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { getFeaturedProducts } from '@/actions/products';

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="cv-section-products container mx-auto px-6 py-24" aria-labelledby="featured-heading">
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="text-xs font-bold text-titan-accent uppercase tracking-[0.25em] mb-3">
            Los más elegidos
          </p>
          <h2 id="featured-heading" className="text-fluid-4xl text-titan-text font-heading uppercase">
            Arsenal <span className="text-titan-accent">Elite</span>
          </h2>
        </div>
        <Link
          href="/catalog"
          className="hidden md:flex items-center gap-2 text-titan-text-muted hover:text-titan-accent transition-colors text-sm font-bold uppercase tracking-widest"
        >
          Ver todo <ArrowRight size={16} />
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product: {
            id: string;
            slug: string;
            name: string;
            price: number;
            category: string;
            product_images?: { url: string; position: number }[];
          }) => {
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
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-titan-border text-center">
          <p className="text-titan-text-muted text-sm uppercase tracking-widest font-bold">
            No hay productos disponibles
          </p>
          <p className="text-titan-text-muted/60 text-xs mt-2">
            Añade productos desde el panel de administración
          </p>
        </div>
      )}

      <div className="mt-10 flex justify-center md:hidden">
        <Link
          href="/catalog"
          className="flex items-center gap-2 px-8 py-4 border border-titan-border text-titan-text hover:border-titan-accent hover:text-titan-accent transition-colors font-heading uppercase tracking-wider"
        >
          Ver Arsenal Completo <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
