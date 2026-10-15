# GoodSlice Current Handoff

Mobile header and borderless surface update (2026-10-15): mobile logo stays left, hamburger is right, and wallet control lives inside the right-hand slide menu. Desktop wallet remains in the header. The drawer releases its native modal before the standard wallet picker opens, avoiding a body-portal trapped behind the dialog. Unavailable-wallet explanations remain inside the drawer. Card borders were removed across landing/lobby/shared panels; color surfaces preserve separation and keyboard focus outlines remain. No dependencies or browser use. Verification: strict TypeScript, all 11 targeted drawer/wallet/balance tests and git diff checks pass. Real-device layout and wallet portal interaction remain unverified.

Updated: 2026-10-15

## Current work

2026-10-15: replaced the lobby and public landing with new Night Market layouts. Mobile game navigation now uses a sliding native dialog below 721px with a close button, Escape/native focus containment, route dismissal and body scroll restoration; desktop keeps its sidebar. Lobby balance uses the existing WalletContext and never shows cached values when disconnected, offline, wrong-network or errored. Rajdhani 500/700 now applies to the entire site, wallet typography and offline fallback. No new dependencies or integration behavior. Strict TypeScript, all 65 unit tests across 19 files and git diff checks pass. Browser/device and fresh production-build verification remain pending; lint execution was blocked by the environment sandbox.

## Preserved behavior and boundaries

Arena remains a cosmetic, unscored seven-fruit cutting preview with bounded slash/juice effects and opt-in synthesized audio. Pause settings contain only difficulty, sound on/off and fruit selection. The modal is outside the touch-canceling board; closing it leaves gameplay paused. Wallet selection remains in the lobby shell, never in the arena. App-owned icons use lucide-react 0.468.0.

All six ADR-0001 gates remain unresolved. Authoritative gameplay rules, backend/session contracts and deployed contract interfaces remain unavailable. Do not fabricate scores, rewards, payments or GoodDollar claims.

## Constraints and verification

No installs, dependency changes, dev servers or user-PC browser use. Latest source passes strict TypeScript and all 65 unit tests across 19 files. E2E navigation expectations were updated for the drawer, but browser tests were not run. The latest font precache changes have not had a production/worker build. Earlier browser observations do not verify this revision.

## Exact next action

Collect user feedback on the new landing, lobby, balance card and mobile drawer at mobile and desktop widths, continuing source-based refinements without opening their browser. When production verification is appropriate, build the app and service worker and confirm the two Rajdhani assets are precached. Keep scored gameplay disabled until authoritative rules and backend contracts are supplied.
