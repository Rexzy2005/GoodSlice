# Active Execution Plan — Frontend Foundation and Integration Readiness

## 1. Objective

Prepare GoodSlice for professional frontend implementation by establishing a verified technical baseline, scaffolding the frontend correctly, and creating the minimum architecture required for later feature work.

This plan covers the transition from documentation-only state to a working frontend foundation.

The goal is not to build every product feature immediately.

The goal is to produce a stable, verified foundation that future implementation can extend without architectural rework.

---

## 2. Current Phase

Status: **Frontend foundation implementation readiness — awaiting separate installation/implementation authorization**

Dependency research and ADR creation are complete. [ADR-0001](../../decisions/ADR-0001-frontend-stack.md) governs the approved exact frontend baseline. Its declared status is **Proposed**; the user explicitly directed that its approved baseline choices control implementation planning. This plan records that authorization without changing the ADR status or resolving its gates.

Current stage:

```text
Repository orchestration
        ↓
Technical verification
        ↓
Dependency baseline
        ↓
Application scaffold
        ↓
Core architecture
        ↓
First verified frontend foundation
```

Application implementation has not yet started. This documentation synchronization task does not authorize package installation or scaffolding.

### Immediate next implementation milestone

Once separately authorized:

1. Create package manifests and a lockfile using the approved exact baseline in ADR-0001; exclude deferred GoodDollar packages.
2. Resolve and inspect the dependency graph, including wagmi/core/connectors and critical transitives, and perform the ADR-required security/audit review before feature work. Do not bypass peer constraints or silently replace approved versions.
3. Establish the Next.js App Router foundation, strict TypeScript and Tailwind configuration.
4. Establish linting, typecheck, unit-test, production-build (including the Serwist worker build), and end-to-end-test infrastructure.
5. Establish the existing client/server, API, wallet/runtime, React–Phaser, shared deterministic-package, state-ownership and static-only PWA boundaries.
6. Run the foundation quality gates; record actual results and stop at unresolved integration gates in section 20. A scaffold does not prove MiniPay or GoodDollar integration.

---

## 3. Scope

This execution plan includes:

- verify third-party integration requirements
- confirm compatible dependency versions
- record reusable research
- record required architecture decisions
- scaffold the monorepo/workspace
- scaffold the Next.js frontend
- establish TypeScript configuration
- establish design tokens and base styling
- establish frontend providers
- establish environment validation
- establish API boundary
- establish Web3 boundary
- establish MiniPay runtime detection boundary
- establish game-runtime boundary
- establish shared deterministic package boundary
- establish testing infrastructure
- establish baseline quality checks
- confirm production build succeeds

This plan does not include complete implementation of:

- full Phaser gameplay
- final visual design for every screen
- production authentication
- full GoodDollar UBI integration
- production tournament contracts
- backend replay engine
- event indexer
- payout generation
- production deployment

Those become separate execution plans or later phases.

---

## 4. Required Reading Before Work

Before modifying application code, read:

1. `AGENTS.md`
2. `docs/PROJECT.md`
3. `ARCHITECTURE.md`
4. `docs/CURRENT_STATE.md`
5. this execution plan
6. relevant files under `docs/research/`
7. [ADR-0001](../../decisions/ADR-0001-frontend-stack.md) and other applicable decisions under `docs/decisions/`

Do not depend on previous chat-session context.

---

## 5. Phase 1 — Verify Technical Baseline

Status: **Dependency research and frontend baseline ADR complete; integration verification deferred to the applicable gates**

Research was recorded on 2026-10-07 in [dependency-baseline.md](../../research/dependency-baseline.md) and informed [ADR-0001](../../decisions/ADR-0001-frontend-stack.md). Core direct peers/engines were checked; no installation, lockfile generation, scaffolding or application verification has occurred. The earlier research-review checkpoint is complete for baseline planning.

The research scope below is retained as the completed research record; do not repeat stack selection. Unresolved integration and runtime verification remains tracked in section 20 and the ADR.

Required areas:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Phaser
- wagmi
- viem
- standard-browser wallet UI
- TanStack Query
- Zustand
- GoodDollar
- MiniPay
- Celo
- Serwist/PWA integration
- Zod
- Vitest
- Playwright

For each relevant integration, record:

- selected version
- compatibility constraints
- official source
- relevant implementation requirements
- verification date

