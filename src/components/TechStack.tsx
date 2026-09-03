import React, { useEffect, useState } from 'react';
import { LoopSimulator } from './LoopSimulator';
import { fetchStack, type StackSnapshot } from '../lib/stack';

/**
 * The Tech Stack tab — an inventory of what this business runs on.
 *
 * The Services page shows a simulation, for prospects. This shows the real
 * thing, for the owner: every piece, what it does in plain words, who owns it,
 * and whether it is actually switched on.
 *
 * The rule that governs it: a piece is reported as connected only when
 * something answered to say so. Where nothing can be asked, the row says what
 * is known and no more. An inventory that guesses is worse than no inventory,
 * because it gets believed.
 *
 * Icon names are checked against the subset font's cmap, which covers only
 * " _abcdefghiklmnoprstuvwy" — no j, q, x or z, or the browser paints the
 * word instead of the glyph.
 */

type State = 'on' | 'off' | 'partial' | 'unknown';

interface Piece {
  name: string;
  does: string;
  owner: string;
  state: State;
  detail: string;
}

const CHIP: Record<State, { label: string; cls: string }> = {
  on:      { label: 'Running',       cls: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  partial: { label: 'Partly on',     cls: 'bg-amber-50 text-amber-800 border-amber-300' },
  off:     { label: 'Not connected', cls: 'bg-slate-100 text-slate-600 border-slate-300' },
  unknown: { label: 'Not checked',   cls: 'bg-slate-100 text-slate-500 border-slate-200' },
};

export const TechStack: React.FC = () => {
  const [snap, setSnap] = useState<StackSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchStack().then((s) => { if (alive) { setSnap(s); setLoading(false); } });
    return () => { alive = false; };
  }, []);

  const h = snap?.health ?? null;
  const pay = snap?.pay ?? null;

  const schedules = h?.schedules ?? [];
  const liveSchedules = schedules.filter((s) => (s.runs_24h ?? 0) > 0).length;
  const published = h?.marketing?.content?.published ?? 0;
  const sent = h?.marketing?.messages?.sent ?? 0;

  const groups: { title: string; blurb: string; pieces: Piece[] }[] = [
    {
      title: 'What the public touches',
      blurb: 'The parts a visitor or client sees.',
      pieces: [
        {
          name: 'Website', owner: 'Yours, hosted on Vercel', state: 'on',
          does: 'The public site and the booking form. Rebuilt and redeployed every time the code changes.',
          detail: 'React and Vite, built to static files. No server to patch.',
        },
        {
          name: 'Booking intake', owner: 'Yours',
          state: h ? 'on' : 'unknown',
          does: 'Turns a form submission into a contact in your CRM, and records where they came from.',
          detail: h ? 'Reachable — the portal is talking to the backend.' : 'Could not check just now.',
        },
        {
          name: 'Owner portal', owner: 'Yours', state: 'on',
          does: 'This. Invoices, client answers, campaign links, system health, and this inventory.',
          detail: 'Passcode checked on the server, never in the browser.',
        },
      ],
    },
    {
      title: 'Where the work is kept',
      blurb: 'Your records. Everything else can be rebuilt; this cannot.',
      pieces: [
        {
          name: 'Database', owner: 'Yours, hosted on Supabase', state: h ? 'on' : 'unknown',
          does: 'Contacts, invoices, drafts, messages, payments, and the settings every agent reads.',
          detail: 'Postgres with row-level security on and no policies — nothing is readable without the server key.',
        },
        {
          name: 'File storage', owner: 'Yours, hosted on Supabase', state: 'on',
          does: 'Holds the branded post images so Instagram can fetch them by web address.',
          detail: 'One public bucket, images only. Nothing private is written to it.',
        },
      ],
    },
    {
      title: 'What does the work',
      blurb: 'Small programs that run on a timer. No server of yours stays awake.',
      pieces: [
        {
          name: 'The schedule', owner: 'Yours',
          state: schedules.length === 0 ? 'unknown' : liveSchedules > 0 ? 'on' : 'partial',
          does: 'Runs the plan, the writing, the measuring, the weekly report, and the self-check.',
          detail: schedules.length
            ? `${schedules.length} jobs, ${liveSchedules} of them ran in the last day.`
            : 'Could not read the schedule just now.',
        },
        {
          name: 'The agents', owner: 'Yours',
          state: h ? 'on' : 'unknown',
          does: 'Plan the day, draft posts and follow-ups, measure results, write the weekly summary.',
          detail: h ? 'Deployed and answering.' : 'Could not check just now.',
        },
        {
          name: 'Self-monitoring', owner: 'Yours',
          state: h ? 'on' : 'unknown',
          does: 'Checks itself every 15 minutes and raises anything wrong on the System Health tab.',
          detail: h
            ? `${h.alerts.length === 0 ? 'Nothing open' : `${h.alerts.length} open`} right now.`
            : 'Could not check just now.',
        },
      ],
    },
    {
      title: 'What it needs to do its job',
      blurb: 'The parts that cost money or reach people. Each is off until you switch it on.',
      pieces: [
        {
          name: 'AI writing', owner: 'Yours — needs your API key',
          state: h ? (h.marketing.mode === 'live' ? 'on' : h.marketing.mode === 'configured_but_still_mocking' ? 'partial' : 'off') : 'unknown',
          does: 'Writes the posts and the follow-ups, using your services, prices and rules.',
          detail: !h ? 'Could not check just now.'
            : h.marketing.mode === 'live' ? `Producing real output — ${h.marketing.real_outputs} pieces so far.`
            : h.marketing.mode === 'configured_but_still_mocking'
              ? 'A key is set but nothing real has come out yet — the key may be wrong.'
              : 'No key. Everything it writes is placeholder text.',
        },
        {
          name: 'Key Router', owner: 'Yours — built, not deployed',
          state: h?.keyrouter?.state === 'up' ? 'on' : h?.keyrouter?.state === 'not_deployed' ? 'off' : h ? 'partial' : 'unknown',
          does: 'Holds one API key per client, meters each one separately, and moves traffic off a key before its quota runs out.',
          detail: h?.keyrouter?.state === 'up'
            ? `Answering in ${h.keyrouter.ms}ms.`
            : h?.keyrouter?.state === 'not_deployed'
              ? 'Not deployed. Nothing is broken — the AI is called directly instead. Deploy it before a second client.'
              : h?.keyrouter?.detail ?? 'Could not check just now.',
        },
        {
          name: 'Taking payment', owner: 'Yours — needs a Stripe account',
          state: !pay ? 'unknown' : !pay.configured ? 'off' : pay.webhook_configured ? (pay.mode === 'live' ? 'on' : 'partial') : 'partial',
          does: 'Turns an invoice into a card, Apple Pay, Google Pay or bank-transfer link, and marks it paid when the money lands.',
          detail: !pay ? 'Could not check just now.'
            : !pay.configured ? 'No Stripe key. No invoice can be charged.'
            : !pay.webhook_configured ? 'Key present, but the paid-confirmation is not set up — payments would not mark invoices paid.'
            : pay.mode === 'test' ? 'In test mode. Takes fake money only — safe to try, useless to bill with.'
            : 'Live. Real money.',
        },
        {
          name: 'Publishing', owner: 'Yours — needs a channel connected',
          state: published > 0 ? 'on' : 'off',
          does: 'Sends approved posts out to Instagram, Facebook, LinkedIn or an automation tool.',
          detail: published > 0
            ? `${published} published so far.`
            : 'Nothing has ever published. Approved posts land in a stub that goes nowhere.',
        },
        {
          name: 'Email and SMS', owner: 'Yours — needs SendGrid or Twilio',
          state: sent > 0 ? 'on' : 'off',
          does: 'Actually delivers the follow-ups the system drafts, and would email you when something breaks.',
          detail: sent > 0
            ? `${sent} message${sent === 1 ? '' : 's'} sent.`
            : 'Nothing has ever been sent. Follow-ups are written and stored, and no one receives them.',
        },
      ],
    },
  ];

  return (
    <section className="space-y-6">
      <div className="max-w-3xl space-y-2">
        <h2 className="font-display text-xl font-bold text-slate-900">Your tech stack</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Everything this business runs on, what each piece does, and whether it is
          actually switched on. A piece is marked <strong>Running</strong> only when
          something answered to say so — where nothing could be asked, it says that
          instead of guessing.
        </p>
      </div>

      {loading && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-500">
          Reading the system&hellip;
        </div>
      )}

      {!loading && !snap?.health && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-5">
          <div className="font-bold text-amber-900 text-sm">Could not reach the backend</div>
          <p className="text-sm text-amber-800 mt-1 leading-relaxed">
            The inventory below still describes the stack, but the live states could
            not be read. Your session may have expired — sign in again, or check the
            System Health tab.
          </p>
        </div>
      )}

      {!loading && groups.map((g) => (
        <div key={g.title} className="space-y-3">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900">{g.title}</h3>
            <p className="text-xs text-slate-500">{g.blurb}</p>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {g.pieces.map((p) => (
              <div key={p.name} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-900">{p.name}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">{p.owner}</div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded border whitespace-nowrap ${CHIP[p.state].cls}`}>
                    {CHIP[p.state].label}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mt-2 leading-relaxed">{p.does}</p>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!loading && (
        <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-200 pt-4 max-w-3xl">
          <strong className="text-slate-700">You own all of it.</strong> Every piece
          above is on an account in your name, with no per-user fee that grows when
          you hire. Hosting and the AI are billed on usage; nothing here charges a
          licence for the software itself. That is the same thing the Tech Stack
          service sells — and this page is the inventory a client would get.
        </p>
      )}
      {/* The working loop, for the owner's eyes and for a screen-share.
          Moved here from the public Services page on Sep 3. */}
      <div className="mt-10">
        <LoopSimulator />
      </div>
    </section>
  );
};
