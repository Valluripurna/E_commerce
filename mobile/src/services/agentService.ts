import api from './api';

export interface DeliveryItem {
  id: number;
  order_id: number;
  agent_id: number;
  status: 'assigned' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'failed';
  notes?: string;
  assigned_at: string;
  picked_up_at?: string;
  delivered_at?: string;
  order: {
    id: number;
    order_number: string;
    total_amount: string | number;
    shipping_address: string;
    status: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
    items?: Array<{
      id: number;
      product_name: string;
      quantity: number;
      price: string | number;
    }>;
  };
}

export interface AgentDashboardData {
  agent: { id: number; name: string };
  stats: {
    total_assigned: number;
    pending: number;
    picked_up: number;
    delivered: number;
  };
  recent_deliveries: DeliveryItem[];
}

export const agentService = {
  getDashboard: async (): Promise<AgentDashboardData> => {
    const res = await api.get<AgentDashboardData>('/agent/dashboard');
    return res.data;
  },

  getDeliveries: async (status?: string, page = 1) => {
    const params: Record<string, any> = { page };
    if (status) params.status = status;
    const res = await api.get('/agent/deliveries', { params });
    return res.data;
  },

  updateDeliveryStatus: async (
    deliveryId: number,
    status: 'picked_up' | 'out_for_delivery' | 'delivered' | 'failed',
    notes?: string
  ) => {
    const res = await api.put(`/agent/deliveries/${deliveryId}/status`, {
      status,
      notes,
    });
    return res.data;
  },
};
