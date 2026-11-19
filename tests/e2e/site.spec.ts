import { brokenImages, expect, openHome, openPage, sidewaysScroll, test } from './fixtures';

test.describe('home page', () => {
  test('loads cleanly under the live security policy', async ({ page, backend: _backend, problems }) => {
    await openHome(page);
    await expect(page).toHaveTitle(/Meridian Interface/);
    await expect(page.locator('h1')).toContainText('Websites, apps and AI');
    expect(await sidewaysScroll(page)).toBe(0);
    expect(await brokenImages(page)).toEqual([]);
    expect(problems).toEqual([]);
  });

  test('the hero film starts muted and the visitor can turn sound on', async ({ page, backend: _backend, problems }) => {
    await openHome(page);
    const button = page.getByRole('button', { name: /Play sound|Sound on/ });
    // The button only appears once the film is actually playing.
    await expect(button).toBeVisible({ timeout: 15_000 });
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(button).toHaveText(/Sound on/);
    const muted = await page.evaluate(() => [...document.querySelectorAll('video')].filter((v) => v.offsetParent).every((v) => v.muted));
    expect(muted).toBe(false);
    expect(problems).toEqual([]);
  });

  test('shows a still picture instead of the film for visitors who ask for less motion', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce', baseURL });
    const page = await context.newPage();
    await page.route(/posthog|fonts\.(googleapis|gstatic)\.com|functions\/v1/, (r) => r.abort());
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toBeVisible();
    const playing = await page.evaluate(() => [...document.querySelectorAll('video')].some((v) => !v.paused));
    expect(playing).toBe(false);
    await expect(page.getByRole('button', { name: /Play sound/ })).toHaveCount(0);
    await context.close();
  });
});

for (const name of ['Services', 'Portfolio', 'Book Appointment', 'My Appointments', 'Privacy', 'Terms']) {
  test(`${name} page opens and fits the screen`, async ({ page, backend: _backend, problems }) => {
    await openPage(page, name);
    await page.waitForLoadState('networkidle');
    expect(await sidewaysScroll(page)).toBe(0);
    expect(await brokenImages(page)).toEqual([]);
    expect(problems).toEqual([]);
  });
}

test.describe('booking an appointment', () => {
  test('an empty form is not sent; a filled one is', async ({ page, backend, problems }) => {
    await openHome(page);
    await page.locator('footer button').filter({ hasText: /Book Appointment/i }).last().click();
    const dialog = page.getByRole('dialog', { name: 'Book an appointment' });
    await expect(dialog).toBeVisible();

    await dialog.locator('button[type=submit]').first().click();
    expect(backend.intake).toHaveLength(0);

    // Fill every visible field, but leave the hidden spam trap alone.
    for (const input of await dialog.locator('input:not([type=date]):not([tabindex="-1"])').all()) {
      const type = await input.getAttribute('type');
      await input.fill(type === 'email' ? 'visitor@example.com' : type === 'tel' ? '2815550100' : 'Test Visitor');
    }
    await dialog.locator('button[type=submit]').first().click();
    await expect.poll(() => backend.intake.length).toBe(1);

    const sent = backend.intake[0] as { type: string; payload: Record<string, string> };
    expect(sent.type).toBe('appointment');
    expect(sent.payload.clientEmail).toBe('visitor@example.com');
    expect(sent.payload.id).toMatch(/^APT-/);
    expect(problems).toEqual([]);
  });

  test('a bot that fills the hidden spam trap is not sent to the studio', async ({ page, backend }) => {
    await openHome(page);
    await page.locator('footer button').filter({ hasText: /Book Appointment/i }).last().click();
    const dialog = page.getByRole('dialog', { name: 'Book an appointment' });
    for (const input of await dialog.locator('input:not([type=date])').all()) {
      const type = await input.getAttribute('type');
      await input.fill(type === 'email' ? 'bot@example.com' : type === 'tel' ? '2815550100' : 'Bot', { force: true });
    }
    await dialog.locator('button[type=submit]').first().click();
    await page.waitForTimeout(1500);
    expect(backend.intake).toHaveLength(0);
  });
});

test('search opens and closes with the Escape key', async ({ page, backend: _backend }) => {
  await openHome(page);
  await page.getByRole('button', { name: 'Search Studio' }).click();
  await expect(page.getByRole('dialog', { name: 'Search the studio' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Search the studio' })).toHaveCount(0);
});

test('the phone menu opens and closes with the Escape key', async ({ page, backend: _backend }, testInfo) => {
  test.skip(testInfo.project.name !== 'phone', 'The menu button only shows on small screens');
  await openHome(page);
  await page.getByRole('button', { name: 'Open Navigation Menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toHaveCount(0);
});

test('every portfolio project opens its concept window', async ({ page, backend: _backend, problems }) => {
  await openHome(page);
  const buttons = page.getByRole('button', { name: /View concept/ });
  const count = await buttons.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await buttons.nth(i).scrollIntoViewIfNeeded();
    await buttons.nth(i).click();
    await expect(page.getByRole('dialog').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  }
  expect(problems).toEqual([]);
});

test('the unsubscribe link works', async ({ page, backend: _backend, problems }) => {
  await page.goto('/unsubscribe?t=test-token', { waitUntil: 'networkidle' });
  await expect(page.locator('body')).toContainText(/unsubscribe|Done/i);
  expect(problems).toEqual([]);
});

test('publishes a security contact', async ({ request }) => {
  const res = await request.get('/.well-known/security.txt');
  expect(res.ok()).toBe(true);
  expect(await res.text()).toContain('Contact: mailto:');
});
