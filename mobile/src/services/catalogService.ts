import api from './api';
import {Category, PaginatedResponse, Product, ProductFilters} from '../types';

export const catalogService = {
  async getCategories(): Promise<Category[]> {
    const {data} = await api.get<{data: Category[]}>('/categories');
    return data.data;
  },

  async getProducts(
    filters: ProductFilters & {page?: number},
  ): Promise<PaginatedResponse<Product>> {
    const {data} = await api.get<PaginatedResponse<Product>>('/products', {
      params: filters,
    });
    return data;
  },

  async getProduct(id: number): Promise<Product> {
    const {data} = await api.get<{data: Product}>(`/products/${id}`);
    return data.data;
  },
};
