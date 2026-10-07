# ADR: GoodSlice Frontend Dependency Baseline

- **Status:** Proposed
- **Date:** 2026-10-07
- **Source:** `docs/research/frontend-dependency-baseline.md`
- **Decision scope:** Frontend runtime, framework, wallet, PWA, testing, and blockchain integration baseline

## Context

GoodSlice needs a frontend dependency baseline before application scaffolding and implementation begin.

The dependency research verified proposed package versions, direct peer ranges, runtime engine requirements, selected SDK exports, and official integration guidance. It did **not** verify a resolved transitive dependency graph, production build, strict typecheck, real-device MiniPay behavior, service-worker behavior, or GoodDollar identity/claim execution. The research therefore remains partially verified rather than an implementation-ready proof. :chatgpt-content-reference{index="0"}

This ADR separates the baseline choices approved for implementation planning from integration questions that remain blocked on additional verification.

---

## Decision

### Approved baseline choices

Use the following as the GoodSlice frontend baseline:

| Area | Approved choice |
| --- | --- |
| Runtime | Node.js `24.21.0 LTS` |
| Framework | Next.js `16.4.0` using App Router |
| UI runtime | React / React DOM `19.3.0` |
| Language | TypeScript `5.9.3`, strict mode |
| Styling | Tailwind CSS `4.3.3` with `@tailwindcss/postcss` |
| Game runtime | Phaser `4.2.1` |
| Wallet hooks | wagmi `2.19.5` |
| Chain client | viem `2.57.3` |
| Standard-web wallet UI | RainbowKit `2.2.11` |
| Remote/server state | TanStack Query `5.104.1` |
| Local UI state | Zustand `5.0.15` |
| Validation | Zod `4.6.5` |
| PWA/service worker | Serwist `9.5.13` |
| Worker build | esbuild `0.28.2` |
| Unit testing | Vitest `5.0.3` with Vite `8.3.3` |
| End-to-end testing | Playwright `1.63.0` |

Pin direct dependencies exactly when manifests are created. Do not establish the baseline using `latest`, caret ranges, peer overrides, or `--legacy-peer-deps`. :chatgpt-content-reference{index="1"} :chatgpt-content-reference{index="2"}

### Approved implementation constraints

- Keep React and React DOM on the same version.
- Keep TypeScript and wagmi patch compatibility under review together.
- Use Tailwind v4's PostCSS integration rather than a Tailwind v3 scaffold.
- Keep Phaser browser-only and lazy-load the game route.
- Use TanStack Query for remote/server/blockchain state.
- Restrict Zustand to local UI state and avoid global-store access from React Server Components.
- Use RainbowKit only for the standard web wallet experience.
- In MiniPay, detect the injected EIP-1193 provider and bypass the normal wallet picker.
- Let wagmi own its compatible internal `@wagmi/core` and connector versions rather than installing independent latest versions.
- Use Turbopack with Serwist configurator mode rather than the Webpack-only `withSerwist` integration.
- Keep service-worker caching restricted to explicitly safe static/offline assets and routes.
- Use canonical Celo chain definitions through viem.
- Do not introduce ContractKit merely for Celo connectivity. :chatgpt-content-reference{index="3"} :chatgpt-content-reference{index="4"} :chatgpt-content-reference{index="5"}

---

## Deferred / unresolved gates

The following are **not approved as solved** and must remain implementation blockers where relevant.

### 1. MiniPay session authentication

MiniPay prohibits requiring message signing merely for site access/authentication. The prior SIWE expectation therefore cannot be assumed to work.

The existing separation between wallet connection and application authentication must remain intact until a backend/security-approved protocol is defined. :chatgpt-content-reference{index="6"}

### 2. GoodDollar SDK documentation drift

GoodDollar documentation and published SDK behavior do not fully agree.

If GoodDollar support is implemented, use the actual published SDK types/exports and normalize them behind a GoodSlice integration boundary. Do not suppress type errors to imitate stale examples. :chatgpt-content-reference{index="7"}

