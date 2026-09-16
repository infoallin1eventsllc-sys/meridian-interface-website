# Why vercel.json looks the way it does

JSON has no comments, and Vercel validates `vercel.json` against a strict
schema that rejects any key it does not recognise. Two explanatory `"comment"`
keys were added to that file on 16 Sep 2026 and the deployment failed
validation before a single file was built — so the whole pre-launch batch
(sitemap, robots.txt, the real 404, the social card, the PostHog fix) sat in
GitHub looking shipped and was never live. The notes live here instead.

## Content-Security-Policy

PostHog needs three exceptions, and they are the only third-party origins on this site. It fetches its runtime config and the session-replay recorder as scripts from us-assets.i.posthog.com, posts events to us.i.posthog.com, and compresses replay data in a blob: worker. Without all three the library initialises and then fails silently: analytics was configured on 15 Sep and recorded nothing at all until 16 Sep, because script-src and connect-src blocked every request it made and nothing surfaced except an empty dashboard. Routing PostHog through a same-origin Vercel rewrite would let this go back to 'self', at the cost of a proxy to maintain.

## The `/unsubscribe` rewrite

The app owns exactly two paths. Everything else falls through to the filesystem, and Vercel answers an unmatched path with 404.html and a real 404 status. A catch-all rewrite used to sit here, which meant a mistyped URL silently returned the homepage with status 200 - a soft 404, which search engines index as a real page and which tells a visitor nothing went wrong when it did.