Store reusable results under:

```text
docs/research/
```

### Phase 1 Acceptance Criteria

- [x] Required technologies have been checked against current official documentation.
- [ ] Full integration compatibility has been confirmed (core direct peer/engine intersection checked; SDK/MiniPay and runtime verification pending).
- [x] No package version was selected purely from memory.
- [x] Relevant findings are recorded in `docs/research/`.
- [x] Known conflicts are documented rather than silently resolved.
- [x] Frontend baseline choices are recorded in ADR-0001 and authorized for implementation planning; its six integration gates remain unresolved.

---

## 6. Phase 2 — Establish Dependency Baseline

Status: **Pending**

Implement the exact baseline governed by ADR-0001 once installation is separately authorized. The research is supporting evidence, not an alternative version authority.

The baseline must include only dependencies required for the first implementation phase.

Avoid speculative packages.

Required categories:

### Application

- Next.js
- React
- TypeScript

### Styling

- Tailwind CSS

### Server/Remote State

- TanStack Query

### Local UI State

- Zustand

### Validation

- Zod

### Game

- Phaser

### Blockchain

- wagmi
- viem
- approved standard-browser wallet UI

### External Integrations

- GoodDollar SDK adoption is blocked by ADR-0001 gate 6; do not install GoodDollar packages in the foundation baseline
- MiniPay-compatible wallet integration

### PWA

- Serwist integration compatible with the selected Next.js bundler

### Testing

- Vitest
- Playwright
- supporting test utilities only where required

Do not install packages merely because they may be useful later.

### Phase 2 Acceptance Criteria

- [x] Frontend baseline versions are selected in ADR-0001.
- [ ] Resolved dependency graph is inspected and verified before feature work; direct peer research alone is insufficient.
- [ ] Package manifest reflects the approved baseline.
- [ ] Lockfile is generated and committed.
- [ ] No unnecessary major dependencies are introduced.
- [x] Frontend dependency choices and constraints are documented in ADR-0001.

---

## 7. Phase 3 — Scaffold Repository

Status: **Pending**

Create the initial workspace structure.

Target high-level structure:

```text
goodslice/
├── apps/
│   └── web/
│
├── packages/
│   ├── shared/
│   └── contracts/
│
├── docs/
│
├── AGENTS.md
└── ARCHITECTURE.md
```

The frontend implementation begins under:

```text
apps/web/
```

Shared deterministic game logic belongs under:

```text
packages/shared/
```

Contract work belongs under:

```text
packages/contracts/
```

Do not move frontend-specific application code into `packages/shared/`.

### Phase 3 Acceptance Criteria

- [ ] Workspace installs successfully.
- [ ] Workspace boundaries are clear.
- [ ] Application package can run independently.
- [ ] Shared package can be imported without circular dependencies.
- [ ] Repository structure matches the architecture.
- [ ] No placeholder architecture contradicts `ARCHITECTURE.md`.

---

## 8. Phase 4 — Scaffold Web Application

Status: **Pending**

Create the Next.js App Router application.

Establish:

- root layout
- global stylesheet
- base metadata
- route structure
- font loading
- providers boundary
- error handling boundary
- loading strategy
- environment validation
- base configuration

Initial routes should exist for:

```text
/
 /play
 /tournament
 /shop
 /leaderboard
 /rewards
 /get-gd
 /profile
```

At this stage, routes may contain intentional minimal shells.

Do not pretend placeholder route content represents completed features.

### Phase 4 Acceptance Criteria

- [ ] Application starts locally.
- [ ] Every required initial route resolves.
- [ ] No route contains unnecessary duplicated infrastructure.
- [ ] Client components are used only where browser behavior requires them.
- [ ] Production build succeeds.
- [ ] TypeScript strict mode is enabled.
- [ ] No type errors remain.

---

## 9. Phase 5 — Establish Design Foundation

Status: **Pending**

Implement the Night Market design tokens from the product specification.

Required color tokens:

```text
Night    #0E1712
Canopy   #18261D
Vine     #2A3D31
Mango    #FFB627
Leaf     #2FBF71
Melon    #FF4D6D
Sky      #3BA8FF
Ember    #E5383B
Cream    #F7F2E7
Mist     #A7B3AA
```

Preserve semantic usage:

