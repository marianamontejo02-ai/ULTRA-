import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/shopify/types';

interface ProductGridProps {
  products: Product[];
  priority?: boolean;
}

export function ProductGrid({ products, priority = false }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg font-medium mb-2">No encontramos productos</p>
        <p className="text-sm">Intenta con otra búsqueda o categoría</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={priority && i < 4}
        />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
          <div className="aspect-[4/5] skeleton" />
          <div className="p-3 space-y-2">
            <div className="h-3 skeleton rounded w-1/3" />
            <div className="h-4 skeleton rounded w-3/4" />
            <div className="h-4 skeleton rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
