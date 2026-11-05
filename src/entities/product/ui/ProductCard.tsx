import { Link } from 'react-router-dom';
import { getCleanImageUrl } from '../lib/getCleanImageUrl';
import { getCategoryName } from '../lib/getCategoryName';
import type { ReactNode } from 'react';
import type { Product } from '../model/types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  actions?: ReactNode;
}

export const ProductCard = ({ product, actions }: ProductCardProps) => {
  const rawImage = product.images[0];
  const imageUrl = getCleanImageUrl(rawImage);
  const categoryName = getCategoryName(product.category);

  return (
    <div className={styles.card}>
      <div>
        <Link to={`/products/${product.id}`} className={styles.contentLink}>
          <img
            src={imageUrl}
            alt={product.title}
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/400x300?text=No+Image';
            }}
            className={styles.image}
          />
          {categoryName && (
            <span className={styles.category}>
              {categoryName}
            </span>
          )}
          <h3 className={styles.title}>
            {product.title}
          </h3>
        </Link>
        <p className={styles.price}>
          ${product.price}
        </p>
      </div>

      <div className={styles.actions}>
        <Link to={`/products/${product.id}`} className={styles.detailsBtn}>
          Подробнее
        </Link>
        {actions}
      </div>
    </div>
  );
};
