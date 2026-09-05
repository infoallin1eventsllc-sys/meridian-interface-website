import { useState, useEffect } from 'react';

const FAVORITES_STORAGE_KEY = 'bigboy_subs_favorites';
const DEFAULT_FAVORITES = ['sub-1'];

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
    return DEFAULT_FAVORITES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore
    }
  }, [favorites]);

  const toggleFavorite = (subId: string) => {
    setFavorites((prev) =>
      prev.includes(subId) ? prev.filter((id) => id !== subId) : [...prev, subId]
    );
  };

  const isFavorite = (subId: string) => favorites.includes(subId);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}
