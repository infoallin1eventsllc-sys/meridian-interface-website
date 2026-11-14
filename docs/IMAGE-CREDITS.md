# Image credits and licensing

> Kept in `docs/`, not `public/`: anything under `public/` is served to the world, and
> these are working notes (moved 14 Nov 2026, when the site check found them online).

Provenance for every image shipped in this repository. Keep this current — a
studio site is the last place to be unsure whether an asset is cleared.

## Hero: the laptop film (13 Nov 2026)

| | |
|---|---|
| Files | `images/hero/laptop-poster.webp`, `images/hero/laptop-poster-sm.webp`, `video/hero-laptop.webm`, `video/hero-laptop.mp4`, `video/hero-laptop-sm.webm`, `video/hero-laptop-sm.mp4` |
| Source | Otis's Higgsfield "Monospace Callouts" ad for the Agent Dashboard, generated on his own account (job 168e6e1c, 12 Nov 2026) from a picture of the studio's own Agent Dashboard on a laptop. Reworked for the hero with ffmpeg only: slowed, looped without a cut, its black stage keyed onto this site's navy. No new generation |
| Sound | The ad's own audio from the same Higgsfield job, slowed to the film's speed and cleaned (pops and clacks removed, a soft lead-in and ring-out added from the sound itself). Nothing else is mixed in |
| Licence | Otis's Higgsfield output, under his plan's commercial terms; the screen shown is the studio's own work |
| Re-render | Backend repo, `system/media/hero-laptop/README.md` |

## Hero (removed 13 Nov 2026): the showcase

The glass-pane showcase film (`images/hero/showcase-poster.webp`, `video/hero-showcase.*`,
a Higgsfield clip from Otis's account, job 3cdc7ab7, 7 Oct 2026) was the hero from
7 Oct to 13 Nov 2026. Its files were removed when the laptop film replaced it; they
are in git history, and its recipe is still in the backend repo at
`system/media/showcase/README.md`.

## Hero (retired): Earth from orbit

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

## Hero (removed 13 Nov 2026): the three demo captures

`images/hero/hero-dashboard.webp`, `hero-website.webp` and `hero-mobile.webp` were
screenshots of this site's own demos, shown as three framed cards in the hero on
phones and tablets until the laptop film took that place. Removed with the component
that drew them (`HeroShowcase.tsx`); both are in git history.

## Everything else

The portfolio and section imagery is currently hotlinked from
`images.unsplash.com`. Unsplash's licence permits commercial use without
attribution, but hotlinking leaves the site's visual identity dependent on a
third party. Self-hosting these is item 2 on `system/PRELAUNCH.md` in the
marketing-system repo.
