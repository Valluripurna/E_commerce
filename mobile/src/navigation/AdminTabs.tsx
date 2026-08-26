import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import ManageProductsScreen from '../screens/admin/ManageProductsScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import {AdminTabParamList} from './types';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export default function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={{tabBarActiveTintColor: '#4f46e5'}}>
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{title: 'Dashboard'}}
      />
      <Tab.Screen
        name="Orders"
        component={AdminOrdersScreen}
        options={{title: 'Orders'}}
      />
      <Tab.Screen
        name="Products"
        component={ManageProductsScreen}
        options={{title: 'Products'}}
      />
      <Tab.Screen
        name="Users"
        component={AdminUsersScreen}
        options={{title: 'Users'}}
      />
    </Tab.Navigator>
  );
}