import type { Product } from '@/entities/product';
import { useFavoritesStore } from '../model/useFavoritesStore';
import styles from './ToggleFavoriteButton.module.css';

interface ToggleFavoriteButtonProps {
  product: Product;
}

export const ToggleFavoriteButton = ({ product }: ToggleFavoriteButtonProps) => {
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id));

  return (
    <button
      onClick={() => toggleFavorite(product)}
      className={`${styles.button} ${isFavorite ? styles.buttonActive : ''}`}
    >
      {isFavorite ? 'В избранном' : 'В избранное'}
    </button>
  );
};
