import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CheckoutScreen from '../screens/customer/CheckoutScreen';
import OrderConfirmationScreen from '../screens/customer/OrderConfirmationScreen';
import OrderHistoryScreen from '../screens/customer/OrderHistoryScreen';
import OrderTrackingScreen from '../screens/customer/OrderTrackingScreen';
import CustomerTabs from './CustomerTabs';
import {CustomerStackParamList} from './types';

const Stack = createNativeStackNavigator<CustomerStackParamList>();

export default function CustomerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={CustomerTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{title: 'Checkout'}}
      />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
        options={{title: 'Confirmation', headerBackVisible: false}}
      />
      <Stack.Screen
        name="OrderTracking"
        component={OrderTrackingScreen}
        options={{title: 'Track Order'}}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{title: 'My Orders'}}
      />
    </Stack.Navigator>
  );
}
