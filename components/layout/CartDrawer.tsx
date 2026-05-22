'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Truck, Shield, RefreshCw } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

const FREE_SHIPPING_THRESHOLD = 150000;

export function CartDrawer() {
  const { isOpen, cart, closeCart } = useCartStore();
  const { updateItem, removeItem } = useCart();

  const subtotalAmount = cart ? parseFloat(cart.subtotal.amount) : 0;
  const shippingProgress = Math.min((subtotalAmount / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotalAmount;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 cart-backdrop"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-ultra-500" size={20} />
            <h2 className="font-semibold text-gray-900">
              Mi carrito
              {cart?.totalQuantity ? (
                <span className="ml-2 text-sm text-ultra-500 font-normal">
                  ({cart.totalQuantity} {cart.totalQuantity === 1 ? 'producto' : 'productos'})
                </span>
              ) : null}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free shipping bar */}
        <div className="px-5 py-3 bg-ultra-50 border-b border-ultra-100">
          {shippingProgress >= 100 ? (
            <p className="text-sm font-medium text-ultra-700 flex items-center gap-2">
              <Truck size={16} />
              ¡Tienes envío gratis! 🎉
            </p>
          ) : (
            <>
              <p className="text-xs text-gray-600 mb-1.5">
                Te faltan{' '}
                <span className="font-semibold text-ultra-600">
                  {formatPrice({ amount: String(remaining), currencyCode: cart?.subtotal.currencyCode || 'COP' })}
                </span>{' '}
                para envío gratis
              </p>
              <div className="w-full bg-ultra-100 rounded-full h-2">
                <div
                  className="bg-ultra-gradient h-2 rounded-full transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </>
          )}
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {!cart?.items.length ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag size={48} className="text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium mb-1">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400 mb-6">Agrega productos y vuelve aquí</p>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 bg-ultra-gradient text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                Ver productos
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.lineId} className="flex gap-3 animate-fade-in">
                {/* Image */}
                <Link
                  href={`/producto/${item.productHandle}`}
                  onClick={closeCart}
                  className="flex-shrink-0 w-20 h-20 bg-nude-50 rounded-xl overflow-hidden border border-gray-100"
                >
                  {item.image ? (
                    <Image
                      src={item.image.url}
                      alt={item.image.altText || item.productTitle}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={24} className="text-gray-300" />
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ultra-600 font-medium uppercase tracking-wide truncate">
                    {item.vendor}
                  </p>
                  <Link
                    href={`/producto/${item.productHandle}`}
                    onClick={closeCart}
                    className="text-sm font-medium text-gray-800 hover:text-ultra-600 line-clamp-2 leading-tight"
                  >
                    {item.productTitle}
                  </Link>
                  {item.selectedOptions.some((o) => o.value !== 'Default Title') && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.selectedOptions
                        .filter((o) => o.value !== 'Default Title')
                        .map((o) => o.value)
                        .join(' / ')}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity */}
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? updateItem(item.lineId, item.quantity - 1)
                            : removeItem(item.lineId)
                        }
                        className="p-1.5 hover:bg-gray-100 transition-colors text-gray-600"
                        aria-label="Reducir cantidad"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2 text-sm font-medium text-gray-800 min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItem(item.lineId, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-100 transition-colors text-gray-600"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {formatPrice(item.price)}
                      </p>
                      {item.compareAtPrice &&
                        parseFloat(item.compareAtPrice.amount) > parseFloat(item.price.amount) && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatPrice(item.compareAtPrice)}
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.lineId)}
                  className="self-start p-1 text-gray-300 hover:text-red-400 transition-colors"
                  aria-label="Eliminar producto"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart?.items.length ? (
          <div className="border-t border-gray-100 px-5 py-5 space-y-4 bg-gray-50/50">
            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Shield size={13} className="text-ultra-500" /> Pago seguro
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw size={13} className="text-ultra-500" /> Devoluciones fáciles
              </span>
              <span className="flex items-center gap-1">
                <Truck size={13} className="text-ultra-500" /> Envío a Colombia
              </span>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="font-bold text-lg text-gray-900">
                {cart.subtotal && formatPrice(cart.subtotal)}
              </span>
            </div>
            <p className="text-xs text-gray-400 -mt-2">
              Impuestos e envío calculados al finalizar el pedido
            </p>

            {/* CTA */}
            <a
              href={cart.checkoutUrl}
              className="block w-full py-4 bg-ultra-gradient text-white text-center font-bold text-base rounded-xl hover:opacity-95 transition-opacity ultra-shadow"
            >
              Finalizar compra
            </a>
            <button
              onClick={closeCart}
              className="block w-full py-2.5 text-sm text-gray-600 hover:text-ultra-600 transition-colors font-medium"
            >
              Seguir comprando
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
