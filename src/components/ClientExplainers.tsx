import React, { useMemo, useState } from 'react';
import {
  CLIENT_EXPLAINERS,
  ClientExplainer,
  explainerAsEmail,
  explainerAsShort,
  explainerForDescription,
} from '../data/clientExplainers';

/**
 * Client Answers — the reference desk for "what am I actually paying for?"
 *
 * This is an Operate surface, not a Persuade one. It is opened mid-conversation,
 * with a client waiting on a reply, so the whole design is in service of one
 * sequence: find the line they asked about, read it, get it into the clipboard.
 * Nothing here is decorative, because decoration on this screen is just distance
 * between a question and its answer.
 *
 * Two copy formats, because the two real situations are different. An emailed
 * question deserves the full breakdown; a text message deserves three sentences.
 * Offering only the long one guarantees it gets pasted somewhere it does not fit
 * and trimmed by hand.
 */

const CATEGORIES = ['All', 'Websites', 'Brand & Logo', 'Packages', 'Ongoing Work'] as const;
type Category = (typeof CATEGORIES)[number];

/**
 * Copy text, and say whether it worked.
 *
 * navigator.clipboard needs a secure context and can be refused outright. The
 * textarea path is the fallback that still works in those cases. A copy button
 * that silently fails is worse than no copy button — you find out when you paste
 * the previous thing into a client email.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
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

const CopyButton: React.FC<{
  text: string;
  label: string;
  icon: string;
  tone?: 'solid' | 'outline';
}> = ({ text, label, icon, tone = 'outline' }) => {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const onClick = async () => {
    const ok = await copyText(text);
    setState(ok ? 'copied' : 'failed');
    window.setTimeout(() => setState('idle'), ok ? 2000 : 4000);
  };

  const base =
    'px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all';
  const skin =
    state === 'copied'
      ? 'bg-emerald-600 text-white'
      : state === 'failed'
      ? 'bg-red-100 text-red-800 border border-red-300'
      : tone === 'solid'
      ? 'bg-[#0f172a] text-white hover:bg-slate-800'
      : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100';

  return (
    <button type="button" onClick={onClick} className={`${base} ${skin}`}>
      <span className="material-symbols-outlined text-sm" aria-hidden="true">
        {state === 'copied' ? 'check' : state === 'failed' ? 'error' : icon}
      </span>
      {state === 'copied' ? 'Copied' : state === 'failed' ? 'Press Ctrl+C' : label}
      {/* A live region, so the confirmation is announced and not only seen. */}
      <span className="sr-only" role="status">
        {state === 'copied' ? `${label} copied to clipboard` : ''}
      </span>
    </button>
  );
};

/**
 * The same answer, reachable from the invoice line itself.
 *
 * A client's question arrives about one line, and the owner is already looking
 * at that line. Making them switch tabs and search for what is in front of them
 * is the kind of small friction that ends with the explanation being retyped
 * from memory instead — differently every time, which is exactly what a written
 * reference is for.
 *
 * Renders nothing when the description matches no entry, rather than showing a
 * dead button. A hand-typed custom line has no catalogue answer, and pretending
 * otherwise is worse than staying quiet.
 */
export const CopyExplainerButton: React.FC<{ description: string; rate?: number }> = ({
  description,
  rate,
}) => {
  const item = explainerForDescription(description);
  if (!item) return null;

  const price =
    typeof rate === 'number' && rate > 0 ? `$${rate.toLocaleString()}` : undefined;

  return (
    <CopyButton
      text={explainerAsEmail(item, price)}
      label="Copy client explanation"
      icon="content_copy"
    />
  );
};

