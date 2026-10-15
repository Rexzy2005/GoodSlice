import { celo, celoSepolia } from 'viem/chains';
import { getAddress } from 'viem';
import { http } from 'wagmi';
import type { PublicConfig } from '../config/schema';
type ActiveNetworkOptions =
  | { network: 'celo'; chains: [typeof celo]; transports: { [celo.id]: ReturnType<typeof http> } }
  | { network: 'celo-sepolia'; chains: [typeof celoSepolia]; transports: { [celoSepolia.id]: ReturnType<typeof http> } };

/** One configured endpoint belongs only to the selected chain, never both networks. */
export function activeNetworkOptions(network: NonNullable<PublicConfig['network']>, rpcUrl: string): ActiveNetworkOptions {
  if (network === 'celo') {
    return { network, chains: [celo], transports: { [celo.id]: http(rpcUrl) } };
  }
  return { network, chains: [celoSepolia], transports: { [celoSepolia.id]: http(rpcUrl) } };
}

export function chainFor(network: NonNullable<PublicConfig['network']>) { return network === 'celo' ? celo : celoSepolia; }
export function contractsFor(config: PublicConfig) {
  return { gd: config.gdAddress ? getAddress(config.gdAddress) : undefined,
    shop: config.shopAddress ? getAddress(config.shopAddress) : undefined,
    tournament: config.tournamentAddress ? getAddress(config.tournamentAddress) : undefined,
    arcade: config.arcadeAddress ? getAddress(config.arcadeAddress) : undefined };
}
export function explorerUrl(network: NonNullable<PublicConfig['network']>, kind: 'address' | 'tx', value: string): string {
  const valid = kind === 'address' ? /^0x[0-9a-fA-F]{40}$/.test(value) : /^0x[0-9a-fA-F]{64}$/.test(value);
  if (!valid) throw new Error('Invalid explorer identifier');
  return chainFor(network).blockExplorers.default.url + '/' + kind + '/' + value;
}
/** G$ on Celo uses 18 decimals in every GoodDollar environment (verified on-chain; docs/research/gooddollar.md). */
export const gdDecimals = 18;
