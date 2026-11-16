import fs from 'node:fs';
import { test as base, expect, type Page } from '@playwright/test';

// Every page is served with the same security headers Vercel sends in
// production (read from vercel.json), so anything the live content security
// policy would block fails here too. The backend is replaced with stand-ins
// that answer in the same shapes as the real Supabase functions, so no test
// ever reaches the live database or creates a real lead.

const vercel = JSON.parse(fs.readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
const rules = (vercel.headers as Array<{ source: string; headers: Array<{ key: string; value: string }> }>).map(
  (r) => ({ re: new RegExp(`^${r.source}$`), headers: r.headers }),
);

export interface Backend {
  /** JSON bodies POSTed to the intake function (booking requests). */
  intake: unknown[];
}

interface Fixtures {
  backend: Backend;
  /** Console errors, page crashes and security-policy blocks seen so far. */
  problems: string[];
}

export const test = base.extend<Fixtures>({
  backend: async ({ context, baseURL }, use) => {
    const backend: Backend = { intake: [] };

    await context.route(`${baseURL}/**`, async (route) => {
      const res = await route.fetch();
      const pathname = new URL(route.request().url()).pathname;
      const headers = { ...res.headers() };
      for (const r of rules) if (r.re.test(pathname)) for (const h of r.headers) headers[h.key.toLowerCase()] = h.value;
      // The preview server is plain http; upgrading to https would break it.
      if (headers['content-security-policy']) {
        headers['content-security-policy'] = headers['content-security-policy'].replace(/;\s*upgrade-insecure-requests/, '');
      }
      await route.fulfill({ response: res, headers });
    });

    const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET,POST' };
    const json = (body: unknown) => (route: Parameters<Parameters<typeof context.route>[1]>[0]) =>
      route.request().method() === 'OPTIONS'
        ? route.fulfill({ status: 204, headers: cors })
        : route.fulfill({ status: 200, contentType: 'application/json', headers: cors, body: JSON.stringify(body) });

    // Playwright tries the most recently added route first, so the catch-all goes in first.
    await context.route('**/functions/v1/**', json({ ok: false, error: 'not available in tests' }));
    await context.route(/posthog|fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
    await context.route('**/functions/v1/site-images*', json({ ok: true, overrides: {} }));
    await context.route('**/functions/v1/owner*', json({ configured: true, twoStep: true }));
    await context.route('**/functions/v1/unsubscribe*', json({ ok: true, unsubscribed: true, message: 'Done.' }));
    await context.route('**/functions/v1/intake*', (route) => {
      if (route.request().method() === 'POST') backend.intake.push(route.request().postDataJSON());
      return json({ ok: true })(route);
    });

    await use(backend);
  },

  problems: async ({ page }, use) => {
    const problems: string[] = [];
    page.on('pageerror', (e) => problems.push(`page error: ${e.message}`));
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      const text = m.text();
      // Requests the tests deliberately block (analytics, web fonts).
      if (/Failed to load resource: net::ERR_FAILED/.test(text)) return;
      problems.push(text);
    });
    await use(problems);
  },
});

export { expect };

/** Open the home page with the backend stand-ins in place. */
export async function openHome(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('h1')).toBeVisible();
}

/** Go to a page using the footer links, the way a visitor would. */
export async function openPage(page: Page, name: string) {
  await openHome(page);
  await page.locator('footer button').filter({ hasText: new RegExp(`^${name}$`) }).first().click();
}

/** Pixels the page scrolls sideways (0 means it fits the screen). */
export const sidewaysScroll = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

/** Images that failed to load. */
export const brokenImages = (page: Page) =>
  page.evaluate(() =>
    [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.src && !i.src.startsWith('data:')).map((i) => i.src),
  );
