import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getProducts } from '@/lib/shopify/queries';

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  sortKey?: string;
  tag?: string;
  limit?: number;
  viewAllHref?: string;
}

export async function FeaturedProducts({
  title = 'Más vendidos',
  subtitle = 'Los favoritos de nuestra comunidad',
  sortKey = 'BEST_SELLING',
  limit = 8,
  viewAllHref = '/colecciones',
}: FeaturedProductsProps) {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    products = await getProducts({ first: limit, sortKey });
  } catch {
    products = [];
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-500 mt-1">{subtitle}</p>
        </div>
        <Link
          href={viewAllHref}
          className="flex items-center gap-1.5 text-ultra-600 font-semibold text-sm hover:text-ultra-700 transition-colors group"
        >
          Ver todos
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <ProductGrid products={products} priority />
    </section>
  );
}
