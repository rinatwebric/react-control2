import { api } from '@/shared/api';
import { CATEGORY_MAP } from '../lib/getCategoryName';

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  const data = response.data || [];
  return data
    .map((cat) => ({
      ...cat,
      name: CATEGORY_MAP[cat.id] || cat.name,
    }))
    .filter((cat) => {
      if (CATEGORY_MAP[cat.id]) return true;
      return cat.name && !/^[a-zA-Z0-9]{8,}$/.test(cat.name) && cat.name.length < 25;
    });
};

export const createProduct = async (data) => {
  const response = await api.post('/products/', data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
