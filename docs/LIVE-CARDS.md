# Meridian Live Cards

A product on top of the digital card: clients make their own card with a live background and share it by link or QR code.

## What is in this branch (claude/live-cards-app)
| Address | What it is | Files |
|---|---|---|
| /live-cards/ | Landing page with a working sample card and background picker | public/live-cards/, public/live/landing.* |
| /studio/ | The app: edit details, buttons, background (13 live scenes or your own photo/video), publish, share, install | public/studio/, public/live/studio.* |
| /c/<name> | A client's public card. /c/?id=sample is Otis's sample; /c/?preview=1 shows the draft on this device | public/c/, public/live/viewer.* |
| /live-cards/terms/ and /privacy/ | Drafts for Otis to review | public/live-cards/ |

Shared pieces: `engine.js` (all backgrounds, one card per page), `card-view.js` (builds a card from saved details; every value is text, a checked http/https link, or a checked file address), `card.css`, `api.js` (device storage plus the service), `config.js` (the switch).
All scripts are separate files because the site's security policy forbids inline scripts.

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
- `live-cards-plans-test.cjs`: plans, the human check, the own-address switch, 19 checks.
- `live-cards-owner-test.cjs`: the owner desk on desktop and phone, 24 checks.
If Playwright's own browser is missing, set `CHROMIUM_PATH`.

## Going live
Nothing has been done. The steps, in order, are in `system/products/live-cards/launch/RUNBOOK.md` in the all-in-1-events-2 repo, and what is still open is in `WHATS-LEFT.md` beside it.

## Not built yet
Managing more than one card in the Studio, sign-in with Apple or Google, video trimming inside the app (the app asks people to trim in Photos), per-card visit counts.

## Store apps
See `mobile/README.md`.
