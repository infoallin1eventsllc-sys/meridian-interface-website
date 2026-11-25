import React, { useCallback, useEffect, useState } from 'react';
import {
  NotDeployedError,
  UnauthorizedError,
  liveCardsAdmin,
  type LiveCardReport,
  type LiveCardRow,
  type LiveCardsOverview,
} from '../lib/ownerStore';

/**
 * The portal's Live Cards tab: read reports, find a client's card, take it
 * down or put it back, set a plan by hand.
 *
 * Nothing here is decided in the browser. Each button asks the `lc-admin`
 * function, which checks the owner session and writes the change to the
 * security log. Client text (names, report reasons) is shown as plain text.
 */

const when = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const Chip: React.FC<{ tone: 'ok' | 'warn' | 'bad' | 'info'; children: React.ReactNode }> = ({ tone, children }) => {
  const cls = {
    ok: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warn: 'bg-amber-50 text-amber-800 border-amber-200',
    bad: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-slate-100 text-slate-700 border-slate-200',
  }[tone];
  return <span className={`inline-block px-2 py-0.5 rounded-md border text-xs font-semibold ${cls}`}>{children}</span>;
};

const btn = 'px-3 py-2 rounded-lg text-xs font-bold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
const btnPlain = `${btn} border-slate-300 text-slate-800 bg-white hover:bg-slate-50`;
const btnDanger = `${btn} border-red-300 text-red-800 bg-red-50 hover:bg-red-100`;

/** One card with its account and the things the owner can do to it. */
const CardRow: React.FC<{ card: LiveCardRow; busy: boolean; act: (label: string, payload: Record<string, unknown>, done: string) => void }> = ({ card, busy, act }) => {
  // Taking a card down and removing files are both asked twice.
  const [armed, setArmed] = useState<'' | 'down' | 'files'>('');
  useEffect(() => {
    if (!armed) return;
    const t = window.setTimeout(() => setArmed(''), 6000);
    return () => window.clearTimeout(t);
  }, [armed]);
  const paid = card.account.plan === 'pro';
  return (
    <div className="py-4 border-b border-slate-100 last:border-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-display font-bold text-slate-900 break-all">{card.name || 'No name'}</span>
        {card.company && <span className="text-sm text-slate-600 break-all">{card.company}</span>}
        {card.blocked ? <Chip tone="bad">Taken down</Chip> : card.published ? <Chip tone="ok">Live</Chip> : <Chip tone="info">Offline</Chip>}
        <Chip tone={paid ? 'ok' : 'info'}>{paid ? 'Paid plan' : 'Free plan'}</Chip>
      </div>
      <div className="mt-1 text-xs text-slate-600 break-all">
        <a className="underline" href={`/c/${encodeURIComponent(card.slug)}`} target="_blank" rel="noopener noreferrer">/c/{card.slug}</a>
        {' · '}{card.account.email ?? 'no email on file'}{' · '}changed {when(card.updated_at)}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {card.blocked ? (
          <>
            <button type="button" className={btnPlain} disabled={busy} onClick={() => act('restore', { action: 'restore', card_id: card.id }, 'The card is back and the account can publish again.')}>Put it back</button>
            <button type="button" className={btnDanger} disabled={busy} onClick={() => armed === 'files' ? act('files', { action: 'remove_files', user_id: card.account.id }, 'Their uploaded pictures and videos were removed.') : setArmed('files')}>
              {armed === 'files' ? 'Tap again to remove their files' : 'Remove their uploaded files'}
            </button>
          </>
        ) : (
          <button type="button" className={btnDanger} disabled={busy} onClick={() => armed === 'down' ? act('down', { action: 'take_down', card_id: card.id }, 'The card is down. That account can no longer publish or upload.') : setArmed('down')}>
            {armed === 'down' ? 'Tap again to take it down' : 'Take this card down'}
          </button>
        )}
        <button type="button" className={btnPlain} disabled={busy} onClick={() => act('plan', { action: 'set_plan', user_id: card.account.id, plan: paid ? 'free' : 'pro' }, paid ? 'Set to the free plan.' : 'Set to the paid plan.')}>
          {paid ? 'Set to free plan' : 'Set to paid plan'}
        </button>
      </div>
      {card.account.pays_through_stripe && (
        <p className="mt-2 text-xs text-slate-600">This client pays through Stripe. A plan set here lasts until Stripe next reports on the subscription; cancel or refund in Stripe as well.</p>
      )}
    </div>
  );
};

