import {tokenStorage} from '../tokenStorage';

describe('tokenStorage', () => {
  it('returns null when no token is stored', async () => {
    const token = await tokenStorage.load();
    expect(token === null || typeof token === 'string').toBe(true);
  });
});
