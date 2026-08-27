import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CartScreen from '../screens/customer/CartScreen';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';
import ProductListScreen from '../screens/customer/ProductListScreen';
import WishlistScreen from '../screens/customer/WishlistScreen';
import {useCart} from '../context/CartProvider';
import {CustomerTabParamList} from './types';
import {ShopIcon, CartIcon, WishlistIcon, ProfileIcon} from '../components/TabIcons';

const Tab = createBottomTabNavigator<CustomerTabParamList>();

export default function CustomerTabs() {
  const {itemCount} = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={ProductListScreen}
        options={{
          title: 'Shop',
          tabBarIcon: ({color}) => <ShopIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarIcon: ({color}) => <CartIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          title: 'Wishlist',
          tabBarIcon: ({color}) => <WishlistIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={CustomerProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({color}) => <ProfileIcon color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}