# MODERN_STREET — storefront demonstration

An e-commerce storefront built by **Meridian Interface** (Houston, TX) to show a
retail client what their own shop can do. MODERN_STREET is a fictional label;
the software around it is real.

## What works

Catalogue with category filter and sort · search · product detail with multiple
views, colourway and size selection · cart with quantity, removal and promo
codes (`MODERN10` / `URBAN10` for 10%, `STREET20` for 20%) · a checkout that walks the full flow · policy and profile
screens.

**Nothing is charged and no order is placed.** The payment step is a fixed
panel, not a card field — a visitor cannot enter card details, and nothing is
transmitted anywhere. In a live build this step is handed to a payment
processor so card data never reaches the shop's own servers.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build into dist/
npm run lint       # tsc --noEmit
```

Hosted under a sub-path (as it is on meridianinterface.com):

```bash
DEMO_BASE=/demos/storefront/ npm run build
```

Every image path is resolved against `import.meta.env.BASE_URL` in
`src/data/products.ts`, because Vite rewrites asset URLs in HTML and CSS but not
string literals in JavaScript.

## Assets

- **Photography** — Adobe Stock, licensed to Meridian Interface, in
  `public/images/products/`. Normalised to one 3:4 plate on a single ground so
  eight shoots read as one catalogue (`hoodie-charcoal-worn.jpg` is a
  full-bleed lifestyle frame and is deliberately left alone). Two were
  recoloured to match their product copy: the shell jacket red → cobalt, and
  the shared drawcord hardware.
- **Type** — Playfair Display and Inter, self-hosted in `public/fonts/`
  (latin subsets, ~268 KB). No font CDN, so the shop renders identically on a
  locked-down corporate network.
- **Brand** — Otis's own artwork in `public/brand/`. Never redrawn.

Nothing is fetched from a third-party host at runtime. The bundle this was
built from hotlinked ten images from a temporary AI Studio asset host; those
would have gone blank in front of a client.

## Copy

Policy, shipping and returns text is **placeholder** and says so on screen. A
live shop replaces it with its own terms. Claims that a client would inherit
and be liable for — carbon-neutral shipping, offsets, organic milling, a named
payment processor, an encryption standard, a 1993 founding date — were removed
rather than left for someone to ship by accident.

## Known

`CheckoutModal` and `ProductDetailModal` return early before their hooks. React
tolerates this (the previous render committed no hooks, so it mounts them
fresh) and both are verified working, but it breaks the rules-of-hooks lint: do
not add a hook above those early returns without restructuring first.

---

Built by Meridian Interface · [meridianinterface.com](https://meridianinterface.com)
· otis@meridianinterface.com · 281-882-9198
