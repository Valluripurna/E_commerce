import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {cartService} from '../services/cartService';
import {Cart} from '../types';
import {useAuth} from './AuthProvider';

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  refreshCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({children}: {children: React.ReactNode}) {
  const {isAuthenticated, user} = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'customer') {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async (productId: number, quantity = 1) => {
      const updated = await cartService.addItem(productId, quantity);
      setCart(updated);
    },
    [],
  );

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    const updated = await cartService.updateItem(itemId, quantity);
    setCart(updated);
  }, []);

  const removeFromCart = useCallback(async (itemId: number) => {
    const updated = await cartService.removeItem(itemId);
    setCart(updated);
  }, []);

  const value = useMemo(
    () => ({
      cart,
      loading,
      itemCount: cart?.item_count ?? 0,
      refreshCart,
      addToCart,
      updateQuantity,
      removeFromCart,
    }),
    [cart, loading, refreshCart, addToCart, updateQuantity, removeFromCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
