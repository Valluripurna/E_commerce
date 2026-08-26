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
  Input,
  FormControl,
  Select,
  CheckIcon,
  useToast,
} from 'native-base';
import { adminService, UserItem } from '../../services/adminService';

export default function AdminUsersScreen(): React.JSX.Element {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('agent');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'agent' | 'customer'>('agent');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers(roleFilter);
      setUsers(res.data || []);
    } catch (err: any) {
      toast.show({
        description: err.response?.data?.message || 'Failed to fetch users.',
      });
    } finally {
      setLoading(false);
    }
  }, [roleFilter, toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = async () => {
    if (!name || !email || !password) {
      toast.show({ description: 'Please complete all required fields.' });
      return;
    }
    setSubmitting(true);
    try {
      await adminService.createUser({ name, email, password, role, phone });
      toast.show({ description: `New ${role} created successfully.` });
      setShowAddModal(false);
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      loadUsers();
    } catch (err: any) {
      toast.show({
        description: err.response?.data?.message || 'Failed to create user.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box flex={1} bg="gray.50" p={4}>
      <HStack justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md" color="indigo.700">User Management</Heading>
        <Button size="xs" colorScheme="indigo" onPress={() => setShowAddModal(true)}>
          + Add Agent
        </Button>
      </HStack>

      <HStack space={2} mb={4}>
        {['agent', 'customer', 'admin'].map((r) => (
          <Button
            key={r}
            size="xs"
            variant={roleFilter === r ? 'solid' : 'outline'}
            colorScheme="indigo"
            onPress={() => setRoleFilter(r)}
          >
            {r.toUpperCase()}S
          </Button>
        ))}
      </HStack>

      {loading ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="indigo.600" />
        </Box>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Box bg="white" p={4} rounded="lg" mb={3} shadow={1}>
              <HStack justifyContent="space-between" alignItems="center">
                <VStack>
                  <Text fontWeight="bold" fontSize="sm">{item.name}</Text>
                  <Text fontSize="xs" color="gray.500">{item.email}</Text>
                  {item.phone && <Text fontSize="xs" color="gray.400">Phone: {item.phone}</Text>}
                </VStack>
                <Badge
                  colorScheme={
                    item.role === 'admin'
                      ? 'rose'
                      : item.role === 'agent'
                      ? 'amber'
                      : 'info'
                  }
                >
                  {item.role}
                </Badge>
              </HStack>
            </Box>
          )}
        />
      )}

      {/* Modal to Create User / Agent */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Register New Staff / Agent</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <FormControl isRequired>
                <FormControl.Label>Full Name</FormControl.Label>
                <Input value={name} onChangeText={setName} placeholder="John Doe" />
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Email Address</FormControl.Label>
                <Input value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="agent@ecommerce.test" />
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Password</FormControl.Label>
                <Input value={password} onChangeText={setPassword} type="password" placeholder="Password1" />
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Role</FormControl.Label>
                <Select
                  selectedValue={role}
                  onValueChange={(val) => setRole(val as any)}
                  _selectedItem={{ bg: 'indigo.100', endIcon: <CheckIcon size="5" /> }}
                >
                  <Select.Item label="Delivery Agent" value="agent" />
                  <Select.Item label="Administrator" value="admin" />
                </Select>
              </FormControl>
              <FormControl>
                <FormControl.Label>Phone Number</FormControl.Label>
                <Input value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+1 555-0199" />
              </FormControl>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="coolGray" onPress={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button colorScheme="indigo" isLoading={submitting} onPress={handleCreateUser}>
                Create User
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
