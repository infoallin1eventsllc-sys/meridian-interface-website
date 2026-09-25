import React from 'react';
import { PORTFOLIO } from '../data/mockData';

type Piece = typeof PORTFOLIO[number];

/**
 * The picture on the right of the homepage hero: three of the studio's own
 * working demos, one of each kind of thing it builds — a dashboard, a website
 * and a phone app — layered in front of the globe.
 *
 * The hero used to be words on one side and an empty stretch of globe on the
 * other. The work is the most persuasive thing the studio has, so the front
 * door now shows it, and every frame opens that piece's concept panel.
 *
 * The images are fresh captures of the demos in `public/demos/`, taken at
 * desktop and phone sizes with the "Built by Meridian Interface" banner
 * trimmed off, because the frames here draw their own chrome. They are
 * deliberately not the portfolio covers: those can be replaced from Photo
 * Control, and a hero that silently changed when a tile did would be a
 * surprise. If a demo changes a lot, re-capture it (see CREDITS.md).
 */

const HERO = {
  dashboard: { id: 'p9', src: '/images/hero/hero-dashboard.webp', w: 1200, h: 750, path: 'demos/analytics-hub' },
  website: { id: 'p2', src: '/images/hero/hero-website.webp', w: 1200, h: 750, path: 'demos/frame-shop' },
  mobile: { id: 'p4', src: '/images/hero/hero-mobile.webp', w: 480, h: 1039 },
} as const;

const find = (id: string) => PORTFOLIO.find((p) => p.id === id);

/** A browser window drawn in CSS: quiet chrome, the real address, the capture. */
const BrowserFrame: React.FC<{ src: string; w: number; h: number; path: string; alt: string }> = ({ src, w, h, path, alt }) => (
  <div className="overflow-hidden rounded-xl bg-[#0b1220] ring-1 ring-white/10">
    {/* The chrome is fixed-size while the frame scales, so on a phone it is
        cut down: smaller dots, and the path alone without the domain. */}
    <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 h-5 sm:h-8 border-b border-white/5">
      <span className="flex gap-1 sm:gap-1.5" aria-hidden="true">
        <span className="h-1 w-1 sm:h-2 sm:w-2 rounded-full bg-slate-600" />
        <span className="h-1 w-1 sm:h-2 sm:w-2 rounded-full bg-slate-600" />
        <span className="h-1 w-1 sm:h-2 sm:w-2 rounded-full bg-slate-600" />
      </span>
      <span className="flex-1 min-w-0 truncate rounded bg-white/5 px-1.5 sm:px-2.5 sm:py-0.5 text-[8px] sm:text-[11px] leading-[1.6] font-body text-slate-400">
        <span className="hidden sm:inline">meridianinterface.com/</span><span className="text-slate-300">{path}</span>
      </span>
    </div>
    <img src={src} width={w} height={h} alt={alt} decoding="async" className="block w-full h-auto" />
  </div>
);

export const HeroShowcase: React.FC<{ onOpen: (item: Piece) => void }> = ({ onOpen }) => {
  const dashboard = find(HERO.dashboard.id);
  const website = find(HERO.website.id);
  const mobile = find(HERO.mobile.id);

  // Each frame is a button onto the concept panel. If a piece is ever removed
  // from the portfolio, its frame still shows but stops pretending to open.
  const frame = (item: Piece | undefined, label: string, className: string, child: React.ReactNode) =>
    item ? (
      <button
        type="button"
        onClick={() => onOpen(item)}
        aria-label={`Open the ${label} concept`}
        className={`hero-frame group absolute text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0f172a] ${className}`}
      >
        {child}
      </button>
    ) : (
      <div className={`hero-frame absolute ${className}`}>{child}</div>
    );

  return (
    <figure className="relative w-full max-w-[640px] mx-auto lg:max-w-none">
      <div className="relative aspect-[10/8.2]">
        {frame(
          dashboard,
          'IntelHub BI dashboard',
          'hero-frame-1 top-0 right-0 w-[80%] z-10',
          <BrowserFrame {...HERO.dashboard} alt="IntelHub BI, an analytics dashboard built by Meridian Interface" />,
        )}
        {frame(
          website,
          'Frame Shop website',
          'hero-frame-2 bottom-[6%] left-0 w-[74%] z-20',
          <BrowserFrame {...HERO.website} alt="The Frame Shop, a motorcycle alignment website built by Meridian Interface" />,
        )}
        {frame(
          mobile,
          'Big Boy Subs ordering app',
          'hero-frame-3 bottom-0 right-[3%] w-[25%] z-30',
          <div className="rounded-[1.4rem] sm:rounded-[1.75rem] bg-[#0b1220] p-[5%] ring-1 ring-white/15">
            <div className="overflow-hidden rounded-[1.05rem] sm:rounded-[1.35rem] bg-white">
              {/* Status bar with the camera cut-out, so it sits above the app rather than over it. */}
              <div aria-hidden="true" className="flex items-center justify-center aspect-[480/40]">
                <span className="h-[48%] w-[32%] rounded-full bg-[#0b1220]" />
              </div>
              <img
                src={HERO.mobile.src}
                width={HERO.mobile.w}
                height={HERO.mobile.h}
                alt="Big Boy Subs, a restaurant ordering app built by Meridian Interface, on a phone"
                decoding="async"
                className="block w-full h-auto"
              />
            </div>
          </div>,
        )}
      </div>
      <figcaption className="mt-5 text-center lg:text-right font-body text-[11px] sm:text-xs text-slate-400 leading-relaxed">
        A dashboard, a website and an ordering app, all live demos.{' '}
        <span className="text-slate-300">Open any one to look inside.</span>
      </figcaption>
    </figure>
  );
};
