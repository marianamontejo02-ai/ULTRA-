import Link from 'next/link';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface BrandFilterProps {
  brands: string[];
  active: string;
  collectionHandle: string;
  sortParam: string;
}

export function BrandFilter({ brands, active, collectionHandle, sortParam }: BrandFilterProps) {
  if (!brands.length) return null;

  const baseHref = (marca?: string) => {
    const params = new URLSearchParams();
    if (sortParam && sortParam !== 'BEST_SELLING') params.set('sort', sortParam);
    if (marca) params.set('marca', marca);
    const qs = params.toString();
    return `/colecciones/${collectionHandle}${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="mb-7">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
          Marca:
        </span>

        {/* "Todas" pill */}
        <Link
          href={baseHref()}
          className={cn(
            'px-4 py-1.5 rounded-full text-sm font-medium border transition-all',
            !active
              ? 'bg-ultra-500 text-white border-ultra-500'
              : 'border-gray-200 text-gray-600 hover:border-ultra-300 hover:text-ultra-600 bg-white'
          )}
        >
          Todas
        </Link>

        {brands.map((brand) => (
          <Link
            key={brand}
            href={baseHref(brand)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-all',
              active === brand
                ? 'bg-ultra-500 text-white border-ultra-500'
                : 'border-gray-200 text-gray-600 hover:border-ultra-300 hover:text-ultra-600 bg-white'
            )}
          >
            {brand}
          </Link>
        ))}

        {/* Clear filter chip */}
        {active && (
          <Link
            href={baseHref()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors border border-gray-200"
          >
            <X size={11} />
            Limpiar filtro
          </Link>
        )}
      </div>
    </div>
  );
}
