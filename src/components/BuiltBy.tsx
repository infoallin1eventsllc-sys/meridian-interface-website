import React from 'react';
import { MeridianLogoMark } from './MeridianLogo';

interface BuiltByProps {
  /** The line above the plate. On a client's site the default is the point of
      the whole block; on Meridian's own site it reads oddly, so pass your own. */
  kicker?: string;
  className?: string;
}

/**
 * The studio signature plate.
 *
 * A light plate on a dark footer, with the mark and wordmark stacked inside it
 * and the studio's line and contacts beneath. Built as its own component
 * because it is meant to travel: the same block goes at the bottom of every
 * site Meridian ships, and a credit that is copy-pasted per project drifts.
 *
 * The mark is drawn for a light background here — the plate is light even when
 * the footer around it is not, which is the whole reason the plate exists. It
 * gives the logo a guaranteed background instead of hoping the surrounding
 * page is a colour the mark survives.
 */
export const BuiltBy: React.FC<BuiltByProps> = ({
  kicker = 'THIS WEBSITE BUILT BY',
  className = '',
}) => (
  <div className={`flex flex-col items-center text-center ${className}`}>
    {kicker && (
      <p className="font-body text-[10px] md:text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
        {kicker}
      </p>
    )}

    <a
      href="https://meridianinterface.com"
      className="mt-4 inline-flex flex-col items-center justify-center gap-3.5 rounded-xl bg-slate-200 px-6 py-6 transition-colors hover:bg-white"
      aria-label="Meridian Interface — visit meridianinterface.com"
    >
      <MeridianLogoMark size={72} />
      <span className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-slate-800 whitespace-nowrap">
        Meridian Interface
      </span>
    </a>

    <p className="mt-5 font-body text-xs text-slate-400 max-w-sm">
      Websites, applications, and marketing systems for growing businesses.
    </p>

    {/* Bullets are decorative; aria-hidden keeps a screen reader from reading
        "bullet" between every contact detail. */}
    <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-body text-xs font-semibold text-slate-300">
      <a href="https://meridianinterface.com" className="hover:text-white transition-colors">
        meridianinterface.com
      </a>
      <span aria-hidden="true" className="text-slate-600">&bull;</span>
      <a href="mailto:otis@meridianinterface.com" className="hover:text-white transition-colors">
        otis@meridianinterface.com
      </a>
      <span aria-hidden="true" className="text-slate-600">&bull;</span>
      <a href="tel:+12818829198" className="hover:text-white transition-colors">
        (281) 882-9198
      </a>
    </div>
  </div>
);
