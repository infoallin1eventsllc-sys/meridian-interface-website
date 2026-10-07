import React, { useEffect, useState } from 'react';
import { HeroBackdrop } from './HeroBackdrop';

/**
 * PREVIEW BRANCH ONLY (preview/backdrop-samples). Never merge to main.
 *
 * Lets Otis compare the live globe with two Higgsfield clips behind the real
 * hero. Clips are self-hosted in public/backdrop-samples, re-encoded from
 * Higgsfield's HEVC to H.264 so Chrome and Firefox can play them, and played
 * forward then backward so neither loop jumps back to its first frame.
 *
 * Video 2 is graded into the site's navy with its highlights held back, so the
 * mid-clip flash never washes out the headline. The globe clip was already in
 * the palette; only its blacks were lifted to meet the hero's navy.
 */
interface Sample {
  id: string;
  label: string;
  src?: string;
  poster?: string;
  /** Darkening behind the headline column, as a CSS background. */
  scrim?: string;
  /** Extra classes that place the footage on wide screens. */
  frame?: string;
  /** The footage shows the products itself, so the hero's demo cards start hidden. */
  hidesCards?: boolean;
}

const SAMPLES: Sample[] = [
  { id: 'current', label: 'Current' },
  {
    id: '2',
    label: 'Video 2',
    src: '/backdrop-samples/video2-polished.mp4',
    poster: '/backdrop-samples/video2-polished.jpg',
    /* Holds at 75% across the text column, then lets go over the gap so the
       square's lines fade out before they reach any words. */
    scrim: 'linear-gradient(90deg, rgba(11,17,31,0.82) 0%, rgba(11,17,31,0.75) 42%, rgba(11,17,31,0.2) 62%, rgba(11,17,31,0) 80%)',
    /* On wide screens the clip slides right so its square settles behind the
       three demo cards instead of where the headline ends. The left edge
       feathers into the hero's navy so the shift never shows as a seam. */
    frame: 'lg:left-[20%] lg:[mask-image:linear-gradient(90deg,transparent,black_14%)]',
  },
  {
    id: 'globe',
    label: 'Globe',
    src: '/backdrop-samples/globe.mp4',
    poster: '/backdrop-samples/globe.jpg',
    /* The globe already sits on the right with dark space on the left, so it
       needs no shift and only a light hold behind the headline. The bottom
       fade keeps the caption under the demo cards off the globe's grid. */
    scrim:
      'linear-gradient(0deg, rgba(11,17,31,0.8) 0%, rgba(11,17,31,0) 24%),' +
      'linear-gradient(90deg, rgba(11,17,31,0.6) 0%, rgba(11,17,31,0.45) 40%, rgba(11,17,31,0) 62%)',
  },
  {
    /* Otis's glass-panes clip rebuilt from real screens: the large pane holds
       the website (it held a car interior), the phone and tablet panes cut
       through every product. Rendered, not generated, so the screens are
       sharp. Its left third is already near-black. */
    id: 'showcase',
    label: 'Showcase',
    src: '/backdrop-samples/showcase.mp4',
    poster: '/backdrop-samples/showcase.jpg',
    scrim: 'linear-gradient(90deg, rgba(11,17,31,0.55) 0%, rgba(11,17,31,0.25) 38%, rgba(11,17,31,0) 55%)',
    hidesCards: true,
  },
];

const DEFAULT_ID = 'showcase';

function initialChoice(): string {
  if (typeof window === 'undefined') return DEFAULT_ID;
  const q = new URLSearchParams(window.location.search).get('backdrop');
  return SAMPLES.some((s) => s.id === q) ? (q as string) : DEFAULT_ID;
}

/** Same rule as the live globe: with reduced motion the backdrop holds still. */
function prefersStill(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const BackdropPreview: React.FC = () => {
  const [choice, setChoice] = useState(initialChoice);
  const [still] = useState(prefersStill);
  const sample = SAMPLES.find((s) => s.id === choice);
  const [showCards, setShowCards] = useState(false);
  const cardsHidden = !!sample?.hidesCards && !showCards;
  // HomeView wraps the demo cards in [data-hero-cards]; hide them without moving the layout.
  useEffect(() => {
    document.documentElement.toggleAttribute('data-hide-cards', cardsHidden);
    return () => document.documentElement.removeAttribute('data-hide-cards');
  }, [cardsHidden]);

  return (
    <>
      {sample?.src ? (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#0B111F]">
          {still ? (
            <img className={`${sample.frame ?? ''} absolute inset-0 w-full h-full object-cover`} src={sample.poster} alt="" />
          ) : (
            <video
              key={sample.src}
              className={`${sample.frame ?? ''} absolute inset-0 w-full h-full object-cover`}
              src={sample.src}
              poster={sample.poster}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          )}
          <div className="absolute inset-0" style={{ background: sample.scrim }} />
          {/* Below lg the copy runs the full width, so the footage sits behind
              every line of it; hold it further back there. */}
          <div className="absolute inset-0 lg:hidden bg-[#0B111F]/60" />
        </div>
      ) : (
        <HeroBackdrop />
      )}

      <div className="fixed left-1/2 -translate-x-1/2 top-[76px] md:top-auto md:bottom-6 z-[60] flex flex-col items-center gap-1.5">
      <div
        role="radiogroup"
        aria-label="Backdrop sample"
        className="flex gap-0.5 min-[400px]:gap-1 rounded-full bg-slate-900/90 backdrop-blur p-1 ring-1 ring-white/15 shadow-xl"
      >
        {SAMPLES.map((s) => (
          <button
            key={s.id}
            role="radio"
            aria-checked={choice === s.id}
            onClick={() => setChoice(s.id)}
            className={`px-2.5 min-[400px]:px-4 py-2 rounded-full font-body text-[10px] min-[400px]:text-xs font-bold uppercase tracking-wide min-[400px]:tracking-wider transition-colors whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
              choice === s.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
        {/* Cards sit beside the headline only on wide screens, so the choice only matters there. */}
        {sample?.hidesCards && (
          <button
            onClick={() => setShowCards((v) => !v)}
            aria-pressed={showCards}
            className="hidden lg:inline-flex px-4 py-1.5 rounded-full bg-slate-900/90 backdrop-blur ring-1 ring-white/15 shadow-xl font-body text-[10px] min-[400px]:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap text-slate-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
          >
            {showCards ? 'Hide cards' : 'Show cards'}
          </button>
        )}
      </div>
      <style>{'@media (min-width:1024px){[data-hide-cards] [data-hero-cards]{visibility:hidden}}'}</style>
    </>
  );
};
