import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMeridianMotion } from '../lib/motion';

/**
 * A working marketing loop, running on the studio's own schedule.
 *
 * This sits on the Services page beside the Tech Stack service, which promises
 * that "a booking becomes a calendar entry, an invoice, and a follow-up without
 * anyone re-keying it". That is a claim a visitor cannot check. This lets them
 * check it: press play, watch a lead arrive and move through, and hit the point
 * where the machine stops and waits for a person.
 *
 * Two honesty rules govern what this may show.
 *
 * 1. It is a simulation of the MECHANISM, never a record of results. The
 *    schedule and the approval gate are the real ones; the numbers are what
 *    this page has done since you opened it, and it says so.
 * 2. Lead arrivals are a button, never a timer. A page that invented leads
 *    arriving would be inventing the one number a prospect actually cares
 *    about.
 *
 * Icon note: the Material Symbols subset shipped here has a cmap covering only
 * " _abcdefghiklmnoprstuvwy". A name containing j, q, x or z cannot form a
 * ligature and the browser paints the raw word instead — 400px of literal text
 * across the layout. Every icon name below is checked against that set.
 */

type Stage = 'measure' | 'plan' | 'write' | 'approve' | 'publish';

const START_MIN = 12 * 60 + 24;   // 12:24, just before the first measurement
const ANALYZE_AT = 12 * 60 + 30;  // the real cron
const PLAN_AT = 13 * 60;          // the real cron

const fmt = (m: number) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

interface LoopState {
  min: number;
  day: number;
  queued: number;
  written: number;
  waiting: number;
  published: number;
  leads: number;
  measured: boolean;
}

const fresh = (): LoopState => ({
  min: START_MIN, day: 1,
  queued: 0, written: 0, waiting: 0, published: 0, leads: 0,
  measured: false,
});

