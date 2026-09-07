import React, { useEffect, useRef, useState } from 'react';

/**
 * The studio reel, sitting in the gap at the end of the services grid.
 *
 * Six services fill four columns and then two, which leaves two empty cells on
 * a large screen. This panel spans exactly those two, so the row closes instead
 * of trailing off — and what closes it is the work itself, explaining in half a
 * minute what the six cards above describe in words.
 *
 * It starts on its own, because that is what Otis asked for: a visitor should
 * arrive and see the studio working. Three rules make that safe rather than
 * rude:
 *
 *   1. **Muted to begin with.** Every browser blocks autoplay with sound, so a
 *      film that insists on audio simply never starts. This one starts silent
 *      and offers the narration on a button — one press, no reload.
 *   2. **Still when asked.** prefers-reduced-motion, Save-Data and 2G all mean
 *      the poster frame and a play button instead, matching HeroBackdrop's
 *      rule (see shouldStayStill there — the same test, kept in step).
 *   3. **Cheap.** 2.6 MB, self-hosted next to the hero loop, with a poster so
 *      the frame is painted before a byte of video arrives.
 *
 * The film is the three-product reel: Big Boy Subs, the FinSight dashboard and
 * the Stack Planner, with one narration across all three. It is portrait,
 * because it was cut for a phone, so it sits in its own 9:16 frame beside the
 * copy rather than being stretched into a shape it was never composed for.
 */

/** True when the visitor has asked for less movement or less data. Mirrors
    HeroBackdrop.shouldStayStill — if one changes, change both. */
function shouldStayStill(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType && /(^|\W)(slow-)?2g$/.test(conn.effectiveType)) return true;
  return false;
}

interface StudioReelCardProps {
  onTabChange?: (tab: 'portfolio') => void;
}

export const StudioReelCard: React.FC<StudioReelCardProps> = ({ onTabChange }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (shouldStayStill()) return;
    setPlaying(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playing) return;
    // A rejected play() is a policy decision, not an error: the poster and the
    // button are already on screen, so there is nothing to recover from.
    void video.play().catch(() => undefined);
  }, [playing]);

  const start = (withSound: boolean) => {
    setPlaying(true);
    if (withSound) setMuted(false);
    const video = videoRef.current;
    if (video) {
      video.muted = !withSound;
      void video.play().catch(() => undefined);
    }
  };

  return (
    <div className="md:col-span-2 lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col sm:flex-row">
      {/* The film, in its own portrait frame. */}
      <div className="relative w-full sm:w-[45%] shrink-0 bg-black aspect-[9/16] sm:aspect-auto sm:min-h-[22rem]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/images/meridian-reel-poster.jpg"
          muted={muted}
          loop
          playsInline
          preload="metadata"
          aria-label="Meridian Interface showreel: a restaurant ordering site, a revenue dashboard and the Stack Planner"
        >
          {/* H.264 first: it is the smaller file here and every current browser
              plays it. The VP9 copy is the fallback, matching the hero loop. */}
          <source src="/video/meridian-reel.mp4" type="video/mp4" />
          <source src="/video/meridian-reel.webm" type="video/webm" />
        </video>

        {!playing && (
          <button
            type="button"
            onClick={() => start(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/40 text-white transition-colors hover:bg-slate-950/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Play the studio reel with sound, 31 seconds"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg">
              <span className="material-symbols-outlined text-3xl">play_arrow</span>
            </span>
            <span className="font-display text-xs font-bold uppercase tracking-widest">Play</span>
          </button>
        )}

        {playing && muted && (
          <button
            type="button"
            onClick={() => start(true)}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 text-white backdrop-blur-sm transition-colors hover:bg-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Turn the narration on"
          >
            <span className="material-symbols-outlined text-base leading-none">volume_up</span>
            <span className="font-body text-[11px] font-bold uppercase tracking-wider">Sound on</span>
          </button>
        )}

        {playing && !muted && (
          <button
            type="button"
            onClick={() => {
              setMuted(true);
              if (videoRef.current) videoRef.current.muted = true;
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 text-white backdrop-blur-sm transition-colors hover:bg-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Mute the narration"
          >
            <span className="material-symbols-outlined text-base leading-none">volume_off</span>
            <span className="font-body text-[11px] font-bold uppercase tracking-wider">Mute</span>
          </button>
        )}
      </div>

      {/* What it is, for anyone who reads before they watch. */}
      <div className="flex flex-1 flex-col justify-center gap-3 p-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300">
          <span className="material-symbols-outlined text-base">play_circle</span>
          See It Working
        </div>
        <h3 className="font-display text-lg font-bold text-white">
          Thirty seconds of what we build
        </h3>
        <p className="font-body text-xs leading-relaxed text-slate-300">
          A restaurant ordering site, a revenue dashboard and the Stack Planner — three
          real products, built here, shown running. Narrated; press sound on.
        </p>
        {onTabChange && (
          <button
            onClick={() => onTabChange('portfolio')}
            className="mt-1 inline-flex items-center gap-1 self-start font-body text-xs font-bold uppercase tracking-wider text-white hover:underline"
          >
            See the full portfolio
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        )}
      </div>
    </div>
  );
};
