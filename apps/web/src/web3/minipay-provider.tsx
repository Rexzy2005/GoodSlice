'use client';
import { useState, type ReactNode } from 'react';
import { WagmiProvider, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { publicConfig } from '../config/public';
import { activeNetworkOptions } from './config';
import { ConnectedState } from './connected-state';
import type { MiniPayProvider as Provider } from './runtime';
export default function MiniPayProvider({ provider, children }: { provider: Provider; children: ReactNode }) {
  const [config] = useState(() => {
    if (!publicConfig.network || !publicConfig.rpcUrl) throw new Error('MiniPay network configuration is incomplete');
    const active = activeNetworkOptions(publicConfig.network, publicConfig.rpcUrl);
    const options = { connectors: [injected({ target: { id: 'minipay', name: 'MiniPay', provider } })],
      ssr: true, multiInjectedProviderDiscovery: false };
    // Narrow before the generic factory so it receives one concrete chain tuple.
    return active.network === 'celo'
      ? createConfig({ ...options, chains: active.chains, transports: active.transports })
      : createConfig({ ...options, chains: active.chains, transports: active.transports });
  });
  return <WagmiProvider config={config} reconnectOnMount={false}><ConnectedState runtime="minipay">{children}</ConnectedState></WagmiProvider>;
}
