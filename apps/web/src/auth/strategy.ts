import type { WalletRuntime } from '../web3/runtime';
export type AuthAvailability = { status: 'blocked'; reason: string };
export interface AuthenticationStrategy {
  readonly runtime: WalletRuntime;
  readonly availability: AuthAvailability;
}
export function authenticationFor(runtime: WalletRuntime): AuthenticationStrategy {
  return { runtime, availability: { status: 'blocked', reason: runtime === 'minipay'
    ? 'MiniPay session authentication awaits an approved backend protocol. Wallet connection is not sign-in.'
    : 'Secure sign-in is not available until the backend session and SIWE contract are connected.' } };
}
