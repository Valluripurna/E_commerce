import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYCHAIN_SERVICE = 'ecommerce-auth-token';

export const tokenStorage = {
  async save(token: string): Promise<void> {
    try {
      await Keychain.setGenericPassword('token', token, {
        service: KEYCHAIN_SERVICE,
      });
    } catch {
      await AsyncStorage.setItem(KEYCHAIN_SERVICE, token);
    }
  },

  async load(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE,
      });
      if (credentials && credentials.password) {
        return credentials.password;
      }
    } catch {
      return AsyncStorage.getItem(KEYCHAIN_SERVICE);
    }
    return null;
  },

  async clear(): Promise<void> {
    try {
      await Keychain.resetGenericPassword({service: KEYCHAIN_SERVICE});
    } catch {
      await AsyncStorage.removeItem(KEYCHAIN_SERVICE);
    }
  },
};
