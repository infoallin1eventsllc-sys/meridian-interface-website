import { defineConfig } from '@playwright/test';

// Browser tests for the built site (`npm run build` first).
// On GitHub's runners this uses the installed Google Chrome. Locally, point
// PW_CHROMIUM_PATH at any Chromium to use that instead of downloading one.
const CI = !!process.env.CI;
const executablePath = process.env.PW_CHROMIUM_PATH;
const PORT = 4173;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  workers: CI ? 2 : 4,
  retries: CI ? 1 : 0,
  reporter: CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  webServer: {
    command: `npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !CI,
    timeout: 60_000,
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    headless: true,
    trace: 'retain-on-failure',
    ...(executablePath ? { launchOptions: { executablePath } } : { channel: 'chrome' }),
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { viewport: { width: 375, height: 740 }, isMobile: true, hasTouch: true } },
  ],
});
