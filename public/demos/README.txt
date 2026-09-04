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
