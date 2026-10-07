'use client';
import { createContext, useContext } from 'react';
import type { Address } from 'viem';
import type { WalletRuntime } from './runtime';
export interface WalletState {
  runtime: WalletRuntime | 'detecting';
  status: 'unavailable' | 'disconnected' | 'connecting' | 'connected' | 'error';
  address?: Address;
  wrongNetwork: boolean;
  message?: string;
  retry?: () => void;
  balance: { status: 'offline' | 'unavailable' | 'loading' | 'error' | 'ready'; formatted?: string };
}
export const WalletContext = createContext<WalletState>({ runtime: 'detecting', status: 'unavailable', wrongNetwork: false, balance: { status: 'unavailable' } });
export const useWallet = () => useContext(WalletContext);
