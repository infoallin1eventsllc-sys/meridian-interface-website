import React, { useEffect, useState } from 'react';
import { HERO_GROUND, HeroLaptopFilm } from './HeroLaptopFilm';

/**
 * The homepage hero's ground: one flat navy at every size, and on wide screens
 * (lg and up) the laptop film standing on it, centred on the right-hand column
 * of the hero grid and 115% of the hero's height, so the opened laptop nearly
 * fills the hero from top to bottom without ever being cropped.
 *
 * The numbers below describe the grid in HomeView: max 1280 px wide with 48 px
 * of side padding and columns of 1fr / 1.08fr with a 48 px gap. Change the grid
 * and they need changing with it.
 *
 * Below lg the film is not here: it sits in the page under the buttons
 * (HomeView), so this renders the ground alone.
 */

const WIDE = '(min-width: 1024px)';

// The grid's content width, its right-hand column's centre, and the film's
// height: 115% of the hero, but never so tall that the film (22:27) grows more
// than about an eighth wider than that column and runs under the headline.
const GRID = 'min(1280px, 100vw - 96px)';
const COLUMN_CENTRE = 'min(74.04% - 10.6px, 50% + 320px)';
const FILM_HEIGHT = `min(115%, calc((${GRID} - 48px) * 0.7137))`;

export const HeroBackdrop: React.FC = () => {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(WIDE).matches);

  // Follow the window across the lg breakpoint.
  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const update = () => setWide(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ backgroundColor: HERO_GROUND }} aria-hidden="true">
      {wide && (
        <HeroLaptopFilm
          size="wide"
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: COLUMN_CENTRE, height: FILM_HEIGHT }}
        />
      )}
    </div>
  );
};
