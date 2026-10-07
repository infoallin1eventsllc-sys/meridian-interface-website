# Design notes

Decisions that should survive the next pass, so "polish the services page"
next month lands in the same system as what shipped today. Brand colours, type
and logo rules live in the `meridian-brand` skill; this file is about how the
site uses them.

## Mode

The site is a **Persuade** surface: visitors are deciding whether to care.
One claim per section, stated with hierarchy, and the work shown rather than
described.

## Homepage hero (25 Sep 2026)

- **Headline** is the line the studio reel closes on: "Websites, apps, and AI
  systems. / We put the future in your hands." Change them together or not at
  all; the film and the front door should say the same thing.
- **The brand name is not repeated in the hero.** The header already carries
  it. The eyebrow is one line, "Design & development studio", short enough not
  to wrap on a phone.
- **Body copy is specific**, naming the five things built (brand, website, app,
  dashboard, follow-up systems) and the first step (a 1-on-1 appointment).
  The old slash-separated capability line was removed because it repeated the
  paragraph.
- **Two CTAs, each naming its action**: "Book an appointment" (primary, blue)
  and "Try the working demos" (secondary, outline, trailing arrow).
- **Imagery is real work, not stock.** On wide screens (lg and up) the
  backdrop is the showcase (7 Oct 2026): Otis's own Higgsfield clip, three
  aluminium-rimmed glass panes on dark navy joined by threads of light, with
  real screen captures composited into the glass; the large pane is this
  website, the phone and tablet panes cut through every product every 0.8 s.
  Nothing in the clip is redrawn, so it looks exactly as he approved it, and
  every screen in it is true. The panes keep to the right half. Below lg, `HeroShowcase.tsx`
  layers three demo captures under the buttons, each opening its concept
  panel; on wide screens it is not rendered, since the backdrop shows the
  products. Provenance and re-render steps: `public/images/CREDITS.md`.
- **Frames**: dark chrome `#0b1220`, neutral dots (not traffic-light colours),
  a real address in the bar. Elevation is a navy-tinted drop shadow, used
  here because the frames genuinely overlap.
- **Motion**: copy rises first, then frames arrive back to front (0.35s, 0.5s,
  0.65s). Pointer hover lifts a frame 6px. All of it is off under
  `prefers-reduced-motion`.
- **The backdrop** (`HeroBackdrop.tsx`) is shown only on wide screens. It
  pauses off screen and in a hidden tab; reduced motion, Save-Data and 2G get
  its 51 KB still frame (`lib/stillness.ts`, shared with the studio reel), which
  `index.html` preloads for wide screens. Below lg the copy runs full width and
  the cards carry the imagery, so the ground is the video's palette with
  nothing in it: footage behind running text is clutter. When the homepage
  changes, re-render the video: the large pane shows the homepage.

## Type scale in the hero

| Element | Size |
|---|---|
| Eyebrow | 12px Inter bold, tracking 0.22em, uppercase |
| H1 | 40px, then 48px from sm, 54px from lg, 64px from xl. Hanken Grotesk 900, leading 1.04 |
| Body | 16px, then 18px from sm. Inter, slate-300, measure max-w-xl |
| Caption | 11-12px Inter, slate-400 |

## Copy rules (30 Sep 2026)

- **No long dashes (—) in anything a visitor reads.** They are the most-cited
  sign of AI-written copy. Use a full stop, a comma, a colon, or brackets.
  Product titles take a colon ("FinSight: Financial & Revenue Dashboard").
  Code comments and the owner portal are exempt; visitors never see them.
- **Reply promise: one business day.** Stated on the booking confirmation,
  the booking page, the saved-list fallback, the closing call to action and
  the FAQ. Change it everywhere or nowhere.
- **FAQ answers restate commitments made elsewhere on the site** (the quote
  on the booking page, ownership in "How we work", timelines on the service
  cards). If one of those changes, change the FAQ too.
- **The `<noscript>` block in `index.html` mirrors the hero and the FAQ word
  for word.** It is the only text crawlers and AI search read; if it says
  something the page does not, search engines treat that as cloaking.
