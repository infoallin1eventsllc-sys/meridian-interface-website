// Collects the Live Cards Studio into mobile/www so it can be wrapped as an App Store / Google Play app with Capacitor.
// The app runs the same files as meridianinterface.com/studio/, bundled inside the app, and talks to the same service.
// Usage: node tools/build-live-cards-app.mjs
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
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
console.log('Live Cards app files are in mobile/www');
