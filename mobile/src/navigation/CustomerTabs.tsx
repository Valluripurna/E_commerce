import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CartScreen from '../screens/customer/CartScreen';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';
import ProductListScreen from '../screens/customer/ProductListScreen';
import WishlistScreen from '../screens/customer/WishlistScreen';
import {useCart} from '../context/CartProvider';
import {CustomerTabParamList} from './types';

const Tab = createBottomTabNavigator<CustomerTabParamList>();

export default function CustomerTabs() {
  const {itemCount} = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#4f46e5',
      }}>
      <Tab.Screen
        name="Home"
        component={ProductListScreen}
        options={{title: 'Shop'}}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
        }}
      />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile" component={CustomerProfileScreen} />
    </Tab.Navigator>
  );
}