### 3. GoodDollar identity flow inside MiniPay

It is not yet verified that GoodDollar identity/face-verification signing behavior is supported and policy-compatible inside MiniPay.

Do not declare "Get G$" supported until provider signing, redirects/callbacks, and claim behavior are verified on-device. :chatgpt-content-reference{index="8"}

### 4. GoodDollar non-production environment

The researched GoodDollar SDK does not expose Celo Sepolia as a supported protocol environment.

Do not map mainnet GoodDollar addresses onto Celo Sepolia. A supported test environment, funding path, fee strategy, and identity/claim environment must be confirmed first. :chatgpt-content-reference{index="9"}

### 5. Browser / MiniPay WebView floor

Tailwind v4's documented browser requirements must be validated against the actual MiniPay Android/iOS device population.

No GoodSlice minimum WebView/browser support matrix is approved yet. :chatgpt-content-reference{index="10"}

### 6. GoodDollar package adoption

`@goodsdks/citizen-sdk` is a researched integration candidate, not part of the approved installed baseline.

Do not install GoodDollar SDK packages until the MiniPay identity and supported-environment gates above are resolved. :chatgpt-content-reference{index="11"}

---

## Pre-implementation verification tasks

Before treating this ADR as an implementation-proven baseline:

1. Create the package manifest and lockfile using the exact approved direct versions.
2. Resolve the dependency graph without `--legacy-peer-deps`, force flags, or peer overrides.
3. Inspect resolved wagmi/core/connector versions and other critical transitives.
4. Run security/audit review on the resolved dependency tree.
5. Run strict TypeScript typecheck.
6. Run linting and unit tests.
7. Run the production Next.js build.
8. Run the Serwist worker build after the Next.js build.
9. Verify SSR and hydration behavior.
10. Verify Phaser client-only lifecycle and route cleanup.
11. Verify service-worker caching does not cache authoritative APIs, RPC, sessions, inventory, prices, or rewards.
12. Verify RainbowKit, injected wallets, and WalletConnect in the standard web runtime.
13. Verify automatic MiniPay detection and connection on real supported devices.
14. Verify MiniPay transaction fee behavior for the actual GoodSlice payment path.
15. Verify browser/WebView compatibility against the product's supported-device matrix.
16. If GoodDollar is enabled, separately verify the approved SDK version, supported environment, identity flow, entitlement/claim flow, fee path, token addresses, decimals, and callback behavior.

The research explicitly did not run package resolution, build, typecheck, service-worker runtime tests, MiniPay device tests, or GoodDollar identity/claim tests, so none of those should be treated as already proven. :chatgpt-content-reference{index="12"}

---

## Consequences

### Positive

- Establishes one exact frontend baseline instead of allowing dependency drift.
- Keeps the wallet stack on a verified wagmi 2 / RainbowKit 2 compatibility line.
- Prevents GoodDollar documentation drift from leaking directly into application code.
- Keeps MiniPay-specific behavior isolated from the standard web wallet experience.
- Preserves Turbopack while allowing Serwist through configurator mode.
- Makes unresolved blockchain/authentication risks explicit before implementation.

### Trade-offs

- The baseline intentionally does not adopt every latest package major.
- GoodDollar functionality remains partially blocked.
- MiniPay authentication requires additional design work.
- Some architectural choices remain dependent on real-device verification.
- The ADR defines the intended baseline but does not itself prove production compatibility.

---

## Implementation rule

Codex may scaffold and implement against the **approved baseline choices** only after package installation is separately authorized.

Codex must **not invent solutions** for the unresolved gates, silently replace approved versions, introduce alternate wallet frameworks, add legacy GoodDollar stacks, bypass peer constraints, or declare MiniPay/GoodDollar behavior verified without the required tests.

When a blocked integration is reached, preserve the architectural boundary, document the blocker, and stop at the boundary rather than improvising around it.