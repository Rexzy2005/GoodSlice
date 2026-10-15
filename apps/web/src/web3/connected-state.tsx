'use client';
import type { ReactNode } from 'react';
import { useAccount, useBalance, useReadContracts } from 'wagmi';
import { parseEther } from 'viem';
import { erc20Abi } from 'viem';
import { publicConfig } from '../config/public';
import { chainFor, contractsFor } from './config';
import { WalletContext, type WalletState } from './context';
import { formatTokenAmount } from './units';
import { useOnlineStatus } from './online-status';
/** Below this, a new wallet likely can't pay Celo network fees for a few transactions. */
const lowGas = parseEther('0.005');
export function ConnectedState({ children }: { children: ReactNode }) {
  const account = useAccount();
  const online = useOnlineStatus();
  const chain = publicConfig.network ? chainFor(publicConfig.network) : undefined;
  const token = contractsFor(publicConfig).gd;
  const wrongNetwork = account.isConnected && account.chainId !== chain?.id;
  const balance = useReadContracts({
    contracts: token && account.address && chain ? [
      { address: token, abi: erc20Abi, functionName: 'balanceOf', args: [account.address], chainId: chain.id },
      { address: token, abi: erc20Abi, functionName: 'decimals', chainId: chain.id },
    ] : [],
    allowFailure: false,
    query: { enabled: online && !!token && account.isConnected && !wrongNetwork, staleTime: 0, refetchOnWindowFocus: true },
  });
  const native = useBalance({ address: account.address, chainId: chain?.id, query: { enabled: online && account.isConnected && !wrongNetwork && !!chain, refetchInterval: 30_000 } });
  const raw = balance.data?.[0];
  const decimals = balance.data?.[1];
  const balanceState: WalletState['balance'] = !online ? { status: 'offline' } : !token || !account.isConnected || wrongNetwork ? { status: 'unavailable' }
    : balance.isError ? { status: 'error' }
    : typeof raw === 'bigint' && typeof decimals === 'number' ? { status: 'ready', formatted: formatTokenAmount(raw, decimals), raw }
    : { status: 'loading' };
  const value: WalletState = {
    status: account.isConnected ? 'connected' : account.isConnecting || account.isReconnecting ? 'connecting' : 'disconnected',
    ...(account.address ? { address: account.address } : {}), wrongNetwork, balance: balanceState,
    gas: native.data === undefined ? 'unknown' : native.data.value < lowGas ? 'low' : 'ok',
    refreshBalance: () => { void balance.refetch(); void native.refetch(); },
  };
  return <WalletContext value={value}>{children}</WalletContext>;
}
