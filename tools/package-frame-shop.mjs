#!/usr/bin/env node
// Packages The Frame Shop demo at /demos/frame-shop/ from the version Otis published
// from the Frame Shop session: the artifact "The Frame Shop"
// (https://claude.ai/artifact/6GNnNSJjNXPWXdLApS9NM6, version 1791481564-bb94, 8 Oct 2026),
// a single-file build with the video hero. Its source was never pushed to a repository,
// so frame-shop/ in this repo is the OLDER version (before the video hero); the demo now
// comes from the published build.
//
//   node tools/package-frame-shop.mjs <artifact index.html> <folder holding video/hero-1080.mp4 and video/hero-poster.jpg>
//   node tools/brand-demos.mjs
//   cp public/brand/meridian-mark.png public/demos/frame-shop/brand/
//
// On the way in:
//   - the artifact service's page shell is removed;
//   - the inline app script moves to js/<hash>.js (the site's security policy runs no inline script);
//   - the three Unsplash photos become the demo's own copies (frame-shop/public/images/),
//     which is what the previous build did: the site loads no pictures from other hosts;
//   - the hero's captions file, which the build asks for but the artifact never carried, is
//     written: the clip has no speech, so it describes the sound;
//   - the booking and contact confirmations say it is a demonstration and nothing was sent;
//   - the shop's legal pages open inside the demo (?page=privacy ...), and Home links stay in it;
//   - the canonical link and og:url pointing at "/" (the Meridian home page) are dropped, and
//     the icons and manifest the previous build carried are linked again.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const [srcHtml, srcMedia] = process.argv.slice(2).map((p) => p && path.resolve(p));
if (!srcHtml || !fs.existsSync(srcHtml) || !srcMedia || !fs.existsSync(path.join(srcMedia, "video/hero-1080.mp4")))
  throw new Error("usage: package-frame-shop.mjs <artifact index.html> <folder with video/hero-1080.mp4 and video/hero-poster.jpg>");
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, "public/demos/frame-shop");
const pub = path.join(root, "frame-shop/public");

const once = (text, from, to, where) => {
  const n = text.split(from).length - 1;
  if (n !== 1) throw new Error(`${where}: expected one "${from.slice(0, 70)}", found ${n}`);
  return text.replace(from, () => to);
};

let html = fs.readFileSync(srcHtml, "utf8");
const SHELL = "<!doctype html><html><head><meta charset=utf8>";
if (html.startsWith(SHELL)) {
  html = html.slice(html.indexOf("<body>") + "<body>".length).replace(/<\/body><\/html>\s*$/, "").replace(/^\s+/, "");
}
if (!html.startsWith("<!doctype html>")) throw new Error("index.html: not the published page");

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "js"), { recursive: true });

// The inline app script to a file (structured data stays: it is data, not a script).
let moved = 0;
html = html.replace(/<script(\s+type="module")?>([\s\S]*?)<\/script>/g, (all, mod, code) => {
  const name = `js/${crypto.createHash("sha256").update(code).digest("hex").slice(0, 16)}.js`;
  fs.writeFileSync(path.join(out, name), code);
  moved++;
  return mod ? `<script type="module" src="${name}"></script>` : `<script src="${name}"></script>`;
});
if (moved !== 1) throw new Error(`expected 1 inline script (the app), moved ${moved}`);

// The case-study and fallback photos: the demo's own copies.
const PHOTOS = {
  "photo-1558981806-ec527fa84c39": "images/work-powertrain.jpg", // Road Glide, powertrain
  "photo-1568772585407-9361f9bf3a87": "images/work-frame.jpg",   // FXR chopper, frame
  "photo-1558981403-c5f9899a28bc": "images/work-powertrain.jpg", // Challenger bagger and the fallbacks
};
const js = fs.readdirSync(path.join(out, "js"));
for (const f of [null, ...js]) {
  const p = f ? path.join(out, "js", f) : null;
  let text = p ? fs.readFileSync(p, "utf8") : html;
  text = text.replace(/https:\/\/images\.unsplash\.com\/(photo-[\w-]+)\?[^"'`\s)]*/g, (u, id) => {
    if (!PHOTOS[id]) throw new Error(`unmapped Unsplash photo ${id}`);
    return PHOTOS[id];
  });
  if (p) fs.writeFileSync(p, text); else html = text;
}
for (const f of js) if (/images\.unsplash\.com/.test(fs.readFileSync(path.join(out, "js", f), "utf8"))) throw new Error(`js/${f}: an Unsplash link is left`);

