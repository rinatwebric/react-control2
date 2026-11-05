import { api } from '@/shared/api';
import type { Category, Product, ProductPayload, ProductsQuery } from '../model/types';
import { CATEGORY_MAP } from '../lib/getCategoryName';

export const getProducts = async (params?: ProductsQuery): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products', { params });
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/categories');
  const data = response.data || [];
  return data
    .map((cat) => ({ ...cat, name: CATEGORY_MAP[cat.id] || cat.name }))
    .filter((cat) => {
      if (CATEGORY_MAP[cat.id]) return true;
      return cat.name && !/^[a-zA-Z0-9]{8,}$/.test(cat.name) && cat.name.length < 25;
    });
};

export const createProduct = async (data: ProductPayload): Promise<Product> => {
  const response = await api.post<Product>('/products/', data);
  return response.data;
};

export const updateProduct = async (id: string, data: ProductPayload): Promise<Product> => {
  const response = await api.put<Product>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};
