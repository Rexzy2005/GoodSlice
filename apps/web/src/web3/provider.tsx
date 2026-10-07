'use client';
import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { publicConfig } from '../config/public';
import { WalletContext } from './context';
import { detectWalletRuntime, injectedProvider, isMiniPayProvider } from './runtime';
const StandardProvider = lazy(() => import('./standard-provider'));
const MiniPayProvider = lazy(() => import('./minipay-provider'));
export function Web3Provider({ children }: { children: ReactNode }) {
  const [runtime, setRuntime] = useState<'detecting' | 'standard' | 'minipay'>('detecting');
  useEffect(() => { setRuntime(detectWalletRuntime(injectedProvider())); }, []);
  const provider = injectedProvider();
  const networkReady = !!publicConfig.network && !!publicConfig.rpcUrl;
  if (runtime === 'minipay' && networkReady && isMiniPayProvider(provider)) return <Suspense fallback={children}><MiniPayProvider provider={provider}>{children}</MiniPayProvider></Suspense>;
  if (runtime === 'standard' && networkReady && publicConfig.walletConnectProjectId) return <Suspense fallback={children}><StandardProvider>{children}</StandardProvider></Suspense>;
  return <WalletContext value={{ runtime, status: 'unavailable', wrongNetwork: false, balance: { status: 'unavailable' },
    message: runtime === 'detecting' ? 'Checking wallet availability…' : 'Wallet connection is not configured for this environment.' }}>{children}</WalletContext>;
}
