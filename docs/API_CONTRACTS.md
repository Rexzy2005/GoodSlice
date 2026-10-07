# Frontend API boundary

Status: provisional frontend contracts; no authoritative backend wire contract accepted.

The user authorized minimum explicit frontend contracts during foundation implementation (2026-10-07). Canonical TypeScript/Zod definitions are in [contracts.ts](../apps/web/src/api/contracts.ts). These describe views needed by the UI, not existing endpoints, database schemas or deployed services.

- Session: anonymous or authenticated player ID/address. Wallet connection alone never produces an authenticated session.
- Round: round ID, opaque seed and rules-version identifier. Finish submits the round and ordered replay inputs, never a claimed final score as proof. Verification returns verified score or rejection.
- Leaderboard: scope today/week/all; player ID, display name, integer score and positive rank.
- Inventory: opaque item ID, name and non-negative integer quantity; item use requires a round and inventory item ID.
- Rewards/shop: opaque IDs, display labels, integer token amounts encoded as strings; token decimals come from the configured contract, not a floating-point assumption.
- Shared replay inputs: integer elapsed milliseconds, normalized pointer coordinates and phases, or inventory-item activation. These are provisional client interfaces; final replay timing, validation limits, rules and serialization need backend/game approval before play.

The default adapter rejects every operation as unavailable. It returns no mock players, scores, purchases or claims. HTTP infrastructure requires an explicit request mapping and a runtime response decoder for every operation. No routes/URLs or mutation authorization/CSRF protocol have been invented. The HTTP adapter is not activated until backend contracts and authentication are accepted. It disables browser HTTP caching and redirects, passes abort signals, and hides server error-body details.

Next integration step: approve request/response/error contracts and session/CSRF requirements, then supply mappings to createHttpApi and replace the unavailable adapter. Validate mutation inputs and replay limits against those authoritative contracts before enabling actions. Public queries use TanStack Query; player-specific queries require a verified session identity in their keys. Account/session invalidation and logout must clear user-scoped cached data when authentication is implemented.
