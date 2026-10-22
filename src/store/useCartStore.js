import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        const { cart } = get();
        const existingIndex = cart.findIndex((item) => item.id === product.id);

        if (existingIndex > -1) {
          const updatedCart = [...cart];
          updatedCart[existingIndex].count += 1;
          set({ cart: updatedCart });
        } else {
          set({ cart: [...cart, { ...product, count: 1 }] });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) });
      },

      changeQuantity: (productId, amount) => {
        const { cart } = get();
        const updatedCart = cart
          .map((item) => {
            if (item.id === productId) {
              const newCount = item.count + amount;
              return newCount > 0 ? { ...item, count: newCount } : null;
            }
            return item;
          })
          .filter(Boolean); 

        set({ cart: updatedCart });
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);