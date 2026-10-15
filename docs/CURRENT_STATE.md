# GoodSlice Current State

Mobile header and borderless surface update (2026-10-15): mobile logo stays left, hamburger is right, and wallet control lives inside the right-hand slide menu. Desktop wallet remains in the header. The drawer releases its native modal before the standard wallet picker opens, avoiding a body-portal trapped behind the dialog. Unavailable-wallet explanations remain inside the drawer. Card borders were removed across landing/lobby/shared panels; color surfaces preserve separation and keyboard focus outlines remain. No dependencies or browser use. Verification: strict TypeScript, all 11 targeted drawer/wallet/balance tests and git diff checks pass. Real-device layout and wallet portal interaction remain unverified.

## Landing, lobby and mobile navigation

2026-10-15: replaced the lobby and public landing with new Night Market layouts. Mobile game navigation now uses a sliding native dialog below 721px with a close button, Escape/native focus containment, route dismissal and body scroll restoration; desktop keeps its sidebar. Lobby balance uses the existing WalletContext and never shows cached values when disconnected, offline, wrong-network or errored. Rajdhani 500/700 now applies to the entire site, wallet typography and offline fallback. No new dependencies or integration behavior. Strict TypeScript, all 65 unit tests across 19 files and git diff checks pass. Browser/device and fresh production-build verification remain pending; lint execution was blocked by the environment sandbox.

## Status

Latest user correction (2026-10-15): pause settings are limited to difficulty, sound on/off and fruit selection. Removed volume, audio demos, fullscreen settings and guidance from the modal. Easy/normal/hard control local-preview spawn pace, speed and wave size; fruit selection controls future spawns and cannot be empty. Changing configuration resets the visual wave while preserving pause. These are unscored preview controls, not authoritative game rules. Ready UI now has one start action and a mode/fruit summary. All app-owned UI icons use the shared lucide-react wrapper (0.468.0); installation of exact 0.468.0 was subsequently observed in node_modules. No agent installs or browser use. Strict TypeScript and all 58 unit tests pass; visual/device acceptance remains pending.

Pause settings (2026-10-15): the paused board has a Settings button opening a native modal dialog outside the board gesture boundary. It exposes sound enable/mute, 0–100% session volume, sound-only cue previews, fullscreen and input guidance. Done/Escape dismiss settings without resuming gameplay. Volume survives dialog reopening within the arena session; no reload persistence is claimed. No permanent settings card or arena wallet/footer navigation was reintroduced. PC-browser use remains prohibited. Pause-settings verification: strict TypeScript, all eight arena unit tests and git diff checks pass. Native dialog rendering, focus behavior and device interaction remain unverified in a real browser.

Latest arena cleanup (2026-10-15): removed the expandable controls/sound card, its volume and cue-demo UI, and the bottom lobby/wallet row. Arena retains one header lobby link and the quick gameplay controls. Sound toggle remains with 35% volume. Desktop HUD elements have explicit columns in one row. Wallet selection stays outside gameplay in the lobby shell. TypeScript, all seven arena tests and git diff checks pass. No browser use; desktop layout has not been visually verified.

Arena follow-up: compact lobby/title header and stat cards replace the oversized branding row. The entire board, canvas and overlays now own touch gestures through touch-action:none plus a native non-passive touchmove listener; default page panning is prevented without stopping Phaser event propagation. Outside-board scrolling remains available. TypeScript, git diff checks and all seven arena unit tests pass after rerunning one initial timeout. Real-device confirmation remains pending; do not use the PC browser.

2026-10-15: mobile-first arena layout refined with stable viewport sizing, safe-area padding, portrait/short-landscape adaptations and always-visible quick controls. The user prohibits PC-browser use; the latest layout has not been visually verified. Earlier Chrome observations below apply only to previous revisions.

The public landing, game lobby and dedicated wooden-board interface are implemented. The airborne-fruit update passes strict TypeScript and all 52 unit tests. The preceding effects update passed the production/worker build; that build has not been repeated for the current airborne-fruit revision. Desktop arena visual and preview-control smoke checks pass in the user-started Chrome session. Full E2E and mobile/device acceptance remain pending.

## Implemented boundaries

