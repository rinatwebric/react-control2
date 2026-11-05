export interface Category {
  id: number;
  name: string;
  image?: string;
  slug?: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
}

export interface ProductsQuery {
  limit: number;
  offset: number;
  title?: string;
  categoryId?: string;
  price_min?: string;
  price_max?: string;
}

export interface ProductPayload {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}
