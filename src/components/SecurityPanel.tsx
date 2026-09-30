import React, { useCallback, useEffect, useState } from 'react';
import {
  NotDeployedError,
  securityStatus,
  signOutOtherDevices,
  twoStepBegin,
  twoStepConfirm,
  twoStepOff,
  type SecurityEvent,
  type SecurityStatus,
} from '../lib/ownerStore';

/**
 * The portal's Security tab: two-step sign-in, "sign out every other device",
 * and what has happened at the door in the last 30 days.
 *
 * Everything here is enforced by the `owner` function, not by this component.
 * This page only shows state and asks for changes; a change that does not come
 * with a valid session (and, for turning two-step off, a current code) is
 * refused on the server whatever the browser does.
 */

const EVENT_LABEL: Record<string, { text: string; tone: 'ok' | 'warn' | 'bad' | 'info' }> = {
  login_ok: { text: 'Signed in', tone: 'ok' },
  login_failed: { text: 'Wrong passcode or code', tone: 'warn' },
  new_device: { text: 'First sign-in from this device in 30 days', tone: 'info' },
  locked_caller: { text: 'Device locked out for 15 minutes', tone: 'bad' },
  locked_global: { text: 'Sign-in closed for everyone for an hour', tone: 'bad' },
  twostep_on: { text: 'Two-step sign-in turned on', tone: 'ok' },
  twostep_off: { text: 'Two-step sign-in turned off', tone: 'bad' },
  signout_all: { text: 'Signed out every other device', tone: 'info' },
};

const TONE: Record<string, string> = {
  ok: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  warn: 'bg-amber-50 text-amber-800 border-amber-200',
  bad: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-slate-100 text-slate-700 border-slate-200',
};

const ERROR_TEXT: Record<string, string> = {
  invalid_code: 'That code did not match. Codes change every 30 seconds; enter the one showing now.',
  setup_expired: 'Setup took longer than 15 minutes. Start again to get a fresh key.',
  already_on: 'Two-step sign-in is already on.',
  already_off: 'Two-step sign-in is already off.',
  unavailable: 'The server could not update security settings just now. Try again in a minute.',
};

const explain = (err: unknown) =>
  err instanceof Error ? ERROR_TEXT[err.message] ?? 'Something went wrong. Try again.' : 'Something went wrong. Try again.';

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

/** The key in groups of four, the way authenticator apps show it. */
const grouped = (secret: string) => secret.replace(/(.{4})/g, '$1 ').trim();

const CodeInput: React.FC<{ value: string; onChange: (v: string) => void; id: string; label: string }> = ({ value, onChange, id, label }) => (
  <div>
    <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">{label}</label>
    <input
      id={id}
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9]*"
      maxLength={6}
      placeholder="123456"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
      className="w-40 px-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl text-lg font-mono font-bold tracking-[0.3em] text-slate-900 outline-none"
    />
  </div>
);

