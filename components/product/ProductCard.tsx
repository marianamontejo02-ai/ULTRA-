'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/hooks/useCart';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/shopify/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const firstVariant = product.variantsList[0];
  const secondImage = product.imagesList[1];
  const hasDiscount = Boolean(
    firstVariant?.compareAtPrice &&
      parseFloat(firstVariant.compareAtPrice.amount) > parseFloat(firstVariant.price.amount)
  );
  const discountPct = firstVariant
    ? getDiscountPercentage(firstVariant.price, firstVariant?.compareAtPrice ?? null)
    : 0;

  const isNew = product.tags.includes('nuevo') || product.tags.includes('new');
  const isBestseller =
    product.tags.includes('bestseller') || product.tags.includes('mas-vendido');
  const isLowStock =
    firstVariant?.quantityAvailable !== null &&
    firstVariant?.quantityAvailable !== undefined &&
    firstVariant.quantityAvailable <= 5 &&
    firstVariant.quantityAvailable > 0;

  async function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant || !product.availableForSale) return;
    setIsAdding(true);
    await addItem(firstVariant.id, 1);
    setIsAdding(false);
  }

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-ultra-200 hover:shadow-lg transition-all duration-300">
      {/* Image area */}
      <Link href={`/producto/${product.handle}`} className="relative block aspect-[4/5] bg-nude-50 overflow-hidden product-image-hover">
        {product.featuredImage && (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover image-primary"
            priority={priority}
          />
        )}
        {secondImage && (
          <Image
            src={secondImage.url}
            alt={secondImage.altText || product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover image-secondary absolute inset-0"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {!product.availableForSale && (
            <Badge variant="soldout">Agotado</Badge>
          )}
          {discountPct > 0 && (
            <Badge variant="sale">-{discountPct}%</Badge>
          )}
          {isNew && !discountPct && (
            <Badge variant="new">Nuevo</Badge>
          )}
          {isBestseller && !isNew && !discountPct && (
            <Badge variant="bestseller">⭐ Top ventas</Badge>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Agregar a favoritos"
        >
          <Heart
            size={15}
            className={cn(
              'transition-colors',
              isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-600'
            )}
          />
        </button>

        {/* Quick add button */}
        {product.availableForSale && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="w-full py-3 bg-gray-900/90 backdrop-blur-sm text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-ultra-gradient transition-colors disabled:opacity-70"
            >
              {isAdding ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Agregando...
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  Agregar al carrito
                </>
              )}
            </button>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[11px] font-semibold text-ultra-500 uppercase tracking-wider truncate mb-0.5">
          {product.vendor}
        </p>
        <Link
          href={`/producto/${product.handle}`}
          className="text-sm font-medium text-gray-800 hover:text-ultra-600 transition-colors line-clamp-2 leading-snug mb-2"
        >
          {product.title}
        </Link>

        {/* Low stock indicator */}
        {isLowStock && (
          <p className="text-[11px] text-orange-500 font-medium mb-1.5">
            ¡Solo quedan {firstVariant?.quantityAvailable}!
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          <span className={cn('text-base font-bold', hasDiscount ? 'text-red-600' : 'text-gray-900')}>
            {firstVariant && formatPrice(firstVariant.price)}
          </span>
          {hasDiscount && firstVariant?.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(firstVariant.compareAtPrice)}
            </span>
          )}
          {!product.availableForSale && (
            <span className="text-sm text-gray-400">Agotado</span>
          )}
        </div>
      </div>
    </div>
  );
}
