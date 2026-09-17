import React, { useEffect, useState } from 'react';
import { TabType } from '../types';
import { bucketCount, onBucketChange } from '../lib/bucket';

/**
 * The way back to the saved list, with a count on it.
 *
 * Hidden entirely while the list is empty. A permanent empty bookmark icon in
 * the header is a control that does nothing on nine visits out of ten and
 * teaches people to ignore it; appearing the moment something is saved is also
 * the confirmation that the save worked.
 */
export const SavedListButton: React.FC<{
  onTabChange: (tab: TabType) => void;
  active: boolean;
}> = ({ onTabChange, active }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(bucketCount());
    return onBucketChange((items) => setCount(items.length));
  }, []);

  if (count === 0) return null;

  return (
    <button
      onClick={() => onTabChange('bucket')}
      className={`relative p-2 rounded-full transition-colors active:scale-95 ${
        active ? 'bg-slate-200/70 text-[#0f172a]' : 'text-[#0f172a] hover:bg-slate-200/60'
      }`}
      aria-label={`Your saved list, ${count} item${count === 1 ? '' : 's'}`}
      title="Your saved list"
    >
      <span className="material-symbols-outlined text-xl" aria-hidden="true">bookmarks</span>
      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-blue-600 text-white text-[10px] font-bold tabular-nums">
        {count}
      </span>
    </button>
  );
};
