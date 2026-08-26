import React, {useCallback, useEffect, useState} from 'react';
import {Box, Button, Progress, Spinner, Text, VStack} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {orderService} from '../../services/orderService';
import {Order} from '../../types/order';
import {
  ORDER_STATUS_STEPS,
  getStatusProgress,
  isStepComplete,
} from '../../utils/orderStatus';
import {formatCurrency} from '../../utils/formatCurrency';
import {CustomerStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<CustomerStackParamList, 'OrderTracking'>;

export default function OrderTrackingScreen({route, navigation}: Props) {
  const {orderId, order: initialOrder} = route.params;
  const [order, setOrder] = useState<Order | null>(initialOrder ?? null);
  const [loading, setLoading] = useState(!initialOrder);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrder = useCallback(async () => {
    try {
      const data = await orderService.getOrder(orderId);
      setOrder(data);
    } catch {
      // keep last known state
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
    const interval = setInterval(loadOrder, 10000);
    return () => clearInterval(interval);
  }, [loadOrder]);

  if (loading || !order) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner color="primary.600" size="lg" />
      </Box>
    );
  }

  const progress = getStatusProgress(order.status);

  return (
    <Box flex={1} bg="gray.50" px={4} py={4}>
      <VStack space={4}>
        <Box bg="white" p={4} rounded="lg" borderWidth={1} borderColor="gray.200">
          <Text fontSize="lg" fontWeight="bold">
            {order.order_number}
          </Text>
          <Text mt={1} color="gray.600" textTransform="capitalize">
            Status: {order.status}
          </Text>
          <Text mt={2} fontWeight="semibold">
            {formatCurrency(order.total_amount)}
          </Text>
        </Box>

        <Box bg="white" p={4} rounded="lg" borderWidth={1} borderColor="gray.200">
          <Text fontWeight="bold" mb={3}>
            Delivery Progress
          </Text>
          <Progress value={progress} bg="gray.200" _filledTrack={{bg: 'primary.600'}} />
          <VStack mt={4} space={3}>
            {ORDER_STATUS_STEPS.map(step => (
              <Box key={step.key} flexDirection="row" alignItems="center">
                <Box
                  w={3}
                  h={3}
                  rounded="full"
                  mr={3}
                  bg={isStepComplete(step.key, order.status) ? 'primary.600' : 'gray.300'}
                />
                <Text
                  color={isStepComplete(step.key, order.status) ? 'primary.700' : 'gray.500'}
                  fontWeight={order.status === step.key ? 'bold' : 'normal'}>
                  {step.label}
                </Text>
              </Box>
            ))}
          </VStack>
          <Text mt={4} fontSize="xs" color="gray.500">
            Auto-refreshes every 10s. Real-time updates via Pusher in production.
          </Text>
        </Box>

        <Button
          variant="outline"
          isLoading={refreshing}
          onPress={() => {
            setRefreshing(true);
            loadOrder();
          }}>
          Refresh Status
        </Button>
        <Button variant="ghost" onPress={() => navigation.navigate('MainTabs')}>
          Back to Shop
        </Button>
      </VStack>
    </Box>
  );
}
