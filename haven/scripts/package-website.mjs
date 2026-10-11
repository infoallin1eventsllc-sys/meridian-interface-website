// Hosts the complete Haven website, exactly as the Haven session published it, at
// meridianinterface.com/demos/haven/.
//
//   node haven/scripts/package-website.mjs <folder with the published site>
//   node tools/brand-demos.mjs
//
// The input is every file of the published artifact "Meridian Interface"
// (https://claude.ai/artifact/DSiDLzQfDefZV6gTP78e3e): the site, the guided tour, the screen
// library, the three live panels, the film, the voices and the pictures. Its pages, words and
// design are not changed. What changes is only what this site's security policy requires:
//   - script-src is 'self' with no inline scripts, so every inline <script> becomes a file in
//     js/ (named by its content hash; the three panels share one copy of the app). A
//     <script type="text/vtt"> holds captions, not code, and stays;
//   - nothing may load from another site, so the Google Fonts links become fonts/fonts.css with
//     the same families as latin woff2 files (Fontsource, SIL Open Font License, see
//     haven/fonts/licenses/), and the privacy page says so;
//   - the home page gains a #root and room for the Meridian bar (tools/brand-demos.mjs).
// One fix inside Haven: the Command screen's content column (see haven/web/styles.css).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const src = path.resolve(process.argv[2] || "");
if (!fs.existsSync(path.join(src, "index.html"))) throw new Error("usage: package-website.mjs <folder with the published site's index.html>");
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.resolve(root, "../public/demos/haven");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "js"), { recursive: true });
fs.mkdirSync(path.join(out, "fonts"), { recursive: true });

// 1. Everything that is not a page, as it is.
const files = fs.readdirSync(src, { recursive: true }).filter((f) => fs.statSync(path.join(src, f)).isFile());
// Published but used by no page (the Meridian bar brings its own mark as brand/meridian-mark.png).
const UNUSED = new Set(["img/meridian-mark.webp"]);
for (const f of files.filter((f) => !f.endsWith(".html") && !UNUSED.has(f.split(path.sep).join("/")))) {
  fs.mkdirSync(path.dirname(path.join(out, f)), { recursive: true });
  fs.copyFileSync(path.join(src, f), path.join(out, f));
}

// 2. The fonts every page asks Google for, served from here.
const FONTS = [
  // the website, the tour and the walk-through
  ["Archivo", "archivo-latin-standard-normal.woff2", "100 900", "62% 125%"],
  ["Instrument Sans", "instrument-sans-latin-wght-normal.woff2", "400 700"],
  ["JetBrains Mono", "jetbrains-mono-latin-wght-normal.woff2", "100 800"],
  // Linden House
  ["Bodoni Moda", "bodoni-moda-latin-standard-normal.woff2", "400 900"],
  ["DM Mono", "dm-mono-latin-400-normal.woff2", 400], ["DM Mono", "dm-mono-latin-500-normal.woff2", 500],
  // the panels and the screen library
  ...["exo-2:Exo 2", "hanken-grotesk:Hanken Grotesk", "inter:Inter", "jost:Jost", "lexend:Lexend", "manrope:Manrope",
    "nunito:Nunito", "outfit:Outfit", "roboto:Roboto", "saira:Saira"].map((s) => { const [slug, fam] = s.split(":"); return [fam, `${slug}-latin-wght-normal.woff2`, "100 900"]; }),
  ...[[400, 500, 600, 700, "barlow", "Barlow"], [600, 700, "barlow-condensed", "Barlow Condensed"], [500, 600, "chakra-petch", "Chakra Petch"], [600, 700, "saira-condensed", "Saira Condensed"]]
    .flatMap((r) => { const fam = r.pop(), slug = r.pop(); return r.map((w) => [fam, `${slug}-latin-${w}-normal.woff2`, w]); }),
];
const faces = FONTS.map(([family, file, weight, stretch]) => {
  fs.copyFileSync(path.join(root, "fonts", file), path.join(out, "fonts", file));
  return `@font-face{font-family:"${family}";font-style:normal;font-display:swap;font-weight:${weight};${stretch ? `font-stretch:${stretch};` : ""}src:url(./${file}) format("woff2")}`;
});
fs.writeFileSync(path.join(out, "fonts/fonts.css"), faces.join("\n") + "\n");

