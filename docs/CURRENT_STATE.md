# GoodSlice Current State

## Status

Project phase: **Frontend foundation implementation readiness**

Application implementation has not started yet.

Dependency research and ADR creation are complete. The approved planning baseline is governed by [ADR-0001](decisions/ADR-0001-frontend-stack.md); the [active execution plan](exec-plans/active/current.md) records its scope and authorization. No dependencies are installed.

---

## Established Project Documentation

The following project knowledge has been defined:

- `AGENTS.md` — agent operating rules and repository context-routing rules
- `docs/PROJECT.md` — authoritative product requirements and scope
- `ARCHITECTURE.md` — system architecture, ownership boundaries, trust boundaries, and implementation invariants

These documents are the current source of truth for implementation.

---

## Application Implementation

Current implementation state:

- Next.js application: not created
- frontend routes/screens: not created
- design system: not implemented
- wallet integration: not implemented
- MiniPay integration: not implemented
- GoodDollar integration: not implemented
- Phaser game runtime: not implemented
- React ↔ Phaser bridge: not implemented
- shared deterministic simulation: not implemented
- backend API routes: not implemented
- smart contracts: not implemented in this repository
- PWA/service worker: not implemented
- automated tests: not implemented
- CI/CD: not configured

Do not infer implementation from documentation alone.

---

## Confirmed Target Architecture

The planned product is one web codebase serving:

- normal web browsers
- installable PWA
- MiniPay Mini App

The application is expected to use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Phaser for browser gameplay
- wagmi + viem for supported blockchain interaction
- a standard-web wallet UI layer
- TanStack Query for remote/server state
- Zustand only for appropriate local UI state
- GoodDollar integration for G$
- a shared deterministic game package for client/server replay compatibility

Exact frontend versions and runtime choices are governed by ADR-0001; the eventual manifest and lockfile will record installed versions. GoodDollar package adoption remains deferred.

---

## Confirmed Product Boundaries

The following architectural rules are already established:

- normal gameplay remains off-chain
- players sign their own blockchain transactions
- the backend never signs transactions for players
- final scores are not trusted directly from the browser
- deterministic scoring/replay logic must be shared by client and server
- Phaser remains isolated from React through a typed bridge
- high-frequency game state must not be pushed through React
- blockchain transaction confirmation and backend/indexer synchronization are separate states
- inventory must not be granted optimistically from a submitted transaction
- MiniPay and normal-browser wallet behavior may differ
- production secrets and privileged keys must remain server-side

---

## Known External Integration Dependency

### MiniPay Authentication

The original build specification defines Sign-In with Ethereum for session establishment.

Current MiniPay requirements conflict with forcing users to sign arbitrary messages merely to access or authenticate to a Mini App.

Therefore:

- standard-browser authentication may use the approved SIWE flow
- MiniPay authentication must remain separately abstracted
- the production MiniPay server-session strategy is not yet resolved
- no implementation should invent or silently assume a MiniPay authentication protocol

This must be resolved through verified research and an architectural decision before MiniPay authentication is considered production-complete.

---

## Frontend Baseline and Unresolved Integration Gates

The completed [dependency research](research/dependency-baseline.md), verified on 2026-10-07, informed ADR-0001. Its declared status remains **Proposed**, while the user has explicitly designated its approved choices as the controlling implementation-planning baseline. Research remains partially verified; package resolution and application/runtime validation are not complete.

Unresolved integration gaps:

- GoodDollar claim documentation differs from published citizen SDK 1.2.7 exports and return types.
- GoodDollar face verification requires wallet message signing; its supported/allowed MiniPay path remains unconfirmed.
- The citizen SDK does not configure Celo Sepolia; the supported non-production identity/UBI environment must be agreed.
- Tailwind v4 browser floors need an accepted MiniPay/device support matrix.

ADR-0001 controls all six integration gates, including GoodDollar package adoption: do not install GoodDollar SDK packages until its required gates are resolved. Existing MiniPay session-authentication, backend-schema, contract-deployment and deterministic-game-rule dependencies remain unresolved. Stop at affected boundaries rather than inventing workarounds.

---

## Immediate Next Action

Await separate authorization to begin the foundation milestone in the active plan: exact manifests/lockfile, dependency-graph verification, Next.js App Router, strict TypeScript, Tailwind, quality-check infrastructure and existing architectural boundaries. This synchronization pass does not authorize installation or implementation, and none of the six ADR gates is resolved.

---

## Verification State

No application build, typecheck, lint, test, or runtime verification exists yet because implementation has not started.

Documentation completion must not be interpreted as product implementation completion.

---

## Update Rule

Update this file only when the meaningful state of the project changes.

Examples:

- scaffolding is completed
- a major capability becomes operational
- a blocker appears or is resolved
- an integration becomes functional
- a feature changes from mocked to real
- an implementation assumption materially changes

Do not use this file as a chronological development log.

Git history and execution plans should contain detailed implementation history.