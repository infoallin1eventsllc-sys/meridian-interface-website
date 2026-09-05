import React from 'react';

/**
 * "Built by Meridian Interface" — the studio's mark on its own work.
 *
 * One component, dropped unchanged into every product, so the attribution is
 * identical everywhere instead of being re-typed and slowly drifting.
 *
 * Two treatments, because the artwork demands it. On a light ground it uses
 * Otis's lockup file, which is the most faithful thing that can be shipped. On
 * a dark ground it uses the mark beside live text: the lockup's wordmark is
 * near-black and disappears on dark, which is the most common way this logo
 * gets shipped broken.
 *
 * The mark is never redrawn and never recoloured. It is his artwork, served
 * from /brand/.
 */

export const MERIDIAN = {
  name: 'Meridian Interface',
  tagline: 'Websites · Apps · Marketing Systems',
  city: 'Houston, Texas',
  site: 'https://meridianinterface.com',
  siteLabel: 'meridianinterface.com',
  email: 'otis@meridianinterface.com',
  phone: '281-882-9198',
  phoneHref: 'tel:+12818829198',
} as const;

interface BuiltByMeridianProps {
  /** The ground it sits on. Dark swaps the lockup for the mark plus live text. */
  tone?: 'light' | 'dark';
  /** Optional single line above the contact row — e.g. what this demonstration is. */
  note?: string;
  className?: string;
}

export const BuiltByMeridian: React.FC<BuiltByMeridianProps> = ({ tone = 'light', note, className = '' }) => {
  const dark = tone === 'dark';
  const body = dark ? 'text-slate-400' : 'text-slate-500';
  const strong = dark ? 'text-white' : 'text-slate-900';
  const hover = dark ? 'hover:text-white' : 'hover:text-slate-900';
  const rule = dark ? 'border-slate-800' : 'border-slate-200';
  const ground = dark ? 'bg-[#0f172a]' : 'bg-white';

  return (
    <footer className={`w-full border-t ${rule} ${ground} px-6 lg:px-12 py-6 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {dark ? (
            <>
              {/* The mark alone holds on dark; the wordmark is live text so it can be light. */}
              <img src={`${import.meta.env.BASE_URL}brand/meridian-mark.png`} alt="" width={342} height={333} className="h-9 w-auto shrink-0" aria-hidden="true" />
              <div className="leading-tight">
                <div className={`text-[13px] font-bold tracking-[0.18em] ${strong}`}>MERIDIAN</div>
                <div className="text-[10px] tracking-[0.28em] text-slate-300">INTERFACE</div>
              </div>
            </>
          ) : (
            <img src={`${import.meta.env.BASE_URL}brand/meridian-lockup.png`} alt="Meridian Interface" width={885} height={550} className="h-10 w-auto shrink-0" />
          )}
          <span className={`hidden sm:inline-block w-px h-8 ${dark ? 'bg-slate-700' : 'bg-slate-200'}`} aria-hidden="true" />
          <div className={`text-xs ${body} leading-relaxed`}>
            <div className={`font-semibold ${strong}`}>Built by {MERIDIAN.name}</div>
            <div>{MERIDIAN.tagline} · {MERIDIAN.city}</div>
          </div>
        </div>

        <div className={`flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs ${body}`}>
          <a href={MERIDIAN.site} className={`${hover} transition-colors`}>{MERIDIAN.siteLabel}</a>
          <a href={`mailto:${MERIDIAN.email}`} className={`${hover} transition-colors`}>{MERIDIAN.email}</a>
          <a href={MERIDIAN.phoneHref} className={`${hover} transition-colors`}>{MERIDIAN.phone}</a>
        </div>
      </div>

      {note && (
        <p className={`max-w-7xl mx-auto mt-3 text-[11px] ${dark ? 'text-slate-500' : 'text-slate-400'} leading-relaxed`}>
          {note}
        </p>
      )}
    </footer>
  );
};