export const OwnerLiveCards: React.FC = () => {
  const [state, setState] = useState<'loading' | 'ready' | 'off' | 'offline'>('loading');
  const [overview, setOverview] = useState<LiveCardsOverview | null>(null);
  const [reports, setReports] = useState<LiveCardReport[]>([]);
  const [showHandled, setShowHandled] = useState(false);
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState<LiveCardRow[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const load = useCallback(async (all: boolean) => {
    try {
      const [o, r] = await Promise.all([
        liveCardsAdmin<LiveCardsOverview>({ action: 'overview' }),
        liveCardsAdmin<{ reports: LiveCardReport[] }>({ action: 'reports', ...(all ? { show: 'all' } : {}) }),
      ]);
      setOverview(o);
      setReports(r.reports);
      setState('ready');
    } catch (err) {
      if (err instanceof UnauthorizedError) return; // the portal puts the sign-in gate back up
      setState(err instanceof NotDeployedError ? 'off' : 'offline');
    }
  }, []);

  useEffect(() => { void load(showHandled); }, [load, showHandled]);

  const search = async (q: string) => {
    setBusy(true);
    setMsg(null);
    try {
      setCards((await liveCardsAdmin<{ cards: LiveCardRow[] }>({ action: 'cards', q })).cards);
    } catch (err) {
      if (!(err instanceof UnauthorizedError)) setMsg({ type: 'err', text: 'The search did not run. Try again.' });
    } finally {
      setBusy(false);
    }
  };

  const act = async (_label: string, payload: Record<string, unknown>, done: string) => {
    setBusy(true);
    setMsg(null);
    try {
      await liveCardsAdmin(payload);
      setMsg({ type: 'ok', text: done });
      await load(showHandled);
      if (cards) setCards((await liveCardsAdmin<{ cards: LiveCardRow[] }>({ action: 'cards', q: query })).cards);
    } catch (err) {
      if (!(err instanceof UnauthorizedError)) setMsg({ type: 'err', text: err instanceof Error && err.message && !/^HTTP/.test(err.message) ? err.message : 'That did not go through. Try again.' });
    } finally {
      setBusy(false);
    }
  };

  if (state === 'loading') return <p className="text-sm text-slate-600">Loading Live Cards…</p>;
  if (state === 'off') {
    return (
      <section className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
        <h2 className="font-display font-bold text-slate-900 text-lg">Live Cards is not switched on yet</h2>
        <p className="mt-2 text-sm text-slate-600 max-w-prose">
          This is where client reports will arrive, and where you take a card down, put it back, or set a plan by hand.
          It starts working when the Live Cards service goes live. Nothing is being collected today.
        </p>
      </section>
    );
  }
  if (state === 'offline') {
    return (
      <section className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
        <h2 className="font-display font-bold text-slate-900 text-lg">Live Cards could not be reached</h2>
        <p className="mt-2 text-sm text-slate-600">Check your connection, then try again.</p>
        <button type="button" className={`${btnPlain} mt-4`} onClick={() => { setState('loading'); void load(showHandled); }}>Try again</button>
      </section>
    );
  }

  const tiles: Array<[string, number]> = overview
    ? [['Cards', overview.cards], ['Live now', overview.published], ['Paid accounts', overview.paid_accounts], ['Open reports', overview.open_reports], ['Blocked accounts', overview.blocked_accounts]]
    : [];

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 sm:grid-cols-5 gap-3" aria-label="Live Cards at a glance">
        {tiles.map(([label, n]) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-2xl font-display font-extrabold text-slate-900 tabular-nums">{n}</div>
            <div className="text-xs font-semibold text-slate-600">{label}</div>
          </div>
        ))}
      </section>

      {msg && (
        <div role={msg.type === 'err' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${msg.type === 'ok' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-red-200 bg-red-50 text-red-900'}`}>
          {msg.text}
        </div>
      )}

      <section className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-2">
          <h2 className="font-display font-bold text-slate-900 text-lg">Reports from visitors</h2>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <input type="checkbox" checked={showHandled} onChange={(e) => setShowHandled(e.target.checked)} />
            Show handled reports too
          </label>
        </div>
        {reports.length === 0 && <p className="py-4 text-sm text-slate-600">No {showHandled ? '' : 'open '}reports.</p>}
        {reports.map((r) => (
          <div key={r.id} className="py-4 border-b border-slate-100 last:border-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span>{when(r.created_at)}</span>
              {r.handled ? <Chip tone="info">Handled</Chip> : <Chip tone="warn">Open</Chip>}
            </div>
            <p className="mt-1 text-sm text-slate-900 break-words">{r.reason}</p>
            {r.card ? <CardRow card={r.card} busy={busy} act={act} /> : <p className="mt-1 text-xs text-slate-600 break-all">The card /c/{r.slug} no longer exists.</p>}
            {!r.handled && (
              <button type="button" className={btnPlain} disabled={busy} onClick={() => act('done', { action: 'report_done', id: r.id }, 'Report marked as handled.')}>Mark as handled</button>
            )}
          </div>
        ))}
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
        <h2 className="font-display font-bold text-slate-900 text-lg">Find a card</h2>
        <form className="mt-3 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); void search(query); }}>
          <label className="sr-only" htmlFor="lc-find">Name or link</label>
          <input id="lc-find" value={query} onChange={(e) => setQuery(e.target.value)} maxLength={40} placeholder="Name or link"
            className="flex-1 min-w-[12rem] px-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl text-sm text-slate-900 outline-none" />
          <button type="submit" className={btnPlain} disabled={busy}>Search</button>
          <button type="button" className={btnPlain} disabled={busy} onClick={() => { setQuery(''); void search(''); }}>Show newest</button>
        </form>
        {cards && cards.length === 0 && <p className="py-4 text-sm text-slate-600">No card matches that.</p>}
        {cards?.map((c) => <CardRow key={c.id} card={c} busy={busy} act={act} />)}
      </section>
    </div>
  );
};
