# Live Cards design system

Written 25 Nov 2026 after Otis asked for a "Fortune 500 ready" app that looks like the best-designed apps on the market.
The look is not copied from any one app. It takes what those apps have in common and applies it with the Meridian brand.

## Brief
- **Who uses it:** a business owner building a card on a phone, often in a hurry; that owner's clients, who open the card once and act; a larger company deciding whether Meridian is credible.
- **Voice:** calm, confident, plain. No hype words, no prices, no invented numbers or logos.
- **Not this:** dark navy "AI startup" pages, glass panels everywhere, purple gradients, pill buttons on everything, pulsing dots, eyebrow chips, cards inside cards.

## Three modes, three jobs
| Surface | Mode | Rule |
|---|---|---|
| Landing page `/live-cards/` | Persuade | One idea ("The business card that moves"), proved by a working card in the first screen. |
| Studio `/studio/` | Operate | The form gets out of the way; the card preview never leaves the screen; one blue action per view. |
| Card `/c/<name>` | Experience | The client's card fills the screen. Meridian's chrome is almost invisible. |

## What it borrows from the best-designed apps
1. **The product is the hero.** The interface is quiet (light surface, hairlines, one accent) so the live card is the only loud thing.
2. **Native patterns people already know.** A tab bar at the thumb on phones, a tab row on computers, switches for on/off, a picture gallery instead of a list of names.
3. **A real type scale and spacing scale,** not sizes chosen screen by screen.
4. **Every state is designed:** empty, saving, saved, off, error, signed out, dark mode, reduced motion, keyboard focus.
5. **Trust is stated plainly,** with facts that are true of the build, not badges.

## Tokens (`public/live/ui.css`)
| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | #f7f9fd | #0b1120 | Page |
| `--panel` | #ffffff | #111a2e | Bars, inputs, device bezel |
| `--sunk` | #eef2f8 | #0e1627 | Preview stage, callouts |
| `--ink` | #0f172a | #f1f5f9 | Headings, strong text |
| `--muted` / `--faint` | #475569 / #64748b | #a3b2cc / #8b9ab5 | Supporting text |
| `--line` / `--line-strong` | #e2e8f0 / #cbd5e1 | #22304f / #33456e | Hairlines, input borders |
| `--accent` | #2563eb | #2563eb | The one primary action, selection |
| `--ok` / `--danger` | #047857 / #b91c1c | #34d399 / #fca5a5 | Saved, destructive |

Light is the default because the brand's surface is light and the real logo needs a light ground. Dark follows the device setting.

- **Type:** Hanken Grotesk 800 for headings (tracking -0.02em), Inter for everything else. Sizes: 64/36/28/24/19/17 display; 16/15/14.5/13.5/12 text.
- **Spacing:** 4, 8, 12, 16, 20, 24, 32, 48, 56, 80.
- **Radius:** 10 inputs, 12 buttons and thumbnails, 14 callouts, 20 bands. Full pills are kept for the client's card only, so the card never looks like part of the app.
- **Elevation:** hairlines first. Shadow only on the phone device and the toast.
- **Motion:** 160 ms ease-out on state changes; press scales to 0.98; all of it off under "reduce motion".
- **Touch targets:** 44 px minimum. **Focus:** 2 px accent ring, 2 px offset, on everything.

## Parts
- `.btn` the single primary action of a view. `.ghost` every other button. `.ghost.danger` destructive. `.small` compact.
- Tab bar (`.tabs`): icon over label, fixed to the bottom on phones; icon beside label under the app bar on computers. Arrow keys move between tabs.
- Fields: label above, 48 px input, blue ring on focus. Groups are a heading and a hairline, not boxes.
- `.check.switch` for on/off settings; a plain checkbox for consent.
- `.drop` upload tile. Background gallery: 4:5 thumbnails in `public/live/thumbs/`, three across on phones, four on computers.
- `.ready` checklist on the Share tab; each line jumps to where it is fixed.
- `.callout` for "not available yet" messages.

## Rules that came from the brand skill
The mark is the real file beside live text. The lockup file is never placed on a dark ground. The accent blue never touches the mark. Fonts are self-hosted.

## Not done yet
A design pass on the owner desk tab, illustrations for empty states, and real-phone checks of the tab bar with the on-screen keyboard open.
