import React, { useEffect, useRef, useState } from 'react';
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
 * A film with a vertical cut (`portraitSrc`) plays it on a phone held upright, in a
 * tall frame, so the phone's full screen fills it top to bottom instead of showing a
 * small sideways picture. Turned sideways, or on a tablet or computer, the wide cut plays.
 *
 * The idle state is the reel's own ink ground and grid drawn in CSS, so no
 * poster image has to ship or be kept in step with the film. A caller that
 * already has a relevant picture — the services page shows a different one per
 * service — can pass it as `poster` and it becomes the play surface, so that
 * picture is not lost just because a video moved in. If it fails to load the
 * CSS ground shows through, which is why it is a background and not a swap.
 *
 * A caller showing a software demo can pass `browserAddress`: on a computer or tablet the
 * film then sits in a browser window with that address in its bar, so it reads as the
 * product running. Phones get the same rounded, shadowed frame without the bar, so the
 * film keeps every pixel of a small screen.
 */

interface ReelPlayerProps {
  /** Which cut to play. Defaults to the copy served from this site, which is
      measured to carry unbroken sound; the bucket cut goes quiet a third of
      the way in, so it is not something to fall back to by accident. */
  src?: string;
  /** What the button announces to a screen reader. */
  label?: string;
  /** Caption under the frame. Omitted entirely when not given. */
  caption?: React.ReactNode;
  /** A still to sit behind the play button instead of the plain CSS ground. */
  poster?: string;
  /** A WebM of the same film, for browsers with no H.264 decoder. */
  webm?: string;
  /** Length announced on the play surface; the studio reel's by default. */
  seconds?: number;
  /** Start playing on mount, for a player opened by a Watch click (that click is the user gesture). */
  autoStart?: boolean;
  /** A vertical (9:16) cut of the same film, for phones held upright. */
  portraitSrc?: string;
  /** Web address shown in a browser-window bar above the film on computers and tablets. */
  browserAddress?: string;
}

/** A phone held upright: the only case where the vertical cut fits better than the wide one. */
const UPRIGHT_PHONE = '(orientation: portrait) and (max-width: 767px)';
const isUprightPhone = () => typeof window !== 'undefined' && !!window.matchMedia?.(UPRIGHT_PHONE).matches;

export const ReelPlayer: React.FC<ReelPlayerProps> = ({
  src = REEL.local,
  label = 'Play the reel',
  caption,
  poster,
  webm,
  seconds = REEL.seconds,
  autoStart = false,
  portraitSrc,
  browserAddress,
}) => {
  const [playing, setPlaying] = useState(autoStart);
  const [posterFailed, setPosterFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [vertical, setVertical] = useState(() => !!portraitSrc && isUprightPhone());
  const resumeAt = useRef<number | null>(null);
  const film = vertical && portraitSrc ? portraitSrc : src;

  // Turning the phone while the film plays swaps cuts at the same moment. Not in full
  // screen, though: there the phone's own player turns the picture itself.
  useEffect(() => {
    if (!portraitSrc || typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(UPRIGHT_PHONE);
    const onChange = () => {
      const v = videoRef.current as (HTMLVideoElement & { webkitDisplayingFullscreen?: boolean }) | null;
      if (v && (document.fullscreenElement || v.webkitDisplayingFullscreen)) return;
      if (v && !v.paused) resumeAt.current = v.currentTime;
      setVertical(mq.matches);
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [portraitSrc]);

  // The `autoPlay` attribute alone is unreliable for a film with sound: it was
  // mounting paused at 0:00, so the visitor had to press play a second time.
  // Calling play() here is permitted because the click that mounted this IS
  // the user gesture. A rejection is a browser policy decision, not an error —
  // the controls are right there, so there is nothing to recover from.
  useEffect(() => {
    if (!playing) return;
    void videoRef.current?.play().catch(() => undefined);
  }, [playing]);

  return (
    <div>
      <div
        className={`${playing && vertical ? 'mx-auto' : ''} w-full overflow-hidden rounded-xl border border-slate-200 bg-[#0f172a] ${browserAddress ? 'shadow-xl shadow-slate-900/10' : 'shadow-sm'}`}
        style={playing && vertical ? { maxWidth: 'calc(78vh * 9 / 16)' } : undefined}
      >
        {/* Shown only where there is room for it: not on a phone, upright or sideways. */}
        {browserAddress && (
          <div
            aria-hidden="true"
            className="hidden items-center gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2 [@media(min-width:768px)_and_(min-height:501px)]:flex"
          >
            <span className="flex shrink-0 gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            </span>
            <span className="mx-auto flex min-w-0 max-w-sm flex-1 items-center justify-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-0.5 font-body text-xs text-slate-500">
              <span className="material-symbols-outlined shrink-0 text-[13px] leading-none" aria-hidden="true">lock</span>
              <span className="truncate">{browserAddress}</span>
            </span>
            <span className="w-[42px] shrink-0" />
          </div>
        )}
        <div
          className={`relative ${playing && vertical ? '' : 'aspect-video'} w-full`}
          style={playing && vertical ? { aspectRatio: '9 / 16' } : undefined}
        >
          {playing ? (
            <video
              key={film}
              ref={videoRef}
              className="absolute inset-0 h-full w-full"
              {...(webm && !vertical ? {} : { src: film })}
              onLoadedMetadata={(e) => {
                const t = resumeAt.current;
                if (t == null) return;
                resumeAt.current = null;
                e.currentTarget.currentTime = t;
                void e.currentTarget.play().catch(() => undefined);
              }}
              controls
              autoPlay
              playsInline
              preload="metadata"
            >
              {/* mp4 first on purpose: the devices that can play both decode
                  H.264 in hardware. The WebM is the safety net for the ones that
                  cannot play it at all, which would otherwise see a dead frame. */}
              {webm && !vertical && <source src={src} type="video/mp4" />}
              {webm && !vertical && <source src={webm} type="video/webm" />}
              Your browser cannot play this video. <a href={film}>Download it instead.</a>
            </video>
          ) : (
            <button
              type="button"
              onClick={() => {
                setVertical(!!portraitSrc && isUprightPhone());
                setPlaying(true);
              }}
              className="group absolute inset-0 flex flex-col items-center justify-center gap-4 text-white transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
              aria-label={`${label}, ${seconds} seconds`}
            >
              {poster && !posterFailed && (
                <>
                  <img
                    src={poster}
                    alt=""
                    aria-hidden="true"
                    onError={() => setPosterFailed(true)}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  />
                  {/* Dimmed, or white text on a pale product shot disappears. */}
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-slate-950/55" />
                </>
              )}
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
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">play_arrow</span>
              </span>
              <span className="relative font-display text-sm font-bold tracking-wide">
                {label}
              </span>
              <span className="relative font-body text-xs text-slate-300">
                {seconds} seconds
              </span>
            </button>
          )}
        </div>
      </div>

      {caption && (
        <p className="mt-3 text-center font-body text-xs text-slate-500">{caption}</p>
      )}
    </div>
  );
};
