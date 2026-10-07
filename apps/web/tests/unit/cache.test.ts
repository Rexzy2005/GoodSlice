import { expect, it } from 'vitest';
import { safePrecachePath } from '../../src/pwa/cache-policy';
it('allows only reviewed static resources', () => {
  for (const url of ['/_next/static/chunks/hash.js', '/icons/icon-192.png', '/offline.html']) expect(safePrecachePath(url)).toBe(true);
  for (const url of ['/', '/play', '/api/session', '/api/rewards', '/leaderboard', '/rpc', 'https://rpc.example/_next/static/a.js', '/icons/icon-192.png?account=1']) expect(safePrecachePath(url)).toBe(false);
});
