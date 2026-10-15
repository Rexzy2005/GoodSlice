'use client';
import { createContext, useContext } from 'react';
import type { Address } from 'viem';
export interface WalletState {
  status: 'unavailable' | 'disconnected' | 'connecting' | 'connected' | 'error';
  address?: Address;
  wrongNetwork: boolean;
  message?: string;
  balance: { status: 'offline' | 'unavailable' | 'loading' | 'error' | 'ready'; formatted?: string; raw?: bigint };
  /** Native CELO for network fees. `low` means transactions will likely fail until topped up. */
  gas?: 'ok' | 'low' | 'unknown';
  /** Refetches the G$ balance after a confirmed transaction. */
  refreshBalance?: () => void;
}
export const WalletContext = createContext<WalletState>({ status: 'unavailable', wrongNetwork: false, balance: { status: 'unavailable' } });
export const useWallet = () => useContext(WalletContext);
