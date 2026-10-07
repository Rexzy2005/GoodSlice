import type { EIP1193Provider } from 'viem';
export type WalletRuntime = 'standard' | 'minipay';
export type MiniPayProvider = EIP1193Provider & { isMiniPay: true };
export function isMiniPayProvider(value: unknown): value is MiniPayProvider {
  return typeof value === 'object' && value !== null && 'isMiniPay' in value && value.isMiniPay === true
    && 'request' in value && typeof value.request === 'function'
    && 'on' in value && typeof value.on === 'function'
    && 'removeListener' in value && typeof value.removeListener === 'function';
}
export function detectWalletRuntime(value: unknown): WalletRuntime {
  // The marker alone suppresses the standard picker, even if the provider is malformed.
  return typeof value === 'object' && value !== null && 'isMiniPay' in value && value.isMiniPay === true ? 'minipay' : 'standard';
}
export function injectedProvider(): unknown {
  return typeof window !== 'undefined' && 'ethereum' in window ? window.ethereum : undefined;
}
