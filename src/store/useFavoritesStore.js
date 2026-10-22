import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (product) => {
        const { favorites } = get();
        const exists = favorites.some((item) => item.id === product.id);

        if (exists) {
          set({ favorites: favorites.filter((item) => item.id !== product.id) });
        } else {
          set({ favorites: [...favorites, product] });
        }
      },

      isFavorite: (productId) => {
        return get().favorites.some((item) => item.id === productId);
      },
    }),
    {
      name: 'favorites-storage', 
    }
  )
);