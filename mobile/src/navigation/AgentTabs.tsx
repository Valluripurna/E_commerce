import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AgentDeliveriesScreen from '../screens/agent/AgentDeliveriesScreen';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';
import {AgentTabParamList} from './types';

const Tab = createBottomTabNavigator<AgentTabParamList>();

export default function AgentTabs() {
  return (
    <Tab.Navigator screenOptions={{tabBarActiveTintColor: '#4f46e5'}}>
      <Tab.Screen
        name="Deliveries"
        component={AgentDeliveriesScreen}
        options={{title: 'Deliveries'}}
      />
      <Tab.Screen
        name="Profile"
        component={CustomerProfileScreen}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
}
