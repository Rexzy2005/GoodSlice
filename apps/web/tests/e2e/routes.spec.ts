import { expect, test } from '@playwright/test';
const routes = ['/', '/play', '/tournament', '/shop', '/leaderboard', '/rewards', '/get-gd', '/profile'];
for (const route of routes) test('route and mobile layout: ' + route, async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(route); expect(response?.status()).toBe(200);
  await expect(page.locator('main h1')).toBeVisible(); await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
test('leaderboard period changes without fabricating scores', async ({ page }) => {
  await page.goto('/leaderboard'); await page.getByRole('button', { name: 'This week', exact: true }).click();
  await expect(page.getByRole('button', { name: 'This week', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'The leaderboard is unavailable' })).toBeVisible();
});
test('Phaser canvas cleans up after navigating away', async ({ page }) => {
  await page.goto('/play'); await expect(page.locator('canvas')).toHaveCount(1);
  await page.getByRole('link', { name: 'Shop', exact: true }).click(); await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('link', { name: 'Play', exact: true }).click(); await expect(page.locator('canvas')).toHaveCount(1);
});
test('MiniPay never presents the standard picker', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'ethereum', { value: { isMiniPay: true, request: async () => { throw new Error('test provider unavailable'); }, on() {}, removeListener() {} } }); });
  await page.goto('/profile'); await expect(page.getByRole('button', { name: /connect wallet/i })).toHaveCount(0);
});
