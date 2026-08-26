import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  ScrollView,
  Spinner,
  Badge,
  FlatList,
  Button,
  useToast,
  Divider,
} from 'native-base';
import { adminService, AdminDashboardData } from '../../services/adminService';
import { useAuth } from '../../context/AuthProvider';

export default function AdminDashboardScreen(): React.JSX.Element {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const toast = useToast();

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboard();
      setData(res);
    } catch (err: any) {
      toast.show({
        description: err.response?.data?.message || 'Failed to load dashboard data.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50">
        <Spinner size="large" color="indigo.600" />
        <Text mt={2} color="gray.600">Loading Dashboard Metrics...</Text>
      </Box>
    );
  }

  return (
    <ScrollView bg="gray.50" flex={1} p={4}>
      <HStack justifyContent="space-between" alignItems="center" mb={4}>
        <VStack>
          <Heading size="md" color="indigo.700">Store Performance</Heading>
          <Text fontSize="xs" color="gray.500">Real-time Sales & System Metrics</Text>
        </VStack>
        <Button size="xs" variant="outline" colorScheme="rose" onPress={logout}>
          Logout
        </Button>
      </HStack>

      {/* Metric Cards Grid */}
      <HStack space={3} mb={4}>
        <Box flex={1} bg="indigo.600" p={4} rounded="xl" shadow={2}>
          <Text color="indigo.100" fontSize="xs">Total Revenue</Text>
          <Text color="white" fontSize="xl" fontWeight="bold" mt={1}>
            ${data?.metrics?.total_revenue?.toFixed(2) ?? '0.00'}
          </Text>
        </Box>
        <Box flex={1} bg="emerald.600" p={4} rounded="xl" shadow={2}>
          <Text color="emerald.100" fontSize="xs">Total Orders</Text>
          <Text color="white" fontSize="xl" fontWeight="bold" mt={1}>
            {data?.metrics?.total_orders ?? 0}
          </Text>
        </Box>
      </HStack>

      <HStack space={3} mb={4}>
        <Box flex={1} bg="blue.600" p={4} rounded="xl" shadow={2}>
          <Text color="blue.100" fontSize="xs">Customers</Text>
          <Text color="white" fontSize="xl" fontWeight="bold" mt={1}>
            {data?.metrics?.total_customers ?? 0}
          </Text>
        </Box>
        <Box flex={1} bg="amber.600" p={4} rounded="xl" shadow={2}>
          <Text color="amber.100" fontSize="xs">Active Agents</Text>
          <Text color="white" fontSize="xl" fontWeight="bold" mt={1}>
            {data?.metrics?.total_agents ?? 0}
          </Text>
        </Box>
      </HStack>

      {/* Orders Breakdown */}
      <Box bg="white" p={4} rounded="xl" shadow={1} mb={4}>
        <Heading size="sm" mb={3} color="gray.700">Order Status Breakdown</Heading>
        <VStack space={2}>
          {Object.entries(data?.orders_by_status || {}).map(([status, count]) => (
            <HStack key={status} justifyContent="space-between" alignItems="center">
              <Text textTransform="capitalize" color="gray.600" fontSize="sm">{status}</Text>
              <Badge colorScheme="indigo" rounded="full">{count}</Badge>
            </HStack>
          ))}
        </VStack>
      </Box>

      {/* Recent Orders List */}
      <Box bg="white" p={4} rounded="xl" shadow={1} mb={6}>
        <HStack justifyContent="space-between" alignItems="center" mb={3}>
          <Heading size="sm" color="gray.700">Recent Customer Orders</Heading>
          <Button size="xs" variant="ghost" onPress={fetchDashboard}>Refresh</Button>
        </HStack>
        <Divider mb={2} />
        {data?.recent_orders && data.recent_orders.length > 0 ? (
          <VStack space={3}>
            {data.recent_orders.map((item) => (
              <HStack key={item.id} justifyContent="space-between" alignItems="center">
                <VStack>
                  <Text fontWeight="bold" fontSize="sm">{item.order_number}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {item.user?.name ?? 'Customer'} • ${Number(item.total_amount).toFixed(2)}
                  </Text>
                </VStack>
                <Badge
                  colorScheme={
                    item.status === 'delivered' ? 'success' : item.status === 'processing' ? 'info' : 'warning'
                  }
                >
                  {item.status}
                </Badge>
              </HStack>
            ))}
          </VStack>
        ) : (
          <Text fontSize="xs" color="gray.400">No orders recorded yet.</Text>
        )}
      </Box>
    </ScrollView>
  );
}