- Mango → primary/spending actions
- Leaf → earning/rewards
- Sky → G$ values and relevant links
- Melon → highlights/combo/streak states
- Ember → errors/danger
- Cream → primary text
- Mist → secondary text

Establish reusable primitives only where they immediately benefit implementation.

Avoid prematurely building a large design-system library.

### Phase 5 Acceptance Criteria

- [ ] Design tokens exist in one canonical location.
- [ ] Required colors are not scattered as repeated literals.
- [ ] Typography is established.
- [ ] Base mobile layout is functional.
- [ ] Core contrast remains readable.
- [ ] Initial UI works at a minimum 360-pixel viewport width.

---

## 10. Phase 6 — Establish Provider Architecture

Status: **Pending**

Create the application provider composition.

Expected responsibilities include:

- TanStack Query
- Web3/wallet configuration
- supported UI-level providers

Provider setup must remain centralized.

Do not wrap the application in unnecessary client providers.

Conceptual structure:

```text
Root Layout
    |
    v
Application Providers
    |
    +-- Query Provider
    |
    +-- Web3 Provider
    |
    +-- other confirmed providers only
```

### Phase 6 Acceptance Criteria

- [ ] Provider composition exists in one clear boundary.
- [ ] Query client behavior is configured correctly.
- [ ] Web3 configuration is not duplicated.
- [ ] Server-only modules do not leak into client bundles.
- [ ] Client boundaries remain narrow.

---

## 11. Phase 7 — Establish Environment Configuration

Status: **Pending**

Create a validated environment/configuration layer.

Separate:

### Browser-safe values

Examples:

- active public network
- public RPC endpoint
- WalletConnect/Reown project identifier
- public G$ contract address
- Shop contract address
- Tournament contract address
- public application URL

### Server-only values

Examples:

- database URL
- session secret
- results-signer private key
- privileged server configuration

Use runtime validation.

Application modules should consume the validated configuration layer rather than calling `process.env` throughout the codebase.

### Phase 7 Acceptance Criteria

- [ ] `.env.example` exists.
- [ ] No secret values are committed.
- [ ] Public and server-only values are clearly separated.
- [ ] Invalid required configuration fails clearly.
- [ ] Production addresses are not scattered through UI components.

---

## 12. Phase 8 — Establish API Boundary

Status: **Pending**

Create a typed application API layer.

Initial capabilities must correspond to:

- authentication/session
- start round
- finish round
- leaderboard
- inventory
- inventory use
- rewards
- shop items

Use runtime validation at external response boundaries where appropriate.

UI components should consume feature hooks/services rather than raw `fetch()` calls.

Provide a clean separation between:

```text
UI
 ↓
Feature hooks
 ↓
API abstraction
 ↓
HTTP implementation
```

A development mock implementation may exist if backend endpoints are unavailable, but:

- it must be explicitly identified as mock behavior
- it must not fake blockchain transaction success
- it must be replaceable without modifying feature UI

### Phase 8 Acceptance Criteria

- [ ] API interface exists.
- [ ] HTTP implementation boundary exists.
- [ ] Response validation strategy exists.
- [ ] UI does not scatter raw request logic.
- [ ] Mock behavior, if used, is clearly marked.
- [ ] Missing backend schemas are not invented silently.

---

## 13. Phase 9 — Establish Wallet/Web3 Boundary

Status: **Pending**

Create centralized Web3 infrastructure for:

- network configuration
- supported wallet connectors
- wallet/account state
- MiniPay detection
- G$ balance reads
- contract configuration
- transaction lifecycle primitives
- block explorer links
- token unit helpers

Feature UI must not directly manage low-level connector configuration.

Required runtime distinction:

```text
MiniPay
    → injected provider
    → automatic connection
    → no generic wallet picker

Standard Web/PWA
    → approved wallet selection flow
    → supported connectors
```

Exact implementation must follow verified installed versions.

### Phase 9 Acceptance Criteria

- [ ] MiniPay detection is centralized.
- [ ] Standard-web wallet behavior is centralized.
- [ ] Wallet runtime state is normalized for feature consumption.
- [ ] Chain configuration has one canonical source.
- [ ] Contract addresses have one canonical source.
- [ ] G$ unit conversion avoids floating-point arithmetic.
- [ ] No production transaction is simulated locally.

---

## 14. Phase 10 — Establish Transaction State Model

Status: **Pending**

