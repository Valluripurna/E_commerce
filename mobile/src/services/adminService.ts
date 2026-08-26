import api from './api';

export interface AdminMetrics {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_agents: number;
}

export interface AdminDashboardData {
  metrics: AdminMetrics;
  orders_by_status: Record<string, number>;
  recent_orders: Array<{
    id: number;
    order_number: string;
    total_amount: string | number;
    status: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
    created_at: string;
  }>;
}

export interface UserItem {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'agent';
  phone?: string;
}

export const adminService = {
  getDashboard: async (): Promise<AdminDashboardData> => {
    const res = await api.get<AdminDashboardData>('/admin/dashboard');
    return res.data;
  },

  getOrders: async (status?: string, page = 1) => {
    const params: Record<string, any> = { page };
    if (status) params.status = status;
    const res = await api.get('/admin/orders', { params });
    return res.data;
  },

  assignAgent: async (orderId: number, agentId: number, notes?: string) => {
    const res = await api.put(`/admin/orders/${orderId}/assign-agent`, {
      agent_id: agentId,
      notes,
    });
    return res.data;
  },

  getUsers: async (role?: string, page = 1) => {
    const params: Record<string, any> = { page };
    if (role) params.role = role;
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'agent' | 'customer';
    phone?: string;
  }) => {
    const res = await api.post('/admin/users', userData);
    return res.data;
  },
};
