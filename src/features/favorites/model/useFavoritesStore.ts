import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/entities/product';

interface FavoritesStore {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (product) => {
        const { favorites } = get();
        const exists = favorites.some((item) => item.id === product.id);
        if (exists) set({ favorites: favorites.filter((item) => item.id !== product.id) });
        else set({ favorites: [...favorites, product] });
      },
      isFavorite: (productId) => get().favorites.some((item) => item.id === productId),
    }),
    { name: 'favorites-storage' },
  ),
);
