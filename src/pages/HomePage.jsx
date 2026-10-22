import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../api/products';
import { ProductCard } from '../components/ProductCard';

const LIMIT = 12;

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const title = searchParams.get('title') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const price_min = searchParams.get('price_min') || '';
  const price_max = searchParams.get('price_max') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data || []))
      .catch((err) => console.error('Ошибка загрузки категорий:', err));
  }, []);

  const updateParam = (key, value, resetPage = true) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    if (resetPage) {
      nextParams.set('page', '1');
    }

    setSearchParams(nextParams);
  };

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        setError(null);

        const offset = (page - 1) * LIMIT;
        const params = {
          limit: LIMIT,
          offset,
        };

        if (title.trim()) params.title = title.trim();
        if (categoryId) params.categoryId = categoryId;
        if (price_min) params.price_min = price_min;
        if (price_max) params.price_max = price_max;

        const data = await getProducts(params);
        setProducts(data || []);
      } catch (err) {
        setError('Не удалось загрузить товары');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [title, categoryId, price_min, price_max, page]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'asc') return a.price - b.price;
    if (sort === 'desc') return b.price - a.price;
    return 0;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '28px', color: '#111827', marginBottom: '20px' }}>
        Каталог товаров
      </h1>

      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '12px', 
          padding: '16px', 
          backgroundColor: '#f9fafb', 
          borderRadius: '10px', 
          border: '1px solid #e5e7eb',
          marginBottom: '24px' 
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
            Поиск
          </label>
          <input
            type="text"
            placeholder="Название товара..."
            value={title}
            onChange={(e) => updateParam('title', e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
            Категория
          </label>
          <select
            value={categoryId}
            onChange={(e) => updateParam('categoryId', e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', backgroundColor: '#fff' }}
          >
            <option value="">Все категории</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
            Цена от ($)
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={price_min}
            onChange={(e) => updateParam('price_min', e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
            Цена до ($)
          </label>
          <input
            type="number"
            min="0"
            placeholder="1000"
            value={price_max}
            onChange={(e) => updateParam('price_max', e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
            Сортировка
          </label>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value, false)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', backgroundColor: '#fff' }}
          >
            <option value="">По умолчанию</option>
            <option value="asc">Сначала дешевые</option>
            <option value="desc">Сначала дорогие</option>
          </select>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <h2>Загрузка товаров...</h2>
        </div>
      )}

      {error && !loading && (
        <div style={{ textAlign: 'center', padding: '30px', color: '#dc2626' }}>
          <h2>{error}</h2>
        </div>
      )}

      {!loading && !error && sortedProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: '#6b7280' }}>
          <h3>Товары не найдены. Попробуйте сбросить фильтры.</h3>
          <button
            onClick={() => setSearchParams({ page: '1' })}
            style={{ marginTop: '12px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer' }}
          >
            Сбросить фильтры
          </button>
        </div>
      )}

      {!loading && !error && sortedProducts.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '36px' }}>
            <button
              disabled={page <= 1}
              onClick={() => updateParam('page', String(page - 1), false)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                backgroundColor: page <= 1 ? '#f3f4f6' : '#fff',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                color: page <= 1 ? '#9ca3af' : '#111827'
              }}
            >
              ← Назад
            </button>

            <span style={{ fontWeight: '500', fontSize: '15px' }}>
              Страница {page}
            </span>

            <button
              disabled={products.length < LIMIT}
              onClick={() => updateParam('page', String(page + 1), false)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                backgroundColor: products.length < LIMIT ? '#f3f4f6' : '#fff',
                cursor: products.length < LIMIT ? 'not-allowed' : 'pointer',
                color: products.length < LIMIT ? '#9ca3af' : '#111827'
              }}
            >
              Вперед →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