// 3. The pages.
const once = (html, from, to, where) => {
  const n = html.split(from).length - 1;
  if (n !== 1) throw new Error(`${where}: expected one "${from.slice(0, 70)}", found ${n}`);
  return html.replace(from, () => to);
};
const report = [];
for (const f of files.filter((f) => f.endsWith(".html"))) {
  let html = fs.readFileSync(path.join(src, f), "utf8");
  // The artifact service publishes its main page inside a one-line page shell of its own; the
  // site's real page is the second document in the file. Take that one.
  // Only the main page (index.html) is wrapped; other pages may mention a doctype in their code.
  if (f === "index.html" && /^<!doctype html><html><head><meta charset=utf8>/i.test(html)) {
    const second = html.indexOf("<!doctype html>", 1);
    if (second < 0 || html.slice(0, second).includes("\n<")) throw new Error("index.html: unexpected artifact shell");
    html = html.slice(second).replace(/\n*<\/body><\/html>\s*$/, "\n");
    if (!/<\/html>\s*$/.test(html)) throw new Error("index.html: could not take the page out of the artifact's shell");
  }
  // fonts
  html = html.replace(/[ \t]*<link rel="preconnect" href="https:\/\/fonts\.(googleapis|gstatic)\.com"( crossorigin)?>\n?/g, "");
  const g = html.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/[^"]*">/g) || [];
  if (g.length > 1) throw new Error(`${f}: ${g.length} Google Fonts links`);
  if (g.length) html = html.replace(g[0], '<link rel="stylesheet" href="fonts/fonts.css">');
  // inline scripts become files
  let moved = 0;
  html = html.replace(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g, (all, attrs = "", code) => {
    if (/\bsrc\s*=/.test(attrs)) return all;
    const type = (attrs.match(/\btype\s*=\s*"([^"]*)"/) || [])[1];
    if (type && type !== "module" && type !== "text/javascript") return all; // data, e.g. the film's captions
    const name = `js/${crypto.createHash("sha256").update(code).digest("hex").slice(0, 16)}.js`;
    if (!fs.existsSync(path.join(out, name))) fs.writeFileSync(path.join(out, name), code);
    moved++;
    return `<script${attrs} src="${name}"></script>`;
  });
  if (/fonts\.(googleapis|gstatic)\.com/.test(html)) throw new Error(`${f}: still asks Google for fonts`);
  // Sound carried inside a page (the film's soundtrack) as data: URLs, which media-src does not
  // allow, becomes an ordinary file beside it.
  html = html.replace(/data:audio\/mpeg;base64,([A-Za-z0-9+/=]+)/g, (all, b64) => {
    const name = `audio/${crypto.createHash("sha256").update(b64).digest("hex").slice(0, 16)}.mp3`;
    fs.mkdirSync(path.join(out, "audio"), { recursive: true });
    fs.writeFileSync(path.join(out, name), Buffer.from(b64, "base64"));
    return name;
  });
  for (const js of fs.readdirSync(path.join(out, "js"))) if (/data:(audio|video)\//.test(fs.readFileSync(path.join(out, "js", js), "utf8"))) throw new Error(`js/${js}: media as a data: URL`);
  if (/data:(audio|video)\//.test(html)) throw new Error(`${f}: media as a data: URL`);
  // Haven's Command screen on a phone (the panels carry styles.css inline)
  // No dead ends, and the library's "Open live" links stay inside the tour (haven/site-edits/haven-nav.js).
  if (f.startsWith("panel-") || f === "film.html" || f === "library.html") {
    fs.copyFileSync(path.join(root, "site-edits/haven-nav.js"), path.join(out, "js/haven-nav.js"));
    html = once(html, "</title>", '</title>\n<script src="js/haven-nav.js"></script>', f); // these pages have no </head>
  }
  if (f.startsWith("panel-")) html = once(html, ".cm-main { display: grid; gap: 12px; align-content: start; min-width: 0; padding: 0 0 14px; }",
    ".cm-main { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; align-content: start; min-width: 0; padding: 0 0 14px; }", f);
  if (f === "privacy.html") html = once(html, "<li><strong>Fonts.</strong> The typefaces load from Google Fonts, so your browser asks Google for them.</li>",
    "<li><strong>Fonts.</strong> The typefaces are served from this site; your browser asks no one else for them.</li>", f);
  if (f === "index.html") {
    // A root for tools/brand-demos.mjs, and the site's sticky header and FAQ heading below the bar.
    html = once(html, "</head>", `<style id="haven-under-meridian-bar">
  .nav { top: calc(var(--meridian-bar, 0px) + env(safe-area-inset-top, 0px)); }
  .faq-wrap .head { top: calc(var(--meridian-bar, 0px) + var(--nav-h) + 24px); }
</style>
</head>`, f);
    html = html.replace(/(<body[^>]*>)/, '$1\n<div id="root">');
    html = once(html, "</body>", "</div>\n</body>", f);
  }
  fs.writeFileSync(path.join(out, f), html);
  report.push(`${f}: ${moved} script${moved === 1 ? "" : "s"} to js/${g.length ? ", fonts local" : ""}`);
}
let total = 0;
for (const f of fs.readdirSync(out, { recursive: true })) { const p = path.join(out, f); if (fs.statSync(p).isFile()) total += fs.statSync(p).size; }
console.log(report.join("\n"));
console.log(`public/demos/haven/  ${fs.readdirSync(path.join(out, "js")).length} script files, ${(total / 1024 / 1024).toFixed(1)} MB`);
