import React from 'react';
import {Box, Button, Center, Text, VStack} from 'native-base';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAuth} from '../../context/AuthProvider';
import {CustomerStackParamList, CustomerTabParamList} from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<CustomerTabParamList, 'Profile'>,
  NativeStackScreenProps<CustomerStackParamList>
>;

export default function CustomerProfileScreen({navigation}: Props) {
  const {user, logout} = useAuth();

  return (
    <Center flex={1} bg="white" px={6}>
      <VStack space={4} alignItems="center" w="100%">
        <Text fontSize="2xl" fontWeight="bold" color="primary.700">
          Profile
        </Text>
        {user && (
          <Box w="100%" p={4} bg="gray.50" rounded="lg">
            <Text fontWeight="semibold">{user.name}</Text>
            <Text color="gray.600">{user.email}</Text>
          </Box>
        )}
        <Button
          w="100%"
          variant="outline"
          onPress={() => navigation.getParent()?.navigate('OrderHistory')}>
          My Orders
        </Button>
        <Button variant="outline" colorScheme="danger" onPress={logout} w="100%">
          Logout
        </Button>
      </VStack>
    </Center>
  );
}
