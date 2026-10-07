import { expect, it } from 'vitest';
import { parseTokenAmount, formatTokenAmount } from '../../src/web3/units';
it('preserves amounts beyond Number precision and rejects excess precision', () => {
  const value = '9007199254740993.123456789012345678';
  expect(formatTokenAmount(parseTokenAmount(value, 18), 18)).toBe(value);
  expect(() => parseTokenAmount('0.001', 2)).toThrow(); expect(() => parseTokenAmount('1e9', 18)).toThrow();
});
