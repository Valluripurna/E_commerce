import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  FlatList,
  Badge,
  Button,
  Spinner,
  useToast,
  Divider,
} from 'native-base';
import { agentService, DeliveryItem } from '../../services/agentService';
import { useAuth } from '../../context/AuthProvider';

export default function AgentDeliveriesScreen(): React.JSX.Element {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const { logout } = useAuth();
  const toast = useToast();

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await agentService.getDeliveries();
      setDeliveries(res.data || []);
    } catch (err: any) {
      toast.show({
        description: err.response?.data?.message || 'Failed to load assigned deliveries.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleUpdateStatus = async (
    deliveryId: number,
    nextStatus: 'picked_up' | 'out_for_delivery' | 'delivered'
  ) => {
    setUpdatingId(deliveryId);
    try {
      await agentService.updateDeliveryStatus(deliveryId, nextStatus);
      toast.show({ description: `Status updated to ${nextStatus.replace(/_/g, ' ')}.` });
      fetchDeliveries();
    } catch (err: any) {
      toast.show({
        description: err.response?.data?.message || 'Status update failed.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50">
        <Spinner size="large" color="indigo.600" />
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50" p={4}>
      <HStack justifyContent="space-between" alignItems="center" mb={4}>
        <VStack>
          <Heading size="md" color="indigo.700">Assigned Deliveries</Heading>
          <Text fontSize="xs" color="gray.500">Manage package pickups and drop-offs</Text>
        </VStack>
        <HStack space={2}>
          <Button size="xs" variant="outline" onPress={fetchDeliveries}>Refresh</Button>
          <Button size="xs" variant="ghost" colorScheme="rose" onPress={logout}>Logout</Button>
        </HStack>
      </HStack>

      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Box bg="white" p={4} rounded="xl" mb={4} shadow={1}>
            <HStack justifyContent="space-between" alignItems="center" mb={2}>
              <Text fontWeight="bold" fontSize="sm">{item.order?.order_number}</Text>
              <Badge
                colorScheme={
                  item.status === 'delivered'
                    ? 'success'
                    : item.status === 'out_for_delivery'
                    ? 'info'
                    : item.status === 'picked_up'
                    ? 'amber'
                    : 'warning'
                }
              >
                {item.status.replace(/_/g, ' ')}
              </Badge>
            </HStack>

            <Text fontSize="xs" color="gray.700" fontWeight="semibold">
              Customer: {item.order?.user?.name ?? 'Customer'}
            </Text>
            <Text fontSize="xs" color="gray.600" mt={1}>
              📍 Shipping Address: {item.order?.shipping_address}
            </Text>
            <Text fontSize="xs" color="gray.600">
              Total Amount: ${Number(item.order?.total_amount).toFixed(2)}
            </Text>

            <Divider my={3} />

            <HStack space={2} justifyContent="flex-end">
              {item.status === 'assigned' && (
                <Button
                  size="xs"
                  colorScheme="amber"
                  isLoading={updatingId === item.id}
                  onPress={() => handleUpdateStatus(item.id, 'picked_up')}
                >
                  Mark Picked Up
                </Button>
              )}

              {item.status === 'picked_up' && (
                <Button
                  size="xs"
                  colorScheme="info"
                  isLoading={updatingId === item.id}
                  onPress={() => handleUpdateStatus(item.id, 'out_for_delivery')}
                >
                  Out For Delivery
                </Button>
              )}

              {item.status === 'out_for_delivery' && (
                <Button
                  size="xs"
                  colorScheme="success"
                  isLoading={updatingId === item.id}
                  onPress={() => handleUpdateStatus(item.id, 'delivered')}
                >
                  Mark Delivered
                </Button>
              )}

              {item.status === 'delivered' && (
                <Text fontSize="xs" color="emerald.600" fontWeight="bold">
                  ✓ Delivery Completed
                </Text>
              )}
            </HStack>
          </Box>
        )}
        ListEmptyComponent={
          <Box p={6} alignItems="center">
            <Text color="gray.500">No deliveries assigned at the moment.</Text>
          </Box>
        }
      />
    </Box>
  );
}
