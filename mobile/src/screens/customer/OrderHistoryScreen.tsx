import React, {useCallback, useEffect, useState} from 'react';
import {Box, Button, FlatList, Spinner, Text, VStack} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {orderService} from '../../services/orderService';
import {Order} from '../../types/order';
import {formatCurrency} from '../../utils/formatCurrency';
import {CustomerStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<CustomerStackParamList, 'OrderHistory'>;

export default function OrderHistoryScreen({navigation}: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrders();
      setOrders(response.data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner color="primary.600" size="lg" />
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50" px={4} pt={4}>
      <FlatList
        data={orders}
        keyExtractor={item => String(item.id)}
        refreshing={loading}
        onRefresh={loadOrders}
        ListEmptyComponent={
          <Box py={12} alignItems="center">
            <Text color="gray.500">No orders yet.</Text>
          </Box>
        }
        renderItem={({item}) => (
          <Box bg="white" p={4} mb={3} rounded="lg" borderWidth={1} borderColor="gray.200">
            <VStack space={1}>
              <Text fontWeight="bold">{item.order_number}</Text>
              <Text color="gray.600" textTransform="capitalize">
                {item.status} · {formatCurrency(item.total_amount)}
              </Text>
              <Button
                mt={2}
                size="sm"
                variant="outline"
                alignSelf="flex-start"
                onPress={() =>
                  navigation.navigate('OrderTracking', {orderId: item.id, order: item})
                }>
                Track
              </Button>
            </VStack>
          </Box>
        )}
      />
    </Box>
  );
}