export const SecurityPanel: React.FC = () => {
  const [status, setStatus] = useState<SecurityStatus | null>(null);
  const [notDeployed, setNotDeployed] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [setup, setSetup] = useState<{ secret: string; svg: string } | null>(null);
  const [code, setCode] = useState('');
  const [offCode, setOffCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setStatus(await securityStatus());
      setLoadError(null);
    } catch (err) {
      if (err instanceof NotDeployedError) setNotDeployed(true);
      else setLoadError('Could not load security status. Check the connection and reload.');
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const run = async (fn: () => Promise<void>, done: string) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await fn();
      setNotice(done);
      await refresh();
    } catch (err) {
      setError(explain(err));
    } finally {
      setBusy(false);
    }
  };

  const beginSetup = () => run(async () => {
    const r = await twoStepBegin();
    // Drawn here, in the browser, so the secret never passes through a
    // third-party QR service. Loaded only when needed: most visits never set up.
    const QR = await import('qrcode');
    const svg = await QR.toString(r.uri, { type: 'svg', margin: 1, width: 200, errorCorrectionLevel: 'M' });
    setSetup({ secret: r.secret, svg });
    setCode('');
  }, '');

  const confirmSetup = () => run(async () => {
    await twoStepConfirm(code);
    setSetup(null);
    setCode('');
  }, 'Two-step sign-in is on. Every other device has been signed out, and you have been emailed.');

  const turnOff = () => {
    if (!window.confirm('Turn off two-step sign-in? Your passcode alone will open the portal again.')) return;
    run(async () => {
      await twoStepOff(offCode);
      setOffCode('');
    }, 'Two-step sign-in is off. Every other device has been signed out.');
  };

  const signOutOthers = () => {
    if (!window.confirm('Sign out every other device? This device stays signed in.')) return;
    run(() => signOutOtherDevices(), 'Every other device has been signed out.');
  };

  if (notDeployed) {
    return (
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-3 max-w-3xl">
        <h2 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-500" aria-hidden="true">shield</span>
          Security
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Two-step sign-in, sign-out of every device and the sign-in log switch on once the updated
          backend is deployed. From the project folder on your Mac, run{' '}
          <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-xs">supabase functions deploy</code>, then reload this page.
        </p>
      </section>
    );
  }

  if (!status) {
    return (
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 max-w-3xl">
        <p className="text-sm text-slate-600" role={loadError ? 'alert' : undefined}>{loadError ?? 'Loading security status…'}</p>
      </section>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <section className="space-y-1">
        <h2 className="font-display font-bold text-2xl text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-500" aria-hidden="true">shield</span>
          Security
        </h2>
        <p className="text-sm text-slate-600">Who can open this portal, and what has happened at the door in the last 30 days.</p>
      </section>

      {/* At a glance */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Two-step sign-in</div>
          <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${status.twoStep ? TONE.ok : TONE.bad}`}>
            <span className="material-symbols-outlined text-sm" aria-hidden="true">{status.twoStep ? 'verified_user' : 'gpp_maybe'}</span>
            {status.twoStep ? 'On' : 'Off'}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Wrong sign-ins, last 24 hours</div>
          <div className={`mt-1 font-display font-black text-3xl ${status.failedSignInsLast24h >= 8 ? 'text-red-700' : 'text-slate-900'}`}>
            {status.failedSignInsLast24h}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">This device</div>
          <div className="mt-2 font-mono font-bold text-slate-900">{status.thisDevice}</div>
          <div className="text-[11px] text-slate-500 mt-1">A label from a scrambled network address, not your IP.</div>
        </div>
      </section>

      {(error || notice) && (
        <p
          role={error ? 'alert' : 'status'}
          className={`rounded-xl border px-4 py-3 text-sm ${error ? TONE.bad : TONE.ok}`}
        >
          {error ?? notice}
        </p>
      )}

      {/* Two-step */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="font-display font-bold text-lg text-slate-900">Two-step sign-in</h3>

        {!status.twoStep && !setup && (
          <>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              With this on, opening the portal needs your passcode and a 6-digit code from an
              authenticator app on your phone. Someone who learns the passcode still cannot get in.
            </p>
            <button
              type="button"
              onClick={beginSetup}
              disabled={busy}
              className="px-5 py-2.5 bg-[#0f172a] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-800 disabled:opacity-60"
            >
              Turn on two-step sign-in
            </button>
          </>
        )}

        {!status.twoStep && setup && (
          <div className="grid gap-6 md:grid-cols-[auto_1fr] items-start">
            <div
              className="w-[200px] h-[200px] bg-white border border-slate-200 rounded-xl p-2"
              role="img"
              aria-label="QR code for your authenticator app"
              // Generated in this browser by the qrcode package from the key below.
              dangerouslySetInnerHTML={{ __html: setup.svg }}
            />
            <div className="space-y-4">
              <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-700">
                <li>Open an authenticator app on your phone: Google Authenticator, Microsoft Authenticator, 1Password or Apple Passwords.</li>
                <li>Scan this code. If you cannot scan, enter the key below by hand.</li>
                <li>Type the 6-digit code the app shows to finish. Setup expires in 15 minutes.</li>
              </ol>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Key</div>
                <code className="block w-fit px-3 py-2 rounded-lg bg-slate-100 text-slate-900 font-mono text-sm select-all">{grouped(setup.secret)}</code>
              </div>
              <form
                className="flex flex-wrap items-end gap-3"
                onSubmit={(e) => { e.preventDefault(); if (code.length === 6) confirmSetup(); }}
              >
                <CodeInput id="twostep-setup-code" label="Code from the app" value={code} onChange={setCode} />
                <button
                  type="submit"
                  disabled={busy || code.length !== 6}
                  className="px-5 py-3 bg-[#0f172a] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-800 disabled:opacity-60"
                >
                  Confirm and turn on
                </button>
                <button type="button" onClick={() => setSetup(null)} className="px-3 py-3 text-xs font-bold text-slate-500 hover:text-slate-800">
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {status.twoStep && (
          <>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              On. Signing in needs your passcode and the code from your authenticator app. If you
              lose your phone, switch it off from Supabase: open the SQL editor and run{' '}
              <code className="px-1 py-0.5 rounded bg-slate-100 text-[12px]">update owner_security set totp_enabled = false, totp_secret = null;</code>
            </p>
            <details className="group">
              <summary className="cursor-pointer text-xs font-bold text-slate-500 hover:text-slate-800">Turn two-step sign-in off</summary>
              <form
                className="mt-3 flex flex-wrap items-end gap-3"
                onSubmit={(e) => { e.preventDefault(); if (offCode.length === 6) turnOff(); }}
              >
                <CodeInput id="twostep-off-code" label="Current code" value={offCode} onChange={setOffCode} />
                <button
                  type="submit"
                  disabled={busy || offCode.length !== 6}
                  className="px-5 py-3 bg-white border border-red-300 text-red-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-red-50 disabled:opacity-60"
                >
                  Turn off
                </button>
              </form>
            </details>
          </>
        )}
      </section>

      {/* Sessions */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-3">
        <h3 className="font-display font-bold text-lg text-slate-900">Signed-in devices</h3>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          A sign-in lasts up to 8 hours. If a phone or laptop is lost, or you signed in somewhere you
          should not have, end every session except this one.
        </p>
        <button
          type="button"
          onClick={signOutOthers}
          disabled={busy}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-50 disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-base" aria-hidden="true">logout</span>
          Sign out every other device
        </button>
      </section>

      {/* Log */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-3">
        <h3 className="font-display font-bold text-lg text-slate-900">Last 30 days</h3>
        {status.events.length === 0 ? (
          <p className="text-sm text-slate-500">Nothing recorded yet. Sign-ins appear here from the next one on.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-4">When</th>
                  <th className="py-2 pr-4">What</th>
                  <th className="py-2">Device</th>
                </tr>
              </thead>
              <tbody>
                {status.events.map((e: SecurityEvent, i) => {
                  const label = EVENT_LABEL[e.kind] ?? { text: e.kind, tone: 'info' as const };
                  return (
                    <tr key={`${e.at}-${i}`} className="border-b border-slate-100 last:border-0">
                      <td className="py-2.5 pr-4 whitespace-nowrap text-slate-600">{when(e.at)}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`inline-block px-2 py-0.5 rounded-md border text-xs font-semibold ${TONE[label.tone]}`}>{label.text}</span>
                      </td>
                      <td className="py-2.5 whitespace-nowrap font-mono text-xs text-slate-700">
                        {e.device}
                        {e.thisDevice && <span className="ml-2 font-body font-bold text-[10px] uppercase tracking-wider text-blue-700">this device</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
