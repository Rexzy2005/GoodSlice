# Reown AppKit (email + wallet sign-in) — Verified Findings

Verified: 2026-10-15. Packages: `@reown/appkit` 1.8.24, `@reown/appkit-adapter-wagmi` 1.8.24, `@wagmi/core` 2.22.1 (wagmi 2.19.5, viem 2.57.3).

## Sources

- Next.js App Router + wagmi setup: https://docs.reown.com/appkit/next/core/installation
- Options: https://docs.reown.com/appkit/react/core/options
- Embedded-wallet chain support (Blockchain API): https://docs.reown.com/cloud/blockchain-api
- Installed type definitions (`@reown/appkit-controllers` 1.8.24 `TypeUtil.d.ts`)

## Findings

- Peer requirements of the adapter: `wagmi >=2.19.5`, `viem >=2.55.13`, `@wagmi/core >=2.21.2`. `@wagmi/core` is pinned to 2.22.1, the version wagmi 2.19.5 already resolves.
- Email login creates a non-custodial embedded wallet. Embedded wallets only transact on Blockchain API chains, and **Celo Mainnet (eip155:42220) is listed**.
- `Features` in 1.8.24 include `email`, `emailShowWallets`, `socials`, `connectMethodsOrder`, `swaps`, `onramp` and `analytics`. There are also dashboard-controlled `RemoteFeatures`, so **email login must be enabled in the Reown dashboard** for the project, and the app domain must be allowlisted there.
- Hooks: `useAppKit().open()` (optionally `{ view: 'Account' | 'Networks' }`). Hooks throw if called before `createAppKit`.
- `createAppKit` runs during Next pre-rendering (no `window`), so the app passes an explicit `NEXT_PUBLIC_APP_URL` for metadata.
- Under `exactOptionalPropertyTypes`, `WagmiAdapter` is not assignable to AppKit's adapter parameter type (`namespace`/`adapterType` are optional). The app checks those fields at runtime instead of casting.
- New email wallets hold no CELO. GoodDollar's faucet (`@goodsdks/citizen-sdk` `ClaimSDK.claim`/`triggerFaucet`) tops up verified users, falling back to GoodDollar's API when the wallet cannot pay gas.
