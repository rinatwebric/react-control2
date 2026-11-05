import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getProductById,
  createProduct,
  updateProduct,
  getCategories,
  getCleanImageUrl,
} from '@/entities/product';
import type { Category } from '@/entities/product';
import styles from './ProductFormPage.module.css';

interface ProductFormData {
  title: string;
  price: string;
  description: string;
  categoryId: string;
  imageUrl: string;
}

export const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    price: '',
    description: '',
    categoryId: '',
    imageUrl: '',
  });

  const [surname, setSurname] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats || []);

        if (isEditMode && id) {
          const product = await getProductById(id);
          const rawImg = Array.isArray(product.images) ? product.images[0] : '';
          setFormData({
            title: product.title || '',
            price: String(product.price || ''),
            description: product.description || '',
            categoryId: String(product.category?.id || cats[0]?.id || ''),
            imageUrl: getCleanImageUrl(rawImg) || '',
          });
        } else if (cats && cats.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: String(cats[0].id) }));
        }
      } catch {
        setError('Не удалось загрузить данные формы');
      } finally {
        setInitialLoading(false);
      }
    };

    init();
  }, [id, isEditMode]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    let finalTitle = formData.title.trim();
    if (!finalTitle) {
      setError('Укажите название товара');
      return;
    }

    if (surname.trim() && !finalTitle.toLowerCase().includes(surname.trim().toLowerCase())) {
      finalTitle = `${surname.trim()} ${finalTitle}`;
    }

    const priceNum = Number(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
      setError('Цена должна быть положительным числом');
      return;
    }

    const defaultImg = formData.imageUrl.trim() || 'https://placehold.co/600x400?text=Product+Image';
    const payload = {
      title: finalTitle,
      price: priceNum,
      description: formData.description.trim() || 'Описание товара',
      categoryId: Number(formData.categoryId) || (categories[0]?.id || 1),
      images: [defaultImg],
    };

    try {
      setLoading(true);
      if (isEditMode && id) {
        await updateProduct(id, payload);
        alert('Товар успешно обновлен!');
        navigate(`/products/${id}`);
      } else {
        const created = await createProduct(payload);
        alert('Товар успешно создан!');
        if (created?.id) {
          navigate(`/products/${created.id}`);
        } else {
          navigate('/');
        }
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message || err.message
        : 'Попробуйте позже';
      setError('Ошибка при сохранении: ' + message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className={styles.loading}>
        <h2>Загрузка данных товара...</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button 
        onClick={() => navigate(-1)} 
        className={styles.backBtn}
      >
        ← Назад
      </button>

      <h1 className={styles.title}>
        {isEditMode ? 'Редактировать товар' : 'Создать новый товар'}
      </h1>
      <p className={styles.subtitle}>
        Заполните форму ниже для {isEditMode ? 'изменения' : 'добавления'} товара в каталог.
      </p>

      {error && (
        <div className={styles.errorAlert}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Ваша фамилия (по требованию: обязательно в названии):
          </label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Например: Shadiev"
            className={styles.input}
          />
          <small className={styles.hint}>
            Будет автоматически добавлена к названию, если еще не указана в нем.
          </small>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Название товара *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Например: Shadiev Classic T-Shirt"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Цена ($) *
          </label>
          <input
            type="number"
            name="price"
            min="1"
            step="any"
            required
            value={formData.price}
            onChange={handleChange}
            placeholder="49"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Категория *
          </label>
          <select
            name="categoryId"
            required
            value={formData.categoryId}
            onChange={handleChange}
            className={styles.select}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Ссылка на изображение (URL)
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/photo-..."
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Описание товара
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Подробное описание товара..."
            className={styles.textarea}
          />
        </div>

        <div className={styles.buttonsRow}>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? 'Сохранение...' : (isEditMode ? 'Сохранить изменения' : 'Создать товар')}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.cancelBtn}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
