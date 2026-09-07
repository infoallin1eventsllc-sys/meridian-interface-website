import React, { useState } from 'react';
import { REEL } from '../lib/reel';

/**
 * The reel player, in one place.
 *
 * Used by the services-page showreel and by the portfolio's tech stack entry,
 * so the film behaves identically wherever it appears and there is one thing to
 * change when the cut changes.
 *
 * Two rules it exists to keep:
 *   1. The <video> element is not mounted until the visitor presses play, so a
 *      browser cannot decide to buffer twelve megabytes ahead of a click on a
 *      metered connection.
 *   2. The frame is reserved at 16:9 before anything loads, so the page never
 *      jumps when the player appears.
 *
 * The idle state is the reel's own ink ground and grid drawn in CSS, so no
 * poster image has to ship or be kept in step with the film.
 */

interface ReelPlayerProps {
  /** Which cut to play. Defaults to the landscape web cut. */
  src?: string;
  /** What the button announces to a screen reader. */
  label?: string;
  /** Caption under the frame. Omitted entirely when not given. */
  caption?: React.ReactNode;
}

export const ReelPlayer: React.FC<ReelPlayerProps> = ({
  src = REEL.landscape,
  label = 'Play the reel',
  caption,
}) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-[#0f172a] shadow-sm">
        {playing ? (
          <video
            className="absolute inset-0 h-full w-full"
            src={src}
            controls
            autoPlay
            playsInline
            preload="metadata"
          >
            Your browser cannot play this video. <a href={src}>Download it instead.</a>
          </video>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-4 text-white transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
            aria-label={`${label}, ${REEL.seconds} seconds`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'linear-gradient(#93C5FD 1px, transparent 1px), linear-gradient(90deg, #93C5FD 1px, transparent 1px)',
                backgroundSize: '80px 80px',
              }}
            />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-3xl">play_arrow</span>
            </span>
            <span className="relative font-display text-sm font-bold tracking-wide">
              {label}
            </span>
            <span className="relative font-body text-xs text-slate-300">
              {REEL.seconds} seconds
            </span>
          </button>
        )}
      </div>

      {caption && (
        <p className="mt-3 text-center font-body text-xs text-slate-500">{caption}</p>
      )}
    </div>
  );
};
