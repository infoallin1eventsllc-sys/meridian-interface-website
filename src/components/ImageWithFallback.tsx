import React, { useCallback, useRef, useState } from 'react';

/**
 * An image that fails honestly.
 *
 * Every image in this app used to fall back to one hard-coded Unsplash photo —
 * the dashboards shot. So a Web Design card whose photo failed rendered a
 * dashboard screenshot under a "Custom Web Design & Development" heading, and a
 * Logo & Brand portfolio piece rendered the same dashboard. Wrong content is a
 * worse failure than no content: a visitor cannot tell it went wrong, they just
 * conclude the studio shipped a mismatched page.
 *
 * The fallback was also itself an Unsplash URL, so in the one situation that
 * actually happens — Unsplash unreachable, rate limited, or blocked by an
 * extension — the fallback failed too. It could only ever produce a wrong
 * image, never a working one.
 *
 * This renders a branded panel instead: no network, no other service's
 * photograph, and it reads as designed rather than broken.
 */

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  /** Material symbol name shown on the fallback panel. */
  icon?: string;
  /** Short label shown on the fallback panel — usually the item's category. */
  label?: string;
  /**
   * Frame the picture instead of cropping it.
   *
   * The owner swaps tile images from Photo Control, and an upload is whatever
   * shape his file was — a tall phone screenshot in a wide tile, say. Plain
   * `object-cover` then shows one slice of it (the top of a screenshot, the
   * middle of a logo) and hides the rest. With `frame`, a picture whose shape
   * roughly matches the tile still fills it edge to edge; one that does not is
   * shown whole, sharp and centred, over a soft blurred copy of itself so the
   * tile never has dead space or a hard crop. Every upload comes into frame.
   */
  frame?: boolean;
}

/** How far apart two aspect ratios can be before covering would crop away real content. */
const COVER_TOLERANCE = 0.18;

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  icon = 'image',
  label,
  frame = false,
}) => {
  const [failed, setFailed] = useState(false);

  // A new src is a new attempt — otherwise swapping images (the owner's Photo
  // Control does exactly that) would stay stuck on the fallback forever.
  const [lastSrc, setLastSrc] = useState(src);
  if (src !== lastSrc) {
    setLastSrc(src);
    setFailed(false);
  }

  // Frame mode decides cover-vs-contain from the real shapes, once loaded.
  const box = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<'cover' | 'contain'>('cover');
  const measure = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const el = box.current;
    if (!img.naturalWidth || !img.naturalHeight || !el || !el.clientWidth || !el.clientHeight) return;
    const image = img.naturalWidth / img.naturalHeight;
    const tile = el.clientWidth / el.clientHeight;
    setFit(Math.abs(image - tile) / tile <= COVER_TOLERANCE ? 'cover' : 'contain');
  }, []);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-800 via-slate-900 to-[#0f172a] text-slate-400`}
      >
        <span className="material-symbols-outlined text-3xl text-blue-400/70" aria-hidden="true">
          {icon}
        </span>
        {label && (
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 px-4 text-center">
            {label}
          </span>
        )}
      </div>
    );
  }

  if (frame) {
    // The caller's classes describe the tile (size, hover transform, opacity);
    // `object-cover` in them belongs to the picture, so it moves inside.
    const shell = className.replace(/\bobject-(cover|contain|center|top|bottom)\b/g, '').trim();
    return (
      <div ref={box} className={`relative overflow-hidden ${shell}`}>
        {fit === 'contain' && (
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-80"
          />
        )}
        <img
          src={src}
          alt={alt}
          onLoad={measure}
          onError={() => setFailed(true)}
          className={`absolute inset-0 w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
