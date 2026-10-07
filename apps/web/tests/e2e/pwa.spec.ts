import { expect, test } from '@playwright/test';
test('production worker keeps navigation/data network-only and provides static offline page', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  const cached = await page.evaluate(async () => {
    const names = await caches.keys();
    return (await Promise.all(names.map(async name => (await (await caches.open(name)).keys()).map(request => new URL(request.url).pathname)))).flat();
  });
  expect(cached).toContain('/offline.html');
  for (const route of ['/', '/play', '/leaderboard', '/api/session', '/api/inventory', '/api/rewards']) expect(cached).not.toContain(route);
  await context.setOffline(true);
  try {
    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'A little pause.' })).toBeVisible();
    await expect(page.getByText(/No account data is stored/)).toBeVisible();
  } finally { await context.setOffline(false); }
});
