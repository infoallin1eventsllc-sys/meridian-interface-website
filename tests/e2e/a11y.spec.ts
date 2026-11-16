import AxeBuilder from '@axe-core/playwright';
import { expect, openHome, openPage, test } from './fixtures';

// Automated accessibility scan (axe-core, WCAG 2.0 A and AA rules) of the
// main pages. Fails on any serious or critical problem.
//
// Known gap, listed in the README under Tests: the WCAG 2.1 "label in name" rule
// (2.5.3) flags buttons whose accessible name does not contain their visible
// text. Add 'wcag21a' and 'wcag21aa' below once those labels are reworded.
const scan = async (page: import('@playwright/test').Page) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  return results.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.help} (${v.nodes.length})`);
};

// axe injects its own script, which the live policy rightly refuses.
// Reduced motion so the scan sees finished pages, not text halfway through a fade-in.
test.use({ bypassCSP: true, contextOptions: { reducedMotion: 'reduce' } });

test('home page has no serious accessibility problems', async ({ page, backend: _backend }) => {
  await openHome(page);
  expect(await scan(page)).toEqual([]);
});

for (const name of ['Services', 'Portfolio', 'Book Appointment']) {
  test(`${name} page has no serious accessibility problems`, async ({ page, backend: _backend }) => {
    await openPage(page, name);
    await page.waitForLoadState('networkidle');
    expect(await scan(page)).toEqual([]);
  });
}

test('the booking window has no serious accessibility problems', async ({ page, backend: _backend }) => {
  await openHome(page);
  await page.locator('footer button').filter({ hasText: /Book Appointment/i }).last().click();
  await expect(page.getByRole('dialog', { name: 'Book an appointment' })).toBeVisible();
  expect(await scan(page)).toEqual([]);
});
