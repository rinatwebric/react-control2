import { Link } from 'react-router-dom';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useCartStore } from '../store/useCartStore';

export const getCleanImageUrl = (url) => {
  if (!url) return 'https://placehold.co/400x300?text=No+Image';
  try {
    const clean = url.replace(/^[\["']+|[\]"']+$/g, '');
    if (!clean.startsWith('http')) return 'https://placehold.co/400x300?text=No+Image';
    return clean;
  } catch {
    return 'https://placehold.co/400x300?text=No+Image';
  }
};

export const ProductCard = ({ product }) => {
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id));
  const addToCart = useCartStore((state) => state.addToCart);

  const rawImage = Array.isArray(product.images) ? product.images[0] : product.images;
  const imageUrl = getCleanImageUrl(rawImage);

  return (
    <div 
      className="product-card" 
      style={{ 
        border: '1px solid #e5e7eb', 
        padding: '16px', 
        borderRadius: '12px', 
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
      }}
    >
      <div>
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <img 
            src={imageUrl} 
            alt={product.title} 
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/400x300?text=No+Image';
            }}
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} 
          />
          {product.category?.name && (
            <span style={{ 
              display: 'inline-block', 
              marginTop: '10px', 
              fontSize: '12px', 
              color: '#6b7280', 
              background: '#f3f4f6', 
              padding: '2px 8px', 
              borderRadius: '4px' 
            }}>
              {product.category.name}
            </span>
          )}
          <h3 style={{ margin: '8px 0', fontSize: '16px', fontWeight: '600', color: '#111827', minHeight: '44px' }}>
            {product.title}
          </h3>
        </Link>
        <p style={{ fontSize: '18px', fontWeight: '700', color: '#059669', margin: '4px 0 12px 0' }}>
          ${product.price}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
        <Link 
          to={`/products/${product.id}`}
          style={{ 
            textDecoration: 'none', 
            padding: '6px 10px', 
            border: '1px solid #d1d5db', 
            borderRadius: '6px', 
            fontSize: '13px', 
            color: '#374151' 
          }}
        >
          Подробнее
        </Link>

        <button 
          onClick={() => toggleFavorite(product)}
          style={{ 
            padding: '6px 10px', 
            border: '1px solid #d1d5db', 
            borderRadius: '6px', 
            background: isFavorite ? '#fee2e2' : '#f9fafb', 
            cursor: 'pointer',
            fontSize: '13px',
            color: isFavorite ? '#dc2626' : '#374151'
          }}
        >
          {isFavorite ? 'В избранном' : 'В избранное'}
        </button>

        <button 
          onClick={() => addToCart(product)}
          style={{ 
            flex: 1,
            padding: '6px 12px', 
            border: 'none', 
            borderRadius: '6px', 
            background: '#2563eb', 
            color: '#fff', 
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500'
          }}
        >
          В корзину
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
