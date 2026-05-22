'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart } from '@/lib/shopify/types';

interface CartStore {
  cart: Cart | null;
  cartId: string | null;
  isOpen: boolean;
  isLoading: boolean;

  setCart: (cart: Cart) => void;
  setCartId: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
  setLoading: (loading: boolean) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: null,
      cartId: null,
      isOpen: false,
      isLoading: false,

      setCart: (cart) => set({ cart }),
      setCartId: (id) => set({ cartId: id }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      clearCart: () => set({ cart: null, cartId: null }),
    }),
    {
      name: 'ultra-cart',
      partialize: (state) => ({ cartId: state.cartId }),
    }
  )
);
