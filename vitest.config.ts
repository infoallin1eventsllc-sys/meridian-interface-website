import { defineConfig } from 'vitest/config';

// Unit tests: the site's own logic, run in a simulated browser (jsdom).
// The browser tests in tests/e2e run separately with Playwright.
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.ts'],
    restoreMocks: true,
    unstubGlobals: true,
  },
});
