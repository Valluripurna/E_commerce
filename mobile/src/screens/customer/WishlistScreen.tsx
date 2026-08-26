import React, {useCallback, useEffect, useState} from 'react';
import {Box, Button, FlatList, Spinner, Text} from 'native-base';
import ProductCard from '../../components/ProductCard';
import {useWishlist} from '../../context/WishlistProvider';
import {useCart} from '../../context/CartProvider';
import {WishlistItem} from '../../types';

export default function WishlistScreen() {
  const {wishlist, loading, refreshWishlist, removeFromWishlist} = useWishlist();
  const {addToCart} = useCart();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshWishlist();
    setRefreshing(false);
  }, [refreshWishlist]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const renderItem = ({item}: {item: WishlistItem}) => {
    if (!item.product) {
      return null;
    }

    return (
      <ProductCard
        product={item.product}
        isWishlisted
        onToggleWishlist={() => removeFromWishlist(item.id)}
        onAddToCart={() => addToCart(item.product!.id, 1)}
      />
    );
  };

  if (loading && !wishlist) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner color="primary.600" size="lg" />
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50" px={4} pt={4}>
      <FlatList
        data={wishlist?.items ?? []}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <Box py={16} alignItems="center">
            <Text fontSize="lg" fontWeight="semibold" color="gray.600">
              Your wishlist is empty
            </Text>
            <Text mt={2} color="gray.500" textAlign="center">
              Save products you love and buy them later.
            </Text>
            <Button mt={4} variant="outline" onPress={onRefresh}>
              Refresh
            </Button>
          </Box>
        }
      />
    </Box>
  );
}
