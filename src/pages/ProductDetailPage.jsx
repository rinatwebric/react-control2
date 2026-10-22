import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, deleteProduct } from '../api/products';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useCartStore } from '../store/useCartStore';
import { getCleanImageUrl } from '../components/ProductCard';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(Number(id)));
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(id);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(getCleanImageUrl(data.images[0]));
        }
      } catch (err) {
        setError('Не удалось загрузить данные о товаре');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить этот товар?');
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteProduct(id);
      alert('Товар успешно удален!');
      navigate('/');
    } catch (err) {
      alert('Ошибка при удалении товара: ' + (err.message || 'Попробуйте позже'));
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Загрузка товара...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>{error || 'Товар не найден'}</h2>
        <button 
          onClick={() => navigate('/')}
          style={{ marginTop: '16px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer' }}
        >
          Вернуться в каталог
        </button>
      </div>
    );
  }

  const imagesList = Array.isArray(product.images) ? product.images : [];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '15px' }}
      >
        ← Назад
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>
        {/* Галерея изображений */}
        <div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f9fafb' }}>
            <img 
              src={selectedImage || getCleanImageUrl(imagesList[0])} 
              alt={product.title} 
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image';
              }}
              style={{ width: '100%', height: '380px', objectFit: 'contain', display: 'block' }}
            />
          </div>

          {imagesList.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {imagesList.map((img, index) => {
                const cleanImg = getCleanImageUrl(img);
                const isSelected = selectedImage === cleanImg;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(cleanImg)}
                    style={{
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '2px',
                      background: '#fff',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <img 
                      src={cleanImg} 
                      alt={`preview-${index}`} 
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/100x100?text=No+Image';
                      }}
                      style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Информация о товаре */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {product.category?.name && (
              <span style={{ 
                display: 'inline-block', 
                fontSize: '13px', 
                color: '#4b5563', 
                background: '#f3f4f6', 
                padding: '4px 10px', 
                borderRadius: '6px',
                marginBottom: '8px' 
              }}>
                {product.category.name}
              </span>
            )}

            <h1 style={{ fontSize: '26px', margin: '8px 0 16px 0', color: '#111827' }}>
              {product.title}
            </h1>

            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', margin: '0 0 20px 0' }}>
              ${product.price}
            </p>

            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', color: '#374151', marginBottom: '8px' }}>Описание</h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '15px' }}>
                {product.description || 'Описание отсутствует.'}
              </p>
            </div>
          </div>

          {/* Кнопки действий */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
            <button
              onClick={() => addToCart(product)}
              style={{
                flex: '1 1 180px',
                padding: '12px 20px',
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              В корзину
            </button>

            <button
              onClick={() => toggleFavorite(product)}
              style={{
                padding: '12px 18px',
                backgroundColor: isFavorite ? '#fee2e2' : '#f9fafb',
                color: isFavorite ? '#dc2626' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              {isFavorite ? '❤️ В избранном' : '🤍 В избранное'}
            </button>

            <Link
              to={`/products/${product.id}/edit`}
              style={{
                padding: '12px 18px',
                backgroundColor: '#f3f4f6',
                color: '#1f2937',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '15px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              ✏️ Редактировать
            </Link>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                padding: '12px 18px',
                backgroundColor: '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                cursor: isDeleting ? 'not-allowed' : 'pointer'
              }}
            >
              {isDeleting ? 'Удаление...' : '🗑️ Удалить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

