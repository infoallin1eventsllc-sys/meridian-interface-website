// Rules the live site depends on, checked against the files that ship.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { PORTFOLIO, SERVICES } from '../../src/data/mockData';

const root = path.resolve(__dirname, '../..');
const publicFile = (p: string) => path.join(root, 'public', p);
const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));

/** The headers Vercel sends for a path, merged in file order like Vercel does. */
function headersFor(pathname: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rule of vercel.headers) {
    if (new RegExp(`^${rule.source}$`).test(pathname)) {
      for (const h of rule.headers) out[h.key.toLowerCase()] = h.value;
    }
  }
  return out;
}

describe('security headers', () => {
  it.each(['/', '/unsubscribe', '/demos/frame-shop/'])('%s gets the baseline headers', (p) => {
    const h = headersFor(p);
    expect(h['x-content-type-options']).toBe('nosniff');
    expect(h['strict-transport-security']).toMatch(/max-age=\d{8,}/);
    expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(h['x-frame-options']).toBe('DENY');
  });

  it('the main site has a strict content security policy', () => {
    const csp = headersFor('/')['content-security-policy'];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-(inline|eval)'/);
  });

  it('turns off browser features the site never uses', () => {
    expect(headersFor('/')['permissions-policy']).toMatch(/camera=\(\).*payment=\(\)/);
  });

  it('publishes a security contact that has not expired', () => {
    const txt = fs.readFileSync(publicFile('.well-known/security.txt'), 'utf8');
    expect(txt).toMatch(/^Contact: mailto:\S+@meridianinterface\.com$/m);
    const expires = new Date(txt.match(/^Expires: (.+)$/m)![1]);
    expect(expires.getTime()).toBeGreaterThan(Date.now());
  });
});

describe('portfolio and services content', () => {
  it('every project has a unique id', () => {
    const ids = PORTFOLIO.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every picture is a file in the site, not a hotlink that can disappear', () => {
    const images = [...PORTFOLIO.map((p) => p.image), ...SERVICES.map((s) => s.image)].filter(Boolean) as string[];
    for (const img of images) {
      expect(img, img).toMatch(/^\//);
      expect(fs.existsSync(publicFile(img)), `missing ${img}`).toBe(true);
    }
  });

  it('every "Open the working demo" button leads to a demo that ships', () => {
    for (const { demo } of PORTFOLIO) {
      if (!demo) continue;
      if (/^https:\/\//.test(demo)) continue; // hosted elsewhere, opened in a new tab
      const folder = demo.replace(/\?.*$/, '').replace(/^\/|\/$/g, '');
      expect(fs.existsSync(publicFile(`${folder}/index.html`)), `missing ${folder}/index.html`).toBe(true);
    }
  });

  it('shows no prices: cost is discussed, then invoiced', () => {
    expect(JSON.stringify([PORTFOLIO, SERVICES])).not.toMatch(/\$\s?\d/);
  });
});
