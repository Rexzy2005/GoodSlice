import { expect, test } from '@playwright/test';
// Runs against a server started by the user. Without wallet configuration every app screen must stay
// behind the sign-in gate; signed-in flows need a real wallet and are verified manually on a device.
const routes = ['/play', '/play/arena', '/tournament', '/shop', '/leaderboard', '/rewards', '/get-gd', '/profile'];
for (const route of routes) test('signed-out gate and mobile layout: ' + route, async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(route); expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: /Swipe\. Slice\./ })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'App navigation' })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
test('root opens the app instead of a landing page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/play$/);
});
test('installed app starts inside the game', async ({ request }) => {
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  expect(manifest.start_url).toBe('/play');
  expect(manifest.display).toBe('standalone');
});
