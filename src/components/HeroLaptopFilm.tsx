import React, { useEffect, useRef, useState } from 'react';
import { shouldStayStill } from '../lib/stillness';
import { heroSound } from '../lib/heroSound';

/**
 * The homepage hero's picture: the Agent Dashboard laptop film. A laptop rests,
 * lifts apart into its layers, the camera glides through them past four labels,
 * and it closes and settles again. 15.6 s, one continuous loop with no cut at
 * the seam: the closing frame eases back to the exact size and place of the
 * opening one before the film starts over.
 *
 * Made from Otis's Higgsfield "Monospace Callouts" ad (no credits spent on this
 * version): slowed to about three-quarter speed with in-between frames, its
 * black stage keyed out, and the laptop set on this hero's own navy with a
 * soft blue pool of light behind it. Source and the steps to re-render it are
 * in the backend repo at system/media/hero-laptop/.
 *
 * It is a portrait clip, not a full-bleed backdrop, so no screen shape can
 * crop the laptop: wide screens centre it on the right-hand column at 115% of
 * the hero's height (HeroBackdrop); phones and tablets show it under the
 * buttons (HomeView). The clip's edges are the same flat navy as the hero
 * (HERO_GROUND) and are feathered by the .hero-film mask in index.css, so
 * there is no box around it. If the ground colour changes, re-render the film.
 *
 * What it costs the page:
 *   - The still frame is the film's first frame and paints first, so there is
 *     never an empty hero, and no jump when the video starts.
 *   - Phones get a smaller encode, requested only after the page has loaded.
 *   - Reduced motion, Save-Data and 2G get the still frame and no video
 *     (shouldStayStill, shared with the studio reel).
 *   - It pauses while scrolled out of view or while the tab is hidden.
 *
 * Sound: the film carries the ad's own Higgsfield audio, slowed to the film's
 * speed and cleaned (its pops and clacks removed, a soft way in and a long
 * ring-out, so each loop starts and ends in silence and the seam is a breath,
 * not a cut). It always starts muted. HeroSoundButton turns it on through
 * lib/heroSound; scrolling the hero away fades the sound and pauses the film.
 */

export const HERO_GROUND = '#060d1d';

const SOUND_LEVEL = 0.85;

// Every path is written out in full so the pre-launch check can confirm the file exists.
const FILM = {
  wide: { poster: '/images/hero/laptop-poster.webp', webm: '/video/hero-laptop.webm', mp4: '/video/hero-laptop.mp4', w: 880, h: 1080 },
  small: { poster: '/images/hero/laptop-poster-sm.webp', webm: '/video/hero-laptop-sm.webm', mp4: '/video/hero-laptop-sm.mp4', w: 660, h: 810 },
} as const;

export const HeroLaptopFilm: React.FC<{ size: keyof typeof FILM; className?: string; style?: React.CSSProperties }> = ({ size, className = '', style }) => {
  const film = FILM[size];
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [still] = useState(shouldStayStill);
  // Wide screens ask for the film straight away; small ones wait for the page.
  const [ready, setReady] = useState(() => !still && (size === 'wide' || (typeof document !== 'undefined' && document.readyState === 'complete')));
  const [showing, setShowing] = useState(false); // first frame decoded: fade it in over the still

  useEffect(() => {
    if (still || ready) return;
    const done = () => setReady(true);
    window.addEventListener('load', done, { once: true });
    return () => window.removeEventListener('load', done);
  }, [still, ready]);

  // Volume is always ramped, never switched. The sound is bass-heavy, and a
  // deep wave cut off or started mid-swing is heard as a pop. (iPhones ignore
  // page-set volume, so there the change is immediate, as on any site.)
  const rampRef = useRef<number | null>(null);
  const rampVolume = (video: HTMLVideoElement, to: number, ms: number, then?: () => void) => {
    if (rampRef.current !== null) cancelAnimationFrame(rampRef.current);
    const from = video.volume, t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      video.volume = Math.min(1, Math.max(0, from + (to - from) * k * k * (3 - 2 * k)));
      if (k < 1) rampRef.current = requestAnimationFrame(step);
      else { rampRef.current = null; then?.(); }
    };
    rampRef.current = requestAnimationFrame(step);
  };
  useEffect(() => () => { if (rampRef.current !== null) cancelAnimationFrame(rampRef.current); }, []);

  // Play only while the film is on screen and the tab is visible. With sound
  // on, it fades out before pausing and fades back in on return.
  useEffect(() => {
    const video = videoRef.current, wrap = wrapRef.current;
    if (!ready || !video || !wrap) return;
    let onScreen = true;
    const sync = () => {
      const show = onScreen && document.visibilityState === 'visible';
      const audible = heroSound.isOn() && !video.muted;
      if (show) {
        if (audible && video.paused) video.volume = 0;
        video.play().catch(() => {});
        if (audible) rampVolume(video, SOUND_LEVEL, 500);
      } else if (audible && document.visibilityState === 'visible') {
        rampVolume(video, 0, 250, () => video.pause());
      } else {
        video.pause();
      }
    };
    const io = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync(); }, { threshold: 0.05 });
    io.observe(wrap);
    document.addEventListener('visibilitychange', sync);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, [ready]);

  // Tell the button a film is playing, and follow it: muted until asked.
  useEffect(() => {
    if (!showing) return;
    heroSound.setAvailable(true);
    return () => heroSound.setAvailable(false);
  }, [showing]);

  useEffect(() => {
    const apply = () => {
      const video = videoRef.current;
      if (!video) return;
      if (heroSound.isOn()) {
        if (video.muted) { video.volume = 0; video.muted = false; }
        rampVolume(video, SOUND_LEVEL, 700);   // also turns a fade-out around if tapped twice quickly
        // A browser that still refuses sound pauses the film: put it back as it was.
        video.play().catch(() => { video.muted = true; heroSound.set(false); video.play().catch(() => {}); });
      } else if (!video.muted) {
        rampVolume(video, 0, 300, () => { video.muted = true; });
      }
    };
    apply();
    return heroSound.subscribe(apply);
  }, [ready]);

  return (
    <div ref={wrapRef} aria-hidden="true" className={`hero-film pointer-events-none aspect-[22/27] ${className}`} style={style}>
      <img
        src={film.poster}
        alt=""
        width={film.w}
        height={film.h}
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {ready && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${showing ? 'opacity-100' : 'opacity-0'}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          onPlaying={() => setShowing(true)}
        >
          <source src={film.webm} type="video/webm" />
          <source src={film.mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
};
