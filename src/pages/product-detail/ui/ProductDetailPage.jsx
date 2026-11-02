import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getProductById,
  deleteProduct,
  getCleanImageUrl,
  getCategoryName,
} from '@/entities/product';
import { useFavoritesStore } from '@/features/favorites';
import { useCartStore } from '@/features/cart';
import styles from './ProductDetailPage.module.css';

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
      } catch {
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
      <div className={styles.loading}>
        <h2>Загрузка товара...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.errorState}>
        <h2>{error || 'Товар не найден'}</h2>
        <button 
          onClick={() => navigate('/')}
          className={styles.backCatalogBtn}
        >
          Вернуться в каталог
        </button>
      </div>
    );
  }

  const imagesList = Array.isArray(product.images) ? product.images : [];
  const categoryName = getCategoryName(product.category);

  return (
    <div className={styles.container}>
      <button 
        onClick={() => navigate(-1)} 
        className={styles.backBtn}
      >
        ← Назад
      </button>

      <div className={styles.detailGrid}>
        <div className={styles.imageSection}>
          <div className={styles.mainImageWrapper}>
            <img 
              src={selectedImage || getCleanImageUrl(imagesList[0])} 
              alt={product.title} 
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image';
              }}
              className={styles.mainImage}
            />
          </div>

          {imagesList.length > 1 && (
            <div className={styles.thumbnails}>
              {imagesList.map((img, index) => {
                const cleanImg = getCleanImageUrl(img);
                const isSelected = selectedImage === cleanImg;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(cleanImg)}
                    className={`${styles.thumbBtn} ${isSelected ? styles.thumbBtnActive : ''}`}
                  >
                    <img 
                      src={cleanImg} 
                      alt={`preview-${index}`} 
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/100x100?text=No+Image';
                      }}
                      className={styles.thumbImg}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <div>
            {categoryName && (
              <span className={styles.category}>
                {categoryName}
              </span>
            )}

            <h1 className={styles.title}>
              {product.title}
            </h1>

            <p className={styles.price}>
              ${product.price}
            </p>

            <div className={styles.descriptionBlock}>
              <h3 className={styles.descHeading}>Описание</h3>
              <p className={styles.descText}>
                {product.description || 'Описание отсутствует.'}
              </p>
            </div>
          </div>

          <div className={styles.actionsBar}>
            <button
              onClick={() => addToCart(product)}
              className={styles.cartBtn}
            >
              В корзину
            </button>

            <button
              onClick={() => toggleFavorite(product)}
              className={`${styles.favBtn} ${isFavorite ? styles.favBtnActive : ''}`}
            >
              {isFavorite ? 'В избранном' : 'В избранное'}
            </button>

            <Link
              to={`/products/${product.id}/edit`}
              className={styles.editBtn}
            >
              Редактировать
            </Link>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={styles.deleteBtn}
            >
              {isDeleting ? 'Удаление...' : 'Удалить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
