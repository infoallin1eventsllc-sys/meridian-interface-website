import React, { useEffect, useRef, useState } from 'react';
import { shouldStayStill } from '../lib/stillness';

/**
 * The homepage hero's ground: Otis's own Higgsfield clip, three aluminium-rimmed
 * glass panes on dark navy (and a fourth carrying the Meridian lockup), with real screen captures
 * composited into the glass. The large pane is this website; the phone and
 * tablet panes scroll through every product the studio has built, each rising
 * into the next as one continuous scroll; the large pane scrolls down the
 * homepage and back. The 8 s clip plays forward then back, gliding to a stop at
 * each end, so the 20 s loop never jumps or bounces. The clip's glowing threads
 * are erased (and the stubs they lit on the aluminium), nothing Higgsfield printed
 * on the glass (a car interior) shows, each screen sits in its frame like a real
 * display with a thin dark bezel, the fourth pane carries the Meridian lockup, and
 * every screen's scroll is keyed to the camera's travel, resting when it rests.
 *
 * Nothing in the clip is redrawn; only what shows inside the glass is ours, so
 * every screen in it is true. Source and the steps to re-render it (do that
 * whenever the homepage or a demo changes) are in the backend repo at
 * system/media/showcase/.
 *
 * Rules that keep it from costing the page anything:
 *   - Only wide screens (lg and up) show it. Below lg the copy runs the full
 *     width and the demo cards carry the imagery, so the footage would only sit
 *     behind the words: those screens get a quiet navy ground in the video's
 *     own palette, and download neither the video nor its still frame.
 *   - On wide screens, reduced motion, Save-Data and 2G get the 92 KB still
 *     frame instead of the video (shouldStayStill, shared with the studio reel).
 *   - It pauses while scrolled out of view or while the tab is hidden.
 *   - The still frame paints first, so there is never an empty hero while the
 *     video loads, and it stays if the video fails.
 *
 * The panes keep to the right half of the frame; the left side is near-black in
 * the clip itself, which is where the headline sits.
 */

const POSTER = '/images/hero/showcase-poster.webp';
const WIDE = '(min-width: 1024px)';

export const HeroBackdrop: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(WIDE).matches);
  const [still] = useState(shouldStayStill);
  const play = wide && !still;

  // Follow the window across the lg breakpoint.
  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const update = () => setWide(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Play only while the hero is on screen and the tab is visible.
  useEffect(() => {
    const video = videoRef.current, wrap = wrapRef.current;
    if (!play || !video || !wrap) return;
    let onScreen = true;
    const sync = () => {
      if (onScreen && document.visibilityState === 'visible') video.play().catch(() => {});
      else video.pause();
    };
    const io = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync(); }, { threshold: 0.05 });
    io.observe(wrap);
    document.addEventListener('visibilitychange', sync);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, [play]);

  return (
    <div ref={wrapRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#04070e]" aria-hidden="true">
      {!wide && (
        // The video's own palette with nothing in it: near-black, deep navy, a glow on the right.
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 85% 55% at 88% 38%, rgba(34,82,160,0.32), transparent 62%), linear-gradient(165deg, #04070e 0%, #071226 55%, #0b1e3c 100%)' }}
        />
      )}
      {wide && <img src={POSTER} alt="" className="absolute inset-0 w-full h-full object-cover" decoding="async" fetchPriority="high" />}
      {play && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
        >
          <source src="/video/hero-showcase.webm" type="video/webm" />
          <source src="/video/hero-showcase.mp4" type="video/mp4" />
        </video>
      )}
      {/* A light hold behind the headline column; the footage is already dark there. */}
      {wide && (
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(11,17,31,0.55) 0%, rgba(11,17,31,0.25) 38%, rgba(11,17,31,0) 55%)' }}
        />
      )}
    </div>
  );
};
