# Slyce Current State

Updated: 2026-10-15. Target: GoodDollar Season 5. Web + installable PWA on Vercel (ADR-0004, ADR-0005). Repo/packages renamed to Slyce.

## Implemented and verified

- **App shell:** `/` redirects to `/play`, and the PWA `start_url` is `/play`. Top bar with G$ balance and account; bottom tabs (Play, Compete, Shop, Get G$, Me). The landing page, sidebar and drawer were removed.
- **Sign-in (Reown AppKit 1.8.24):** email (embedded wallet) or external wallet. Every app route sits behind `SignInGate`, and wrong-network wallets are asked to switch to Celo. A low-CELO banner points players to the GoodDollar faucet path.
- **Paid rounds:** each round calls `SlyceArcade.play` (default 1 G$). The arena starts only after confirmation. One approval covers 10 rounds.
- **Game (ADR-0003):** practice scoring with lives, bombs, combos, game over and a device-local best.
- **Contracts (UUPS, ADR-0005):** `SlyceShop`, `SlyceTournament` (cancel/refund, liabilities accounting) and `SlyceArcade`. 57 Foundry tests: unit, fuzz (1,000 runs), invariant (256×64), upgrade and a Celo fork test with real G$. Coverage is 96% of lines and 100% of functions. `@openzeppelin/upgrades-core` 1.46.0 validation passes, including V1→V2 layouts.
- **Web integration:** Shop, Tournament (enter, submit score, refund), Rewards (proof-verified claims) and Profile read the proxies. GoodDollar `/get-gd` handles verification, the daily claim and free gas via the faucet.
- **Checks:** typecheck, 70 unit tests in 19 files (Node 24.21.0), lint, format, core, production build with and without full wallet config. Pre-rendered pages show the sign-in screen, and `/` redirects.

## Not verified

- No browser/device testing (the user prohibits use of their PC browser). The Playwright specs were rewritten for the gate but not run.
- Real email sign-in, face verification, UBI claim and faucet top-up: these need Reown dashboard setup and a real account.
- Contracts are not deployed to mainnet and not audited. The previous non-upgradeable deployment rehearsal is obsolete.

## Known gaps

- Leaderboard: no backend. Tournament scores are self-reported (operator review).
- Streak rewards and power-ups are not implemented.
- Local Node is 22.10; the project needs 24.21.0.
- The low-gas threshold (0.005 CELO) is a product estimate.

## Next action

See `docs/handoffs/CURRENT.md`.
