import api from './api';
import {PaginatedResponse} from '../types';
import {Order, PlaceOrderPayload, PlaceOrderResponse} from '../types/order';

export const orderService = {
  async getOrders(page = 1): Promise<PaginatedResponse<Order>> {
    const {data} = await api.get<PaginatedResponse<Order>>('/orders', {
      params: {page},
    });
    return data;
  },

  async getOrder(orderId: number): Promise<Order> {
    const {data} = await api.get<{data: Order}>(`/orders/${orderId}`);
    return data.data;
  },

  async placeOrder(payload: PlaceOrderPayload): Promise<PlaceOrderResponse> {
    const {data} = await api.post<PlaceOrderResponse>('/orders', payload);
    return data;
  },
};
