import React, { useMemo, useState } from 'react';
import { ATTRIBUTABLE_CHANNELS, currentAttribution } from '../lib/attribution';

/**
 * Campaign links — the half of attribution that needs a person.
 *
 * The site now records where a visitor came from, but a referrer only survives
 * some of the journey. Instagram's in-app browser routinely strips it, and a
 * link in a bio or a printed QR code has no referrer at all. A tagged link
 * carries the answer regardless, which is why this exists: without somewhere to
 * produce them, tagged links get hand-typed, mistyped, and quietly stop
 * matching the channel keys the system attributes by.
 *
 * Operate mode — this gets opened mid-post with a caption half-written. Pick,
 * copy, go.
 */

const SITE = 'https://meridian-interface-website.vercel.app';

async function copy(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* fall through */ }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

const CopyButton: React.FC<{ text: string; label?: string }> = ({ text, label = 'Copy link' }) => {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle');
  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copy(text);
        setState(ok ? 'ok' : 'fail');
        window.setTimeout(() => setState('idle'), ok ? 2000 : 4000);
      }}
      className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all ${
        state === 'ok'
          ? 'bg-emerald-600 text-white'
          : state === 'fail'
          ? 'bg-red-100 text-red-800 border border-red-300'
          : 'bg-[#0f172a] text-white hover:bg-slate-800'
      }`}
    >
      <span className="material-symbols-outlined text-sm" aria-hidden="true">
        {state === 'ok' ? 'check' : state === 'fail' ? 'error' : 'content_copy'}
      </span>
      {state === 'ok' ? 'Copied' : state === 'fail' ? 'Press Ctrl+C' : label}
      <span className="sr-only" role="status">{state === 'ok' ? 'Link copied' : ''}</span>
    </button>
  );
};

export const CampaignLinks: React.FC = () => {
  const [channel, setChannel] = useState('instagram');
  const [campaign, setCampaign] = useState('');
  const [landing, setLanding] = useState('/');

  const link = useMemo(() => {
    const url = new URL(landing || '/', SITE);
    url.searchParams.set('utm_source', channel);
    url.searchParams.set('utm_medium', 'social');
    if (campaign.trim()) {
      url.searchParams.set('utm_campaign', campaign.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-'));
    }
    return url.toString();
  }, [channel, campaign, landing]);

  const seen = currentAttribution();

  return (
    <section className="mb-10 bg-white border border-slate-200 rounded-2xl shadow-md p-6">
      <div className="border-b border-slate-200 pb-4 mb-5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
          Campaign Links
        </span>
        <h2 className="font-display font-black text-2xl text-slate-900 pt-2">
          Tag a link so the lead can be traced back
        </h2>
        <p className="text-xs text-slate-600 pt-1 max-w-3xl leading-relaxed">
          The site already records where visitors arrive from, but a referrer does not always
          survive the trip — Instagram's in-app browser usually strips it, and a bio link or a
          printed QR code never had one. A tagged link carries the answer either way.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Where you're posting it
          </span>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-slate-800"
          >
            {ATTRIBUTABLE_CHANNELS.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Campaign name <span className="font-medium normal-case tracking-normal">(optional)</span>
          </span>
          <input
            type="text"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            placeholder="e.g. march-brand-offer"
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-slate-800"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Page it opens
          </span>
          <input
            type="text"
            value={landing}
            onChange={(e) => setLanding(e.target.value)}
            placeholder="/"
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-slate-800"
          />
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-slate-50 border border-slate-200 rounded-xl p-3">
        <code className="flex-1 text-[11px] font-mono text-slate-800 break-all leading-relaxed">
          {link}
        </code>
        <CopyButton text={link} />
      </div>

      <div className="mt-6 pt-5 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pb-2">
            What this changes
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
            <li className="flex gap-2"><span className="text-slate-400 shrink-0">—</span>
              A booking from this link is filed as a <strong>{channel}</strong> lead, not another
              anonymous website one.</li>
            <li className="flex gap-2"><span className="text-slate-400 shrink-0">—</span>
              Credit goes to the <strong>first</strong> visit, so someone who finds you in March
              and books in May still counts as {channel}.</li>
            <li className="flex gap-2"><span className="text-slate-400 shrink-0">—</span>
              Once ten leads are attributed this way, the system can start telling you which
              channel actually works.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pb-2">
            What this browser recorded
          </h3>
          {seen.first ? (
            <dl className="text-xs text-slate-700 space-y-1">
              <div className="flex gap-2">
                <dt className="text-slate-500 w-24 shrink-0">First visit</dt>
                <dd className="font-mono font-bold">{seen.first.channel}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-slate-500 w-24 shrink-0">Most recent</dt>
                <dd className="font-mono font-bold">{seen.last?.channel ?? '—'}</dd>
              </div>
              {seen.first.referrer_host && (
                <div className="flex gap-2">
                  <dt className="text-slate-500 w-24 shrink-0">Came from</dt>
                  <dd className="font-mono">{seen.first.referrer_host}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-xs text-slate-500 leading-relaxed">
              Nothing yet — this browser arrived directly. Open one of these links in a new
              window to see it recorded.
            </p>
          )}
          <p className="text-[11px] text-slate-500 pt-3 leading-relaxed">
            Only the referring site's name is kept, never the full address it came from.
          </p>
        </div>
      </div>
    </section>
  );
};
