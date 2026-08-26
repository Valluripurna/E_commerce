import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {wishlistService} from '../services/wishlistService';
import {Wishlist} from '../types';
import {useAuth} from './AuthProvider';

interface WishlistContextValue {
  wishlist: Wishlist | null;
  loading: boolean;
  itemCount: number;
  refreshWishlist: () => Promise<void>;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (itemId: number) => Promise<void>;
  isWishlisted: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

export function WishlistProvider({children}: {children: React.ReactNode}) {
  const {isAuthenticated, user} = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'customer') {
      setWishlist(null);
      return;
    }
    setLoading(true);
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data);
    } catch {
      setWishlist(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const addToWishlist = useCallback(async (productId: number) => {
    const updated = await wishlistService.addItem(productId);
    setWishlist(updated);
  }, []);

  const removeFromWishlist = useCallback(async (itemId: number) => {
    const updated = await wishlistService.removeItem(itemId);
    setWishlist(updated);
  }, []);

  const isWishlisted = useCallback(
    (productId: number) =>
      wishlist?.items.some(item => item.product_id === productId) ?? false,
    [wishlist],
  );

  const value = useMemo(
    () => ({
      wishlist,
      loading,
      itemCount: wishlist?.item_count ?? 0,
      refreshWishlist,
      addToWishlist,
      removeFromWishlist,
      isWishlisted,
    }),
    [
      wishlist,
      loading,
      refreshWishlist,
      addToWishlist,
      removeFromWishlist,
      isWishlisted,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
