import React from 'react';
import {Box, Button, HStack, Image, Text, VStack} from 'native-base';
import {Product} from '../types';
import {formatCurrency} from '../utils/formatCurrency';

interface Props {
  product: Product;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
  compact?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  compact = false,
}: Props) {
  const imageUrl =
    product.primary_image ||
    product.images?.find(img => img.is_primary)?.url ||
    product.images?.[0]?.url ||
    'https://via.placeholder.com/400';

  return (
    <Box
      bg="white"
      rounded="lg"
      overflow="hidden"
      borderWidth={1}
      borderColor="gray.200"
      mb={compact ? 0 : 3}
      flex={compact ? 1 : undefined}>
      <Image
        source={{uri: imageUrl}}
        alt={product.name}
        h={compact ? 120 : 160}
        w="100%"
        resizeMode="cover"
      />
      <VStack p={3} space={2} flex={1}>
        <Text fontWeight="semibold" numberOfLines={2}>
          {product.name}
        </Text>
        {product.category && (
          <Text fontSize="xs" color="gray.500">
            {product.category.name}
          </Text>
        )}
        <HStack alignItems="center" justifyContent="space-between">
          <VStack>
            <Text fontSize="lg" fontWeight="bold" color="primary.600">
              {formatCurrency(product.price)}
            </Text>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <Text fontSize="xs" strikeThrough color="gray.400">
                {formatCurrency(product.compare_at_price)}
              </Text>
            )}
          </VStack>
          <Text fontSize="xs" color={product.stock_quantity > 0 ? 'green.600' : 'red.500'}>
            {product.stock_quantity > 0 ? 'In stock' : 'Out of stock'}
          </Text>
        </HStack>
        {(onAddToCart || onToggleWishlist) && (
          <HStack space={2} mt={1}>
            {onToggleWishlist && (
              <Button
                flex={1}
                size="sm"
                variant="outline"
                colorScheme={isWishlisted ? 'warning' : 'coolGray'}
                onPress={onToggleWishlist}>
                {isWishlisted ? 'Saved' : 'Wishlist'}
              </Button>
            )}
            {onAddToCart && (
              <Button
                flex={1}
                size="sm"
                bg="primary.600"
                isDisabled={product.stock_quantity <= 0}
                onPress={onAddToCart}>
                Add
              </Button>
            )}
          </HStack>
        )}
      </VStack>
    </Box>
  );
}
