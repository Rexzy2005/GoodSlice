# GoodSlice Current State

## Status

Frontend foundation passes application/worker/shared typechecks, unit tests and the production/worker build; browser/device acceptance remains pending. The controlling baseline is [ADR-0001](decisions/ADR-0001-frontend-stack.md). Its declared status remains Proposed, with explicit user authorization to implement its approved choices. [ADR-0002](decisions/ADR-0002-workspace-package-manager.md) records pnpm and user-owned installation/server startup.

## What exists

- Exact pnpm workspace manifests for apps/web and packages/shared. The user has installed dependencies and generated pnpm-lock.yaml. Direct installed versions match the exact manifests; resolved wagmi internals are core 2.22.1 and connectors 6.2.0. No contracts package or GoodDollar SDK dependency. The separate root npm lockfile was left unchanged.
- Next.js App Router routes: /, /play, /tournament, /shop, /leaderboard, /rewards, /get-gd, /profile; server page composition and narrow client boundaries.
- Night Market tokens, responsive navigation/cards, wallet panel, loading/error/unavailable states and install guidance. Mobile browser verification at 360px remains pending.
- Central Query/Web3 providers; lazy standard RainbowKit provider and separate MiniPay injected provider with connection/retry state. Both use one concrete active chain and its single configured RPC transport; they do not declare both chains for one RPC URL. Wallet connection is not backend authentication.
- Central public/server configuration validation, environment example, Celo chain definitions, configured G$ balance/decimals reads and exact bigint conversion. Cached balances are hidden while the browser is offline. No deployment defaults or payment ABI/calls.
- Provisional typed API contracts, validated configurable HTTP adapter and an unavailable default adapter. Cancelled requests remain cancelled even during body decoding. No live backend or fake data. See [API_CONTRACTS.md](API_CONTRACTS.md).
- Transaction controller/hook and status UI distinguish submission, confirmation, synchronization, rejection and failure. Confirmation can be retried after an RPC failure without preparing/submitting another payment. Receipt identity is checked before interpreting success or revert. No live transaction action is enabled.
- Lazy Phaser 4 host, typed bridge, renderer-independent browser lifecycle, resize/visibility/teardown handling and initialization-failure cleanup. Shared package contains replay interfaces only. No playable rounds, RNG, scoring or authoritative replay implementation.
- Turbopack-compatible Serwist config, manifest, generated PNG icons, static offline document and production worker registration. No caching of mutable authoritative data is configured.
- Vitest/Playwright tests and source checks. No CI/deployment or production integration is established.

## Verification

Passed: requested pnpm --filter @goodslice/web exec tsc --noEmit; worker and shared-package typechecks; 35 Vitest tests including network transport, confirmation recovery, API cancellation, DOM host lifecycle and online-status regressions; architecture/exact-manifest and whitespace checks; Next.js 16.4.0 Turbopack production build and Serwist worker build. All required routes were prerendered. Generated worker inspection found 214 precache entries, all static chunks/icons/offline document, with no application-data paths.

Not verified: browser E2E/PWA runtime, wallet/device behavior and full dependency security audit. No user-started server was reachable at localhost:3000. The audit command could not start because the Windows shell sandbox refused execution; no audit result is claimed. No dependency, manifest or lockfile versions were changed, and no server was started. Custom source checks remain narrower than ESLint/a full formatter.

## Blockers and deliberate omissions

All six ADR-0001 gates remain: MiniPay session authentication; GoodDollar SDK/documentation drift; GoodDollar identity/claim in MiniPay; supported GoodDollar non-production environment; browser/WebView floor; GoodDollar package adoption. No workaround or SDK adoption was introduced.

Backend schemas/session security, actual deployment addresses/ABIs and deterministic gameplay rules remain undefined. Their buttons/services are unavailable. Environment credentials must be supplied separately. No balances, inventory, rewards, sessions, transactions or UBI claims are simulated.

Zustand is deferred until shared local UI state requires it. Exact lint/formatter and pnpm toolchain versions are not yet approved. Asset generation uses canonical tokens; no external image/font service is required.

## Next action

The user requested end-to-end development. Required clarification is pending: the location/content of approved gameplay rules and backend contracts, and the URL of a user-started application. Current repository documents still mark round duration, scoring/lives/power-up rules, deterministic replay details and backend authentication/persistence contracts as undefined. Do not make those authoritative by assumption.


Complete the security audit and browser tests against a server started by the user (test:e2e; test:pwa requires the production build). Fix any runtime defects without changing approved versions. Keep the active plan open until required verification succeeds. Then obtain/implement authoritative backend round/session contracts and deterministic rules, respecting the six integration gates.
