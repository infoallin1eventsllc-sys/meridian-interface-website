# Meridian Stack Planner

The agentic tech stack proposal tool Meridian Interface uses with clients. A
client walks through the five layers, builds a stack for their stage and kind of
business, watches a workflow run with a person in the loop, works out the return
on the spend, reads how the agents are governed, and exports the plan to bring
to a call.

It is a planning and sales tool. It does not run a stack, and it does not claim
any certification. Every figure is labelled an estimate.

## Where things live

| Part | Where |
|---|---|
| The app (React 19, Vite 6, Tailwind v4) | this directory |
| Brand assets and self-hosted fonts | `public/brand`, `public/fonts` |
| The catalogue of stack components, playbooks, presets | `src/data/stackComponents.ts` |
| Who built it and how to reach them | `src/lib/brand.ts` |
| The one server call (AI advisor, custom workflow trace) | `src/lib/planner.ts` → Supabase function `planner` in the `all-in-1-events-2` repo (`system/supabase/functions/planner`) |

The `planner` function holds the Claude key, answers with `claude-sonnet-5`,
and allows twelve AI calls per address per hour. Everything else in the app runs
in the browser.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview
```

## Show it to a client without deploying anything

Two ways, neither needing a domain:

- **`npm run build`, then `node ../../tools/...`** — or simpler, open `dist/index.html` after a build via `npm run preview`.
- **A single self-contained file.** Everything — fonts, logo, code — can be inlined into one `.html` you keep on a laptop or phone and open by double-clicking. It works with no internet at all; only the AI advisor needs a connection, and it says so in the header when it cannot reach the service. The proposal sheet, the planner, the ROI model and the export all work offline.

## The proposal sheet

The **Proposal** button (header, or from Export) renders the plan as a one-page
document on Meridian letterhead: what the client said, what would be built, what
it frees up, what it costs, when it pays back, and how it is governed. It prints
to PDF from the browser and reads fine on screen in a meeting. It uses the
`plain` line on each catalogue component rather than the technical description,
because the client reads this one without you in the room.

## Deploy it (Vercel)

This directory is a second Vercel project on the same repository:

1. Vercel → Add New Project → import `meridian-interface-website`.
2. **Root Directory:** `planner`. Framework preset: Vite. Build command `npm run build`, output `dist`.
3. Domain: `planner.meridianinterface.com` (add the CNAME Vercel gives you at the DNS host).
4. No environment variables are required. `VITE_PLANNER_ENDPOINT` overrides the AI service URL if it ever moves.

The main website's own Vercel project ignores this directory.
