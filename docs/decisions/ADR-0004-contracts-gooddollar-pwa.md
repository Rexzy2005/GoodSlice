# ADR-0004: Slyce Contracts, GoodDollar SDK and PWA-only Distribution

Status: Accepted
Date: 2026-10-15

## Context

GoodDollar Season 5 needs a deployed, working product today. The user directed: drop MiniPay, ship as a PWA on Vercel, write the application contracts in this repo, integrate them, and wire GoodDollar. There is no backend.

## Decision

1. **Distribution:** standard web + installable PWA only. MiniPay runtime detection, provider and UI are removed. Wallets connect through RainbowKit.
2. **Contracts** (`contracts/`, Foundry, Solidity 0.8.28, OpenZeppelin 5.6.1, `evm_version = cancun`):
   - `SlyceShop`: owner-listed items with on-chain price, per-wallet limit and `purchased` counts. G$ goes straight to the treasury. `buy` takes a `maxTotal` price guard.
   - `SlyceTournament`: owner creates tournaments. Entrants pay the G$ fee, anyone may sponsor, and entrants submit **self-reported** scores. After the end the owner (operator) posts a Merkle root of prizes, with the unallocated pool sent to the treasury. Winners claim with proofs. Unclaimed prizes can be swept to the treasury after 30 days.
3. **Results are operator-run.** `apps/web/scripts/tournament-results.ts` ranks `ScoreSubmitted` events (top N by `SHARES`, ties to the earlier submission) and writes `public/tournaments/<id>.json`. The app only offers a claim when the file's proof verifies against the on-chain root.
4. **Shop catalog is cosmetic only** (blade trails 101–103). Power-ups are not sold because no in-game power-up rules exist.
5. **GoodDollar:** `@goodsdks/citizen-sdk` 1.2.7 (exact) powers identity verification and the daily UBI claim on Celo mainnet. `NEXT_PUBLIC_GOODDOLLAR_ENV` selects production or development, and the configured G$ address must match that environment.
6. ADR-0002's "user-only installs" constraint is lifted for this work by explicit user authorization.

## Consequences

### Positive

- Real G$ purchases, tournament entries, prize claims and UBI claims with no backend.

### Negative

- Tournament scores are self-reported and unverified. Fairness depends on the operator's review. Verified replay (PROJECT.md §8) is still unimplemented.
- The operator must redeploy the web app after posting results so the claim file is served.
- The contracts have not had an external security review. Keep pools small until reviewed.

## Evidence

- `docs/research/gooddollar.md`
- `contracts/test/` (unit tests + Celo mainnet fork test with real G$)

## Supersedes

The MiniPay portions of `docs/PROJECT.md` §2 and §14 and the MiniPay runtime in ADR-0001.
