import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: true, retries: 0,
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000', trace: 'retain-on-failure' },
  projects: [{ name: 'mobile-chromium', testIgnore: '**/pwa.spec.ts', use: { ...devices['Pixel 7'], viewport: { width: 360, height: 800 } } }, { name: 'desktop-chromium', testIgnore: '**/pwa.spec.ts', use: { ...devices['Desktop Chrome'] } }, { name: 'pwa-chromium', testMatch: '**/pwa.spec.ts', use: { ...devices['Desktop Chrome'] } }],
  // Deliberately no webServer: the user controls application-server startup.
});
