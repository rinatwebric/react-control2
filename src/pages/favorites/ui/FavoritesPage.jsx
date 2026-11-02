import { Link } from 'react-router-dom';
import { useFavoritesStore } from '@/features/favorites';
import { ProductGrid } from '@/widgets/product-grid';
import styles from './FavoritesPage.module.css';

export const FavoritesPage = () => {
  const favorites = useFavoritesStore((state) => state.favorites);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Избранные товары</h1>
        {favorites.length > 0 && (
          <span className={styles.totalCount}>
            Всего: {favorites.length}
          </span>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            В избранном пока ничего нет
          </p>
          <Link
            to="/"
            className={styles.catalogBtn}
          >
            Перейти к каталогу
          </Link>
        </div>
      ) : (
        <ProductGrid products={favorites} />
      )}
    </div>
  );
};
