// Builds the Haven demo for meridianinterface.com/demos/haven/.
//
//   cd haven && npm ci && node scripts/build-meridian.mjs
//
// The same browser-only app as scripts/build-demo.mjs (the real Haven core on a
// simulated house, the Claude agent stubbed out because it needs a server-side
// key), packaged for the website's security policy instead of as one page:
//   - script-src is 'self' with no inline scripts, so the app, and the small
//     start-up script that picks the finish, are files (app.js, boot.js);
//   - nothing loads from another site, so the fonts are the same families as
//     the Google Fonts link in web/index.html, as latin woff2 files in fonts/
//     (from Fontsource, SIL Open Font License, see fonts/licenses/);
//   - everything is relative, so it works under /demos/haven/.
// Output: ../public/demos/haven/. Then run `node tools/brand-demos.mjs` from the
// website root to stamp the Meridian bar.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.resolve(root, "../public/demos/haven");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "fonts"), { recursive: true });

const shims = path.join(root, "web/demo/shims.js");
const result = await build({
  entryPoints: [path.join(root, "web/demo/entry.js")],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2022",
  minify: true,
  define: { "import.meta.url": JSON.stringify("https://haven.demo/") },
  write: false,
  loader: { ".webp": "dataurl" },
  alias: { "node:events": shims, "node:fs": shims, "node:path": shims, fs: shims, path: shims },
  plugins: [{
    name: "no-claude-in-browser",
    setup(b) {
      b.onResolve({ filter: /claude\.js$/ }, () => ({ path: "claude-disabled", namespace: "stub" }));
      b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({ contents: "export async function createClaudeAgent() { throw new Error('Claude is not available in the demo.'); }" }));
    },
  }],
});
fs.writeFileSync(path.join(out, "app.js"), result.outputFiles[0].text);

// The finish picker from build-demo.mjs, as a file. Vivid is the default here:
// the keynote direction, and the brightest first impression on a portfolio.
fs.writeFileSync(path.join(out, "boot.js"), `(function () {
  var look = "vivid", theme = null;
  var screen = location.hash.replace("#", "");
  var asked = new URLSearchParams(location.search).get("look");
  try { look = localStorage.getItem("haven.look") || look; theme = localStorage.getItem("haven.theme"); screen = screen || localStorage.getItem("haven.screen") || ""; } catch (e) {}
  if (asked === "grounded" || asked === "futuristic" || asked === "vivid") look = asked;
  document.documentElement.setAttribute("data-look", screen === "wallpaper" ? look : "grounded");
  window.__havenLook = look;
  if (theme === "light" || theme === "dark") document.documentElement.setAttribute("data-theme", theme);
  if (!document.documentElement.lang) document.documentElement.lang = "en";
})();
`);

// Styles and the Wallpaper screen's photos, side by side so the relative urls hold.
fs.copyFileSync(path.join(root, "web/styles.css"), path.join(out, "styles.css"));
fs.cpSync(path.join(root, "web/wallpapers"), path.join(out, "wallpapers"), { recursive: true });
fs.copyFileSync(path.join(root, "web/icon.svg"), path.join(out, "icon.svg"));

// Fonts: one variable file per family where it exists, static weights otherwise.
const VARIABLE = { "Exo 2": "exo-2", "Hanken Grotesk": "hanken-grotesk", Inter: "inter", Jost: "jost", Lexend: "lexend",
  Manrope: "manrope", Nunito: "nunito", Outfit: "outfit", Roboto: "roboto", Saira: "saira" };
const STATIC = { Barlow: ["barlow", [400, 500, 600, 700]], "Barlow Condensed": ["barlow-condensed", [600, 700]],
  "Chakra Petch": ["chakra-petch", [500, 600]], "Saira Condensed": ["saira-condensed", [600, 700]] };
const faces = [];
const face = (family, file, weight) => {
  fs.copyFileSync(path.join(root, "fonts", file), path.join(out, "fonts", file));
  faces.push(`@font-face{font-family:"${family}";font-style:normal;font-display:swap;font-weight:${weight};src:url(./fonts/${file}) format("woff2")}`);
};
for (const [family, slug] of Object.entries(VARIABLE)) face(family, `${slug}-latin-wght-normal.woff2`, "100 900");
for (const [family, [slug, weights]] of Object.entries(STATIC)) for (const w of weights) face(family, `${slug}-latin-${w}-normal.woff2`, w);
fs.writeFileSync(path.join(out, "fonts.css"), faces.join("\n") + "\n");

// The page: the app's own markup between its body markers, inside a #root so
// tools/brand-demos.mjs can stamp the Meridian bar (its guard refuses a page
// without one). Nothing in styles.css or the app addresses body's children.
const html = fs.readFileSync(path.join(root, "web/index.html"), "utf8");
const body = html.split("<!--haven:body-->")[1].split("<!--/haven:body-->")[0];
fs.writeFileSync(path.join(out, "index.html"), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#17130f">
<meta name="description" content="Haven, an AI agent for the whole house, running on a simulated home: lights, climate, water, garage and locks, with briefings and a safety controller. A Meridian Interface demo.">
<title>Haven: AI Home Integration Demo</title>
<link rel="icon" href="icon.svg" type="image/svg+xml">
<link rel="stylesheet" href="fonts.css">
<link rel="stylesheet" href="styles.css">
<script src="boot.js"></script>
</head>
<body>
<div id="root">
${body}
</div>
<script src="app.js"></script>
</body>
</html>
`);

let total = 0;
for (const f of fs.readdirSync(out, { recursive: true })) { const p = path.join(out, f); if (fs.statSync(p).isFile()) total += fs.statSync(p).size; }
console.log(`public/demos/haven/  ${(total / 1024 / 1024).toFixed(1)} MB`);
