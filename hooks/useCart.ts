'use client';

import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import {
  createCart,
  getCart,
  addToCart,
  updateCartLine,
  removeFromCart,
} from '@/lib/shopify/queries';

export function useCart() {
  const { cart, cartId, setCart, setCartId, setLoading, openCart } = useCartStore();

  const ensureCart = useCallback(async (): Promise<string> => {
    if (cartId) {
      try {
        const existingCart = await getCart(cartId);
        if (existingCart) {
          setCart(existingCart);
          return cartId;
        }
      } catch {
        // Cart expired - create new one
      }
    }
    const newCart = await createCart();
    setCart(newCart);
    setCartId(newCart.id);
    return newCart.id;
  }, [cartId, setCart, setCartId]);

  const addItem = useCallback(
    async (merchandiseId: string, quantity = 1) => {
      setLoading(true);
      try {
        const id = await ensureCart();
        const updatedCart = await addToCart(id, [{ merchandiseId, quantity }]);
        setCart(updatedCart);
        openCart();
        toast.success('Producto agregado al carrito', {
          style: { background: '#FF6B35', color: '#fff', fontWeight: '600' },
          iconTheme: { primary: '#fff', secondary: '#FF6B35' },
        });
      } catch (err) {
        toast.error('No se pudo agregar el producto');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [ensureCart, setCart, setLoading, openCart]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cartId) return;
      setLoading(true);
      try {
        const updatedCart = await updateCartLine(cartId, lineId, quantity);
        setCart(updatedCart);
      } catch (err) {
        toast.error('Error al actualizar el carrito');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [cartId, setCart, setLoading]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cartId) return;
      setLoading(true);
      try {
        const updatedCart = await removeFromCart(cartId, [lineId]);
        setCart(updatedCart);
        toast.success('Producto eliminado');
      } catch (err) {
        toast.error('Error al eliminar el producto');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [cartId, setCart, setLoading]
  );

  return {
    cart,
    totalQuantity: cart?.totalQuantity ?? 0,
    addItem,
    updateItem,
    removeItem,
  };
}
