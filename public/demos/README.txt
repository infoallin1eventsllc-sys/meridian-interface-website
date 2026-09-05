These folders are BUILT OUTPUT, not source.

Each is a working copy of a Meridian Interface product, built to be served from
this path so clients can click through it without a domain or a hosting project
of its own:

  /demos/stack-planner/  -> planner/            (this repo)
  /demos/finsight/       -> FinSight BI dashboard
  /demos/aurora/         -> Aurora Reserve interface
  /demos/orchestra/      -> ORCHESTRA cloud console
  /demos/meridian-crm/   -> CRM-dashboard-operations-hub (built with VITE_DEMO_MODE=true)
  /demos/analytics-hub/  -> Data Analytics Intelligence Hub
  /demos/modern-street/  -> storefront/          (this repo)
  /demos/fog-city/       -> fog-city/            (this repo)
  /demos/big-boy-subs/   -> big-boy-subs/        (this repo)

To refresh one, build its source with DEMO_BASE set to the path it is served
from, then copy the build here. For the planner, which lives in this repo:

  cd planner && DEMO_BASE=/demos/stack-planner/ npm run build
  rm -rf ../public/demos/stack-planner && cp -r dist ../public/demos/stack-planner

The storefront lives here too, for the same reason:

  cd storefront && DEMO_BASE=/demos/modern-street/ npm run build
  rm -rf ../public/demos/modern-street && cp -r dist ../public/demos/modern-street

DEMO_BASE matters: without it every asset points at the site root and the demo
loads a blank page.

The CRM needs one more flag, VITE_DEMO_MODE=true, or the copy will demand a
Google sign-in nobody here has. With the flag it keeps its data in the
visitor's browser and answers AI requests with a note instead of calling a
server that does not exist on a static host. Its README has the exact command.

Each demo folder also carries brand/meridian-mark.png for the bar below and
the tab icon; copy it from public/brand/ when adding a new one.

Then stamp the Meridian bar back on — a fresh build does not have it:

  node tools/brand-demos.mjs

Running it again is safe: it strips the bar it finds and writes the current one,
so a change to the bar reaches every demo in one pass. It refuses to write a
file if removing the old bar would take the app's own <div id="root"> with it.

That bar is why the demos can keep their own product names. A bank interface
has to look like a bank, not like its agency, or it stops demonstrating that
Meridian can build a brand for a client. The bar makes sure nobody mistakes
whose work it is: it names Meridian, says the page is a demonstration, and
links back to the site. It is applied to the built HTML rather than each app's
source, so every demo carries exactly the same bar and it cannot drift.
