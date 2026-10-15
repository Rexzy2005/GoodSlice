# Slyce Current Handoff

Updated: 2026-10-15

## Objective

Ship Slyce for GoodDollar Season 5: an app-style PWA with email/wallet sign-in, paid rounds, G$ shop, tournaments, prize claims and the GoodDollar daily claim.

## Done

See `docs/CURRENT_STATE.md`. Decisions: ADR-0003, ADR-0004, ADR-0005. Research: `docs/research/gooddollar.md`, `docs/research/reown-appkit.md`. Operations: `contracts/README.md`.

## Remaining, in order

1. Reown dashboard (cloud.reown.com): create a project, enable Email login, and allowlist the Vercel domain. Copy the project ID.
2. Deploy the contracts (`contracts/README.md`). Use a multisig as `OWNER` for production G$.
3. In Vercel, set every variable in `.env.example`, including `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_ARCADE_ADDRESS`. Redeploy.
4. On a phone:
   - Sign in with email.
   - Get G$: verify, claim, and check gas is topped up.
   - Pay and play a round.
   - Buy a blade and equip it.
   - Enter a tournament and submit a score.
5. Run the Playwright specs against the deployed URL (`PLAYWRIGHT_BASE_URL=... pnpm test:e2e`).
6. Commit and push as `emmanuelgiftee-ux`. The repo-local identity is set; the remote still points to `Rexzy2005/GoodSlice`.

## Notes

- Use Node 24.21.0 (jsdom tests fail on 22.10).
- After a contract change: `forge build && node script/export-abis.mjs`.
