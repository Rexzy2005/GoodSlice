import { describe, expect, it } from 'vitest';
import { createConfig } from 'wagmi';
import { activeNetworkOptions } from '../../src/web3/config';
import type { PublicConfig } from '../../src/config/schema';

const networks: { network: NonNullable<PublicConfig['network']>; chainId: number; rpcUrl: string }[] = [
  { network: 'celo', chainId: 42220, rpcUrl: 'https://mainnet.example.invalid' },
  { network: 'celo-sepolia', chainId: 11142220, rpcUrl: 'https://sepolia.example.invalid' },
];

describe('active wallet network', () => {
  it.each(networks)('configures only $network and its endpoint', ({ network, chainId, rpcUrl }) => {
    const active = activeNetworkOptions(network, rpcUrl);
    const client = active.network === 'celo'
      ? createConfig({ chains: active.chains, transports: active.transports, ssr: true, storage: null }).getClient()
      : createConfig({ chains: active.chains, transports: active.transports, ssr: true, storage: null }).getClient();
    expect(active.chains.map(chain => chain.id)).toEqual([chainId]);
    expect(Object.keys(active.transports)).toEqual([String(chainId)]);
    expect(client.chain.id).toBe(chainId);
    expect(client.transport.url).toBe(rpcUrl);
  });
});