Implement reusable transaction lifecycle handling.

Required conceptual states:

```text
idle
preparing
awaiting_wallet
submitted
confirming
confirmed
synchronizing
success
rejected
failed
```

Do not represent all transaction behavior with a single loading boolean.

Normalize common failure categories where practical:

- user rejection
- insufficient balance
- wrong network
- RPC/network failure
- contract revert
- synchronization timeout/failure

### Phase 10 Acceptance Criteria

- [ ] Transaction lifecycle model exists.
- [ ] Rejected and failed states are distinguishable.
- [ ] Blockchain confirmation is distinguishable from backend synchronization.
- [ ] Transaction components/hooks can be reused by shop, tournament, and rewards.
- [ ] No feature grants authoritative state based solely on transaction submission.

---

## 15. Phase 11 — Establish Phaser Boundary

Status: **Pending**

Create the browser-only game host without implementing full gameplay.

Required foundation:

- client-only Phaser loading
- game lifecycle management
- resize behavior
- visibility handling
- typed React ↔ Phaser bridge
- clean teardown

Initial bridge contract should support only confirmed needs.

Example game-to-React events:

- ready
- score changed
- lives changed
- power-up used
- game over
- error

Example React-to-game commands:

- start
- pause
- resume
- activate power-up

Do not implement frame-level React synchronization.

### Phase 11 Acceptance Criteria

- [ ] Phaser never executes during server rendering.
- [ ] Phaser initializes on the play route.
- [ ] Game runtime tears down cleanly.
- [ ] Resize handling works.
- [ ] Visibility pause/resume behavior exists.
- [ ] Bridge is typed.
- [ ] React is not updated every frame.

---

## 16. Phase 12 — Establish Shared Deterministic Package

Status: **Pending**

Create the shared package boundary required for deterministic replay.

Initial package may contain only contracts/interfaces until gameplay rules are implemented.

Expected eventual ownership includes:

- seeded RNG
- deterministic scoring
- replay-compatible input types
- deterministic game-event types
- shared simulation rules

Do not invent final gameplay mechanics solely to fill this package.

If backend/game rules remain undefined, establish the boundary and types needed without fabricating behavior.

### Phase 12 Acceptance Criteria

- [ ] Shared package exists.
- [ ] Web application can import it.
- [ ] Package does not depend on React or Phaser.
- [ ] Deterministic domain code remains framework-independent.
- [ ] No duplicate scoring implementation exists.

---

## 17. Phase 13 — Establish PWA Foundation

Status: **Pending**

Implement the initial PWA infrastructure according to the selected Next.js/Serwist integration.

Required baseline:

- manifest
- application icons
- installable metadata
- portrait-oriented application configuration where appropriate
- service-worker integration
- static asset caching strategy
- explicit protection against stale authoritative API data

Static resources may be cached where appropriate.

Do not cache authoritative mutable data such as:

- wallet balances
- inventory
- shop prices
- rewards
- leaderboard
- tournament state
- authentication state
- transaction state

### Phase 13 Acceptance Criteria

- [ ] Manifest resolves correctly.
- [ ] Service-worker configuration matches the actual Next.js bundler.
- [ ] Static-shell strategy is defined.
- [ ] Mutable authoritative APIs are not cached incorrectly.
- [ ] Installed application can load its intended shell.
- [ ] PWA configuration does not break production build.

---

## 18. Phase 14 — Establish Testing Baseline

Status: **Pending**

Set up:

- unit testing
- integration testing where appropriate
- Playwright end-to-end testing

Initial tests should prioritize architectural boundaries rather than superficial snapshot coverage.

Minimum foundation tests should cover:

- MiniPay detection
- runtime wallet branching
- environment validation
- API response validation
- transaction-state transitions
- critical route availability
- Phaser host lifecycle where practical

### Phase 14 Acceptance Criteria

- [ ] Unit test command works.
- [ ] End-to-end test command works.
- [ ] Initial meaningful tests pass.
- [ ] No test suite depends unnecessarily on production services.
- [ ] Critical architecture boundaries have at least baseline verification.

---

## 19. Phase 15 — Final Foundation Verification

Status: **Pending**

Run the complete repository quality gate.

Required checks:

```text
format
lint
typecheck
unit tests
integration tests where configured
production build
targeted end-to-end tests
```

Also verify:

