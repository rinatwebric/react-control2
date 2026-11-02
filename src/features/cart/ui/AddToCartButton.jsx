import { useCartStore } from '../model/useCartStore';
import styles from './AddToCartButton.module.css';

export const AddToCartButton = ({ product }) => {
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
