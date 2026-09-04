import React from 'react';
import { CalendarCheck, Mail, Phone, Globe } from 'lucide-react';
import { MERIDIAN } from '../lib/brand';

/**
 * The plate that says who built this and how to reach them.
 *
 * The lockup file is used here rather than the live-text logo because the
 * ground is white and under our control — the most faithful thing we can ship
 * is Otis's own artwork, untouched.
 */
export const BuiltBy: React.FC<{ variant?: 'card' | 'footer' }> = ({ variant = 'card' }) => {
  if (variant === 'footer') {
    return (
      <footer className="border-t border-[#e2e8f0] bg-white py-6 px-4 sm:px-6 lg:px-8 text-xs text-[#475569]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/brand/meridian-lockup.png" alt="Meridian Interface" width={885} height={550} className="h-11 w-auto" />
            <div>
              <div className="font-semibold text-[#0f172a]">A Meridian Interface build</div>
              <div>{MERIDIAN.tagline} · {MERIDIAN.city}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <a href={MERIDIAN.site} className="inline-flex items-center gap-1.5 hover:text-[#0f172a]"><Globe className="w-3.5 h-3.5" />{MERIDIAN.siteLabel}</a>
            <a href={`mailto:${MERIDIAN.email}`} className="inline-flex items-center gap-1.5 hover:text-[#0f172a]"><Mail className="w-3.5 h-3.5" />{MERIDIAN.email}</a>
            <a href={MERIDIAN.phoneHref} className="inline-flex items-center gap-1.5 hover:text-[#0f172a]"><Phone className="w-3.5 h-3.5" />{MERIDIAN.phone}</a>
          </div>
        </div>
        <p className="max-w-7xl mx-auto mt-4 text-[11px] text-slate-500 leading-relaxed">
          Figures in this planner are planning estimates for a conversation, not a quote. Nothing here is a certification or a
          compliance attestation; those belong to a business and its vendors, and this planner shows how a stack is designed so the evidence for them exists.
          Model prices are the providers' published rates at the time of writing and change without notice.
        </p>
      </footer>
    );
  }

  return (
    <section className="rounded-2xl border border-[#e2e8f0] bg-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center gap-5">
      <img src="/brand/meridian-lockup.png" alt="Meridian Interface" width={885} height={550} className="h-14 w-auto shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-extrabold text-[#0f172a]" style={{ fontFamily: 'var(--font-display)' }}>
          Want this built rather than planned?
        </h3>
        <p className="text-sm text-[#475569] mt-1 leading-relaxed max-w-2xl">
          Meridian Interface designs and builds the stack in this planner: the tools chosen to fit how you work, connected so nothing is typed
          twice, with a person approving anything that matters. Bring the plan you export here to the call.
        </p>
      </div>
      <a
        href={MERIDIAN.book}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#2563eb] hover:bg-[#1d4ed8] text-white transition-colors shrink-0"
      >
        <CalendarCheck className="w-4 h-4" />
        Book a call with Meridian
      </a>
    </section>
  );
};
