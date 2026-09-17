import React, { useEffect, useState } from 'react';
import { isSaved, toggleSaved, onBucketChange, type SavedItem } from '../lib/bucket';

/**
 * "Save this" — the one control that puts something in the client's list.
 *
 * It is deliberately not called "Add to cart". There is no cart, no total and
 * no checkout: the list is a shortlist of what they want, which they send to
 * the studio to be quoted. Naming it after a shop would promise a price on the
 * next screen, and there isn't one.
 *
 * It subscribes to the store rather than keeping its own copy, so a piece
 * saved from the portfolio grid shows as saved in the detail panel too,
 * without either one knowing about the other.
 */
export const SaveToListButton: React.FC<{
  item: Omit<SavedItem, 'addedAt'>;
  /** `full` on a detail panel, `compact` on a card corner. */
  variant?: 'full' | 'compact';
  className?: string;
}> = ({ item, variant = 'full', className = '' }) => {
  const [saved, setSaved] = useState(false);

  // Read on mount rather than in useState: localStorage is not available
  // during a server render or a thumbnail capture, and this keeps the first
  // paint identical either way.
  useEffect(() => {
    setSaved(isSaved(item.id));
    return onBucketChange((items) => setSaved(items.some((i) => i.id === item.id)));
  }, [item.id]);

  const click = (e: React.MouseEvent) => {
    e.stopPropagation(); // a card's own onClick opens the detail panel
    setSaved(toggleSaved(item));
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={click}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${item.title} from your list` : `Save ${item.title} to your list`}
        title={saved ? 'Saved — click to remove' : 'Save to your list'}
        className={`w-9 h-9 grid place-items-center rounded-full backdrop-blur transition-colors shadow-sm ${
          saved
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-white/90 text-slate-700 hover:bg-white hover:text-blue-600'
        } ${className}`}
      >
        <span className="material-symbols-outlined text-lg leading-none" aria-hidden="true">
          {saved ? 'bookmark_added' : 'bookmark_add'}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={click}
      aria-pressed={saved}
      className={`px-5 py-3 font-body font-bold text-xs uppercase tracking-widest rounded-lg border transition-all flex items-center justify-center gap-2 ${
        saved
          ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
          : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
      } ${className}`}
    >
      <span className="material-symbols-outlined text-lg" aria-hidden="true">
        {saved ? 'bookmark_added' : 'bookmark_add'}
      </span>
      {saved ? 'Saved to your list' : 'Save to your list'}
    </button>
  );
};
