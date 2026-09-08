import React, { useEffect, useState } from 'react';
import { MeridianLogo } from './MeridianLogo';

/**
 * The page an unsubscribe link lands on.
 *
 * The rule this exists to satisfy is that opting out takes one click and needs
 * nothing else from the person — no login, no reply, no form. So this page does
 * the work itself on arrival and tells them it is done.
 *
 * Why a page at all, when the endpoint could be linked directly: the endpoint
 * answers JSON, and a person who clicks "unsubscribe" and is shown a wall of
 * braces has been failed even if the record changed. Worse, the endpoint's GET
 * deliberately does *not* unsubscribe — mail scanners follow links before a
 * human sees them, so the change is on POST. A visitor clicking the raw link
 * would have seen JSON and stayed subscribed. This page issues that POST.
 */

const ENDPOINT =
  (import.meta.env.VITE_UNSUBSCRIBE_ENDPOINT as string | undefined)?.trim() ||
  'https://glzodwhyavexpuusbqjy.supabase.co/functions/v1/unsubscribe';

type State = 'working' | 'done' | 'failed';

export const UnsubscribeView: React.FC = () => {
  const [state, setState] = useState<State>('working');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('t') ?? '';
    let alive = true;

    (async () => {
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const body = await res.json().catch(() => ({}));
        if (!alive) return;
        if (body?.unsubscribed) {
          setState('done');
          setMessage(String(body.message ?? 'You will not receive marketing email from us.'));
        } else {
          setState('failed');
          setMessage('');
        }
      } catch {
        if (alive) setState('failed');
      }
    })();

    return () => { alive = false; };
  }, []);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center space-y-5">
        <div className="flex justify-center">
          <MeridianLogo size={44} subtext="INTERFACE" />
        </div>

        {state === 'working' && (
          <p className="font-body text-sm text-slate-600">Removing you from marketing email…</p>
        )}

        {state === 'done' && (
          <>
            <div className="flex justify-center">
              <span className="material-symbols-outlined text-4xl text-emerald-600" aria-hidden="true">
                check_circle
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl text-slate-900">You&apos;re unsubscribed</h1>
            <p className="font-body text-sm text-slate-600 leading-relaxed">{message}</p>
            <a
              href="/"
              className="inline-block px-5 py-2.5 bg-[#0f172a] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-800 transition-colors"
            >
              Back to the site
            </a>
          </>
        )}

        {/* Even a failure has to leave them with a way out that does not depend
            on us. A dead end here is the thing the rule exists to prevent. */}
        {state === 'failed' && (
          <>
            <h1 className="font-display font-bold text-2xl text-slate-900">
              We couldn&apos;t complete that automatically
            </h1>
            <p className="font-body text-sm text-slate-600 leading-relaxed">
              Email{' '}
              <a className="text-blue-700 underline" href="mailto:otis@meridianinterface.com">
                otis@meridianinterface.com
              </a>{' '}
              with the word &ldquo;unsubscribe&rdquo; and we will take you off the list by hand. You
              will not be emailed marketing again either way.
            </p>
          </>
        )}
      </div>
    </main>
  );
};
