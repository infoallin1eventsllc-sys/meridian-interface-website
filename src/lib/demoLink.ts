/**
 * Where a project's "Open the working demo" button goes.
 *
 * Most demos are served from this site (`/demos/<name>/`) and open in place.
 * A live app hosted elsewhere (a full https address, such as Meridian Hire's
 * API and board) opens in a new tab instead, so the visitor's place on this
 * site is kept and the site's own Back button still works.
 */
export function isExternalDemo(demo: string): boolean {
  return /^https?:\/\//.test(demo);
}

export function demoLinkProps(demo: string) {
  return isExternalDemo(demo) ? { href: demo, target: '_blank', rel: 'noopener' } : { href: demo };
}

/** The address shown in the browser-window frame around a demo's film. */
export function demoAddress(demo: string): string {
  return isExternalDemo(demo)
    ? demo.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : `meridianinterface.com${demo.replace(/\/$/, '')}`;
}
