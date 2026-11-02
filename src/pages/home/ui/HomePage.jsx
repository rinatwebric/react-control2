import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '@/entities/product';
import { ProductGrid } from '@/widgets/product-grid';
import styles from './HomePage.module.css';

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
      } catch {
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
    <div className={styles.container}>
      <h1 className={styles.title}>
        Каталог товаров
      </h1>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            Поиск
          </label>
          <input
            type="text"
            placeholder="Название товара..."
            value={title}
            onChange={(e) => updateParam('title', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            Категория
          </label>
          <select
            value={categoryId}
            onChange={(e) => updateParam('categoryId', e.target.value)}
            className={styles.select}
          >
            <option value="">Все категории</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            Цена от ($)
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={price_min}
            onChange={(e) => updateParam('price_min', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            Цена до ($)
          </label>
          <input
            type="number"
            min="0"
            placeholder="1000"
            value={price_max}
            onChange={(e) => updateParam('price_max', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            Сортировка
          </label>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value, false)}
            className={styles.select}
          >
            <option value="">По умолчанию</option>
            <option value="asc">Сначала дешевые</option>
            <option value="desc">Сначала дорогие</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className={styles.loading}>
          <h2>Загрузка товаров...</h2>
        </div>
      )}

      {error && !loading && (
        <div className={styles.error}>
          <h2>{error}</h2>
        </div>
      )}

      {!loading && !error && sortedProducts.length === 0 && (
        <div className={styles.emptyState}>
          <h3>Товары не найдены. Попробуйте сбросить фильтры.</h3>
          <button
            onClick={() => setSearchParams({ page: '1' })}
            className={styles.resetBtn}
          >
            Сбросить фильтры
          </button>
        </div>
      )}

      {!loading && !error && sortedProducts.length > 0 && (
        <>
          <ProductGrid products={sortedProducts} />

          <div className={styles.pagination}>
            <button
              disabled={page <= 1}
              onClick={() => updateParam('page', String(page - 1), false)}
              className={styles.pageBtn}
            >
              ← Назад
            </button>

            <span className={styles.pageInfo}>
              Страница {page}
            </span>

            <button
              disabled={products.length < LIMIT}
              onClick={() => updateParam('page', String(page + 1), false)}
              className={styles.pageBtn}
            >
              Вперед →
            </button>
          </div>
        </>
      )}
    </div>
  );
};
