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
  dashboard, follow-up systems) and the first step (a 1-on-1 consultation).
  The old slash-separated capability line was removed because it repeated the
  paragraph.
- **Two CTAs, each naming its action**: "Book a consultation" (primary, blue)
  and "Try the working demos" (secondary, outline, trailing arrow).
- **Imagery is real work, not stock.** `HeroShowcase.tsx` layers three demo
  captures (dashboard at back, website in front, phone foremost) over the
  globe. Each frame opens that piece's concept panel. Provenance and
  re-capture sizes are in `public/images/CREDITS.md`.
- **Frames**: dark chrome `#0b1220`, neutral dots (not traffic-light colours),
  a real address in the bar. Elevation is a navy-tinted drop shadow, used
  here because the frames genuinely overlap.
- **Motion**: copy rises first, then frames arrive back to front (0.35s, 0.5s,
  0.65s). Pointer hover lifts a frame 6px. All of it is off under
  `prefers-reduced-motion`.
- **The globe** (`HeroBackdrop.tsx`) stays as the ground, not the subject.

## Type scale in the hero

| Element | Size |
|---|---|
| Eyebrow | 12px Inter bold, tracking 0.22em, uppercase |
| H1 | 40px, then 48px from sm, 54px from lg, 64px from xl. Hanken Grotesk 900, leading 1.04 |
| Body | 16px, then 18px from sm. Inter, slate-300, measure max-w-xl |
| Caption | 11-12px Inter, slate-400 |
