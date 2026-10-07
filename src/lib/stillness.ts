/**
 * True when the visitor has asked for less movement or less data: reduced
 * motion, Save-Data, or a 2G connection. Anything that would autoplay (the hero
 * backdrop, the studio reel) shows its still frame instead, so nobody gets a
 * lesser page for asking for less; they get it holding still.
 *
 * Kept apart from lib/motion.ts on purpose: that file imports the animation
 * library, and the hero should not pull it into the first download.
 */
export function shouldStayStill(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType && /(^|\W)(slow-)?2g$/.test(conn.effectiveType)) return true;
  return false;
}
