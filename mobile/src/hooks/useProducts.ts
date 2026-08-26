import {useCallback, useEffect, useRef, useState} from 'react';
import {catalogService} from '../services/catalogService';
import {Product, ProductFilters} from '../types';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export function useProducts(filters: ProductFilters): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filtersKey = JSON.stringify(filters);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchPage = useCallback(
    async (pageNumber: number, reset: boolean) => {
      try {
        if (reset) {
          setError(null);
        }
        const response = await catalogService.getProducts({
          ...filters,
          page: pageNumber,
          per_page: filters.per_page ?? 12,
        });

        if (!isMounted.current) {
          return;
        }

        setProducts(prev =>
          reset ? response.data : [...prev, ...response.data],
        );
        setPage(pageNumber);
        setHasMore(response.meta.current_page < response.meta.last_page);
      } catch (err: unknown) {
        if (!isMounted.current) {
          return;
        }
        const message =
          (err as {response?: {data?: {message?: string}}})?.response?.data
            ?.message || 'Failed to load products.';
        setError(message);
      }
    },
    [filters],
  );

  useEffect(() => {
    setLoading(true);
    setProducts([]);
    setPage(1);
    setHasMore(true);

    fetchPage(1, true).finally(() => {
      if (isMounted.current) {
        setLoading(false);
      }
    });
  }, [filtersKey, fetchPage]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPage(1, true);
    setRefreshing(false);
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || loading) {
      return;
    }
    setLoadingMore(true);
    await fetchPage(page + 1, false);
    setLoadingMore(false);
  }, [fetchPage, hasMore, loadingMore, loading, page]);

  return {
    products,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    refresh,
    loadMore,
  };
}
