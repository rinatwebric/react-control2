import type { Product } from '@/entities/product';
import { useCartStore } from '../model/useCartStore';
import styles from './AddToCartButton.module.css';

interface AddToCartButtonProps {
  product: Product;
}

export const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <button
      onClick={() => addToCart(product)}
      className={styles.button}
    >
      В корзину
    </button>
  );
};
