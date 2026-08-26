import api from './api';
import {ApiResponse} from '../types';
import {Order} from '../types/order';

export const paymentService = {
  async confirmPayment(orderId: number): Promise<Order> {
    const {data} = await api.post<ApiResponse<Order>>('/payments/confirm', {
      order_id: orderId,
    });
    return data.data;
  },
};
