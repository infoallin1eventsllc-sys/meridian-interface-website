import React, { useState } from 'react';

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
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  icon = 'image',
  label,
}) => {
  const [failed, setFailed] = useState(false);

  // A new src is a new attempt — otherwise swapping images (the owner's Photo
  // Control does exactly that) would stay stuck on the fallback forever.
  const [lastSrc, setLastSrc] = useState(src);
  if (src !== lastSrc) {
    setLastSrc(src);
    setFailed(false);
  }

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

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
