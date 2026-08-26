import {formatCurrency} from '../formatCurrency';

describe('formatCurrency', () => {
  it('formats USD amounts', () => {
    expect(formatCurrency(49.99)).toBe('$49.99');
  });
});
