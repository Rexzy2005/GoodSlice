import { parsePublicConfig } from './schema';
// Explicit reads are required for Next's build-time public environment replacement.
export const publicConfig = parsePublicConfig({
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  network: process.env.NEXT_PUBLIC_NETWORK,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  gdAddress: process.env.NEXT_PUBLIC_GD_ADDRESS,
  shopAddress: process.env.NEXT_PUBLIC_SHOP_ADDRESS,
  tournamentAddress: process.env.NEXT_PUBLIC_TOURNAMENT_ADDRESS,
});
export const isProduction = process.env.NODE_ENV === 'production';
