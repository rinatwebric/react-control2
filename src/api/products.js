import { api } from './client';

export const getProducts = async (params = {}, offset) => {
  let queryParams = params;
  if (typeof params === 'number') {
    queryParams = { limit: params, offset: offset || 0 };
  }
  const response = await api.get('/products', { params: queryParams });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
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
