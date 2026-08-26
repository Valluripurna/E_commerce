import React from 'react';
import {
  Box,
  Button,
  FlatList,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCart} from '../../context/CartProvider';
import {CartItem} from '../../types';
import {formatCurrency} from '../../utils/formatCurrency';
import {CustomerStackParamList, CustomerTabParamList} from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<CustomerTabParamList, 'Cart'>,
  NativeStackScreenProps<CustomerStackParamList>
>;

export default function CartScreen({navigation}: Props) {
  const {cart, loading, updateQuantity, removeFromCart} = useCart();

  if (loading && !cart) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner color="primary.600" size="lg" />
      </Box>
    );
  }

  const renderItem = ({item}: {item: CartItem}) => {
    const imageUrl =
      item.product?.primary_image ||
      item.product?.images?.[0]?.url ||
      'https://via.placeholder.com/80';

    return (
      <Box bg="white" p={4} mb={3} rounded="lg" borderWidth={1} borderColor="gray.200">
        <HStack space={3} alignItems="center">
          <Image source={{uri: imageUrl}} alt={item.product?.name} size="md" rounded="md" />
          <VStack flex={1} space={1}>
            <Text fontWeight="semibold" numberOfLines={2}>
              {item.product?.name ?? 'Product'}
            </Text>
            <Text color="primary.600" fontWeight="bold">
              {formatCurrency(item.unit_price)}
            </Text>
            <HStack alignItems="center" space={2}>
              <Button
                size="sm"
                variant="outline"
                onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                -
              </Button>
              <Text minW={6} textAlign="center">
                {item.quantity}
              </Text>
              <Button
                size="sm"
                variant="outline"
                onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                +
              </Button>
            </HStack>
          </VStack>
          <VStack alignItems="flex-end" space={2}>
            <Text fontWeight="bold">{formatCurrency(item.line_total)}</Text>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="danger"
              onPress={() => removeFromCart(item.id)}>
              Remove
            </Button>
          </VStack>
        </HStack>
      </Box>
    );
  };

  return (
    <Box flex={1} bg="gray.50" px={4} pt={4}>
      <FlatList
        data={cart?.items ?? []}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={
          <Box py={16} alignItems="center">
            <Text fontSize="lg" fontWeight="semibold" color="gray.600">
              Your cart is empty
            </Text>
            <Text mt={2} color="gray.500" textAlign="center">
              Browse products and tap Add to start shopping.
            </Text>
          </Box>
        }
        ListFooterComponent={
          cart && cart.items.length > 0 ? (
            <Box bg="white" p={4} rounded="lg" mb={8} borderWidth={1} borderColor="gray.200">
              <HStack justifyContent="space-between" mb={3}>
                <Text fontSize="md" color="gray.600">
                  Subtotal ({cart.item_count} items)
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="primary.700">
                  {formatCurrency(cart.subtotal)}
                </Text>
              </HStack>
              <Button bg="primary.600" size="lg" onPress={() => navigation.navigate('Checkout')}>
                Proceed to Checkout
              </Button>
            </Box>
          ) : null
        }
      />
    </Box>
  );
}
