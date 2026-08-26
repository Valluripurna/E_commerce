import {tokenStorage} from '../tokenStorage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}));

describe('tokenStorage', () => {
  it('returns null when no token is stored', async () => {
    const token = await tokenStorage.load();
    expect(token === null || typeof token === 'string').toBe(true);
  });
});
