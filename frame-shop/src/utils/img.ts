/**
 * Resolve an image in public/images against the deployed base.
 *
 * Vite rewrites URLs it can see in HTML and CSS, but a path held as a string in
 * a data file is invisible to it. Served from /demos/frame-shop/, a bare
 * "/images/x.jpg" resolves to the site root and 404s — which is how a demo ends
 * up as a page of empty frames.
 */
export const img = (file: string): string =>
  `${import.meta.env.BASE_URL}images/${file}`.replace(/\/{2,}/g, '/');
