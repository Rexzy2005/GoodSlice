# GoodSlice Current State

## Status

Frontend foundation source is implemented; full application verification is pending. The controlling baseline is [ADR-0001](decisions/ADR-0001-frontend-stack.md). Its declared status remains Proposed, with explicit user authorization to implement its approved choices. [ADR-0002](decisions/ADR-0002-workspace-package-manager.md) records pnpm and user-owned installation/server startup.

## What exists

- Exact pnpm workspace manifests for apps/web and packages/shared. No pnpm workspace lockfile; no contracts package or GoodDollar SDK dependency. A root npm package-lock.json appeared during implementation and covers only TypeScript 5.9.3; the agent left it unchanged. It does not resolve the workspace.
- Next.js App Router routes: /, /play, /tournament, /shop, /leaderboard, /rewards, /get-gd, /profile; server page composition and narrow client boundaries.
- Night Market tokens, responsive navigation/cards, wallet panel, loading/error/unavailable states and install guidance. Mobile browser verification at 360px remains pending.
- Central Query/Web3 providers; lazy standard RainbowKit provider and separate MiniPay injected provider with connection/retry state. Wallet connection is not backend authentication.
- Central public/server configuration validation, environment example, Celo chain definitions, configured G$ balance/decimals reads and exact bigint conversion. No deployment defaults or payment ABI/calls.
- Provisional typed API contracts, validated configurable HTTP adapter and an unavailable default adapter. No live backend or fake data. See [API_CONTRACTS.md](API_CONTRACTS.md).
- Transaction controller/hook and status UI distinguish submission, confirmation, synchronization, rejection and failure. No live transaction action is enabled.
- Lazy Phaser 4 host, typed bridge, resize/visibility/teardown handling. Shared package contains replay interfaces only. No playable rounds, RNG, scoring or authoritative replay implementation.
- Turbopack-compatible Serwist config, manifest, generated PNG icons, static offline document and production worker registration. No caching of mutable authoritative data is configured.
- Vitest/Playwright tests and source checks. No CI/deployment or production integration is established.

## Verification

Passed: all source syntax diagnostics using the locally available approved TypeScript 5.9.3; strict shared-package typecheck; architecture/exact-manifest checks; source whitespace checks; targeted dependency-light assertions for MiniPay detection, cache exclusions, async game teardown and transaction rejection/revert/indexer separation.

Not run: complete application/worker typecheck, Vitest suite, production/worker build, browser E2E/PWA, MiniPay devices, resolved dependency-graph/security audit. Application dependencies are absent; the agent did not install anything or start a server. Only TypeScript was locally available. Narrow custom source checks are not ESLint or a full formatter. UI/runtime correctness is not yet verified.

## Blockers and deliberate omissions

All six ADR-0001 gates remain: MiniPay session authentication; GoodDollar SDK/documentation drift; GoodDollar identity/claim in MiniPay; supported GoodDollar non-production environment; browser/WebView floor; GoodDollar package adoption. No workaround or SDK adoption was introduced.

Backend schemas/session security, actual deployment addresses/ABIs and deterministic gameplay rules remain undefined. Their buttons/services are unavailable. Environment credentials must be supplied separately. No balances, inventory, rewards, sessions, transactions or UBI claims are simulated.

Zustand is deferred until shared local UI state requires it. Exact lint/formatter and pnpm toolchain versions are not yet approved. Asset generation uses canonical tokens; no external image/font service is required.

## Next action

The user installs the committed manifests using pnpm, generating the lockfile. Resume with resolved graph review and full foundation checks against those dependencies; fix implementation defects without changing approved versions. Browser checks use a server started by the user. Keep the active plan open until required verification succeeds. Then obtain/implement authoritative backend round/session contracts and deterministic rules, respecting the six integration gates.
