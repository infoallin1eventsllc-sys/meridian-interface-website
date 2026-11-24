// Collects the Live Cards Studio into mobile/www so it can be wrapped as an App Store / Google Play app with Capacitor.
// The app runs the same files as meridianinterface.com/studio/, bundled inside the app, and talks to the same service.
// Usage: node tools/build-live-cards-app.mjs
import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..'), pub = join(root, 'public'), out = join(root, 'mobile', 'www');
rmSync(out, { recursive: true, force: true });
for (const d of ['studio', 'live', 'c', 'fonts']) cpSync(join(pub, d), join(out, d), { recursive: true });
rmSync(join(out, 'live', 'samples'), { recursive: true, force: true });           // sample videos belong to the website landing page only
mkdirSync(join(out, 'brand'), { recursive: true });
cpSync(join(pub, 'brand', 'meridian-mark.png'), join(out, 'brand', 'meridian-mark.png'));
writeFileSync(join(out, 'index.html'), '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/studio/"><title>Live Cards</title>');
if (!existsSync(join(out, 'studio', 'index.html'))) throw new Error('Studio was not copied');
// Inside a store app there is no web server to send the security policy, so the same policy vercel.json sends for the app's
// pages is written into each page. (frame-ancestors and upgrade-insecure-requests only work as server headers and are left out.)
const rule = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8')).headers.find(h => h.source === '/(studio|c|live-cards|live)/(.*)');
const csp = rule && rule.headers.find(h => h.key === 'Content-Security-Policy');
if (!csp) throw new Error('The Live Cards security policy was not found in vercel.json');
const policy = csp.value.split(';').map(x => x.trim()).filter(x => x && !/^(frame-ancestors|upgrade-insecure-requests)/.test(x)).join('; ');
for (const page of ['studio/index.html', 'c/index.html']) {
  const f = join(out, page), html = readFileSync(f, 'utf8');
  if (!/<meta charset="utf-8">/i.test(html)) throw new Error(page + ' has no charset tag to place the policy after');
  writeFileSync(f, html.replace(/<meta charset="utf-8">/i, m => m + `<meta http-equiv="Content-Security-Policy" content="${policy}">`));
}
console.log('Live Cards app files are in mobile/www');