- no committed secrets
- no accidental production private configuration
- no unexplained type suppression
- no unnecessary dependency duplication
- no invalid client/server imports
- no architecture violations introduced during scaffolding

### Phase 15 Acceptance Criteria

- [ ] Formatting passes.
- [ ] Lint passes.
- [ ] Typecheck passes.
- [ ] Tests pass.
- [ ] Production build succeeds.
- [ ] Required routes load.
- [ ] Repository documentation reflects actual state.
- [ ] Remaining blockers are explicitly documented.
- [ ] No known implementation is represented as complete when still mocked.

---

## 20. Known Blockers / Open Dependencies

### ADR-0001 integration gates — stop boundaries

The six [ADR-0001 gates](../../decisions/ADR-0001-frontend-stack.md#deferred--unresolved-gates) remain unresolved and block their respective implementation areas:

1. MiniPay session authentication.
2. GoodDollar SDK/documentation drift.
3. GoodDollar identity inside MiniPay, including verification and claim behavior.
4. GoodDollar non-production/test environment.
5. MiniPay/browser/WebView support floor.
6. GoodDollar package adoption.

Codex must stop at each affected boundary until its gate is resolved. Do not invent authentication, signing, SDK, environment or browser-support workarounds; do not install GoodDollar packages. Foundation structure and infrastructure may be established after separate authorization, but no gate is waived by that milestone or by existing phase checklists. Preserve interfaces without pretending blocked integrations work. ADR-required real-device and integration verification remains pending.

### MiniPay Authentication

Production MiniPay server authentication remains unresolved.

The frontend architecture must preserve a separate MiniPay-compatible authentication path.

Do not invent this protocol.

### Backend API Schemas

The build specification defines endpoint responsibilities but does not fully define all production request/response schemas.

Do not fabricate authoritative backend contracts without coordination.

Frontend mocks/interfaces may be used for development when clearly marked.

### Deployed Application Contracts

Production Shop and Tournament addresses do not yet exist in the current repository state.

Contract-dependent functionality must remain environment/configuration driven.

### Final Game Rules

Full deterministic gameplay/scoring rules have not yet been implemented.

Do not invent server-authoritative rules merely to complete scaffolding.

---

## 21. Progress

Research checkpoint (2026-10-07): official dependency research completed and recorded.

Current checkpoint: ADR-0001 created and designated by the user as the controlling approved baseline for planning; documentation synchronized for frontend foundation implementation readiness. Package installation and implementation still require separate authorization. Integration acceptance and Phases 2–15 implementation/verification remain unfinished.

Current overall progress:

```text
[x] Repository orchestration structure
[x] Agent operating rules
[x] Product specification
[x] Target architecture
[x] Current-state baseline
[x] Initial active execution plan

[x] Dependency research pass (remaining integration gates documented)
[ ] Resolve integration questions
[x] Frontend baseline ADR created (ADR-0001; declared status Proposed)
[x] Frontend baseline approved for implementation planning by user direction
[ ] Resolve ADR-0001 integration gates and record any required further decisions
[ ] Approved baseline installed and resolved graph verified
[ ] Repository scaffold
[ ] Web application scaffold
[ ] Design foundation
[ ] Provider architecture
[ ] Environment configuration
[ ] API boundary
[ ] Wallet/Web3 boundary
[ ] Transaction state model
[ ] Phaser boundary
[ ] Shared deterministic package
[ ] PWA foundation
[ ] Testing baseline
[ ] Final foundation verification
```

---

## 22. Definition of Done

This execution plan is complete only when:

1. the verified dependency baseline exists
2. reusable external research is recorded
3. required architecture decisions are recorded
4. the monorepo/workspace exists
5. the Next.js application runs
6. required routes exist
7. design tokens are established
8. validated configuration exists
9. API boundaries exist
10. wallet/Web3 boundaries exist
11. MiniPay runtime branching exists
12. transaction lifecycle infrastructure exists
13. Phaser can be mounted through the approved bridge
14. the shared deterministic package boundary exists
15. PWA infrastructure is operational
16. baseline tests exist and pass
17. lint/typecheck/build pass
18. `docs/CURRENT_STATE.md` reflects actual implementation
19. unresolved integration dependencies are documented
20. another developer or coding agent can continue without previous chat context

Do not close this plan based solely on scaffold generation.