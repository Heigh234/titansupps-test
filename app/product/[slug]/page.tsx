import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck, Truck, RotateCcw, Star } from 'lucide-react';
import ProductInteractive from '@/components/product/ProductInteractive';
import ProductGallery from '@/components/product/ProductGallery';
import { getProductBySlug } from '@/actions/products';

const GUARANTEES = [
  { icon: ShieldCheck, label: 'Fórmula certificada', desc: 'Laboratorio independiente' },
  { icon: Truck,       label: 'Envío 24-48h',        desc: 'En tu base en 2 días'     },
  { icon: RotateCcw,   label: 'Devolución 30 días',  desc: 'Sin preguntas'            },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Producto no encontrado | TitanSupps' };

  const firstImage = product.product_images
    ?.sort((a: { position: number }, b: { position: number }) => a.position - b.position)[0];

  return {
    title: `${product.name} | TitanSupps`,
    description: product.description?.substring(0, 160) || '',
    openGraph: { images: firstImage ? [firstImage.url] : [] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product  = await getProductBySlug(slug);

  if (!product) notFound();

  const images = (product.product_images ?? [])
    .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
    .map((img: { url: string; alt: string | null }) => img.url);

  // Grupos estructurados: [{ name: "Sabor", options: [...] }, { name: "Tamaño", options: [...] }]
  // ProductInteractive usa key={`${group.name}-${option}`} → siempre único
  // Productos sin variantes reciben [] → el componente no muestra selectores (correcto)
  const variantGroups = (product.product_variants ?? []).map(
    (v: { name: string; options: string[] }) => ({ name: v.name, options: v.options })
  );

  const productForComponents = {
    id:           product.id,
    name:         product.name,
    slug:         product.slug,
    price:        product.price,
    category:     product.category,
    brand:        'TitanSupps',
    description:  product.description || '',
    rating:       4.8,
    reviews:      124,
    stock:        product.stock,
    images:       images.length > 0 ? images : ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80&auto=format&fit=crop'],
    variantGroups, // ← reemplaza el antiguo `variants: string[]`
    ingredients:  '',
  };

  return (
    <div className="min-h-screen pt-20 pb-12 container mx-auto px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs font-bold uppercase tracking-widest text-titan-text-muted">
        <ol className="flex items-center gap-2 flex-wrap">
          <li><Link href="/" className="hover:text-titan-accent transition-colors">Home</Link></li>
          <li><span className="text-titan-border" aria-hidden="true">/</span></li>
          <li><Link href="/catalog" className="hover:text-titan-accent transition-colors">Arsenal</Link></li>
          <li><span className="text-titan-border" aria-hidden="true">/</span></li>
          <li className="text-titan-text truncate max-w-[200px]" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <ProductGallery
          images={productForComponents.images}
          productName={product.name}
          stock={product.stock}
        />

        <div className="flex flex-col gap-4">
          <div className="border-b border-titan-border pb-4">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              {product.status === 'low_stock' && (
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-widest">
                  Pocas unidades
                </span>
              )}
              <span className="text-[10px] font-bold text-titan-text-muted uppercase tracking-widest">
                {product.category}
              </span>
              <span className="text-titan-border text-[10px]" aria-hidden="true">·</span>
              <span className="text-[10px] font-bold text-titan-accent/70 uppercase tracking-widest">
                TitanSupps
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <div role="img" aria-label="4.8 de 5 estrellas" className="flex text-titan-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} aria-hidden="true" fill={i < 4 ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-titan-text-muted text-xs">4.8 (124 reseñas)</span>
            </div>

            <h1 className="font-heading text-fluid-2xl text-titan-text uppercase leading-[1.05] mb-2">
              {product.name}
            </h1>

            <div className="flex items-end gap-2">
              <span className="font-heading text-fluid-xl text-titan-accent">
                €{product.price.toFixed(2)}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-titan-text-muted text-sm line-through pb-0.5">
                  €{product.compare_price.toFixed(2)}
                </span>
              )}
              <span className="text-titan-text-muted text-sm pb-0.5">/ unidad</span>
            </div>
          </div>

          {product.description && (
            <p className="text-titan-text-muted leading-relaxed text-sm">
              {product.description}
            </p>
          )}

          <ProductInteractive product={productForComponents} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {GUARANTEES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-1.5 p-3 sm:p-2.5 border border-titan-border bg-titan-surface">
                <Icon size={16} className="text-titan-accent flex-shrink-0" />
                <div className="flex sm:flex-col items-center sm:items-center gap-1 sm:gap-0.5">
                  <p className="text-xs font-bold uppercase tracking-widest text-titan-text leading-tight">{label}</p>
                  <span className="text-titan-text-muted sm:hidden" aria-hidden="true">·</span>
                  <p className="text-[11px] text-titan-text-muted leading-tight">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
