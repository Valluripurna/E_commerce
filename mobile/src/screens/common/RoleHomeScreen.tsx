import React from 'react';
import {Box, Button, Center, Text, VStack} from 'native-base';
import {useAuth} from '../../context/AuthProvider';

interface Props {
  title: string;
  subtitle: string;
}

export default function RoleHomeScreen({title, subtitle}: Props) {
  const {user, logout} = useAuth();

  return (
    <Center flex={1} bg="white" px={6}>
      <VStack space={4} alignItems="center" w="100%">
        <Text fontSize="2xl" fontWeight="bold" color="primary.700">
          {title}
        </Text>
        <Text color="gray.500" textAlign="center">
          {subtitle}
        </Text>
        {user && (
          <Box w="100%" p={4} bg="gray.50" rounded="lg">
            <Text fontWeight="semibold">{user.name}</Text>
            <Text color="gray.600">{user.email}</Text>
            <Text mt={1} color="primary.600" textTransform="capitalize">
              Role: {user.role}
            </Text>
          </Box>
        )}
        <Button variant="outline" colorScheme="danger" onPress={logout} w="100%">
          Logout
        </Button>
      </VStack>
    </Center>
  );
}
