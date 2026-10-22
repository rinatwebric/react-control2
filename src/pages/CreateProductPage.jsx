import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, createProduct, updateProduct, getCategories } from '../api/products';
import { getCleanImageUrl } from '../components/ProductCard';

export const CreateProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    categoryId: '',
    imageUrl: '',
  });

  const [surname, setSurname] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats || []);

        if (isEditMode) {
          const product = await getProductById(id);
          const rawImg = Array.isArray(product.images) ? product.images[0] : '';
          setFormData({
            title: product.title || '',
            price: product.price || '',
            description: product.description || '',
            categoryId: product.category?.id || (cats[0]?.id || ''),
            imageUrl: getCleanImageUrl(rawImg) || '',
          });
        } else if (cats && cats.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: cats[0].id }));
        }
      } catch (err) {
        setError('Не удалось загрузить данные формы');
      } finally {
        setInitialLoading(false);
      }
    };

    init();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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
      if (isEditMode) {
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
    } catch (err) {
      setError('Ошибка при сохранении: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Загрузка данных товара...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', margin: '20px auto', padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '16px', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '14px' }}
      >
        ← Назад
      </button>

      <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#111827' }}>
        {isEditMode ? 'Редактировать товар' : 'Создать новый товар'}
      </h1>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
        Заполните форму ниже для {isEditMode ? 'изменения' : 'добавления'} товара в каталог.
      </p>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
            Ваша фамилия (по требованию: обязательно в названии):
          </label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Например: Shadiev"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
          />
          <small style={{ color: '#6b7280', fontSize: '12px' }}>
            Будет автоматически добавлена к названию, если еще не указана в нем.
          </small>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
            Название товара *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Например: Shadiev Classic T-Shirt"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
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
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
            Категория *
          </label>
          <select
            name="categoryId"
            required
            value={formData.categoryId}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#fff' }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
            Ссылка на изображение (URL)
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/photo-..."
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
            Описание товара
          </label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Подробное описание товара..."
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Сохранение...' : (isEditMode ? 'Сохранить изменения' : 'Создать товар')}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: '12px 20px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;
