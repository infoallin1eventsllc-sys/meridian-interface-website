import React, { useEffect, useRef, useState } from 'react';

/**
 * Motion layer behind the homepage hero.
 *
 * This is real footage, not a simulation. A 16-second cinematic loop rendered
 * from the studio's own Earth still: a slow dolly with an arc across the limb,
 * a breathing atmospheric bloom, film grain and a vignette. Every animated
 * value in the render is a cosine over the clip length, so the last frame is
 * the first frame and the loop point is invisible.
 *
 * An earlier version drew a canvas starfield instead. It was tuned to sit just
 * under the threshold of noticing, which is the right instinct for an operations
 * screen and the wrong one for a studio's front door — the brief was production
 * value, and simulated particles do not carry it. The footage does, and it
 * already contains its own stars, so nothing is drawn on top of it.
 *
 * The poster frame is what actually paints first, so the largest contentful
 * paint never waits on video. If the clip is slow, blocked, declined, or the
 * visitor is on a metered connection, the poster simply stays — and the hero
 * looks composed either way rather than empty.
 */

interface HeroBackdropProps {
  /** Resolved still image (owner-swappable via Photo Control). */
  imageUrl: string;
}

/** True when the visitor has asked for less movement or less data. */
function shouldStayStill(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  // Save-Data is a direct request not to spend the visitor's bandwidth on decoration.
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType && /(^|\W)(slow-)?2g$/.test(conn.effectiveType)) return true;
  return false;
}

export const HeroBackdrop: React.FC<HeroBackdropProps> = ({ imageUrl }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Start still on every render, then opt in. Server-side and first paint both
  // get the poster, which is the cheap, correct thing to show.
  const [playFootage, setPlayFootage] = useState(false);

  useEffect(() => {
    if (shouldStayStill()) return;
    setPlayFootage(true);

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPrefChange = () => setPlayFootage(!media.matches);
    media.addEventListener('change', onPrefChange);
    return () => media.removeEventListener('change', onPrefChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playFootage) return;

    // Autoplay policies vary; a rejected play() is normal, not an error. The
    // poster is already on screen, so there is nothing to recover from.
    void video.play().catch(() => {});

    // Decoding video in a tab nobody is looking at is pure battery drain.
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') video.pause();
      else void video.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [playFootage]);

  return (
    <div className="hero-backdrop absolute inset-0 z-0 pointer-events-none">
      {/* The still. Always painted, and the only thing shown when the visitor
          asked for less motion or less data. Owner-swappable. */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />

      {playFootage && (
        <video
          ref={videoRef}
          className="hero-video absolute inset-0 h-full w-full object-cover"
          poster="/images/earth-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/video/earth-loop.webm" type="video/webm" />
          <source src="/video/earth-loop.mp4" type="video/mp4" />
        </video>
      )}

      {/* Legibility scrims, unchanged: dark where the copy sits, clearing to
          reveal the scene. These stay above the footage so no frame of the loop
          can wash the headline out. */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/70 via-transparent to-[#0f172a]/25" />
    </div>
  );
};
