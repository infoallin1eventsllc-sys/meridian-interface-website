import React, { useState } from 'react';
import { HeroBackdrop } from './HeroBackdrop';

/**
 * PREVIEW BRANCH ONLY (preview/backdrop-samples). Never merge to main.
 *
 * Lets Otis compare the current globe with his Higgsfield clip behind the real
 * hero. Clips are self-hosted in public/backdrop-samples and re-encoded from
 * Higgsfield's HEVC to H.264 so Chrome and Firefox can play them.
 *
 * "Polished" is the same clip graded into the site's navy, with the highlights
 * held back so the mid-clip flash never washes out the headline, a soft glow on
 * the lines, and played forward then backward so the loop has no jump.
 */
interface Sample {
  id: string;
  label: string;
  src?: string;
  poster?: string;
  /** Darkening behind the headline column, as a CSS background. */
  scrim?: string;
}

const SAMPLES: Sample[] = [
  { id: 'current', label: 'Current' },
  {
    id: '2',
    label: 'Video 2',
    src: '/backdrop-samples/video2.mp4',
    poster: '/backdrop-samples/video2.jpg',
    scrim: 'linear-gradient(90deg, rgba(11,17,31,0.9) 0%, rgba(11,17,31,0.55) 50%, rgba(11,17,31,0.1) 100%)',
  },
  {
    id: '2p',
    label: 'Video 2 polished',
    src: '/backdrop-samples/video2-polished.mp4',
    poster: '/backdrop-samples/video2-polished.jpg',
    /* Holds at 75% across the text column, then lets go over the gap so the
       square's lines fade out before they reach any words. */
    scrim: 'linear-gradient(90deg, rgba(11,17,31,0.82) 0%, rgba(11,17,31,0.75) 42%, rgba(11,17,31,0.2) 62%, rgba(11,17,31,0) 80%)',
  },
];

const DEFAULT_ID = '2p';

/* On wide screens the clip slides right so its square settles behind the three
   demo cards and frames them, instead of sitting where the headline ends. The
   left edge feathers into the hero's navy so the shift never shows as a seam. */
const FRAME = 'lg:left-[20%] lg:[mask-image:linear-gradient(90deg,transparent,black_14%)]';

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

  return (
    <>
      {sample?.src ? (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#0B111F]">
          {still ? (
            <img className={`${FRAME} absolute inset-0 w-full h-full object-cover`} src={sample.poster} alt="" />
          ) : (
            <video
              key={sample.src}
              className={`${FRAME} absolute inset-0 w-full h-full object-cover`}
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
        </div>
      ) : (
        <HeroBackdrop />
      )}

      <div
        role="radiogroup"
        aria-label="Backdrop sample"
        className="fixed left-1/2 -translate-x-1/2 top-[76px] md:top-auto md:bottom-6 z-[60] flex gap-1 rounded-full bg-slate-900/90 backdrop-blur p-1 ring-1 ring-white/15 shadow-xl"
      >
        {SAMPLES.map((s) => (
          <button
            key={s.id}
            role="radio"
            aria-checked={choice === s.id}
            onClick={() => setChoice(s.id)}
            className={`px-3 min-[400px]:px-4 py-2 rounded-full font-body text-[11px] min-[400px]:text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
              choice === s.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </>
  );
};
