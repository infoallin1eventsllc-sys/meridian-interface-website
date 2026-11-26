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
- **Top:** logo (or, with no logo, the business name set as a wordmark), a headshot (cut to a 640 px square on the device, shown in a circle; the logo steps back to one small row), name, title, one line, hours.
- **Main buttons:** Call, Email, Book. **Round buttons:** Text, Website, Directions (from an address, opens the map), Save to contacts, five social sites.
- **Labelled buttons:** Leave a review (any review link), and Pay with Cash App, Venmo, Zelle. Zelle has no payment link, so its button shows where to send and copies it.
- **Save to contacts** now carries the address and, on the public card, the headshot.
- A card with everything filled in is taller than one screen. On a phone the page grows; inside a fixed frame (the Studio preview, a desktop window) the card scrolls.

## Link preview
When a link is texted or posted, the phone or site reads the page's title and picture without running scripts, so every card link used to look the same.
- The Studio draws a 1200 x 630 picture from the card (background, headshot, name, title, line; the business name is in the link's title beneath it) on the device, shows it on the Share tab, and at publish saves it beside the card as `og-<id>.jpg`.
- `api/lc-card.js` (a Vercel Function in plain JavaScript, so the site's TypeScript settings cannot break its build; `vercel.json` sends `/c/:slug` to it) returns the same card page with that card's title, line and picture written into the top. It reads `public/live/config.js` for the switch, asks the service the one public question `lc_get_card`, holds no secret and writes nothing. Service off, slow, broken, card missing or taken down: it returns exactly `public/c/index.html`.
- The function repeats the page and the security headers; `tools/live-cards-preview-test.cjs` fails if either drifts from `public/c/index.html` or `vercel.json`.
- `public/live/og-default.jpg` is the picture for a link with no card behind it.
- Not yet seen on real apps: check a published card's link in iMessage, WhatsApp and Facebook's Sharing Debugger at go-live.

## Built on 26 Nov 2026 (the rest of the front end)
- **Photo:** the chosen photo stays on the device so it can be dragged and zoomed inside its circle; only the cut 640 px square is uploaded.
- **Logo:** a logo with a see-through background is saved as PNG and stays see-through. Everything else is JPG.
- **Starting points by trade** (Details tab): fills a title, a line, the booking button words, a background and a color. It never overwrites what the client typed.
- **Take it with you** (Share tab, after publishing): a 1600 px QR code PNG for print, a 1290 x 2796 lock-screen picture, an email signature copied to the clipboard, and "Set up a tap card" on phones that can write NFC. All made on the device.
- **Team cards:** the Studio keeps a book of cards (`book` in IndexedDB; `draft` is the one being edited). On the paid plan the "Editing" picker offers "Add a team member". The business name, logo, colors, background, address, hours, website, social, review and pay buttons are shared; names, photos, phones, emails and links are personal. "Update every card" republishes each card that changed.
  - Back end still needed for teams: the file limit is 12 per account, which is exactly five cards with nothing to spare during an update; raise it for the paid plan. Members cannot sign in to edit their own card; the account owner edits all of them.
- **Spanish:** `public/live/i18n.js` holds every line of text in Spanish, keyed by the English. Pages follow the reader (`?lang=es` or `?lang=en`, remembered; else the device language) and are swapped as they appear, including text scripts add later. A card follows the language its owner picks on the Details tab (`lang` in the card's data). New or changed English text needs its Spanish line added there; `tools/live-cards-preview-test.cjs` fails if any page shows English to a Spanish reader. The Spanish terms and privacy are translations of the English drafts and need the same review.

## Activity, and "Send me your info" (front end built 26 Nov 2026; needs the back end before it is switched on)
Switch: `activity` in `public/live/config.js`. While it is false there is no Activity tab, no "Send me your info" switch, and the card sends no counts.
- **Card:** when the owner turns it on, a "Send me your info" button opens a small form (name, phone or email, optional note). The public card also adds one to a count when it is opened and when a button is tapped.
- **Studio, Activity tab:** opens in the last 30 days, one row per button that was tapped, and the people who sent their info (with Remove).
- **What the back end must provide** (the stand-in in `tools/lc-test-kit.cjs` shows the exact shapes and rules):
  - `lc_hit(p_slug, p_event)`: public; adds one to a per-card, per-day, per-event count; accepts only open, call, text, email, book, web, map, save, review, pay, social; must be rate limited; stores no visitor details.
  - `lc_send_info(p_slug, p_name, p_contact, p_note)`: public; only for a published card whose owner turned the button on; cleans the text, requires a phone number or email, is rate limited per card and overall, and adds one to the `info` count.
  - `lc_card_stats(p_slug)`: signed-in owner only; returns `{days:30, opens, taps:{...}}` for one of their own cards.
  - `lc_card_leads(p_slug)`: signed-in owner only; the people who sent their info to that card, newest first.
  - table `lc_leads(id, card, name, contact, note, created_at)`: the owner can read and delete their own rows; nobody else can read any.

## Demo mode (for trying everything before the service exists)
`public/live/demo.js`. Open the Studio with `?demo=1` on a test copy (localhost or a *.vercel.app preview); `?demo=0` or the bar's "Leave demo" turns it off. It never starts on meridianinterface.com or while the real service is switched on. Everything stays in that browser: sign in with any email and any 6 digits, publish, open the card, tap its buttons, send your info, see Activity, add team cards (the demo acts as the paid plan), download the QR, lock screen and signature. A card link only opens on the same browser. Your own background video only lasts until the page is closed; pictures last.

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
- `live-cards-preview-test.cjs`: the link page function against hostile and broken answers (no browser), then in a browser: headshot (move and zoom), new buttons, link preview, contact file, file limit, the "say it once" rules, starting points, downloads, "Send me your info", the Activity tab, team cards and Spanish. 132 checks.
- `lc-test-kit.cjs` is shared by those two: the service stand-in (it mirrors the database rules; change both together) and the real page function.
- `live-cards-plans-test.cjs`: plans, the human check, the own-address switch, 19 checks.
- `live-cards-owner-test.cjs`: the owner desk on desktop and phone, 24 checks.
If Playwright's own browser is missing, set `CHROMIUM_PATH`.

## Going live
Nothing has been done. The steps, in order, are in `system/products/live-cards/launch/RUNBOOK.md` in the all-in-1-events-2 repo, and what is still open is in `WHATS-LEFT.md` beside it.

## Not built yet
Sign-in with Apple or Google, video trimming inside the app (the app asks people to trim in Photos), team members signing in to edit their own card, and Apple or Google Wallet (needs Apple's paid developer account and a signing server before any button can exist).

## Store apps
See `mobile/README.md`.
