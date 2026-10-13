#!/usr/bin/env node
// Packages the Secrets of Cint promotional website as a demo at /demos/secrets-of-cint/.
//
// The site itself lives in the client session's branch: all-in-1-events-2,
// claude/client-promo-website-5ct9i8 (a static site, no build step). To refresh the demo:
//
//   git -C <all-in-1-events-2> fetch origin claude/client-promo-website-5ct9i8
//   git -C <all-in-1-events-2> archive FETCH_HEAD index.html assets | tar -x -C <src>
//   node tools/package-secrets-of-cint.mjs <src> <node_modules/@fontsource>
//   node tools/brand-demos.mjs
//   cp public/brand/meridian-mark.png public/demos/secrets-of-cint/brand/
//
// What changes on the way in, and why:
//   - Fonts are served from the demo folder (Fontsource, OFL) instead of Google Fonts.
//   - The newsletter form says plainly that it is a demo: on this host nothing is sent,
//     so "You're on the list" would tell a visitor something happened that did not.
//   - The page is wrapped in <div id="root"> for tools/brand-demos.mjs, and the site's
//     sticky header, cart drawer and phone menu start below the Meridian bar.
// Everything else (the real products, prices, photos, film and the client's contact
// details) is the client's site as built.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [src, fontsource] = process.argv.slice(2).map((p) => p && path.resolve(p));
if (!src || !fs.existsSync(path.join(src, "index.html"))) throw new Error("usage: package-secrets-of-cint.mjs <site folder> <node_modules/@fontsource>");
if (!fontsource || !fs.existsSync(path.join(fontsource, "cormorant-garamond"))) throw new Error("need the @fontsource folder with cormorant-garamond and jost");
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, "public/demos/secrets-of-cint");

const once = (text, from, to, where) => {
  const n = text.split(from).length - 1;
  if (n !== 1) throw new Error(`${where}: expected one "${from.slice(0, 70)}", found ${n}`);
  return text.replace(from, () => to);
};

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.cpSync(path.join(src, "assets"), path.join(out, "assets"), { recursive: true });

// Fonts: the weights the site's Google Fonts link asked for, latin subset.
const FONTS = [
  ["Cormorant Garamond", "cormorant-garamond", [[300, "normal"], [400, "normal"], [500, "normal"], [600, "normal"], [300, "italic"], [400, "italic"], [500, "italic"]]],
  ["Jost", "jost", [[300, "normal"], [400, "normal"], [500, "normal"]]],
];
fs.mkdirSync(path.join(out, "assets/fonts"), { recursive: true });
const faces = [];
for (const [family, pkg, styles] of FONTS) {
  for (const [w, s] of styles) {
    const file = `${pkg}-latin-${w}-${s}.woff2`;
    fs.copyFileSync(path.join(fontsource, pkg, "files", file), path.join(out, "assets/fonts", file));
    faces.push(`@font-face { font-family: "${family}"; font-style: ${s}; font-weight: ${w}; font-display: swap; src: url(./${file}) format("woff2"); }`);
  }
  fs.copyFileSync(path.join(fontsource, pkg, "LICENSE"), path.join(out, "assets/fonts", `${pkg}-LICENSE.txt`));
}
fs.writeFileSync(path.join(out, "assets/fonts/fonts.css"), faces.join("\n") + "\n");

let html = fs.readFileSync(path.join(src, "index.html"), "utf8");
html = once(html, '  <link rel="preconnect" href="https://fonts.googleapis.com" />\n', "", "index.html");
html = once(html, '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n', "", "index.html");
html = html.replace(/  <link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*" rel="stylesheet" \/>/, '  <link href="assets/fonts/fonts.css" rel="stylesheet" />');
if (/fonts\.(googleapis|gstatic)\.com/.test(html)) throw new Error("index.html: a Google Fonts reference is left");

html = once(html, '<p class="news-ok" id="newsOk">Welcome to the family — check your inbox soon.</p>',
  '<p class="news-ok" id="newsOk">This is a demonstration, so no email was sent. On the live site this signs you up for the newsletter.</p>', "index.html");
html = once(html, "</head>", `<style id="meridian-demo-fit">
  /* Below the Meridian demonstration bar (tools/brand-demos.mjs sets --meridian-bar). */
  .site-header { top: var(--meridian-bar, 0px); }
  .cart-drawer, .mobile-nav { top: var(--meridian-bar, 0px); }
</style>
</head>`, "index.html");
html = once(html, "<body>", '<body>\n<div id="root">', "index.html");
html = once(html, "</body>", "</div>\n</body>", "index.html");
fs.writeFileSync(path.join(out, "index.html"), html);

const mainJs = path.join(out, "assets/js/main.js");
fs.writeFileSync(mainJs, once(fs.readFileSync(mainJs, "utf8"), 'showToast("You\'re on the list");', 'showToast("Demo only: no email was sent");', "main.js"));

let total = 0;
for (const f of fs.readdirSync(out, { recursive: true })) { const p = path.join(out, f); if (fs.statSync(p).isFile()) total += fs.statSync(p).size; }
console.log(`public/demos/secrets-of-cint/  ${(total / 1024 / 1024).toFixed(1)} MB`);
