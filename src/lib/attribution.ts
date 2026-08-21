/**
 * Where the lead came from.
 *
 * Until this existed, every booking reached the CRM labelled
 * `meridian-website:booking`, because that is the only thing `intake` could
 * infer without being told. Someone could see an Instagram post, click through,
 * and book — and the marketing system would record a website lead. It attributes
 * by matching `contacts.source` to a channel key, so it would have gone on
 * reporting "0 leads attributable to channels" however much was published, and
 * never reached the ten it needs before it can say which channel works.
 *
 * This captures the answer at the door and carries it to the booking.
 *
 * Two touches are kept:
 *   - FIRST touch is written once and never overwritten. It is the campaign that
 *     actually earned the visitor, and it is what gets sent as `source`.
 *   - LAST touch is refreshed every visit, so a returning visitor's most recent
 *     path is still on record.
 * Someone who finds you on Instagram in March and books in May is an Instagram
 * lead. Last-touch alone would credit whatever they typed into the address bar
 * that morning.
 *
 * On privacy: only the referrer's HOSTNAME is stored, never the full URL. A
 * search referrer can carry the query in its path, and that is the visitor's
 * words, not ours to keep.
 */

const FIRST_KEY = 'meridian_attr_first';
const LAST_KEY = 'meridian_attr_last';

export interface Attribution {
  /** Normalised to a `channels.key` when recognised — that match is what makes
   *  attribution work downstream. Left as the raw value when it isn't one. */
  channel: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  /** Hostname only. Never the full referring URL. */
  referrer_host?: string;
  landing_path?: string;
  captured_at: string;
}

/**
 * Referring hosts we can recognise without a tag.
 *
 * Values on the left of the arrow must match `channels.key` in the database, or
 * the lead lands in "from elsewhere" — which is the honest outcome for anything
 * that genuinely is not one of our channels.
 */
const HOST_TO_CHANNEL: Array<[RegExp, string]> = [
  [/(^|\.)instagram\.com$|(^|\.)ig\.me$/, 'instagram'],
  [/(^|\.)facebook\.com$|(^|\.)fb\.me$|(^|\.)fb\.com$/, 'facebook'],
  [/(^|\.)linkedin\.com$|(^|\.)lnkd\.in$/, 'linkedin'],
  [/(^|\.)tiktok\.com$/, 'tiktok'],
  [/(^|\.)youtube\.com$|(^|\.)youtu\.be$/, 'youtube'],
  // Deliberately NOT mapped to a channel: organic search is not something the
  // marketing system did, and counting it would flatter every number it reports.
  [/(^|\.)google\.[a-z.]+$/, 'google-organic'],
  [/(^|\.)bing\.com$|(^|\.)duckduckgo\.com$|(^|\.)search\.yahoo\.com$/, 'search-organic'],
  [/(^|\.)x\.com$|(^|\.)twitter\.com$|(^|\.)t\.co$/, 'x-twitter'],
  [/(^|\.)reddit\.com$/, 'reddit'],
];

/** Common shorthands people actually type into a link builder. */
const UTM_ALIASES: Record<string, string> = {
  ig: 'instagram', insta: 'instagram', instagram: 'instagram',
  fb: 'facebook', facebook: 'facebook', meta: 'facebook',
  li: 'linkedin', linkedin: 'linkedin',
  tt: 'tiktok', tiktok: 'tiktok',
  yt: 'youtube', youtube: 'youtube',
  gbp: 'gbp', gmb: 'gbp', google_business: 'gbp', googlebusiness: 'gbp',
  google_ads: 'google_ads', googleads: 'google_ads', adwords: 'google_ads',
  meta_ads: 'meta_ads', metaads: 'meta_ads',
  newsletter: 'email', email: 'email',
  sms: 'sms', text: 'sms',
};

const slug = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '_').slice(0, 40);

function hostToChannel(host: string): string | undefined {
  const h = host.toLowerCase();
  for (const [re, channel] of HOST_TO_CHANNEL) if (re.test(h)) return channel;
  return undefined;
}

/** Read the current URL and referrer into an Attribution. */
function readCurrent(): Attribution {
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(window.location.search);
  } catch {
    params = new URLSearchParams();
  }

  const utm = (k: string) => {
    const v = params.get(k);
    return v ? slug(v) : undefined;
  };

  const utmSource = utm('utm_source');

  let referrerHost: string | undefined;
  try {
    // Same-origin referrers are internal navigation, not an arrival.
    if (document.referrer) {
      const url = new URL(document.referrer);
      if (url.hostname && url.hostname !== window.location.hostname) {
        referrerHost = url.hostname.replace(/^www\./, '');
      }
    }
  } catch {
    /* malformed referrer — ignore rather than guess */
  }

  // A tag beats a referrer: it was set deliberately, and Instagram's in-app
  // browser frequently strips the referrer entirely, which is exactly the case
  // tagging exists to cover.
  const channel =
    (utmSource && (UTM_ALIASES[utmSource] ?? utmSource)) ||
    (referrerHost && hostToChannel(referrerHost)) ||
    (referrerHost ? 'referral' : 'direct');

  return {
    channel,
    utm_source: utmSource,
    utm_medium: utm('utm_medium'),
    utm_campaign: utm('utm_campaign'),
    utm_content: utm('utm_content'),
    utm_term: utm('utm_term'),
    referrer_host: referrerHost,
    landing_path: window.location.pathname || '/',
    captured_at: new Date().toISOString(),
  };
}

function read(key: string): Attribution | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: Attribution): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private browsing — attribution degrades to this page view only */
  }
}

/**
 * Record this visit. Safe to call on every load; the first touch is written
 * once and left alone after that.
 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  const current = readCurrent();

  // Always refresh last touch.
  write(LAST_KEY, current);

  const first = read(FIRST_KEY);
  if (!first) {
    write(FIRST_KEY, current);
    return;
  }

  // One upgrade is allowed: a first visit recorded as "direct" with no detail
  // is an absence of information, not a finding. If the same visitor later
  // arrives properly tagged, promote it rather than preserving the blank.
  if (first.channel === 'direct' && current.channel !== 'direct') {
    write(FIRST_KEY, { ...current, captured_at: first.captured_at });
  }
}

export interface AttributionPayload {
  /** What `intake` stores as contacts.source. */
  source: string;
  attribution: { first: Attribution | null; last: Attribution | null };
}

/**
 * The attribution to attach to a submission. Returns null when nothing was ever
 * captured, so callers keep whatever default they had rather than sending a
 * fabricated one.
 */
export function attributionForSubmission(): AttributionPayload | null {
  const first = read(FIRST_KEY);
  const last = read(LAST_KEY);
  if (!first && !last) return null;

  const chosen = first ?? last!;
  // "direct" is the absence of a source. Let intake apply its own default
  // rather than writing a word that looks like a finding.
  if (chosen.channel === 'direct') {
    return { source: 'meridian-website:booking', attribution: { first, last } };
  }
  return { source: chosen.channel, attribution: { first, last } };
}

/** Everything captured so far — used by the owner portal's link builder. */
export function currentAttribution(): { first: Attribution | null; last: Attribution | null } {
  return { first: read(FIRST_KEY), last: read(LAST_KEY) };
}

/** Channel keys the system can attribute to, for the link builder. */
export const ATTRIBUTABLE_CHANNELS: Array<{ key: string; label: string }> = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'gbp', label: 'Google Business Profile' },
  { key: 'email', label: 'Email / newsletter' },
  { key: 'sms', label: 'Text message' },
];
