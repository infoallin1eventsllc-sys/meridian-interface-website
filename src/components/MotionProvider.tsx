import React from 'react';
import { LazyMotion, domAnimation } from 'motion/react';

/**
 * Loads Motion's animation features on demand.
 *
 * Importing the full `motion` component pulls every feature into the main
 * bundle whether a visitor ever reaches an animated view or not — measured at
 * +45kB gzipped on this site, for one staggered grid. `LazyMotion` with a
 * dynamic loader keeps that out of the first paint and fetches it in the
 * background instead, so the homepage stays as light as it was.
 *
 * `strict` makes the trade-off enforceable: it throws if any component reaches
 * for the heavyweight `motion` import, so the saving cannot be undone by
 * accident six months from now.
 */
export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LazyMotion features={domAnimation} strict>
    {children}
  </LazyMotion>
);
