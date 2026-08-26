import React, {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Button,
  FlatList,
  HStack,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import api from '../../services/api';
import {Product} from '../../types';
import {formatCurrency} from '../../utils/formatCurrency';

export default function ManageProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const {data} = await api.get<{data: Product[]}>('/admin/products', {
        params: {per_page: 50},
      });
      setProducts(data.data);
    } catch {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner color="primary.600" size="lg" />
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50" px={4} pt={4}>
      <HStack justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Inventory ({products.length})
        </Text>
        <Button size="sm" variant="outline" onPress={loadProducts}>
          Refresh
        </Button>
      </HStack>

      {!!error && (
        <Text color="red.500" mb={3}>
          {error}
        </Text>
      )}

      <FlatList
        data={products}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <Box bg="white" p={4} mb={3} rounded="lg" borderWidth={1} borderColor="gray.200">
            <VStack space={1}>
              <Text fontWeight="semibold">{item.name}</Text>
              <Text fontSize="sm" color="gray.500">
                SKU: {item.sku}
              </Text>
              <HStack justifyContent="space-between" mt={2}>
                <Text color="primary.600" fontWeight="bold">
                  {formatCurrency(item.price)}
                </Text>
                <Text color={item.is_active ? 'green.600' : 'red.500'}>
                  {item.is_active ? 'Active' : 'Inactive'} · Stock {item.stock_quantity}
                </Text>
              </HStack>
            </VStack>
          </Box>
        )}
        ListEmptyComponent={
          <Text color="gray.500" textAlign="center" py={8}>
            No products yet. Seed the database or create via API.
          </Text>
        }
      />
    </Box>
  );
}
