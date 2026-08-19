# Meridian Interface

Marketing site and client booking portal for **Meridian Interface** — a digital design &
development studio (custom web design, mobile app interfaces, analytics & CRM dashboards, and
brand identity systems).

Built with React 19 + Vite 6 + Tailwind CSS v4.

## Run locally

**Prerequisites:** Node.js 20+

```bash
npm install
cp .env.example .env.local   # optional — the app runs without it
npm run dev                  # http://localhost:3000
```

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
├── App.tsx              # Root — tab routing + modal state
├── main.tsx            # React entry
├── index.css           # Tailwind + base styles
├── types.ts            # Shared TypeScript types
├── data/
│   └── mockData.ts     # Services, pricing, portfolio & testimonial content
├── lib/
│   └── leads.ts        # Single submission seam for bookings/inquiries (backend-ready)
└── components/         # Views (Home, Solutions, Impact, Connect, Dashboard, OwnerInvoice) + chrome
```

## Backend integration (marketing stack)

The site is currently **front-end only** — booking and inquiry submissions persist to the
browser's `localStorage`. All submissions flow through a single seam in
[`src/lib/leads.ts`](src/lib/leads.ts). To connect the site to the marketing-system backend,
set `VITE_LEAD_ENDPOINT` in `.env.local` to the receiving API/serverless endpoint; `leads.ts`
will POST submissions there (and continue to keep a local copy as a fallback). No other view
code needs to change.

## Security note

The owner invoice portal is protected by a **soft client-side gate only**. Any value shipped in
a front-end bundle is publicly readable, so this is *not* real authentication — it just keeps the
internal tooling out of casual view. Real access control (and any handling of confidential
billing data) must be enforced server-side as part of the backend integration. See `.env.example`.

## Environment variables

See [`.env.example`](.env.example). All `VITE_`-prefixed variables are inlined into the public
client bundle — never place real secrets there.
