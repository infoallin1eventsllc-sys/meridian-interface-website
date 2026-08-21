/**
 * The studio's motion vocabulary.
 *
 * Motion (formerly Framer Motion) is installed, but importing it everywhere is
 * how a site ends up with six different easings and a fade on elements nobody
 * was looking at. These are the only transitions the site uses, so a change
 * here changes the whole feel rather than one component.
 *
 * Every variant respects `prefers-reduced-motion` through `useMeridianMotion`
 * below: a visitor who has asked their operating system to stop moving things
 * gets the finished state immediately, not a slower version of the animation.
 */
import { m as lightMotion, useReducedMotion } from 'motion/react';
import type { Transition, Variants } from 'motion/react';

/**
 * `m` is the feature-light component: markup and layout only, with the
 * animation features supplied at runtime by the LazyMotion provider.
 *
 * Named imports, not `import * as` — a namespace import defeats tree-shaking
 * and drags every Motion feature into the bundle whether it is used or not.
 * Measured on this site: the namespace form cost 194kB raw where the named
 * form costs a fraction of that.
 */
export const m = lightMotion;

/** The house easing. Matches the CSS the rest of the site already uses. */
export const EASE = [0.22, 0.61, 0.36, 1] as const;

export const transition: Transition = { duration: 0.45, ease: EASE };
export const quick: Transition = { duration: 0.22, ease: EASE };

/** Arrive from slightly below. The workhorse. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition },
};

/** A parent that lets its children arrive in sequence rather than all at once. */
export const stagger = (gap = 0.08): Variants => ({
  hidden: {},
  shown: { transition: { staggerChildren: gap } },
});

/** For panels and modals that appear in place. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  shown: { opacity: 1, scale: 1, transition: quick },
};

/**
 * Use this instead of the variants directly.
 *
 * Returns the same shapes with movement stripped when the visitor has asked
 * for reduced motion — opacity still resolves, so nothing is invisible, but
 * nothing travels. Returning static objects rather than disabling the library
 * keeps every call site identical in both cases.
 */
export function useMeridianMotion() {
  const reduced = useReducedMotion();

  if (reduced) {
    const instant: Transition = { duration: 0 };
    return {
      reduced: true,
      transition: instant,
      quick: instant,
      rise: { hidden: { opacity: 0 }, shown: { opacity: 1, transition: instant } } as Variants,
      scaleIn: { hidden: { opacity: 0 }, shown: { opacity: 1, transition: instant } } as Variants,
      stagger: (): Variants => ({ hidden: {}, shown: {} }),
      /** Props for a scroll-triggered reveal. */
      reveal: { initial: 'shown' as const, whileInView: 'shown' as const, viewport: { once: true } },
    };
  }

  return {
    reduced: false,
    transition,
    quick,
    rise,
    scaleIn,
    stagger,
    reveal: {
      initial: 'hidden' as const,
      whileInView: 'shown' as const,
      viewport: { once: true, amount: 0.25 },
    },
  };
}
