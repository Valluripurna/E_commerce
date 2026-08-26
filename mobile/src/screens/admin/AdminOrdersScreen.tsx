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
  Modal,
  Select,
  CheckIcon,
  useToast,
} from 'native-base';
import { adminService, UserItem } from '../../services/adminService';

export default function AdminOrdersScreen(): React.JSX.Element {
  const [orders, setOrders] = useState<any[]>([]);
  const [agents, setAgents] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const ordersRes = await adminService.getOrders();
      setOrders(ordersRes.data || []);

      const agentsRes = await adminService.getUsers('agent');
      setAgents(agentsRes.data || []);
    } catch (err: any) {
      toast.show({
        description: err.response?.data?.message || 'Failed to fetch order list.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAssignAgent = async () => {
    if (!selectedOrder || !selectedAgentId) return;
    setSubmitting(true);
    try {
      await adminService.assignAgent(selectedOrder.id, Number(selectedAgentId));
      toast.show({ description: 'Delivery Agent assigned successfully.' });
      setSelectedOrder(null);
      setSelectedAgentId('');
      loadData();
    } catch (err: any) {
      toast.show({
        description: err.response?.data?.message || 'Failed to assign agent.',
      });
    } finally {
      setSubmitting(false);
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
        <Heading size="md" color="indigo.700">Order Management</Heading>
        <Button size="xs" variant="outline" onPress={loadData}>Refresh</Button>
      </HStack>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Box bg="white" p={4} rounded="lg" mb={3} shadow={1}>
            <HStack justifyContent="space-between" alignItems="center" mb={2}>
              <Text fontWeight="bold" fontSize="sm">{item.order_number}</Text>
              <Badge
                colorScheme={
                  item.status === 'delivered'
                    ? 'success'
                    : item.status === 'shipped'
                    ? 'info'
                    : 'warning'
                }
              >
                {item.status}
              </Badge>
            </HStack>

            <Text fontSize="xs" color="gray.600">
              Customer: {item.user?.name ?? 'Unknown'} ({item.user?.email})
            </Text>
            <Text fontSize="xs" color="gray.600">
              Total: ${Number(item.total_amount).toFixed(2)}
            </Text>

            <HStack justifyContent="space-between" alignItems="center" mt={3}>
              <Text fontSize="xs" color="gray.500">
                Agent: {item.delivery_assignment?.agent?.name ?? 'Unassigned'}
              </Text>
              <Button
                size="xs"
                colorScheme="indigo"
                onPress={() => {
                  setSelectedOrder(item);
                  if (item.delivery_assignment?.agent?.id) {
                    setSelectedAgentId(item.delivery_assignment.agent.id.toString());
                  } else {
                    setSelectedAgentId('');
                  }
                }}
              >
                Assign Agent
              </Button>
            </HStack>
          </Box>
        )}
      />

      {/* Modal to Assign Agent */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Assign Delivery Agent</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <Text fontSize="xs">
                Order: <Text fontWeight="bold">{selectedOrder?.order_number}</Text>
              </Text>
              <Text fontSize="xs" color="gray.500">Select an active delivery agent to handle this order.</Text>
              <Select
                selectedValue={selectedAgentId}
                minWidth="200"
                accessibilityLabel="Choose Agent"
                placeholder="Choose Delivery Agent"
                _selectedItem={{
                  bg: 'indigo.100',
                  endIcon: <CheckIcon size="5" />,
                }}
                onValueChange={(itemValue) => setSelectedAgentId(itemValue)}
              >
                {agents.map((ag) => (
                  <Select.Item key={ag.id} label={`${ag.name} (${ag.email})`} value={ag.id.toString()} />
                ))}
              </Select>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="coolGray" onPress={() => setSelectedOrder(null)}>
                Cancel
              </Button>
              <Button
                colorScheme="indigo"
                isLoading={submitting}
                isDisabled={!selectedAgentId}
                onPress={handleAssignAgent}
              >
                Confirm Assignment
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
