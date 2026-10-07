'use client';

import '@rainbow-me/rainbowkit/styles.css';

import { useState, type ReactNode } from 'react';
import { createConfig, WagmiProvider } from 'wagmi';
import {
  connectorsForWallets,
  darkTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { publicConfig } from '../config/public';
import { activeNetworkOptions } from './config';
import { ConnectedState } from './connected-state';

export default function StandardProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [config] = useState(() => {
    if (
      !publicConfig.network ||
      !publicConfig.rpcUrl ||
      !publicConfig.walletConnectProjectId
    ) {
      throw new Error('Standard wallet configuration is incomplete');
    }

    const active = activeNetworkOptions(
      publicConfig.network,
      publicConfig.rpcUrl,
    );

    const connectors = connectorsForWallets(
      [
        {
          groupName: 'Recommended',
          wallets: [
            metaMaskWallet,
            rainbowWallet,
            injectedWallet,
            walletConnectWallet,
          ],
        },
      ],
      {
        appName: 'Slyce',
        projectId: publicConfig.walletConnectProjectId,
      },
    );

    /*
     * Keep these branches separate.
     *
     * activeNetworkOptions() returns a discriminated union:
     * either the Celo configuration or the Celo Sepolia configuration.
     *
     * Calling createConfig() only after narrowing `active.network`
     * allows wagmi to infer one concrete chain and its matching
     * transport instead of incorrectly requiring transports for both.
     */
    if (active.network === 'celo') {
      return createConfig({
        chains: active.chains,
        connectors,
        transports: active.transports,
        ssr: true,
        multiInjectedProviderDiscovery: false,
      });
    }

    return createConfig({
      chains: active.chains,
      connectors,
      transports: active.transports,
      ssr: true,
      multiInjectedProviderDiscovery: false,
    });
  });

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider theme={darkTheme()}>
        <ConnectedState runtime="standard">
          {children}
        </ConnectedState>
      </RainbowKitProvider>
    </WagmiProvider>
  );
}