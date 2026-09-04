These folders are BUILT OUTPUT, not source.

Each is a working copy of a Meridian Interface product, built to be served from
this path so clients can click through it without a domain or a hosting project
of its own:

  /demos/stack-planner/  -> planner/            (this repo)
  /demos/finsight/       -> FinSight BI dashboard
  /demos/aurora/         -> Aurora Reserve interface
  /demos/orchestra/      -> ORCHESTRA cloud console

To refresh one, build its source with DEMO_BASE set to the path it is served
from, then copy the build here. For the planner, which lives in this repo:

  cd planner && DEMO_BASE=/demos/stack-planner/ npm run build
  rm -rf ../public/demos/stack-planner && cp -r dist ../public/demos/stack-planner

DEMO_BASE matters: without it every asset points at the site root and the demo
loads a blank page.

Then stamp the Meridian bar back on — a fresh build does not have it:

  node tools/brand-demos.mjs

That bar is why the demos can keep their own product names. A bank interface
has to look like a bank, not like its agency, or it stops demonstrating that
Meridian can build a brand for a client. The bar makes sure nobody mistakes
whose work it is: it names Meridian, says the page is a demonstration, and
links back to the site. It is applied to the built HTML rather than each app's
source, so all four carry exactly the same bar and it cannot drift.
