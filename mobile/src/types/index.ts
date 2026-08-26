export type UserRole = 'admin' | 'customer' | 'agent';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text?: string;
  is_primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number | null;
  sku: string;
  stock_quantity: number;
  category_id: number;
  category?: Category;
  is_active?: boolean;
  is_featured?: boolean;
  images?: ProductImage[];
  primary_image?: string | null;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
  product?: Product;
}

export interface Cart {
  id: number;
  items: CartItem[];
  item_count: number;
  subtotal: number;
}

export interface WishlistItem {
  id: number;
  product_id: number;
  product?: Product;
}

export interface Wishlist {
  id: number;
  items: WishlistItem[];
  item_count: number;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links?: {
    next?: string | null;
    prev?: string | null;
  };
}

export interface ProductFilters {
  q?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'name' | 'latest';
  per_page?: number;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}
