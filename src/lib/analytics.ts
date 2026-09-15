/**
 * Site analytics — PostHog, deliberately narrowed.
 *
 * Chosen 11 Sep over Plausible, Fathom and Vercel Analytics, and not for the
 * dashboards. At launch volume a pageview counter says almost nothing: thirty
 * visits a month is noise. Session replay is the part that earns its place —
 * watching one person hesitate at the booking form and leave teaches more than
 * any bounce rate, and it stops being worth it long before it stops being free.
 *
 * Two things this file exists to enforce, both of which would be easy to get
 * wrong by accepting the defaults:
 *
 *   1. The booking form collects a name, an email address and a phone number.
 *      Session replay must never record any of it. `maskAllInputs` is set here
 *      rather than trusted to a default, because the cost of that default
 *      changing under us is someone's personal data sitting in a third party's
 *      storage with no way to know it happened.
 *
 *   2. The owner portal shows client names, invoice amounts and the pipeline.
 *      That is other people's commercial information, and recording it would be
 *      a breach dressed up as product research. Recording stops on entry to the
 *      portal and does not resume for the rest of the session.
 *
 * Without `VITE_PUBLIC_POSTHOG_KEY` this module is inert — every export becomes
 * a no-op and nothing is loaded or sent. That is the state the repository sits
 * in by default, so a fork, a preview build or a local checkout does not
 * quietly start reporting to someone else's project.
 *
 * `posthog-js` is imported dynamically rather than at the top of the file, and
 * the reason is measured rather than theoretical: importing it statically grew
 * the main bundle from 567 KB to 879 KB. Every visitor would have downloaded
 * 312 KB of tracker before deciding whether to read the headline — including
 * every visitor in the default configuration, where the tracker does nothing at
 * all. Loading it only once a key is present keeps that cost with the people
 * who chose it.
 */
import type { TabType } from '../types';

type PostHog = typeof import('posthog-js').default;

const KEY = (import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string | undefined)?.trim() || '';

/** PostHog's US cloud. Override for the EU region, or a reverse proxy. */
const HOST = (import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string | undefined)?.trim()
  || 'https://us.i.posthog.com';

let started = false;
/** Set once the portal has been opened. Never cleared: see note above. */
let ownerSeen = false;
/** Resolved once the library has loaded and initialised. */
let ph: PostHog | null = null;
/** A tab visited before the library finished loading, replayed on arrival. */
let pending: TabType | null = null;

/**
 * Virtual paths for the tab a visitor is on.
 *
 * The site has no router — every section is React state on a single URL — so
 * left alone, every visit reports as one pageview of `/` and the report says
 * nothing about what anyone looked at. These paths are what PostHog's pageview
 * reporting keys off, and they are deliberately the paths this site *would*
 * have if it had routing, so they do not have to be renamed later.
 */
const PATHS: Record<TabType, string> = {
  home: '/',
  services: '/services',
  portfolio: '/portfolio',
  booking: '/book',
  appointments: '/appointments',
  owner_invoice: '/studio',
  legal: '/legal',
};

export function initAnalytics(): void {
  if (!KEY || started || typeof window === 'undefined') return;
  started = true;

  void loadPostHog();
}

async function loadPostHog(): Promise<void> {
  let posthog: PostHog;
  try {
    posthog = (await import('posthog-js')).default;
  } catch {
    // A blocked or failed tracker script must never take the site with it.
    return;
  }

  posthog.init(KEY, {
    api_host: HOST,
    // The site sends its own pageviews on tab change; the automatic one would
    // only ever report `/` and would double-count the first view.
    capture_pageview: false,
    capture_pageleave: true,
    // A visitor who has asked not to be tracked has asked plainly enough.
    respect_dnt: true,
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '[data-private]',
    },
  });

  ph = posthog;

  // Someone can reach the portal before the library finishes loading. If they
  // did, honour that rather than the page they were on when it started.
  if (ownerSeen) {
    stopRecordingForOwner();
    return;
  }
  if (pending) {
    const tab = pending;
    pending = null;
    trackPage(tab);
  }
}

/** Report the section a visitor moved to, as though it were a page. */
export function trackPage(tab: TabType): void {
  if (!KEY || !started) return;

  if (tab === 'owner_invoice') {
    // Recorded even if the library has not arrived yet, so the flag is already
    // set when it does and nothing from this session is ever sent.
    ownerSeen = true;
    stopRecordingForOwner();
    return;
  }
  if (ownerSeen) return;
  if (!ph) {
    pending = tab;
    return;
  }

  ph.capture('$pageview', {
    $current_url: `${window.location.origin}${PATHS[tab] ?? '/'}`,
  });
}

/**
 * Stop recording for good once the portal is opened.
 *
 * Not paused — stopped. Someone who opens the portal is Otis, and the rest of
 * that session is him working, not a visitor deciding whether to hire him. The
 * data would be worthless even if it were harmless, and it is not harmless.
 */
function stopRecordingForOwner(): void {
  ownerSeen = true;
  pending = null;
  if (!ph) return;
  try {
    ph.stopSessionRecording();
    ph.opt_out_capturing();
  } catch {
    // An analytics failure must never take the portal down with it.
  }
}

/** True when a key is configured, for anything that wants to say so honestly. */
export const analyticsEnabled = (): boolean => Boolean(KEY);
