import React, {useMemo, useState} from 'react';
import {
  Box,
  FlatList,
  HStack,
  Input,
  Pressable,
  Select,
  Spinner,
  Text,
  useToast,
} from 'native-base';
import {useCart} from '../../context/CartProvider';
import {useWishlist} from '../../context/WishlistProvider';
import {useProducts} from '../../hooks/useProducts';
import {catalogService} from '../../services/catalogService';
import {Category, Product, ProductFilters} from '../../types';
import ProductCard from '../../components/ProductCard';

export default function ProductListScreen() {
  const toast = useToast();
  const {addToCart} = useCart();
  const {addToWishlist, removeFromWishlist, isWishlisted, wishlist} = useWishlist();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sort, setSort] = useState<ProductFilters['sort']>('latest');

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  React.useEffect(() => {
    catalogService.getCategories().then(setCategories).catch(() => {});
  }, []);

  const filters = useMemo<ProductFilters>(
    () => ({
      q: debouncedSearch || undefined,
      category_id: selectedCategory ? Number(selectedCategory) : undefined,
      sort,
      per_page: 12,
    }),
    [debouncedSearch, selectedCategory, sort],
  );

  const {
    products,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    refresh,
    loadMore,
  } = useProducts(filters);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      toast.show({description: `${product.name} added to cart`, placement: 'top'});
    } catch (err: unknown) {
      const message =
        (err as {response?: {data?: {message?: string}}})?.response?.data?.message ||
        'Could not add to cart.';
      toast.show({description: message, placement: 'top'});
    }
  };

  const handleToggleWishlist = async (product: Product) => {
    try {
      if (isWishlisted(product.id)) {
        const item = wishlist?.items.find(i => i.product_id === product.id);
        if (item) {
          await removeFromWishlist(item.id);
        }
      } else {
        await addToWishlist(product.id);
      }
    } catch {
      toast.show({description: 'Wishlist update failed.', placement: 'top'});
    }
  };

  const renderHeader = () => (
    <Box px={4} pt={4} pb={2} bg="gray.50">
      <Input
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
        mb={3}
        bg="white"
      />
      <HStack space={2}>
        <Select
          flex={1}
          selectedValue={selectedCategory}
          placeholder="All categories"
          onValueChange={setSelectedCategory}
          bg="white">
          <Select.Item label="All categories" value="" />
          {categories.map(cat => (
            <Select.Item key={cat.id} label={cat.name} value={String(cat.id)} />
          ))}
        </Select>
        <Select
          flex={1}
          selectedValue={sort}
          onValueChange={value => setSort(value as ProductFilters['sort'])}
          bg="white">
          <Select.Item label="Latest" value="latest" />
          <Select.Item label="Price: Low to High" value="price_asc" />
          <Select.Item label="Price: High to Low" value="price_desc" />
          <Select.Item label="Name" value="name" />
        </Select>
      </HStack>
      {!!error && (
        <Pressable onPress={refresh} mt={3}>
          <Text color="red.500">{error} — Tap to retry</Text>
        </Pressable>
      )}
    </Box>
  );

  if (loading && products.length === 0) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50">
        <Spinner color="primary.600" size="lg" />
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50">
      <FlatList
        data={products}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between', paddingHorizontal: 16}}
        ListHeaderComponent={renderHeader}
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReached={() => hasMore && loadMore()}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore ? (
            <Box py={4} alignItems="center">
              <Spinner color="primary.600" />
            </Box>
          ) : null
        }
        ListEmptyComponent={
          <Box px={4} py={8} alignItems="center">
            <Text color="gray.500">No products found.</Text>
          </Box>
        }
        renderItem={({item}) => (
          <Box flex={1} maxW="48%" mx={1}>
            <ProductCard
              product={item}
              compact
              onAddToCart={() => handleAddToCart(item)}
              onToggleWishlist={() => handleToggleWishlist(item)}
              isWishlisted={isWishlisted(item.id)}
            />
          </Box>
        )}
      />
    </Box>
  );
}