export const LoopSimulator: React.FC = () => {
  const motion = useMeridianMotion();
  const still = motion.reduced;

  const [s, setS] = useState<LoopState>(fresh);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(6);
  const [active, setActive] = useState<Stage | null>(null);
  const [log, setLog] = useState<{ t: string; text: string; hi?: boolean }[]>([]);

  // The brief the next cycle will be handed. Its wording follows the real
  // analyze function, including its refusal to rank channels on thin evidence.
  const [brief, setBrief] = useState<{ head: string; body: string } | null>(null);

  const flash = useCallback((stage: Stage) => {
    setActive(stage);
    window.setTimeout(() => setActive((c) => (c === stage ? null : c)), still ? 120 : 900);
  }, [still]);

  const addLog = useCallback((min: number, text: string, hi = false) => {
    setLog((l) => [{ t: fmt(min), text, hi }, ...l].slice(0, 8));
  }, []);

  /* ---------------------------------------------------------- the cycle --- */

  const analyze = useCallback((st: LoopState) => {
    flash('measure');
    if (st.published === 0) {
      setBrief({
        head: 'Do not plan more content volume.',
        body: 'Nothing written has reached an audience yet, so more drafts cannot teach us ' +
              'anything. The bottleneck is approval and publishing, not writing.',
      });
    } else if (st.leads < 10) {
      setBrief({
        head: 'Keep publishing steadily.',
        body: `${st.published} published and ${st.leads} attributed ` +
              `lead${st.leads === 1 ? '' : 's'} — under the ten needed before one channel ` +
              'can honestly be called better than another.',
      });
    } else {
      setBrief({
        head: 'Enough evidence to steer.',
        body: `${(st.leads / st.published).toFixed(2)} leads per published post across ` +
              `${st.published} posts. Weight the next cycle toward what is producing.`,
      });
    }
    addLog(st.min, 'measured, and wrote the brief', true);
  }, [flash, addLog]);

  /* One simulated minute. Kept in a single state update so the schedule, the
     queue and the counters can never disagree with each other. */
  const step = useCallback(() => {
    setS((prev) => {
      const next = { ...prev };
      next.min += 1;
      if (next.min >= 24 * 60) { next.min = 0; next.day += 1; }

      if (next.min === ANALYZE_AT) {
        next.measured = true;
        analyze(next);
      }

      if (next.min === PLAN_AT && next.measured) {
        // It listens to its own brief: with nothing published and a backlog
        // already forming, it plans one piece instead of three.
        const n = next.published === 0 && next.waiting >= 4 ? 1 : 3;
        next.queued += n;
        flash('plan');
        addLog(next.min, `planned ${n} task${n === 1 ? '' : 's'}`, true);
        if (n === 1) addLog(next.min, 'held back — the brief said stop writing');
      }

      // The runner drains the queue every two minutes, as it really does.
      if (next.min % 2 === 0 && next.queued > 0) {
        next.queued -= 1;
        next.written += 1;
        next.waiting += 1;
        flash('write');
        addLog(next.min, 'drafted one, waiting for approval');
      }

      return next;
    });
  }, [analyze, flash, addLog]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(step, 1320 / speed);
    return () => window.clearInterval(id);
  }, [running, speed, step]);

  /* --------------------------------------------------------- your moves --- */

  const approve = () => {
    setS((prev) => {
      if (prev.waiting === 0) return prev;
      addLog(prev.min, `you approved ${prev.waiting} → published`, true);
      flash('publish');
      return { ...prev, published: prev.published + prev.waiting, waiting: 0 };
    });
  };

  const addLead = () => {
    setS((prev) => {
      addLog(prev.min, 'a lead arrived → CRM');
      return { ...prev, leads: prev.leads + 1 };
    });
  };

  const reset = () => {
    setRunning(false);
    setS(fresh());
    setBrief(null);
    setLog([]);
    setActive(null);
  };

  /* ------------------------------------------------------------ render --- */

  const stages: { key: Stage; title: string; sub: string; count: string }[] = [
    { key: 'measure', title: 'Measure', sub: 'daily, 12:30', count: s.measured ? `day ${s.day}` : '—' },
    { key: 'plan',    title: 'Plan',    sub: 'daily, 1:00pm', count: `${s.queued} queued` },
    { key: 'write',   title: 'Write',   sub: 'every 2 minutes', count: `${s.written} written` },
    { key: 'approve', title: 'Approve', sub: 'a person, no timer', count: `${s.waiting} waiting` },
    { key: 'publish', title: 'Publish', sub: 'to your channels', count: `${s.published} published` },
  ];

  return (
    <section className="mt-20 border-t border-slate-200 pt-14">
      <div className="max-w-3xl space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 text-slate-800 rounded-full text-xs font-bold uppercase tracking-widest">
          <span className="material-symbols-outlined text-sm">account_tree</span>
          A tech stack, running
        </div>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-slate-900 font-black leading-tight tracking-tight">
          This is what &ldquo;connected&rdquo; actually means.
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Every studio says they will connect your tools. Here is one doing it — the marketing
          system we run for ourselves, on its real schedule. Press play. It plans, writes, and
          then stops and waits for a person, because nothing reaches an audience without one.
          That pause is the design.
        </p>
      </div>

      {/* ---- controls ---- */}
      <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">{running ? 'pause' : 'play_arrow'}</span>
          {running ? 'Pause' : 'Play'}
        </button>

        <div className="flex gap-1">
          {[1, 6, 30].map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => setSpeed(sp)}
              aria-pressed={speed === sp}
              className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-bold border transition-colors ${
                speed === sp
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {sp}&times;
            </button>
          ))}
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 font-mono text-sm font-bold tabular-nums text-slate-900">
          {fmt(s.min)}
          <span className="text-[11px] font-medium text-slate-500 ml-1.5">day {s.day}</span>
        </div>

        <div className="flex-1" />

        <button
          type="button"
          onClick={approve}
          disabled={s.waiting === 0}
          className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
            s.waiting === 0
              ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
              : 'bg-amber-50 text-amber-800 border-amber-400 hover:bg-amber-100'
          }`}
        >
          {s.waiting === 0 ? 'Approve 0 drafts' : `Approve ${s.waiting} draft${s.waiting === 1 ? '' : 's'}`}
        </button>
        <button
          type="button"
          onClick={addLead}
          className="px-4 py-2 rounded-lg bg-slate-50 text-slate-700 text-sm font-bold border border-slate-200 hover:bg-slate-100 transition-colors"
        >
          + A lead arrives
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-3 py-2 rounded-lg text-slate-500 text-sm font-semibold hover:text-slate-900 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* ---- the brief every step reads ---- */}
      <div className="mt-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
          The brief every step reads
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-1 font-mono text-xs text-slate-600">
          {['who you sell to', 'what you sell', 'your prices', 'proof we can cite',
            'writing rules', 'what actually happened'].map((f) => (
            <span key={f}>{f}</span>
          ))}
        </div>
      </div>

      {/* ---- the loop ---- */}
      <div className="mt-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm overflow-x-auto">
        <div className="flex items-stretch gap-2 min-w-[720px]">
          {stages.map((st, i) => (
            <React.Fragment key={st.key}>
              <div
                className={`flex-1 rounded-lg border-2 p-4 text-center transition-all duration-300 ${
                  active === st.key
                    ? 'border-teal-600 bg-teal-50'
                    : st.key === 'approve' && s.waiting > 0
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-slate-200 bg-white'
                }`}
              >
                <div className="font-display font-bold text-sm text-slate-900">{st.title}</div>
                <div className="font-mono text-[10px] text-slate-500 mt-0.5">{st.sub}</div>
                <div className={`font-mono text-base font-bold mt-2 tabular-nums ${
                  st.key === 'approve' && s.waiting > 0 ? 'text-amber-700' : 'text-slate-900'
                }`}>
                  {st.count}
                </div>
              </div>
              {i < stages.length - 1 && (
                <div className="flex items-center text-slate-300 font-bold select-none" aria-hidden="true">
                  &rarr;
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-3 text-center font-mono text-[11px] text-teal-700">
          &darr; what happened becomes the next brief &darr;
        </div>
      </div>

      {/* ---- readouts ---- */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm border-l-4 border-l-teal-600">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            What the next cycle will be told
          </div>
          {brief ? (
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong className="text-teal-800">{brief.head}</strong> {brief.body}
            </p>
          ) : (
            <p className="text-sm text-slate-500 leading-relaxed">
              Nothing measured yet. Press play — the first measurement runs at 12:30.
            </p>
          )}
          <div className="mt-3 pt-3 border-t border-slate-100 flex gap-6 font-mono text-xs text-slate-600">
            <span>{s.leads} lead{s.leads === 1 ? '' : 's'}</span>
            <span>{s.written} written</span>
            <span>{s.published} published</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Run log
          </div>
          {log.length === 0 ? (
            <p className="text-sm text-slate-500">Nothing has happened yet.</p>
          ) : (
            <ul className="space-y-1 font-mono text-[11px]">
              {log.map((l, i) => (
                <li key={i} className={`flex gap-3 ${l.hi ? 'text-teal-700' : 'text-slate-500'}`}>
                  <span className="tabular-nums opacity-70 flex-none w-10">{l.t}</span>
                  <span>{l.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="mt-5 text-xs text-slate-500 leading-relaxed max-w-3xl">
        <strong className="text-slate-700">This is the mechanism, not a sales figure.</strong>{' '}
        The schedule and the approval gate are the real ones, and the counters are only what this
        page has done since you opened it. Leads arrive when you press the button, never on a
        timer — a page that invented customers arriving would be inventing the one number that
        matters. The same system, wired to your tools, is the Tech Stack service above.
      </p>
    </section>
  );
};
