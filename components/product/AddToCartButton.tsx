'use client';

import { useState } from 'react';
import { ShoppingBag, Zap } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  variantId: string;
  available: boolean;
  checkoutUrl?: string;
  className?: string;
}

export function AddToCartButton({
  variantId,
  available,
  checkoutUrl,
  className,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  async function handleAddToCart() {
    if (!available || loading) return;
    setLoading(true);
    await addItem(variantId, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setLoading(false);
  }

  if (!available) {
    return (
      <button
        disabled
        className={cn(
          'w-full py-4 rounded-2xl font-bold text-base bg-gray-200 text-gray-500 cursor-not-allowed',
          className
        )}
      >
        Producto agotado
      </button>
    );
  }

  return (
    <div className={cn('flex flex-col sm:flex-row gap-3', className)}>
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-[0.98]',
          added
            ? 'bg-emerald-500 text-white'
            : 'bg-ultra-gradient text-white hover:opacity-90 ultra-shadow hover:ultra-shadow-lg'
        )}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Agregando...
          </>
        ) : added ? (
          '¡Agregado al carrito! ✓'
        ) : (
          <>
            <ShoppingBag size={20} />
            Agregar al carrito
          </>
        )}
      </button>

      {checkoutUrl && (
        <a
          href={checkoutUrl}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base bg-gray-900 text-white hover:bg-gray-800 transition-colors active:scale-[0.98]"
        >
          <Zap size={18} />
          Comprar ahora
        </a>
      )}
    </div>
  );
}
