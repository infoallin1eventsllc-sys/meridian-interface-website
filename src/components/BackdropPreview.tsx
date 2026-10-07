import React, { useState } from 'react';
import { HeroBackdrop } from './HeroBackdrop';

/**
 * PREVIEW BRANCH ONLY (preview/backdrop-samples). Never merge to main.
 *
 * Lets Otis compare the current globe with his Higgsfield clips behind the real
 * hero. The clips are self-hosted in public/backdrop-samples, re-encoded from
 * Higgsfield's HEVC to H.264 so Chrome and Firefox can play them.
 */
const SAMPLES: { id: string; label: string; src?: string; poster?: string }[] = [
  { id: 'current', label: 'Current' },
  { id: '2', label: 'Video 2', src: '/backdrop-samples/video2.mp4', poster: '/backdrop-samples/video2.jpg' },
];

function initialChoice(): string {
  if (typeof window === 'undefined') return SAMPLES[1].id;
  const q = new URLSearchParams(window.location.search).get('backdrop');
  return SAMPLES.some((s) => s.id === q) ? (q as string) : SAMPLES[1].id;
}

export const BackdropPreview: React.FC = () => {
  const [choice, setChoice] = useState(initialChoice);
  const sample = SAMPLES.find((s) => s.id === choice);

  return (
    <>
      {sample?.src ? (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#0B111F]">
          <video
            key={sample.src}
            className="absolute inset-0 w-full h-full object-cover"
            src={sample.src}
            poster={sample.poster}
            autoPlay
            muted
            loop
            playsInline
          />
          {/* Darkens the left side so the headline stays readable over the footage. */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B111F]/90 via-[#0B111F]/55 to-[#0B111F]/10" />
        </div>
      ) : (
        <HeroBackdrop />
      )}

      <div
        role="radiogroup"
        aria-label="Backdrop sample"
        className="fixed left-1/2 -translate-x-1/2 bottom-24 md:bottom-6 z-[60] flex gap-1 rounded-full bg-slate-900/90 backdrop-blur p-1 ring-1 ring-white/15 shadow-xl"
      >
        {SAMPLES.map((s) => (
          <button
            key={s.id}
            role="radio"
            aria-checked={choice === s.id}
            onClick={() => setChoice(s.id)}
            className={`px-4 py-2 rounded-full font-body text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
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
