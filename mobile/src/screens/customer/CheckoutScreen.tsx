import React, {useState} from 'react';
import {
  Box,
  Button,
  FormControl,
  Input,
  Text,
  VStack,
  useToast,
} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCart} from '../../context/CartProvider';
import {orderService} from '../../services/orderService';
import {paymentService} from '../../services/paymentService';
import {formatCurrency} from '../../utils/formatCurrency';
import {CustomerStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<CustomerStackParamList, 'Checkout'>;

export default function CheckoutScreen({navigation}: Props) {
  const toast = useToast();
  const {cart, refreshCart} = useCart();
  const [shippingAddress, setShippingAddress] = useState('123 Main Street, New York, NY 10001');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const tax = cart ? Math.round(cart.subtotal * 0.08 * 100) / 100 : 0;
  const shipping = cart && cart.subtotal >= 100 ? 0 : 9.99;
  const total = cart ? cart.subtotal + tax + shipping : 0;

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      toast.show({description: 'Your cart is empty.', placement: 'top'});
      return;
    }

    setSubmitting(true);
    try {
      const response = await orderService.placeOrder({
        shipping_address: shippingAddress.trim(),
        customer_notes: notes.trim() || undefined,
        payment_method: 'stripe',
      });

      const paidOrder = await paymentService.confirmPayment(response.data.id);
      await refreshCart();

      navigation.replace('OrderConfirmation', {order: paidOrder});
    } catch (err: unknown) {
      const message =
        (err as {response?: {data?: {message?: string}}})?.response?.data?.message ||
        'Checkout failed. Please try again.';
      toast.show({description: message, placement: 'top'});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box flex={1} bg="gray.50" px={4} py={4}>
      <VStack space={4}>
        <Box bg="white" p={4} rounded="lg" borderWidth={1} borderColor="gray.200">
          <Text fontSize="lg" fontWeight="bold" mb={3}>
            Shipping Address
          </Text>
          <FormControl>
            <Input
              value={shippingAddress}
              onChangeText={setShippingAddress}
              multiline
              numberOfLines={4}
              h={20}
              textAlignVertical="top"
              placeholder="Enter full shipping address"
            />
          </FormControl>
        </Box>

        <Box bg="white" p={4} rounded="lg" borderWidth={1} borderColor="gray.200">
          <Text fontSize="lg" fontWeight="bold" mb={3}>
            Order Notes (optional)
          </Text>
          <Input value={notes} onChangeText={setNotes} placeholder="Delivery instructions" />
        </Box>

        <Box bg="white" p={4} rounded="lg" borderWidth={1} borderColor="gray.200">
          <Text fontSize="lg" fontWeight="bold" mb={3}>
            Payment
          </Text>
          <Text color="gray.600">
            Stripe test mode — payment is simulated locally via API confirmation.
          </Text>
        </Box>

        <Box bg="white" p={4} rounded="lg" borderWidth={1} borderColor="gray.200">
          <Text fontSize="lg" fontWeight="bold" mb={3}>
            Summary
          </Text>
          <VStack space={2}>
            <SummaryRow label="Subtotal" value={formatCurrency(cart?.subtotal ?? 0)} />
            <SummaryRow label="Tax (8%)" value={formatCurrency(tax)} />
            <SummaryRow label="Shipping" value={formatCurrency(shipping)} />
            <SummaryRow label="Total" value={formatCurrency(total)} bold />
          </VStack>
        </Box>

        <Button
          size="lg"
          bg="primary.600"
          isLoading={submitting}
          onPress={handlePlaceOrder}>
          Place Order & Pay
        </Button>
      </VStack>
    </Box>
  );
}

function SummaryRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <Box flexDirection="row" justifyContent="space-between">
      <Text color={bold ? 'primary.700' : 'gray.600'} fontWeight={bold ? 'bold' : 'normal'}>
        {label}
      </Text>
      <Text fontWeight={bold ? 'bold' : 'semibold'} color={bold ? 'primary.700' : 'gray.800'}>
        {value}
      </Text>
    </Box>
  );
}
