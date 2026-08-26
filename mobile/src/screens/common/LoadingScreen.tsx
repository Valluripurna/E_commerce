import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Center, Text} from 'native-base';

export default function LoadingScreen() {
  return (
    <Center flex={1} bg="white">
      <ActivityIndicator size="large" color="#4f46e5" />
      <Text mt={4} color="gray.500">
        Loading...
      </Text>
    </Center>
  );
}
