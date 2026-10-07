import { describe, expect, it } from 'vitest';
import { detectWalletRuntime, isMiniPayProvider } from '../../src/web3/runtime';
describe('wallet runtime policy', () => {
  it('keeps standard wallets outside MiniPay', () => { expect(detectWalletRuntime(undefined)).toBe('standard'); expect(detectWalletRuntime({ isMiniPay: false })).toBe('standard'); });
  it('never exposes a generic picker for a malformed MiniPay provider', () => { expect(detectWalletRuntime({ isMiniPay: true })).toBe('minipay'); expect(isMiniPayProvider({ isMiniPay: true })).toBe(false); });
  it('accepts the explicit EIP-1193 interface', () => { expect(isMiniPayProvider({ isMiniPay: true, request() {}, on() {}, removeListener() {} })).toBe(true); });
});
