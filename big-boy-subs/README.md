# Big Boy Subs — restaurant site demonstration

A sandwich shop's ordering site, hosted by Meridian Interface as a demonstration. Big Boy
Subs is a fictional restaurant.

    npm install
    DEMO_BASE=/demos/big-boy-subs/ npm run build   # then copy dist/ to ../public/demos/big-boy-subs/
    node ../tools/brand-demos.mjs                   # stamp the Meridian bar back on

The bundle shipped no images: all twenty-two were hotlinked from a temporary AI Studio
host. They are now Adobe Stock photographs licensed to Meridian, in src/assets/images, with
small SVGs for the logo and avatar. Type and the Material Symbols icon font are self-hosted. Re-subset the icon font with

    python3 tools/subset-icons.py

after adding any icon. Icons are named as ligature text, so one missing from the
font does not go blank — the browser prints the word on the page.
