import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import {SafeAreaProvider, initialWindowMetrics} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {AuthProvider} from './src/context/AuthProvider';
import {CartProvider} from './src/context/CartProvider';
import {WishlistProvider} from './src/context/WishlistProvider';
import RootNavigator from './src/navigation/RootNavigator';
import {theme} from './src/theme';
import {ErrorBoundary} from './src/components/ErrorBoundary';

const nativeBaseConfig = {
  suppressColorAccessibilityWarning: true,
  isSSR: false,
};

export default function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <NativeBaseProvider theme={theme} config={nativeBaseConfig} isSSR={false}>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <NavigationContainer>
                  <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
                  <RootNavigator />
                </NavigationContainer>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </NativeBaseProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}