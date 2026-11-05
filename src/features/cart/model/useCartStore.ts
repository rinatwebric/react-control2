import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/entities/product';

export interface CartItem extends Product { count: number }

interface CartStore {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  changeQuantity: (productId: number, amount: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        const { cart } = get();
        const exists = cart.some((item) => item.id === product.id);
        if (exists) {
          set({ cart: cart.map((item) => item.id === product.id ? { ...item, count: item.count + 1 } : item) });
        } else {
          set({ cart: [...cart, { ...product, count: 1 }] });
        }
      },
      removeFromCart: (productId) => set({ cart: get().cart.filter((item) => item.id !== productId) }),
      changeQuantity: (productId, amount) => {
        const updatedCart = get().cart.map((item) => {
          if (item.id === productId) {
            const newCount = item.count + amount;
            return newCount > 0 ? { ...item, count: newCount } : null;
          }
          return item;
        }).filter((item): item is CartItem => item !== null);
        set({ cart: updatedCart });
      },
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'cart-storage' },
  ),
);
