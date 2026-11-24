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

## Going live (in order; none of this has been done)
1. Decide the app's address. Recommended: its own, such as cards.meridianinterface.com, so the app's sign-in is walled off from the demo pages.
2. Database: apply `system/supabase/migrations/0047_live_cards.sql` from the all-in-1-events-2 repo. It was attack-tested on 24 Nov 2026 inside a thrown-away transaction (53 checks passed, nothing left behind). Then run the service's security advisor.
3. Sign-in emails (Supabase dashboard, Authentication): email sign-in on; the template must show the 6-digit code (`{{ .Token }}`); ten-minute expiry; a real email sender; a human check on sign-up.
4. `config.js`: paste the project's publishable key into `key` and set `enabled:true`. Leave `billing:false`.
5. Run meridian-prelaunch-qa and the security test, then merge.
6. Test on real phones: sign up, add a photo and a video, publish, edit and update, open the link on another phone, report the card, delete the account.
7. Moderation: read `lc_reports`; to take a card down set `lc_cards.blocked = true` (owner tools only).
8. Plans: `lc_accounts.plan` is `free` (1 card) or `pro` (5 cards). The app cannot change it. Payment functions `lc-billing` and `lc-billing-webhook` are written and tested (31 checks) but not deployed; they need a Stripe price, a webhook signing secret, and a test-mode rehearsal. Pricing is Otis's decision. Then `billing:true` and a button in the Studio.

## Not built yet
An upgrade button in the Studio, an owner screen for reports and plans, sign-in with Apple or Google, video trimming inside the app (the app asks people to trim in Photos), per-card visit counts.

## Store apps
See `mobile/README.md`.
