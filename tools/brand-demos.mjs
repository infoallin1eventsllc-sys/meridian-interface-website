/**
 * Stamps every hosted demo with a Meridian Interface bar across the top.
 *
 * The demos carry client-facing product names — Aurora Reserve, FinSight,
 * ORCHESTRA — because that is the demonstration: a bank interface has to look
 * like a bank, not like its agency. The risk Otis spotted is that a visitor who
 * clicks through from the portfolio then believes they have left Meridian's
 * site. So every demo opens with a bar naming Meridian as the studio that built
 * it, saying plainly that it is a demonstration, and offering the way back.
 *
 * This runs over the BUILT output rather than each app's source, so all four
 * carry exactly the same bar and it cannot drift app by app. Run it after
 * copying a fresh build into public/demos/<slug>/.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DEMOS = join(process.cwd(), 'public', 'demos');
const BAR_H = 46;

const LABEL = {
  'stack-planner': 'Stack Planner',
  finsight: 'FinSight — financial dashboard',
  aurora: 'Aurora Reserve — private banking interface',
  orchestra: 'ORCHESTRA — cloud console',
  'meridian-crm': 'Meridian CRM — operations hub',
  'analytics-hub': 'Analytics Intelligence Hub — BI dashboard',
  'modern-street': 'MODERN_STREET — streetwear storefront',
  'fog-city': 'Fog City Roasters — coffee brand site',
  'big-boy-subs': 'Big Boy Subs — restaurant ordering site',
};

const styles = `
<style id="meridian-demo-bar-style">
  :root { --meridian-bar: ${BAR_H}px; }
  body { padding-top: var(--meridian-bar) !important; }
  /* These apps size themselves to the viewport; leave room for the bar so the
     demo is not pushed off the bottom of the screen. */
  .h-screen { height: calc(100vh - var(--meridian-bar)) !important; }
  .min-h-screen { min-height: calc(100vh - var(--meridian-bar)) !important; }
  /* An app's own sticky header pins to the top of the viewport, which is now
     behind this bar. Push it down so both are readable. */
  .sticky.top-0 { top: var(--meridian-bar) !important; }
  /* Same problem for a fixed header (the storefront uses one): it ignores the
     body padding above and pins under the bar, hiding its own logo and nav.
     Targets the literal top-0 class, so full-screen inset-0 modal overlays,
     which must keep covering the whole viewport, are left alone. */
  .fixed.top-0 { top: var(--meridian-bar) !important; }
  #meridian-demo-bar {
    position: fixed; top: 0; left: 0; right: 0; height: var(--meridian-bar); z-index: 2147483000;
    display: flex; align-items: center; gap: 14px; padding: 0 16px;
    background: #0f172a; color: #fff; box-sizing: border-box;
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    border-bottom: 1px solid rgba(255,255,255,.12);
  }
  #meridian-demo-bar img { height: 26px; width: auto; display: block; flex: none; }
  #meridian-demo-bar .mb-built { font-size: 12.5px; font-weight: 600; white-space: nowrap; }
  #meridian-demo-bar .mb-what { font-size: 12px; color: #cbd5e1; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; }
  #meridian-demo-bar .mb-sep { color: #475569; }
  #meridian-demo-bar .mb-tag { font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase;
    color: #cbd5e1; border: 1px solid rgba(255,255,255,.25); border-radius: 999px;
    padding: 3px 9px; white-space: nowrap; flex: none; }
  #meridian-demo-bar a.mb-home { margin-left: auto; flex: none; display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 700; color: #fff; text-decoration: none;
    background: #2563eb; padding: 7px 12px; border-radius: 8px; }
  #meridian-demo-bar a.mb-home:hover { background: #1d4ed8; }
  #meridian-demo-bar a.mb-home:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
  @media (max-width: 720px) {
    #meridian-demo-bar .mb-what, #meridian-demo-bar .mb-sep { display: none; }
  }
</style>`;

const bar = (slug) => `
<div id="meridian-demo-bar">
  <img src="brand/meridian-mark.png" alt="Meridian Interface" />
  <span class="mb-built">Built by Meridian Interface</span>
  <span class="mb-sep">·</span>
  <span class="mb-what">${LABEL[slug] ?? slug}</span>
  <span class="mb-tag">Demonstration</span>
  <a class="mb-home" href="/">meridianinterface.com &rarr;</a>
</div>`;

/**
 * Remove a previously stamped bar so it can be replaced with the current one.
 *
 * Both patterns are anchored to the bar's own markup and end at its own closing
 * tag — the style block at </style>, the bar at the </a></div> that only the
 * bar has. An earlier attempt matched the bar's opening div and then any later
 * </div>, which quietly ate the app's own <div id="root"> and left every demo
 * a blank page. Do not loosen these.
 */
const unstamp = (html) => html
  .replace(/\n?<style id="meridian-demo-bar-style">[\s\S]*?<\/style>/, '')
  .replace(/\n?<div id="meridian-demo-bar">[\s\S]*?<\/a>\s*<\/div>/, '');

let done = 0, updated = 0;
for (const slug of readdirSync(DEMOS)) {
  const file = join(DEMOS, slug, 'index.html');
  if (!existsSync(file)) continue;
  const before = readFileSync(file, 'utf8');
  const had = before.includes('meridian-demo-bar');
  let html = unstamp(before);

  if (!html.includes('id="root"')) {
    console.error(`${slug}: ABORTED — stripping the old bar would have removed the app root`);
    process.exitCode = 1;
    continue;
  }

  html = html.replace('</head>', `${styles}\n</head>`);
  html = html.replace(/(<body[^>]*>)/, `$1${bar(slug)}`);

  if (html === before) { console.log(`${slug}: unchanged`); continue; }
  writeFileSync(file, html);
  console.log(`${slug}: ${had ? 'bar updated' : 'stamped'}`);
  had ? updated++ : done++;
}
console.log(`${done} stamped, ${updated} updated`);
