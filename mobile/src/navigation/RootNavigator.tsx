import React from 'react';
import {useAuth} from '../context/AuthProvider';
import LoadingScreen from '../screens/common/LoadingScreen';
import AdminTabs from './AdminTabs';
import AgentTabs from './AgentTabs';
import AuthStack from './AuthStack';
import CustomerStack from './CustomerStack';

export default function RootNavigator() {
  const {user, loading} = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthStack />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminTabs />;
    case 'agent':
      return <AgentTabs />;
    case 'customer':
    default:
      return <CustomerStack />;
  }
}
