import api from './api';
import {ApiResponse, Wishlist} from '../types';

export const wishlistService = {
  async getWishlist(): Promise<Wishlist> {
    const {data} = await api.get<{data: Wishlist}>('/wishlist');
    return data.data;
  },

  async addItem(productId: number): Promise<Wishlist> {
    const {data} = await api.post<ApiResponse<Wishlist>>('/wishlist/items', {
      product_id: productId,
    });
    return data.data;
  },

  async removeItem(itemId: number): Promise<Wishlist> {
    const {data} = await api.delete<ApiResponse<Wishlist>>(
      `/wishlist/items/${itemId}`,
    );
    return data.data;
  },
};
