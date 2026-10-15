import { expect, it } from 'vitest';
import { safePrecachePath } from '../../src/pwa/cache-policy';
it('allows only reviewed static resources', () => {
  for (const url of ['/_next/static/chunks/hash.js', '/icons/icon-192.png', '/offline.html', '/game/chopping-board-v1.webp', '/game/fruit-splash-v1.webp', '/font/typography.css', '/font/SpaceGrotesk.ttf', '/font/Rajdhani-Medium.ttf', '/font/Rajdhani-Bold.ttf']) expect(safePrecachePath(url)).toBe(true);
  for (const url of ['/', '/play', '/api/session', '/api/rewards', '/leaderboard', '/rpc', '/font/unreviewed.otf', '/font/typography.css?session=1', 'https://rpc.example/_next/static/a.js', '/icons/icon-192.png?account=1']) expect(safePrecachePath(url)).toBe(false);
});
