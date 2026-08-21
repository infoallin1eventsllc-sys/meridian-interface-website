# Meridian Interface

Marketing site and client booking portal for **Meridian Interface** — a digital design &
development studio (custom web design, mobile app interfaces, analytics & CRM dashboards, and
brand identity systems).

Built with React 19 + Vite 6 + Tailwind CSS v4 + Motion. Deployed on Vercel; backed by Supabase.

## Run locally

**Prerequisites:** Node.js 20+

```bash
npm install
npm run dev                  # http://localhost:3000
```

No `.env.local` is required — both backend seams have working defaults.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check with `tsc --noEmit` |

## Project structure

```
src/
├── App.tsx                    # Root — tab routing + modal state
├── main.tsx                   # React entry
├── index.css                  # Tailwind + base styles
├── types.ts                   # Shared TypeScript types
├── data/mockData.ts           # Services, pricing, portfolio & testimonial content
├── lib/
│   ├── leads.ts               # Booking/inquiry seam → the CRM intake webhook
│   ├── ownerStore.ts          # Owner portal seam → the `owner` edge function
│   ├── attribution.ts         # Where a lead came from (UTM + referrer)
│   ├── motion.ts              # The studio's motion vocabulary — use this, not Motion directly
│   └── imageStore.ts          # Owner image overrides (Photo Control)
└── components/
    ├── HeroBackdrop.tsx       # Homepage video loop + graceful still fallback
    ├── ImageWithFallback.tsx  # Branded panel when an image fails to load
    ├── OwnerInvoiceView.tsx   # Internal Invoice & Pricing Manager
    └── …                      # Home, Solutions, Impact, Connect, Dashboard, chrome
```

## How it connects

Two seams reach the Meridian backend. Neither needs configuration to work.

**Bookings** — every booking and inquiry goes through `submitAppointment()` in
[`src/lib/leads.ts`](src/lib/leads.ts), which POSTs to the CRM intake webhook and opens a
pipeline deal. A local copy is always kept as a backstop. `VITE_LEAD_ENDPOINT` overrides the
destination.

**Owner portal** — the Internal Invoice & Pricing Manager talks to the `owner` edge function
through [`src/lib/ownerStore.ts`](src/lib/ownerStore.ts). Invoices live in Postgres behind
deny-by-default RLS. If the backend is unreachable the portal falls back to local copies and
shows an offline banner, so a failed save is never silent.

## The owner passcode lives on the server

**The passcode is a Supabase secret named `OWNER_PASSCODE`, not a Vercel variable.**

That distinction is the whole security model, so it is worth stating plainly:

- Anything named `VITE_…` is **compiled into the pages this site serves**. A passcode set there
  is readable by anyone who opens the site's source. Marking it "Sensitive" in a hosting
  dashboard hides it from that dashboard and from nobody else.
- A **Supabase Edge Function secret** stays on the server. The `owner` function compares the
  passcode there, with a constant-time comparison, and never sends it to a browser.

### Setting or changing it

Supabase Dashboard → **Edge Functions** → **Secrets** → **Add new secret**

| Field | What goes in it |
|---|---|
| **Name** | `OWNER_PASSCODE` — exactly this. It is the label the code looks up, not a description of the secret. |
| **Value** | The passphrase you type into the portal. |

Save. It takes effect immediately; no redeploy needed. To confirm it registered, POST
`{"action":"status"}` to the `owner` function — it answers `{"configured": true}`.

A successful sign-in returns a signed token with an 8-hour expiry, held in `sessionStorage` so
it dies with the tab. Failed attempts are throttled at 8 per 15 minutes.

There is no reset flow. If the passphrase is lost, replace the secret with a new one.

## Deployment

Vercel builds from GitHub automatically:

- **Push to `main`** → production deploy
- **Push to any branch, or open a PR** → preview deploy at its own URL

The production URL is listed under the project's **Domains** panel.

### Restoring a deleted deployment

Deployments are *builds*, not sources — Vercel can always rebuild from GitHub, so deleting one
loses nothing. If the live production build is removed:

Vercel → **Deployments** → the newest `main` build → **⋯** → **Promote to Production**
(or **Redeploy**). Pushing any commit to `main` also triggers a fresh build.

> **Deployments and environment variables are different things.** A deployment is a built copy
> of the site, under the Deployments tab. An environment variable is a setting the build reads,
> under Settings → Environment Variables. Deleting a deployment does not remove a variable.

## Environment variables

All optional — see [`.env.example`](.env.example).

| Variable | Purpose |
|---|---|
| `VITE_LEAD_ENDPOINT` | Override the booking/inquiry destination. Defaults to the Meridian intake webhook. |
| `VITE_OWNER_ENDPOINT` | Override the owner portal backend. Defaults to the Meridian `owner` function. |

`VITE_OWNER_PASSCODE` is **no longer used**. If it is still set in a hosting project it does
nothing except sit readable in the bundle, and should be removed.

Every `VITE_`-prefixed variable is inlined into the public client bundle. Never put a real
secret behind one.

## Motion

Animation goes through [`src/lib/motion.ts`](src/lib/motion.ts), never straight from the
library. It defines the only easing and transitions the site uses, so a change there changes the
whole feel rather than one component.

```tsx
import { useMeridianMotion, m } from '../lib/motion';

const anim = useMeridianMotion();
<m.div variants={anim.stagger()} {...anim.reveal}>
  <m.div variants={anim.rise}>…</m.div>
</m.div>
```

Two rules, both of which cost real bytes or real accessibility if broken:

- **Import `m`, never `motion`.** `m` is the feature-light component; the features are supplied
  at runtime by `MotionProvider`. The provider runs in `strict` mode, so reaching for the full
  `motion` import throws rather than silently doubling the bundle.
- **Use named imports, never `import * as`.** A namespace import defeats tree-shaking. Measured
  on this site: the namespace form cost 194kB raw, the named form 78kB.

`useMeridianMotion()` returns the same shapes with movement stripped when the visitor has asked
their system for reduced motion — opacity still resolves, so nothing is left invisible, but
nothing travels.

## Image licensing

Provenance for every shipped image is recorded in
[`public/images/CREDITS.md`](public/images/CREDITS.md). The hero is a licensed Adobe Stock asset,
and the video loop is a derived work carrying the same licence — which permits commercial use on
this site but **not** redistribution as a standalone file.
