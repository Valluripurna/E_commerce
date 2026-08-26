import React from 'react';
import {Box, Button, Text, VStack} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {formatCurrency} from '../../utils/formatCurrency';
import {CustomerStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<CustomerStackParamList, 'OrderConfirmation'>;

export default function OrderConfirmationScreen({route, navigation}: Props) {
  const {order} = route.params;

  return (
    <Box flex={1} bg="white" px={6} py={10} justifyContent="center">
      <VStack space={4} alignItems="center">
        <Box bg="green.100" px={4} py={2} rounded="full">
          <Text color="green.700" fontWeight="bold">
            Order Confirmed
          </Text>
        </Box>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Thank you for your purchase!
        </Text>
        <Text color="gray.600" textAlign="center">
          Order {order.order_number} is now {order.status}.
        </Text>
        <Box w="100%" bg="gray.50" p={4} rounded="lg">
          <Text fontWeight="semibold">Total paid</Text>
          <Text fontSize="xl" color="primary.700" fontWeight="bold">
            {formatCurrency(order.total_amount)}
          </Text>
        </Box>
        <Button
          w="100%"
          bg="primary.600"
          onPress={() =>
            navigation.replace('OrderTracking', {orderId: order.id, order})
          }>
          Track Order
        </Button>
        <Button w="100%" variant="outline" onPress={() => navigation.navigate('MainTabs')}>
          Continue Shopping
        </Button>
      </VStack>
    </Box>
  );
}
