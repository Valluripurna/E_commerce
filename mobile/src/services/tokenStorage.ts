import * as Keychain from 'react-native-keychain';

const KEYCHAIN_SERVICE = 'ecommerce-auth-token';

export const tokenStorage = {
  async save(token: string): Promise<void> {
    await Keychain.setGenericPassword('token', token, {
      service: KEYCHAIN_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    });
  },

  async load(): Promise<string | null> {
    const credentials = await Keychain.getGenericPassword({
      service: KEYCHAIN_SERVICE,
    });
    if (credentials && credentials.password) {
      return credentials.password;
    }
    return null;
  },

  async clear(): Promise<void> {
    await Keychain.resetGenericPassword({service: KEYCHAIN_SERVICE});
  },
};
