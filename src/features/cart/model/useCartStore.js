import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        const { cart } = get();
        const exists = cart.some((item) => item.id === product.id);

        if (exists) {
          set({
            cart: cart.map((item) =>
              item.id === product.id ? { ...item, count: item.count + 1 } : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, count: 1 }] });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) });
      },

      changeQuantity: (productId, amount) => {
        const updatedCart = get()
          .cart.map((item) => {
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
