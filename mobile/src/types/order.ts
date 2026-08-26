export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderPayment {
  id: number;
  order_id: number;
  transaction_id?: string | null;
  payment_method: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paid_at?: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  shipping_address: string;
  billing_address?: string | null;
  customer_notes?: string | null;
  placed_at?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  items?: OrderItem[];
  payment?: OrderPayment;
  created_at?: string;
}

export interface PlaceOrderPayload {
  shipping_address: string;
  billing_address?: string;
  customer_notes?: string;
  payment_method: 'stripe' | 'card';
}

export interface PlaceOrderResponse {
  message: string;
  data: Order;
  payment: {
    client_secret: string | null;
    payment_intent_id: string | null;
  };
}
