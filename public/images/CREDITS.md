# Image credits and licensing

Provenance for every image shipped in this repository. Keep this current — a
studio site is the last place to be unsure whether an asset is cleared.

## Hero — Earth from orbit

| | |
|---|---|
| Files | `images/hero-earth.jpg`, `images/earth-poster.jpg`, `video/earth-loop.mp4`, `video/earth-loop.webm` |
| Source | Adobe Stock, asset **337907436** |
| Title | "A cinematic rendering of planet Earth rise rotation moving from night side to the illuminated daylight side with the sun rising on the planet's horizon" |
| Licensed to | Meridian Interface (Otis Williams) Adobe account, 2026-08-20 |
| Tier | Adobe Stock free collection |
| Original | 6000 x 3375 |

The video loop and the poster are **derived works** of that licensed still —
a camera move, bloom, grain and grade rendered with ffmpeg. They carry the
same license as the source asset.

Adobe Stock's standard license covers use on a website, including a commercial
one. It does **not** permit redistributing the asset as a standalone file, so
do not offer the source image or the loop as a download.

### Replaced

The previous `hero-earth.jpg` was a CG render that arrived with the Google AI
Studio export. Its provenance was never established, which is why it was
replaced rather than kept as a fallback.

## Hero — the studio's own work

| | |
|---|---|
| Files | `images/hero/hero-dashboard.webp`, `images/hero/hero-website.webp`, `images/hero/hero-mobile.webp` |
| Source | Screenshots of this site's own demos: `demos/analytics-hub/`, `demos/frame-shop/`, `demos/big-boy-subs/` |
| Captured | 2026-09-25, headless Chromium. Desktop at 1280x800 (1.5x), phone at 390x844 (2x). The "Built by Meridian Interface" banner is trimmed off because the hero draws its own browser and phone frames. |

These carry whatever the demos carry: any photograph visible in a capture
(the Big Boy Subs sandwich, the Frame Shop workshop) is the same file the demo
already ships, so the hero adds no new licensing exposure. If a demo changes
enough that the hero misrepresents it, re-capture at the sizes above and export
to WebP at quality 80 (1200px wide for the browsers, 480px for the phone).

## Everything else

The portfolio and section imagery is currently hotlinked from
`images.unsplash.com`. Unsplash's licence permits commercial use without
attribution, but hotlinking leaves the site's visual identity dependent on a
third party. Self-hosting these is item 2 on `system/PRELAUNCH.md` in the
marketing-system repo.
