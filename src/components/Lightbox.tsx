import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Full-screen view for a picture that is too detailed to read in a tile.
 *
 * The portfolio shows screenshots of real products — dashboards, consoles,
 * banking interfaces. At tile size a visitor cannot read a single label, so the
 * picture proves nothing: it says "we made something" without saying what. This
 * opens the whole screen, fitted so nothing is cropped, which is the difference
 * between a decorative image and evidence.
 *
 * Behaviour a viewer expects and therefore gets: Escape closes, clicking the
 * backdrop closes, arrow keys move through the set, and focus returns to the
 * thumbnail that opened it so keyboard users are not dropped at the top of the
 * page.
 */

export interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  /** Index to show, or null when closed. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ items, index, onClose, onIndexChange }) => {
  const open = index !== null && index >= 0 && index < items.length;
  const opener = useRef<Element | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // Remember what had focus, lock the page, and hand focus to the close button.
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  const go = useCallback(
    (delta: number) => {
      if (index === null || items.length < 2) return;
      onIndexChange((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, go]);

  if (!open || index === null) return null;
  const item = items[index];
  const many = items.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.caption || item.alt}
      className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 text-white shrink-0">
        <p className="font-body text-xs sm:text-sm text-slate-300 truncate">
          {item.caption || item.alt}
          {many && <span className="ml-2 text-slate-500 tabular-nums">{index + 1} / {items.length}</span>}
        </p>
        <button
          ref={closeBtn}
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Close"
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white transition-colors"
        >
          <span className="material-symbols-outlined text-base leading-none" aria-hidden="true">close</span>
          Close
        </button>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center px-2 sm:px-6 pb-4 gap-2 sm:gap-4">
        {many && (
          <NavButton label="Previous" icon="chevron_left" onClick={(e) => { e.stopPropagation(); go(-1); }} />
        )}
        <img
          src={item.src}
          alt={item.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg shadow-2xl bg-white"
        />
        {many && (
          <NavButton label="Next" icon="chevron_right" onClick={(e) => { e.stopPropagation(); go(1); }} />
        )}
      </div>
    </div>
  );
};

const NavButton: React.FC<{ label: string; icon: string; onClick: (e: React.MouseEvent) => void }> = ({ label, icon, onClick }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
  >
    <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
  </button>
);

/** Wiring for a group of pictures: what to spread on the trigger, and the state. */
export function useLightbox(items: LightboxItem[]) {
  const [index, setIndex] = useState<number | null>(null);
  return {
    index,
    open: (i: number) => setIndex(i),
    close: () => setIndex(null),
    setIndex,
    /** Spread onto the element that shows picture `i`. */
    triggerProps: (i: number) => ({
      onClick: () => setIndex(i),
      role: 'button' as const,
      tabIndex: 0,
      'aria-label': `View ${items[i]?.caption || items[i]?.alt || 'image'} full screen`,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIndex(i); }
      },
    }),
  };
}
