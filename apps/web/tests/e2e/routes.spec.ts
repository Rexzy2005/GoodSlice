import { expect, test } from '@playwright/test';
const routes = ['/', '/play', '/play/arena', '/tournament', '/shop', '/leaderboard', '/rewards', '/get-gd', '/profile'];
for (const route of routes) test('route and mobile layout: ' + route, async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(route); expect(response?.status()).toBe(200);
  await expect(page.locator('main h1')).toBeVisible();
  if (route !== '/' && route !== '/play/arena') {
    const mobileMenu = page.getByRole('button', { name: 'Open menu' });
    if (await mobileMenu.isVisible()) { await mobileMenu.click(); await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible(); await page.getByRole('button', { name: 'Close menu' }).click(); }
    else await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  }
  else if (route === '/') await expect(page.getByRole('link', { name: 'Launch game', exact: true }).first()).toBeVisible();
  else await expect(page.getByRole('link', { name: 'Slyce lobby' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
test('leaderboard period changes without fabricating scores', async ({ page }) => {
  await page.goto('/leaderboard'); await page.getByRole('button', { name: 'This week', exact: true }).click();
  await expect(page.getByRole('button', { name: 'This week', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'The leaderboard is unavailable' })).toBeVisible();
});
test('Phaser canvas cleans up after navigating away', async ({ page }) => {
  await page.goto('/play/arena'); await expect(page.locator('canvas')).toHaveCount(1);
  await page.getByRole('link', { name: 'Slyce lobby' }).click();
  if (await page.getByRole('button', { name: 'Open menu' }).isVisible()) await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('link', { name: 'Shop', exact: true }).click(); await expect(page.locator('canvas')).toHaveCount(0);
  if (await page.getByRole('button', { name: 'Open menu' }).isVisible()) await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('link', { name: 'Play', exact: true }).click(); await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('link', { name: 'Open the board' }).click(); await expect(page.locator('canvas')).toHaveCount(1);
});
test('MiniPay never presents the standard picker', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'ethereum', { value: { isMiniPay: true, request: async () => { throw new Error('test provider unavailable'); }, on() {}, removeListener() {} } }); });
  await page.goto('/profile'); await expect(page.getByRole('button', { name: /connect wallet/i })).toHaveCount(0);
});

test('mobile menu shows the active destination and closes on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/profile');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Profile', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
});

test('landing launches the separate gaming interface', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /connect wallet/i })).toHaveCount(0);
  await page.getByRole('link', { name: 'Launch game', exact: true }).first().click();
  await expect(page).toHaveURL(/\/play$/);
  if (await page.getByRole('button', { name: 'Open menu' }).isVisible()) {
    await expect(page.locator('.desktop-wallet')).toBeHidden();
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('region', { name: 'Wallet connection' })).toBeVisible();
    await page.getByRole('button', { name: 'Close menu' }).click();
  } else await expect(page.locator('.desktop-wallet .wallet-control')).toBeVisible();
  await expect(page.getByRole('heading', { name: /A fresh start/ })).toBeVisible();
});

test('lobby opens the dedicated board with working renderer controls', async ({ page }) => {
  await page.goto('/play');
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('link', { name: 'Open the board' }).click();
  await expect(page).toHaveURL(/\/play\/arena$/);
  await expect(page.getByRole('button', { name: 'Pause canvas', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Pause canvas', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your board is paused.' })).toBeVisible();
  await page.getByRole('group', { name: 'Quick arena controls' }).getByRole('button', { name: 'Resume canvas' }).click();
  await expect(page.getByRole('heading', { name: 'Ready to slice?' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start round' })).toHaveCount(0);
});

test('effects preview keeps round readings untouched and can exit cleanly', async ({ page }) => {
  await page.goto('/play/arena');
  await page.getByRole('button', { name: 'Try cutting effects' }).click();
  await expect(page.locator('.effects-active')).toBeVisible();
  await expect(page.getByText('EFFECTS PREVIEW · Swipe across the fruit · No score recorded')).toBeVisible();
  await expect(page.locator('.score-reading strong')).toHaveText('Not started');
  await page.getByRole('button', { name: 'Exit effects preview' }).click();
  await expect(page.getByRole('button', { name: 'Start round', exact: true })).toHaveCount(0);
});
