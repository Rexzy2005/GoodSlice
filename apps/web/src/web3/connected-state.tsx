'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useAccount, useConnect, useReadContracts } from 'wagmi';
import { erc20Abi } from 'viem';
import { publicConfig } from '../config/public';
import { chainFor, contractsFor } from './config';
import { WalletContext, type WalletState } from './context';
import { formatTokenAmount } from './units';
import type { WalletRuntime } from './runtime';
export function ConnectedState({ runtime, children }: { runtime: WalletRuntime; children: ReactNode }) {
  const account = useAccount();
  const { connect, connectors, error, isPending, reset } = useConnect();
  const attempted = useRef(false);
  const [attempt, setAttempt] = useState(0);
  const chain = publicConfig.network ? chainFor(publicConfig.network) : undefined;
  const token = contractsFor(publicConfig).gd;
  const wrongNetwork = account.isConnected && account.chainId !== chain?.id;
  useEffect(() => {
    if (runtime !== 'minipay' || attempted.current || account.isConnected || account.isConnecting) return;
    const connector = connectors[0];
    if (!connector) return;
    attempted.current = true;
    connect({ connector });
  }, [runtime, connectors, connect, account.isConnected, account.isConnecting, attempt]);
  const balance = useReadContracts({
    contracts: token && account.address && chain ? [
      { address: token, abi: erc20Abi, functionName: 'balanceOf', args: [account.address], chainId: chain.id },
      { address: token, abi: erc20Abi, functionName: 'decimals', chainId: chain.id },
    ] : [],
    allowFailure: false,
    query: { enabled: !!token && account.isConnected && !wrongNetwork, staleTime: 0, refetchOnWindowFocus: true },
  });
  const raw = balance.data?.[0];
  const decimals = balance.data?.[1];
  const balanceState: WalletState['balance'] = !token || !account.isConnected || wrongNetwork ? { status: 'unavailable' }
    : balance.isError ? { status: 'error' }
    : typeof raw === 'bigint' && typeof decimals === 'number' ? { status: 'ready', formatted: formatTokenAmount(raw, decimals) }
    : { status: 'loading' };
  const value: WalletState = {
    runtime, status: account.isConnected ? 'connected' : isPending || account.isConnecting || account.isReconnecting ? 'connecting' : error ? 'error' : 'disconnected',
    ...(account.address ? { address: account.address } : {}), wrongNetwork, balance: balanceState,
    ...(error ? { message: 'Wallet connection did not complete. You can retry.' } : {}),
    retry: () => { reset(); attempted.current = false; setAttempt(value => value + 1); },
  };
  return <WalletContext value={value}>{children}</WalletContext>;
}