// On this host nothing reaches the shop, so the booking and contact confirmations say so and
// give the shop's phone (the same fix the previous build carried, from 2 Oct, commit be0afe8).
const appJs = path.join(out, "js", js[0]);
let app = fs.readFileSync(appJs, "utf8");
const PATCHES = [
  ['children:"APPOINTMENT REQUEST RECEIVED!"', 'children:"DEMONSTRATION REQUEST (NOT SENT)"'],
  ['". Paul has received your request for "', '". This copy of the site is a demonstration, so your request for "'],
  ['children:[u," ",f," ",g]}),"."]})', 'children:[u," ",f," ",g]})," was not sent to the shop."]})'],
  ['children:"Next Step:"})," Paul will review your motorcycle details and call or text you at ",i.jsx("strong",{className:"text-zinc-100",children:K})," to confirm your exact lift time slot."]',
   'children:"Demonstration:"})," this copy is not connected to the shop, so nobody will call ",i.jsx("strong",{className:"text-zinc-100",children:K}),". To book a real appointment, call Paul at (832) 628-5226."]'],
  ['children:"Message Sent To The Shop!"', 'children:"Demonstration: Message Not Sent"'],
  ['". Paul will review your message and reach back out promptly."', '". This is a demonstration copy of the site, so your message was not sent. To reach the shop, call (832) 628-5226."'],
];
for (const [from, to] of PATCHES) app = once(app, from, to, `js/${js[0]}`);
// The shop's Privacy, Terms, Refunds and Cookies pages are chosen by the address path
// (/privacy ...), and the Home links go to "/": on this host those land on the Meridian home
// page. Here they are ?page=privacy ... inside the demo folder, and Home is the demo itself.
app = once(app, "const Wx=Hj(window.location.pathname)", 'const Wx=Hj("/"+(new URLSearchParams(window.location.search).get("page")||""))', `js/${js[0]}`);
for (const [from, to, n] of [['href:"/privacy"', 'href:"?page=privacy"', 4], ['href:"/terms"', 'href:"?page=terms"', 3], ['href:"/refunds"', 'href:"?page=refunds"', 3], ['href:"/cookies"', 'href:"?page=cookies"', 1], ['href:"/"', 'href:"./"', 3]]) {
  const found = app.split(from).length - 1;
  if (found !== n) throw new Error(`js/${js[0]}: expected ${n} of ${from}, found ${found}`);
  app = app.split(from).join(to);
}
fs.writeFileSync(appJs, app);

html = once(html, '<link rel="canonical" href="/" />', "", "index.html");
html = once(html, '<meta property="og:url" content="/" />', "", "index.html");
html = once(html, "</title>", `</title>
    <link rel="icon" type="image/png" href="pwa-icon-192.png" />
    <link rel="apple-touch-icon" href="pwa-icon-512.png" />
    <link rel="manifest" href="manifest.json" />`, "index.html");
if (/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/.test(html)) throw new Error("index.html: an inline script is left");
fs.writeFileSync(path.join(out, "index.html"), html);

// Media, pictures, icons.
fs.mkdirSync(path.join(out, "video"), { recursive: true });
for (const f of ["hero-1080.mp4", "hero-poster.jpg"]) fs.copyFileSync(path.join(srcMedia, "video", f), path.join(out, "video", f));
fs.writeFileSync(path.join(out, "video/hero-captions.vtt"), `WEBVTT

00:00:00.000 --> 00:00:15.000
[No speech. The motorcycle comes apart, rebuilds and starts up.]
`);
fs.cpSync(path.join(pub, "images"), path.join(out, "images"), { recursive: true, filter: (s) => !s.endsWith("README.txt") });
for (const f of ["manifest.json", "pwa-icon-192.png", "pwa-icon-512.png"]) fs.copyFileSync(path.join(pub, f), path.join(out, f));

let total = 0;
for (const f of fs.readdirSync(out, { recursive: true })) { const p = path.join(out, f); if (fs.statSync(p).isFile()) total += fs.statSync(p).size; }
console.log(`public/demos/frame-shop/  ${moved} scripts to js/, ${(total / 1024 / 1024).toFixed(1)} MB`);
