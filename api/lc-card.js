/**
 * Live Cards: the page for one card's link, /c/<name>.
 *
 * Why this exists: when a link is texted or posted, the phone or the social site reads the page's title and picture
 * WITHOUT running any script. The card page fills itself in with script, so every card's link used to look the same.
 * This sends the same page, with that one card's name, line and preview picture written into the top of it.
 *
 * It only reads. It asks the service for one published card by its exact link name, the same public question the card
 * page itself asks, with the same public key. It holds no secret, writes nothing, and if anything at all goes wrong
 * (service off, slow, card missing or taken down) it sends the plain page, which is exactly what was served before.
 * Every value from a card is escaped before it is written into the page.
 */
// Kept identical to the rule for these pages in vercel.json (tools/live-cards-preview-test.cjs fails if they differ).
const HEADERS = {
  'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data: blob: https://glzodwhyavexpuusbqjy.supabase.co/storage/v1/object/public/live-cards/; media-src 'self' blob: https://glzodwhyavexpuusbqjy.supabase.co/storage/v1/object/public/live-cards/; connect-src 'self' https://glzodwhyavexpuusbqjy.supabase.co; manifest-src 'self'; worker-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests",
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), bluetooth=(), serial=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

// Kept identical to public/c/index.html outside the <!--share--> block (the same test checks it).
const TOP = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
`;
const REST = `
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0f172a"><link rel="icon" href="/brand/meridian-mark.png">
<link rel="stylesheet" href="/live/card.css"><link rel="stylesheet" href="/live/viewer.css"></head>
<body><main class="stage"><div class="lc-phone" id="lc" hidden></div>
<div class="msg" id="lc-msg" hidden><h1></h1><p></p><a href="/live-cards/">About Live Cards</a></div></main>
<button type="button" id="lc-report" class="report" hidden>Report this card</button>
<script src="/live/i18n.js"></script><script src="/live/config.js"></script><script src="/live/api.js"></script><script src="/live/demo.js"></script><script src="/live/engine.js"></script><script src="/live/card-view.js"></script><script src="/live/viewer.js"></script></body></html>
`;

const esc = s => String(s ?? '').replace(/[&<>"'`]/g, c => '&#' + c.charCodeAt(0) + ';');
const text = (s, max) => (typeof s === 'string' ? s : '').replace(/[\u0000-\u001f\u007f‎‏‪-‮⁦-⁩]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

/** s: { title, description, ogTitle, ogDescription, image, url?, alt? } */
function share(s) {
  return '<!--share--><title>' + esc(s.title) + '</title><meta name="description" content="' + esc(s.description) + '">'
    + (s.url ? '<link rel="canonical" href="' + esc(s.url) + '"><meta property="og:url" content="' + esc(s.url) + '">' : '')
    + '<meta property="og:type" content="website"><meta property="og:title" content="' + esc(s.ogTitle) + '"><meta property="og:description" content="' + esc(s.ogDescription) + '">'
    + '<meta property="og:image" content="' + esc(s.image) + '"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
    + (s.alt ? '<meta property="og:image:alt" content="' + esc(s.alt) + '">' : '')
    + '<meta name="twitter:card" content="summary_large_image"><!--/share-->';
}
const PLAIN = { title: 'Live Card | Meridian Interface', description: 'A digital business card with a live background.', ogTitle: 'Digital business card',
  ogDescription: 'Tap to open this card: call, text, email, book and save the contact.', image: 'https://meridianinterface.com/live/og-default.jpg' };

let memo = null; // { at, origin, cfg: { on, url, key, bucket, site } }
/** The one switch for Live Cards is public/live/config.js. This reads the same file, so there is no second switch to forget. */
async function settings(origin) {
  if (memo && memo.origin === origin && Date.now() - memo.at < 60_000) return memo.cfg;
  const off = { on: false, url: '', key: '', bucket: '', site: '' };
  let cfg = off;
  try {
    const r = await timed(origin + '/live/config.js', {}, 1500);
    if (r.ok) {
      const js = await r.text(), pick = re => (js.match(re) || [])[1] || '';
      const url = pick(/\burl:\s*'(https:\/\/[a-z0-9-]+\.supabase\.co)'/), key = pick(/\bkey:\s*'([A-Za-z0-9._-]{20,600})'/), bucket = pick(/\bbucket:\s*'([a-z0-9-]{3,40})'/), site = pick(/\bsite:\s*'(https:\/\/[a-z0-9.-]+)'/);
      cfg = { on: /\benabled:\s*true\b/.test(js) && !!url && !!key && !!bucket, url, key, bucket, site };
    }
  } catch { /* stays off */ }
  memo = { at: Date.now(), origin, cfg };
  return cfg;
}
async function timed(url, init, ms) {
  const ac = new AbortController(), t = setTimeout(() => ac.abort(), ms);
  try { return await fetch(url, { ...init, signal: ac.signal }); } finally { clearTimeout(t); }
}
const html = (s, seconds) => new Response(TOP + share(s) + REST, { status: 200,
  headers: { ...HEADERS, 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=' + seconds + ', stale-while-revalidate=600' } });

async function handler(req) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Method not allowed', { status: 405, headers: { ...HEADERS, Allow: 'GET, HEAD' } });
  let u;
  try { u = new URL(req.url); } catch { return html(PLAIN, 60); }
  const raw = u.searchParams.get('slug') || (u.pathname.match(/^\/c\/([^/]+)\/?$/) || [])[1] || '';
  const slug = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/.test(raw) ? raw : '';
  if (!slug || slug === 'sample') return html(PLAIN, 300);
  try {
    const cfg = await settings(u.origin);
    if (!cfg.on) return html(PLAIN, 60);
    const r = await timed(cfg.url + '/rest/v1/rpc/lc_get_card', { method: 'POST', headers: { apikey: cfg.key, Authorization: 'Bearer ' + cfg.key, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_slug: slug }) }, 1800);
    if (!r.ok) return html(PLAIN, 30);
    const d = await r.json();
    if (!d || typeof d !== 'object' || Array.isArray(d)) return html(PLAIN, 60); // no such card, or it is offline or taken down
    const name = text(d.name, 60), company = text(d.company, 60), role = text(d.role, 60), tagline = text(d.tagline, 90);
    if (!name) return html(PLAIN, 60);
    const title = name + (company ? ' | ' + company : ''), line = [role, tagline].filter(Boolean).join('. ') || (d.lang === 'es' ? 'Tarjeta de presentación digital' : 'Digital business card');
    const site = cfg.site || u.origin, pic = typeof d.preview?.url === 'string' ? d.preview.url : '';
    const mine = new RegExp('^' + (cfg.url + '/storage/v1/object/public/' + cfg.bucket + '/').replace(/[.]/g, '\\.') + '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/og-[a-z0-9]{1,16}\\.jpg$');
    return html({ title, description: line, ogTitle: title, ogDescription: line + (d.lang === 'es' ? '. Toca para llamar, enviar un mensaje, escribir un correo o guardar el contacto.' : '. Tap to call, text, email or save the contact.'), url: site + '/c/' + slug,
      image: mine.test(pic) ? pic : site + '/live/og-default.jpg', alt: name + (role ? ', ' + role : '') }, 120);
  } catch { return html(PLAIN, 30); }
}

// Vercel's standard function shape: a default export with a fetch handler (Node.js runtime, web Request and Response).
export default { fetch: handler };