- pnpm workspace with apps/web and framework-independent packages/shared. Installed exact baseline remains governed by ADR-0001 and user authorization; ADR-0002 records user-owned installation and server startup. No dependency versions or lockfiles changed in this UI pass.
- / is the public landing. Launch game opens /play, the lobby. Open the board navigates to /play/arena. Existing tournament, shop, leaderboard, rewards, get-gd and profile routes retain their URLs. Only the arena mounts Phaser. It now uses the focused (arena) route-group layout; the lobby and other game pages retain (game).
- Self-hosted Rajdhani is used throughout the site, including marketing and the offline fallback. Font provenance and license are recorded in research/site-typography.md. The old user-provided font file is preserved but unused and excluded from new precaching.
- Night Market design, official locally bundled Lucide icons, mobile navigation, reduced-motion handling and separate public/game layouts. The arcade header owns standard-web wallet selection; MiniPay retains automatic injected connection without a normal wallet picker.
- Centered reference-style playground capped at 1440px with quick gameplay controls below the board and no settings/wallet footer, using generated walnut/brass board artwork and transparent fruit ready-screen art (see research/playground-assets.md), score/lives/round HUD, bridge-driven renderer pause/resume, browser fullscreen with failure handling, expandable instructions and unavailable inventory dock. Unknown readings remain explicitly unknown. No scores, lives, timers or power-up rules are invented.
- Central validated configuration, single active Celo chain/RPC configuration, exact bigint token helpers and configured G$ balance reads. Offline balances are hidden. No deployment/ABI defaults.
- Provisional typed API contracts and configurable validated HTTP adapter; the default API is unavailable. Request cancellation is preserved. Authentication and GoodDollar retain explicit gated interfaces.
- Transaction lifecycle distinguishes submission, receipt confirmation and backend synchronization. Confirmation retry does not resubmit a payment. No live payment actions are enabled.
- Explicit cosmetic cutting preview: intact melon/orange/plum/kiwi/lemon/apple/peach textures, staggered bottom-up launches, gravity-driven rotating flight, swipe-oriented halves that inherit momentum, bounded airborne juice and tapered blade trails that fade on pointer release. Translucent fruit-colored pools, streaks and satellite droplets linger for 35 seconds, fading over the last seven seconds; 40 splatter groups maximum, cleared on preview reset/resize/teardown. Up to six whole fruit and 24 halves remain active; fallen objects are destroyed. Resizing resets the visual wave. Opt-in original synthesized click/swipe/cut/splash/boom/fail/success/combo sounds have mute, volume, polyphony/rate limits and hidden-page/teardown cleanup. No preview action creates an authoritative round, score or reward.
- Browser-only Phaser host and lifecycle/visibility cleanup; shared package contains replay interfaces only. No deterministic gameplay implementation or playable rounds.
- Static-only Serwist PWA, generated icons and offline fallback. Latest worker has 223 precache URLs (8.65 MB); inspection confirms both new WebP playground assets and the new font are included, while the old font is excluded. Mutable authoritative data is not intentionally cached.

The latest feedback pass adds seven fruit kinds, fruit-specific flesh/juice, resampled tapered slash trails and persistent board stains (40 groups, 35-second lifetime). Chrome visual inspection confirmed visible stains after airborne effects faded. Mobile performance and audible quality remain unverified.

## Verification limits

2026-10-15 verification: strict TypeScript and git diff checks pass. The main Vitest run passed 45 tests but two workers timed out before startup; rerunning those two files separately passed all nine tests. All 54 tests passed across these runs, not in one clean suite run. No browser, device or fresh production-build verification was performed for this UI revision.

Production/worker build with strict TypeScript, all 52 unit tests across 16 files, architecture/exact-manifest, whitespace and git diff checks pass. Built HTML confirms /play links to the board without mounting its host; /play/arena contains the host and HUD. This is not visual/browser acceptance.

The user-started localhost:3000 arena is reachable in Chrome; desktop ready-screen composition, preview entry, controls disclosure, pause and preview exit were inspected; the latest runtime was reloaded and airborne fruit artwork observed. A hydration warning traces to extension-injected data-qb-installed/suppresshydrationwarning attributes on html; application warnings were not suppressed. Full E2E, mobile layout, touch cutting, audible sound quality, fullscreen on devices, MiniPay and wallet behavior remain unverified. Full dependency security audit remains pending; previous shell execution was refused. Custom source checks are narrower than ESLint/a full formatter.

## Blockers

All six ADR-0001 gates remain: MiniPay session authentication; GoodDollar SDK/documentation drift; MiniPay identity/claim flow; supported GoodDollar non-production environment; browser/WebView floor; GoodDollar package adoption.

Authoritative gameplay/scoring/duration/power-up rules, backend/session security contracts and deployed application contract interfaces/addresses remain undefined. No sessions, inventory, payments, prizes, identity or UBI claims are simulated. Zustand remains deferred without a current shared-state responsibility.

## Next action

Continue source-based UI refinement and collect user feedback on mobile portrait/landscape. Do not use the user’s PC browser. Visual/device acceptance of the current layout remains pending. Then implement authoritative gameplay/backend rules when supplied, respecting the integration gates. Do not install dependencies or start a server.
