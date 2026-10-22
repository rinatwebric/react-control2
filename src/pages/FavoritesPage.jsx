import { Link } from 'react-router-dom';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { ProductCard } from '../components/ProductCard';

export const FavoritesPage = () => {
  const favorites = useFavoritesStore((state) => state.favorites);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', margin: 0, color: '#111827' }}>Избранные товары</h1>
        {favorites.length > 0 && (
          <span style={{ fontSize: '15px', color: '#6b7280' }}>
            Всего: {favorites.length}
          </span>
        )}
      </div>

      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
          <p style={{ fontSize: '20px', color: '#4b5563', marginBottom: '16px' }}>
            В избранном пока ничего нет 🤍
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Перейти к каталогу
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
