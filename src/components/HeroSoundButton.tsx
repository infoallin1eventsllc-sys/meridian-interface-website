import React, { useSyncExternalStore } from 'react';
import { heroSound } from '../lib/heroSound';

/**
 * The hero film's sound switch. The film has a soundtrack but plays silently
 * until this is tapped (see lib/heroSound). It only appears once a film is
 * really playing, so visitors on the still frame are not offered sound that
 * does not exist.
 *
 * The icons are drawn here rather than taken from the icon font, which is a
 * subset and does not carry speaker glyphs.
 */
export const HeroSoundButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const on = useSyncExternalStore(heroSound.subscribe, heroSound.isOn, () => false);
  const available = useSyncExternalStore(heroSound.subscribe, heroSound.isAvailable, () => false);
  if (!available) return null;

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => heroSound.set(!on)}
      className={`inline-flex items-center gap-2 min-h-11 pl-3.5 pr-4 rounded-full border font-body font-bold text-[11px] uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060d1d] ${
        on
          ? 'bg-white text-slate-900 border-white hover:bg-slate-100'
          : 'bg-white/5 text-slate-200 border-white/20 hover:bg-white/10 hover:border-white/40'
      } ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" fill="currentColor" stroke="none" />
        {on ? (
          <>
            <path d="M15.5 9a4.2 4.2 0 0 1 0 6" />
            <path d="M18.2 6.5a7.8 7.8 0 0 1 0 11" />
          </>
        ) : (
          <path d="M16 9.5l5 5m0-5l-5 5" />
        )}
      </svg>
      {on ? 'Sound on' : 'Play sound'}
    </button>
  );
};
