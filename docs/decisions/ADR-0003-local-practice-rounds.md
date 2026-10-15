# ADR-0003: Local Practice Rounds Before Verified Gameplay

Status: Accepted
Date: 2026-10-15

## Context

The arena was an unscored cosmetic preview because authoritative gameplay rules, backend sessions and replay verification do not exist. The GoodDollar Season 5 submission (deployed on Vercel, no smart contract) needs a playable game today.

## Decision

The arena runs **local practice rounds** with these rules (`apps/web/src/game/practice-rules.ts`):

- 3 lives; a fruit that falls uncut costs one life; 0 lives ends the round.
- Cutting a bomb ends the round. Bombs appear with probability easy 8%, normal 14%, hard 20%.
- 10 points per fruit; 3+ fruit in one swipe adds 5 points per fruit in that swipe.
- Best score per difficulty is stored in `localStorage` (`slyce.practice.best.<difficulty>`) only.

Practice scores are always labeled as device-local and unverified. They never feed leaderboards, tournaments, rewards or any G$ movement, and no backend submission is made.

## Rationale

Delivers a playable game without inventing a verification backend or presenting client scores as authoritative (PROJECT.md §8, §21).

## Consequences

### Positive

- Playable game with score, lives, combos, bombs and game over.

### Negative

- Rules use `Math.random` and are not deterministic or replayable. Verified rounds still require seeded shared rules (`packages/shared`) and server replay; these practice rules are not that ruleset.

## Related Files

- `apps/web/src/game/practice-rules.ts`, `best-score.ts`, `runtime.ts`, `game-host.tsx`
