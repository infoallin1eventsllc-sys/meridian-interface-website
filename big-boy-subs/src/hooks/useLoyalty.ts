import { useState, useEffect } from 'react';

const PUNCHES_STORAGE_KEY = 'bigboy_subs_punches';
const DEFAULT_PUNCHES = 3;

export function useLoyalty() {
  const [punches, setPunches] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(PUNCHES_STORAGE_KEY);
      if (saved !== null) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 0 && val <= 8) return val;
      }
    } catch {
      // Ignore
    }
    return DEFAULT_PUNCHES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(PUNCHES_STORAGE_KEY, punches.toString());
    } catch {
      // Ignore
    }
  }, [punches]);

  const punchSub = () => {
    setPunches((prev) => (prev < 8 ? prev + 1 : 8));
  };

  const resetPunches = () => {
    setPunches(0);
  };

  return {
    punches,
    punchSub,
    resetPunches,
    setPunches,
  };
}
