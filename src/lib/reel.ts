/**
 * The studio reel — one film, two shapes.
 *
 * Both cuts are the same picture Otis approved: a website assembling itself, a
 * mobile app, the storefront, a dashboard, the CRM, the AI stack, and code
 * resolving into a live interface. They differ only in the four-second opening
 * card and the shape of the frame. Rendered by Clipkit from the approved
 * composition; the agents produce more of these, and swapping one in here is a
 * one-line change.
 *
 * Hosting: served from the studio's own public Supabase storage bucket —
 * permanent, CDN-backed, and verified to answer ranged requests with a
 * year-long cache header, so seeking and repeat visits both behave. This is
 * deliberate and is NOT the hotlinking mistake recorded in
 * public/demos/README.txt: that host was a temporary third party whose URLs
 * expire. This bucket is ours. To self-host instead, drop the file into
 * `public/video/` and point the entry below at `/video/<name>.mp4`.
 */

const BUCKET =
  'https://glzodwhyavexpuusbqjy.supabase.co/storage/v1/object/public/social-videos/clips';

export const REEL = {
  /** 16:9 — the web cut. Opens "You formed the LLC. Now look like it." */
  landscape: `${BUCKET}/83373a8d604e20d6d2ba.mp4`,
  /** 9:16 — the social cut, for TikTok and Reels. Not used on the site: a
      portrait film in a landscape frame is letterboxed on both sides. */
  portrait: `${BUCKET}/81d51bdbc9438afdd253.mp4`,
  seconds: 47,
};
