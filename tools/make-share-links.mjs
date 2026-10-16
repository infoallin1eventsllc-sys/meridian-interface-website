// Share links for the still ads: meridianinterface.com/go/<name>/
//
// A picture uploaded to a social app cannot carry a link. A LINK can carry a
// picture: Facebook, LinkedIn, X, iMessage, WhatsApp and Slack read a page's
// og:image and show it as a large card, and the whole card opens the link.
// Each page here is that link: its card is one ad (public/images/share-*.jpg,
// 1200x630), and a visitor who taps it lands on the homepage, tagged with
// utm_campaign so PostHog shows which ad brought them.
//
// Static pages, so the preview crawlers (which run no JavaScript) read the tags
// directly. The hop to the homepage is go.js, an external file because the
// site's CSP allows no inline script; without JavaScript the button does it.
// noindex keeps them out of search results; robots.txt must NOT block /go/,
// because LinkedIn's crawler obeys it and would then show no card at all.
//
// Run: node tools/make-share-links.mjs   (rewrites public/go/)
import { mkdirSync, writeFileSync } from 'fs';

const SITE = 'https://meridianinterface.com';
const ads = [
  { slug: 'conveyor', title: 'If your business is unique, why is your software generic?',
    description: 'Custom sites, apps and dashboards built for you, in Houston. Book a 1-on-1 appointment: 281-882-9198.',
    alt: 'Meridian Interface ad: if your business is unique, why is your software generic? Custom sites, apps and dashboards built for you.' },
  { slug: 'devices', title: 'Custom web design, mobile apps and data dashboards',
    description: 'One studio, start to finish. Working demos you can try today, and you own everything we build. Book a 1-on-1 appointment.',
    alt: 'Meridian Interface ad: custom web design, mobile apps and data dashboards on a tablet, laptop, watch and phone.' },
];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

for (const ad of ads) {
  const url = `${SITE}/go/${ad.slug}/`;
  const image = `${SITE}/images/share-${ad.slug}.jpg`;
  const to = `/?utm_source=share&utm_medium=social&utm_campaign=ad-${ad.slug}`;
  const title = `${ad.title} | Meridian Interface`;
  const html = `<!doctype html>
<html lang="en" data-to="${esc(to)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(ad.description)}">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${url}">
<link rel="icon" href="/brand/meridian-mark.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Meridian Interface">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(ad.description)}">
<meta property="og:image" content="${image}">
<meta property="og:image:secure_url" content="${image}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(ad.alt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(ad.description)}">
<meta name="twitter:image" content="${image}">
<meta name="twitter:image:alt" content="${esc(ad.alt)}">
<script src="/go/go.js"></script>
<style>
html,body{margin:0;height:100%;background:#0f172a;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
main{min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:24px;box-sizing:border-box;text-align:center}
img{width:64px;height:auto}
a{display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:700;padding:14px 26px;border-radius:12px}
p{margin:0;color:#cbd5e1}
</style>
</head>
<body>
<main>
<img src="/brand/meridian-mark.png" alt="Meridian Interface">
<p>Opening meridianinterface.com</p>
<a href="${esc(to)}">Continue to the website</a>
</main>
</body>
</html>
`;
  mkdirSync(`public/go/${ad.slug}`, { recursive: true });
  writeFileSync(`public/go/${ad.slug}/index.html`, html);
}

writeFileSync('public/go/go.js', `// Send visitors who open a share link on to the homepage (see tools/make-share-links.mjs).
(function () {
  var to = document.documentElement.getAttribute('data-to') || '/';
  if (to.charAt(0) !== '/' || to.charAt(1) === '/') to = '/';
  window.location.replace(to);
})();
`);
console.log('wrote', ads.map((a) => `/go/${a.slug}/`).join(' '));
