import React, { useEffect, useState } from 'react';
import { fetchHealth, type SystemHealth as Health, type SystemAlert } from '../lib/health';

/**
 * System Health — is the machinery running, and what is wrong with it.
 *
 * Operate mode. This gets opened because something feels off, or once a week to
 * confirm nothing is. So the answer goes at the top in one line, problems come
 * before detail, and every state is named rather than implied by an empty
 * space. "Nothing here" and "failed to load" look identical if you let them.
 *
 * Key Router is a separate service on separate infrastructure. It is probed,
 * not queried, and when it has never been deployed this says exactly that —
 * "unreachable" would be wrong, because there is nothing to reach.
 */

const REFRESH_MS = 60_000;

const ago = (iso: string | null): string => {
  if (!iso) return 'never';
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const SEVERITY: Record<SystemAlert['severity'], { chip: string; icon: string; label: string }> = {
  critical: { chip: 'bg-red-100 text-red-900 border-red-300', icon: 'error', label: 'Needs attention' },
  warning:  { chip: 'bg-amber-100 text-amber-900 border-amber-300', icon: 'warning', label: 'Worth a look' },
  info:     { chip: 'bg-slate-100 text-slate-700 border-slate-300', icon: 'info', label: 'For information' },
};

const Stat: React.FC<{ label: string; value: React.ReactNode; tone?: 'good' | 'warn' | 'bad' }> = ({
  label, value, tone,
}) => (
  <div className="flex justify-between items-baseline py-1.5 text-xs">
    <span className="text-slate-500">{label}</span>
    <span className={`font-mono font-bold text-sm tabular-nums ${
      tone === 'bad' ? 'text-red-700' : tone === 'warn' ? 'text-amber-700'
        : tone === 'good' ? 'text-emerald-700' : 'text-slate-900'
    }`}>{value}</span>
  </div>
);

export const SystemHealth: React.FC = () => {
  const [health, setHealth] = useState<Health | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = React.useCallback(async () => {
    const h = await fetchHealth();
    setHealth(h);
    setFailed(h === null);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const t = window.setInterval(load, REFRESH_MS);
    return () => window.clearInterval(t);
  }, [load]);

  if (loading) {
    return (
      <section className="mb-10 bg-white border border-slate-200 rounded-2xl shadow-md p-6">
        <p className="text-xs text-slate-500">Checking the system…</p>
      </section>
    );
  }

  if (failed || !health) {
    return (
      <section className="mb-10 bg-white border border-slate-200 rounded-2xl shadow-md p-6">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="material-symbols-outlined text-amber-600 text-lg shrink-0" aria-hidden="true">cloud_off</span>
          <div className="text-[12px] leading-relaxed text-amber-900">
            <strong className="font-bold">Couldn't reach the system.</strong> This panel asks the
            server how everything is doing, and that request failed. It does not mean the system is
            down — only that this page could not ask. Try again, or sign in afresh.
          </div>
        </div>
      </section>
    );
  }

  const { alerts, marketing, schedules, keyrouter } = health;
  const critical = alerts.filter((a) => a.severity === 'critical');
  const warnings = alerts.filter((a) => a.severity === 'warning');
  const allClear = critical.length === 0 && warnings.length === 0;

  const modeCopy =
    marketing.mode === 'live'
      ? { text: 'Live — writing real content', tone: 'bg-emerald-100 text-emerald-900 border-emerald-300' }
      : marketing.mode === 'configured_but_still_mocking'
      ? { text: 'Key set, but still producing placeholder text', tone: 'bg-amber-100 text-amber-900 border-amber-300' }
      : { text: 'Demo mode — placeholder text, no API key', tone: 'bg-slate-100 text-slate-700 border-slate-300' };

  return (
    <section className="mb-10 space-y-5">
      {/* ---- the answer, first ---- */}
      <div className={`rounded-2xl border p-5 shadow-md ${
        critical.length ? 'bg-red-50 border-red-300'
          : warnings.length ? 'bg-amber-50 border-amber-300'
          : 'bg-emerald-50 border-emerald-300'
      }`}>
        <div className="flex items-start gap-3">
          <span className={`material-symbols-outlined text-2xl shrink-0 ${
            critical.length ? 'text-red-700' : warnings.length ? 'text-amber-700' : 'text-emerald-700'
          }`} aria-hidden="true">
            {critical.length ? 'error' : warnings.length ? 'warning' : 'check_circle'}
          </span>
          <div>
            <h2 className={`font-display font-black text-xl ${
              critical.length ? 'text-red-900' : warnings.length ? 'text-amber-900' : 'text-emerald-900'
            }`}>
              {critical.length
                ? `${critical.length} thing${critical.length === 1 ? '' : 's'} need${critical.length === 1 ? 's' : ''} attention`
                : warnings.length
                ? `${warnings.length} thing${warnings.length === 1 ? '' : 's'} worth a look`
                : 'Everything is running'}
            </h2>
            <p className="text-xs text-slate-600 pt-1">
              Checked {ago(health.generated_at)}. Refreshes on its own every minute.
            </p>
          </div>
        </div>
      </div>

      {/* ---- problems before detail ---- */}
      {alerts.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 space-y-3">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
            Open items
          </h3>
          {alerts.map((a) => {
            const s = SEVERITY[a.severity];
            return (
              <div key={a.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3.5">
                <span className={`material-symbols-outlined text-base shrink-0 mt-0.5 ${
                  a.severity === 'critical' ? 'text-red-600'
                    : a.severity === 'warning' ? 'text-amber-600' : 'text-slate-400'
                }`} aria-hidden="true">{s.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-bold text-sm text-slate-900">{a.title}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${s.chip}`}>
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{a.detail}</p>
                  <p className="text-[10px] text-slate-400 font-mono pt-1">
                    first seen {ago(a.first_seen)} · seen {a.seen_count}×
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {allClear && alerts.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            No open items. The checks run every 15 minutes and cover the schedules, the task queue,
            failed sends, failed publishes, and how long drafts have been waiting on you.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ---- marketing system ---- */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <h3 className="font-display font-bold text-base text-slate-900">Marketing system</h3>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${modeCopy.tone}`}>
              {modeCopy.text}
            </span>
          </div>

          <div>
            <Stat label="Planning runs that errored (24h)" value={marketing.errors_24h}
                  tone={marketing.errors_24h > 0 ? 'bad' : 'good'} />
            <Stat label="Tasks waiting" value={marketing.tasks.pending ?? 0} />
            <Stat label="Tasks that gave up" value={marketing.tasks.failed ?? 0}
                  tone={(marketing.tasks.failed ?? 0) > 0 ? 'warn' : undefined} />
            <Stat label="Drafts waiting on you" value={marketing.content.pending_approval ?? 0}
                  tone={(marketing.content.pending_approval ?? 0) > 4 ? 'warn' : undefined} />
            <Stat label="Published" value={marketing.content.published ?? 0} />
            <Stat label="Messages failed to send" value={marketing.messages.failed ?? 0}
                  tone={(marketing.messages.failed ?? 0) > 0 ? 'bad' : 'good'} />
            <Stat label="Approval mode" value={marketing.autonomy === 'auto' ? 'sends by itself' : 'you approve'} />
          </div>

          {marketing.mode !== 'live' && (
            <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200 pt-3">
              {marketing.mode === 'configured_but_still_mocking'
                ? 'A key is configured but nothing real has been produced yet. If this persists the key is likely invalid — the system falls back to placeholder text rather than erroring, so it keeps running either way.'
                : 'Everything below is the real pipeline; only the words are placeholders. Adding an API key switches that over with no redeploy.'}
            </p>
          )}
        </div>

        {/* ---- key router ---- */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <h3 className="font-display font-bold text-base text-slate-900">Key Router</h3>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              keyrouter.state === 'up' ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : keyrouter.state === 'not_deployed' ? 'bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-red-100 text-red-900 border-red-300'
            }`}>
              {keyrouter.state === 'up' ? `up · ${keyrouter.ms}ms`
                : keyrouter.state === 'not_deployed' ? 'not deployed'
                : keyrouter.state === 'error' ? `answered ${keyrouter.status}` : 'unreachable'}
            </span>
          </div>

          {keyrouter.detail && (
            <p className="text-xs text-slate-600 leading-relaxed">{keyrouter.detail}</p>
          )}

          {keyrouter.state === 'up' && keyrouter.fleet && keyrouter.fleet.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Key fleet</h4>
              {keyrouter.fleet.map((k, i) => (
                <div key={i} className="flex justify-between items-baseline text-xs border-b border-slate-100 pb-1.5">
                  <span className="font-mono text-slate-800">{String(k.id ?? `key ${i + 1}`)}</span>
                  <span className="font-mono tabular-nums text-slate-600">
                    {String(k.used ?? k.tokensUsed ?? 0)} / {String(k.limit ?? '—')}
                  </span>
                </div>
              ))}
            </div>
          )}

          {keyrouter.state === 'not_deployed' && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                <strong className="text-slate-800">Nothing is broken.</strong> Key Router manages API
                keys across clients so each one's usage is metered and billed to them. It is written
                and tested but not deployed, so this panel will stay quiet until it is. Deploy it and
                set <code className="font-mono">KEYROUTER_URL</code>, and this fills in on its own.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ---- schedules ---- */}
      {schedules && schedules.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h3 className="font-display font-bold text-base text-slate-900">Schedules</h3>
            <p className="text-[11px] text-slate-500 pt-0.5">
              A schedule that stops firing is the failure that hides all the others — nothing errors,
              work simply stops happening.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[560px]">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="text-left p-3">Job</th>
                  <th className="text-left p-3">Schedule</th>
                  <th className="text-left p-3">Last run</th>
                  <th className="text-left p-3">Runs (24h)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedules.map((s) => (
                  <tr key={s.job}>
                    <td className="p-3 font-semibold text-slate-900">{s.job.replace(/^marketing-/, '')}</td>
                    <td className="p-3 font-mono text-slate-600">{s.schedule}</td>
                    <td className="p-3">
                      <span className={`font-mono ${s.last_run ? 'text-slate-800' : 'text-slate-400'}`}>
                        {ago(s.last_run)}
                      </span>
                    </td>
                    <td className="p-3 font-mono tabular-nums">
                      <span className="text-slate-800">{s.runs_24h}</span>
                      {s.failures_24h > 0 && (
                        <span className="text-red-700 font-bold"> · {s.failures_24h} failed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200 pt-4">
        <strong className="text-slate-700">On being notified:</strong> the checks run every 15
        minutes and record what they find here, so this page is always current. Email alerts need a
        SendGrid key, which is not configured — until it is, this panel is where problems appear.
      </p>
    </section>
  );
};