const Explainer: React.FC<{
  item: ClientExplainer;
  /** From the server catalogue — never bundled. Blank until it loads. */
  price: string;
  open: boolean;
  onToggle: () => void;
}> = ({ item, price, open, onToggle }) => (
  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 transition-colors"
    >
      <div className="min-w-0">
        <div className="font-display font-black text-sm text-slate-900">{item.title}</div>
        <div className="text-[11px] text-slate-500 pt-0.5 leading-relaxed">{item.summary}</div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono font-bold text-sm text-slate-900">{price || '—'}</span>
        <span
          className={`material-symbols-outlined text-slate-400 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        >
          keyboard_arrow_down
        </span>
      </div>
    </button>

    {open && (
      <div className="border-t border-slate-200 p-4 md:p-5 space-y-5 bg-slate-50/60">
        <div className="flex flex-wrap gap-2">
          <CopyButton
            text={explainerAsEmail(item, price)}
            label="Copy full explanation"
            icon="content_copy"
            tone="solid"
          />
          <CopyButton text={explainerAsShort(item, price)} label="Copy short answer" icon="sms" />
        </div>

        <section>
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 pb-2">
            What is included
          </h4>
          <ul className="space-y-2.5">
            {item.included.map((line, i) => (
              <li key={i} className="text-xs leading-relaxed">
                <span className="font-bold text-slate-900">{line.what}</span>
                <span className="block text-slate-600 pt-0.5">{line.why}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 pb-2">
            What this does for them
          </h4>
          <p className="text-xs leading-relaxed text-slate-700">{item.outcome}</p>
        </section>

        <section>
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 pb-2">
            Not included in this price
          </h4>
          <ul className="space-y-1.5">
            {item.excluded.map((line, i) => (
              <li key={i} className="text-xs leading-relaxed text-slate-700 flex gap-2">
                <span className="text-slate-400 shrink-0" aria-hidden="true">
                  —
                </span>
                {line}
              </li>
            ))}
          </ul>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <section>
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 pb-2">
              How long it takes
            </h4>
            <p className="text-xs leading-relaxed text-slate-700">{item.timeline}</p>
          </section>
          <section>
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 pb-2">
              What you need from them
            </h4>
            <ul className="space-y-1.5">
              {item.needFromYou.map((line, i) => (
                <li key={i} className="text-xs leading-relaxed text-slate-700 flex gap-2">
                  <span className="text-slate-400 shrink-0" aria-hidden="true">
                    —
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    )}
  </div>
);

export const ClientExplainers: React.FC<{ prices?: Record<string, string> }> = ({ prices = {} }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [openId, setOpenId] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CLIENT_EXPLAINERS.filter((item) => {
      if (category !== 'All' && item.category !== category) return false;
      if (!q) return true;
      // Search the whole entry, not just the title — the owner is usually
      // searching with the client's words, not the catalogue's.
      return [
        item.title,
        item.summary,
        item.short,
        item.outcome,
        ...item.matches,
        ...item.included.flatMap((i) => [i.what, i.why]),
        ...item.excluded,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [query, category]);

  return (
    <section className="mb-10 bg-white border border-slate-200 rounded-2xl shadow-md p-6">
      <div className="border-b border-slate-200 pb-4 mb-5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
          Client Answers
        </span>
        <h2 className="font-display font-black text-2xl text-slate-900 pt-2">
          "What am I actually paying for?"
        </h2>
        <p className="text-xs text-slate-600 pt-1 max-w-3xl leading-relaxed">
          The written answer for every line on the invoice — what it includes, what it does for
          them, what it does not cover, and how long it takes. Copy the full version into an
          email, or the short one into a text.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-grow">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg"
            aria-hidden="true"
          >
            search
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — try &quot;logo&quot;, &quot;hosting&quot;, or what the client asked"
            aria-label="Search client answers"
            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-slate-800"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                category === c
                  ? 'bg-[#0f172a] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <p className="py-10 text-center text-xs text-slate-500">
          Nothing matches "{query}". Try a single word, or clear the filter.
        </p>
      ) : (
        <div className="space-y-2.5">
          {results.map((item) => (
            <Explainer
              key={item.id}
              item={item}
              price={prices[item.id] ?? ''}
              open={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            />
          ))}
        </div>
      )}

      <p className="text-[11px] text-slate-500 pt-5 mt-5 border-t border-slate-200 leading-relaxed">
        <span className="font-bold text-slate-700">Before you send:</span> the timelines are
        typical, not promises. Check them against what you have actually committed to on this
        project, and adjust the pasted text if it differs.
      </p>
    </section>
  );
};
