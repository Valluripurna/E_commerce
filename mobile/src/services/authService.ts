import api, {setAuthToken} from './api';
import {AuthResponse, User} from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const {data} = await api.post<AuthResponse>('/login', payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const {data} = await api.post<AuthResponse>('/register', payload);
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/logout');
  },

  async fetchMe(): Promise<User> {
    const {data} = await api.get<{data: User}>('/me');
    return data.data;
  },

  applyToken(token: string | null): void {
    setAuthToken(token);
  },
};
