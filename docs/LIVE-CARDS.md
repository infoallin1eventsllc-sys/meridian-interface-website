# Meridian Live Cards

A product on top of the digital card: clients make their own card with a live background and share it by link or QR code.

## What is in this branch (claude/live-cards-app)
| Address | What it is | Files |
|---|---|---|
| /live-cards/ | Landing page with a working sample card and background picker | public/live-cards/, public/live/landing.* |
| /studio/ | The app: edit details, buttons, background (13 live scenes or your own photo/video), publish, share, install | public/studio/, public/live/studio.* |
| /c/<name> | A client's public card, served by `api/lc-card.js` so the link carries that card's own title and preview picture (see "Link preview"). /c/?id=sample is Otis's sample; /c/?preview=1 shows the draft on this device | api/lc-card.js, public/c/, public/live/viewer.* |
| /live-cards/terms/ and /privacy/ | Drafts for Otis to review | public/live-cards/ |

Shared pieces: `engine.js` (all backgrounds, one card per page), `card-view.js` (builds a card from saved details; every value is text, a checked http/https link, or a checked file address), `card.css`, `api.js` (device storage plus the service), `config.js` (the switch).
All scripts are separate files because the site's security policy forbids inline scripts.

## What a card can hold (added 25 Nov 2026: headshot, more buttons, link preview)
- **Top:** logo or wordmark, a headshot (cut to a 640 px square on the device, shown in a circle; the logo steps back to one small row), name, title, one line, hours.
- **Main buttons:** Call, Email, Book. **Round buttons:** Text, Website, Directions (from an address, opens the map), Save to contacts, five social sites.
- **Labelled buttons:** Leave a review (any review link), and Pay with Cash App, Venmo, Zelle. Zelle has no payment link, so its button shows where to send and copies it.
- **Save to contacts** now carries the address and, on the public card, the headshot.
- A card with everything filled in is taller than one screen. On a phone the page grows; inside a fixed frame (the Studio preview, a desktop window) the card scrolls.

## Link preview
When a link is texted or posted, the phone or site reads the page's title and picture without running scripts, so every card link used to look the same.
- The Studio draws a 1200 x 630 picture from the card (background, headshot, name, title, line) on the device, shows it on the Share tab, and at publish saves it beside the card as `og-<id>.jpg`.
- `api/lc-card.js` (a Vercel Function in plain JavaScript, so the site's TypeScript settings cannot break its build; `vercel.json` sends `/c/:slug` to it) returns the same card page with that card's title, line and picture written into the top. It reads `public/live/config.js` for the switch, asks the service the one public question `lc_get_card`, holds no secret and writes nothing. Service off, slow, broken, card missing or taken down: it returns exactly `public/c/index.html`.
- The function repeats the page and the security headers; `tools/live-cards-preview-test.cjs` fails if either drifts from `public/c/index.html` or `vercel.json`.
- `public/live/og-default.jpg` is the picture for a link with no card behind it.
- Not yet seen on real apps: check a published card's link in iMessage, WhatsApp and Facebook's Sharing Debugger at go-live.

## The switch
`public/live/config.js` has `enabled:false`. In that state the Studio works fully on the device (drafts in IndexedDB, nothing sent anywhere) and the Share tab says sharing is being set up. Public card links need the service.

## Security
The browser is never trusted; the rules live in the database and in two payment functions. The full write-up (what was attacked, what stops it, what is still open) is `system/products/live-cards/SECURITY.md` in the all-in-1-events-2 repo.
- App pages (`/studio/`, `/c/`, `/live-cards/`, `/live/`) have their own strict policy in `vercel.json`: scripts from this site only, no inline code, pictures and video only from this site and the Live Cards file store. The rest of the site keeps its existing policy.
- `card-view.js` and `engine.js` accept a picture or video only from this device, the site's own sample and brand folders, or a client's own folder in the file store.
- `tools/live-cards-security-test.cjs` runs the whole journey under that policy against a stand-in service: 36 checks, all passing on 24 Nov 2026.

## Switches in `public/live/config.js` (all off)
| Switch | What it does |
|---|---|
| `enabled` | Accounts, publishing and public links. Off: the Studio saves on the device only. |
| `billing` | Shows "Your plan" in the Studio (Upgrade, Manage, hide the Made-with line). Needs the two payment functions deployed. No price is ever shown here; Stripe's page shows it. |
| `appOrigin` | The app's own address. When set, the Studio and card pages refuse to run anywhere else and move the visitor there. |
| `humanCheck` | A Cloudflare Turnstile site key. When set, asking for a sign-in code needs a passed check. Also needs one agreed line in the Live Cards policy. |

## Owner desk
The Studio portal has a Live Cards tab (`src/components/OwnerLiveCards.tsx`): reports from visitors, find a card, take it down, put it back, set a plan by hand, remove a blocked account's files. It talks to the `lc-admin` function, which checks the owner session. Until that function is deployed the tab says Live Cards is not switched on.

## Tests (all in `tools/`, all against stand-ins; nothing real is contacted)
Build, serve on port 4799 (`npx vite preview --port 4799`), then:
- `live-cards-security-test.cjs`: the whole client journey under the real headers, 36 checks.
- `live-cards-preview-test.cjs`: the link page function against hostile and broken answers (no browser), then headshot, new buttons, link preview, contact file and file limit in a browser, 62 checks.
- `lc-test-kit.cjs` is shared by those two: the service stand-in (it mirrors the database rules; change both together) and the real page function.
- `live-cards-plans-test.cjs`: plans, the human check, the own-address switch, 19 checks.
- `live-cards-owner-test.cjs`: the owner desk on desktop and phone, 24 checks.
If Playwright's own browser is missing, set `CHROMIUM_PATH`.

## Going live
Nothing has been done. The steps, in order, are in `system/products/live-cards/launch/RUNBOOK.md` in the all-in-1-events-2 repo, and what is still open is in `WHATS-LEFT.md` beside it.

## Not built yet
Managing more than one card in the Studio, sign-in with Apple or Google, video trimming inside the app (the app asks people to trim in Photos), per-card visit counts, moving the headshot inside its circle, and logos with a see-through background (uploads are saved as JPG, so a see-through logo gets a solid box behind it).

## Store apps
See `mobile/README.md`.
