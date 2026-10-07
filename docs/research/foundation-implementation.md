# Foundation API facts

Verified: 2026-10-07. Source/API inspection only; app runtime verification pending dependency installation.

- Serwist 9.5.13 configurator exports serwist from @serwist/next/config. Use serwist.config.js (CLI default), next build followed by serwist build, and precachePrerendered: false. Restrict globPatterns explicitly. [Official guide](https://serwist.pages.dev/docs/next/config), [published Next source](https://registry.npmjs.org/@serwist%2fnext/9.5.13), [CLI source](https://registry.npmjs.org/@serwist%2fcli/9.5.13).
- The published Next configurator strips .html from discovered HTML paths. @serwist/build appends additionalPrecacheEntries after manifest transforms. Therefore the static /offline.html fallback is an explicit SHA-256-revisioned additional entry, excluded from discovery globs. [Build source](https://registry.npmjs.org/@serwist%2fbuild/9.5.13), src/lib/transform-manifest.ts. Published source packages were inspected in memory; not installed or executed.
- Worker policy precaches only Next static chunks, generated icons and the offline document. Navigation is network-only with the static fallback; there are no API/RPC/data runtime-cache rules, no route precaching and no automatic update reload during play/payment. Production registration uses the browser service-worker API; development does not register a worker.
- Phaser 4.2.1 exposes game.pause/resume, scale.resize and destroy(true). Destruction is deferred until the next frame; pendingDestroy is checked before paused-state handling. The host keeps manual pause distinct from document visibility, wakes an already running loop for teardown, and destroys late async mounts. [Pinned Game source](https://github.com/phaserjs/phaser/blob/v4.2.1/src/core/Game.js). Real renderer/device lifecycle verification remains required.

No auth, contract, identity or fee protocol was resolved by these findings. Existing dependency baseline and ADR gates still control those integrations.
