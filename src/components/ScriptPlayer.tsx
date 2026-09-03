import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { VideoScript } from '../lib/marketing';

/**
 * Plays a video script before there is a video.
 *
 * A short-video draft is six screens of large type, four seconds each. Until a
 * renderer turns that into an MP4, the owner still has to judge it — and a
 * list of six lines is not the same thing as watching them land one after
 * another on a phone. This is the same layout, type, timing and ground the
 * renderer uses, driven by the browser instead. What plays here is what the
 * clip will say; the rendered file only adds motion between screens.
 *
 * Sizes are in container-query units so the phone reads the same at 240px in
 * a card and at 360px on its own. Colours are the brand's, fixed: this is a
 * preview of a rendered asset, and the asset does not have a dark mode.
 */

const SCENE_MS = 4000;
const BRAND = { paper: '#F5F4EF', ink: '#23262B', slate: '#3E4C63', steel: '#4F6D8C', soft: '#5B626C' };

type Scene = { kicker: string; accent?: boolean; text: string };

export function scenesFor(s: VideoScript): Scene[] {
  return [
    { kicker: '', accent: true, text: s.hook },
    ...s.beats.slice(0, 3).map((b, i) => ({ kicker: `${i + 1} of 3`, text: b })),
    { kicker: 'What it costs', accent: true, text: s.price_line },
    { kicker: 'Next step', text: s.cta },
  ];
}

const sizeFor = (text: string) => (text.length > 60 ? '6.7cqw' : text.length > 36 ? '8.1cqw' : '9.6cqw');

export const ScriptPlayer: React.FC<{
  script: VideoScript;
  /** Set {index, nonce} to jump to a scene from outside (the script sheet). */
  jumpTo?: { index: number; nonce: number } | null;
  onScene?: (index: number) => void;
  className?: string;
}> = ({ script, jumpTo, onScene, className = '' }) => {
  const scenes = scenesFor(script);
  const total = scenes.length * SCENE_MS;
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  const last = useRef(0);
  const tRef = useRef(0);
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const scene = Math.min(scenes.length - 1, Math.floor(t / SCENE_MS));
  useEffect(() => { onScene?.(scene); }, [scene, onScene]);

  const stop = useCallback(() => {
    setPlaying(false);
    cancelAnimationFrame(raf.current);
  }, []);

  const tick = useCallback((now: number) => {
    tRef.current += now - last.current;
    last.current = now;
    if (tRef.current >= total) {
      tRef.current = total;
      setT(total);
      setPlaying(false);
      return;
    }
    setT(tRef.current);
    raf.current = requestAnimationFrame(tick);
  }, [total]);

  const play = useCallback(() => {
    if (tRef.current >= total) tRef.current = 0;
    setPlaying(true);
    last.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  }, [tick, total]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  useEffect(() => {
    if (!jumpTo) return;
    tRef.current = jumpTo.index * SCENE_MS;
    setT(tRef.current);
    if (!playing) play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpTo?.nonce]);

  const ended = t >= total;
  const toggle = () => (playing ? stop() : play());

  return (
    <div className={`w-full max-w-[240px] ${className}`}>
      <div
        className="relative aspect-[9/16] overflow-hidden rounded-xl border border-slate-200 select-none"
        style={{ background: BRAND.paper, containerType: 'inline-size' as never }}
      >
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: 'rgba(35,38,43,.12)' }}>
          <div className="h-full" style={{ width: `${(t / total) * 100}%`, background: BRAND.slate }} />
        </div>

        {scenes.map((s, i) => (
          <div
            key={i}
            aria-hidden={i !== scene}
            className="absolute inset-0 flex flex-col justify-center"
            style={{
              padding: '7.4cqw 7.4cqw 0',
              opacity: i === scene ? 1 : 0,
              transition: reduced ? 'none' : 'opacity .45s ease',
              color: BRAND.ink,
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {s.kicker && (
              <p className="m-0 font-bold uppercase" style={{ fontSize: '3.1cqw', letterSpacing: '.12em', color: s.accent ? BRAND.steel : BRAND.soft, marginBottom: '2.6cqw' }}>
                {s.kicker}
              </p>
            )}
            <p className="m-0 font-bold" style={{ fontSize: sizeFor(s.text), lineHeight: 1.08, letterSpacing: '-.02em', textWrap: 'balance' as never }}>
              {s.text}
            </p>
            <div style={{ width: '11cqw', height: '.9cqw', borderRadius: '1cqw', background: BRAND.slate, marginTop: '4cqw' }} />
          </div>
        ))}

        <div className="absolute" style={{ left: '7.4cqw', bottom: '6cqw', color: BRAND.ink, fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p className="m-0 font-bold" style={{ fontSize: '3.5cqw' }}>Meridian Interface</p>
          <p className="m-0" style={{ fontSize: '2.8cqw', color: BRAND.soft, marginTop: '.9cqw' }}>Websites · Apps · Marketing Systems</p>
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause' : ended ? 'Play again' : 'Play'}
          className="absolute inset-0 grid place-items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F6D8C]"
        >
          <span
            className={`material-symbols-outlined grid place-items-center rounded-full text-white transition-opacity ${playing ? 'opacity-0' : 'opacity-100'}`}
            style={{ width: 56, height: 56, fontSize: 30, background: 'rgba(35,38,43,.82)' }}
            aria-hidden="true"
          >
            {ended ? 'replay' : 'play_arrow'}
          </span>
        </button>
      </div>
      <p className="mt-1.5 text-[11px] text-slate-500 text-center">
        {playing ? `Screen ${scene + 1} of ${scenes.length}` : ended ? 'Finished — tap to play again' : 'Tap to play the script as the video shows it'}
      </p>
    </div>
  );
};
