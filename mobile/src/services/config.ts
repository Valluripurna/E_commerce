export const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000/api/v1' // Android emulator → localhost
  : 'https://api.yourdomain.com/api/v1';

export const API_TIMEOUT = 15000;
