import React from 'react';

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
 * The plate is light even when the footer around it is not, and that is the
 * whole reason it exists: it gives the logo a guaranteed background instead of
 * hoping the surrounding page is a colour the artwork survives. Because the
 * ground is guaranteed, this is the one place that can use Otis's complete
 * lockup file, wordmark and all.
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
      className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-100 px-7 py-6 transition-colors hover:bg-white"
      aria-label="Meridian Interface — visit meridianinterface.com"
    >
      {/* The complete lockup file, not a mark plus typed text. The plate is
          always light, so his near-black wordmark works here — and using his
          own artwork means the spacing and letterforms are his, not a rebuild
          that is nearly right. */}
      <img
        src="/brand/meridian-lockup.png"
        alt="Meridian Interface"
        width={885}
        height={550}
        decoding="async"
        loading="lazy"
        className="w-[132px] h-auto"
      />
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
