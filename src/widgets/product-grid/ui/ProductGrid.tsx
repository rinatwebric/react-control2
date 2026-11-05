import { ProductCard } from '@/entities/product';
import type { Product } from '@/entities/product';
import { AddToCartButton } from '@/features/cart';
import { ToggleFavoriteButton } from '@/features/favorites';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          actions={
            <>
              <ToggleFavoriteButton product={product} />
              <AddToCartButton product={product} />
            </>
          }
        />
      ))}
    </div>
  );
};
