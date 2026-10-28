/**
 * Backgrounds for Otis's digital business card (/card/).
 *
 * The card reads its background from the `card.background` image override, the
 * same store Photo Control already publishes portfolio images to, so choosing
 * one here changes the card for every visitor and nobody else can change it.
 * The files live in public/card/bg/ (built by the digital card kit in the
 * backend repo, .claude/skills/meridian-digital-card). A stored choice names a
 * file by its public URL; the card maps it back to the same-origin copy.
 */
export const CARD_BACKGROUND_KEY = 'card.background';
export const CARD_BG_PUBLIC_BASE = 'https://meridianinterface.com/card/bg/';
export const CARD_DEFAULT_STEM = 'ribbon';

export interface CardBackground {
  stem: string;
  name: string;
  colour: string;
}

const art: [string, string][] = [
  ['ribbon', 'Blue Ribbon'],
  ['light-trails', 'Light Trails'],
  ['liquid-glass', 'Liquid Glass'],
  ['glass-tower', 'Glass Tower'],
  ['houston-skyline', 'Houston Skyline'],
  ['curved-facade', 'Curved Facade'],
];
const colours: [string, string][] = [
  ['purple', 'Royal Purple'],
  ['teal', 'Ocean Teal'],
  ['gold', 'Charcoal & Gold'],
  ['red', 'Crimson'],
  ['sunset', 'Sunset'],
];

export const CARD_BACKGROUNDS: CardBackground[] = [
  ...art.map(([stem, name]) => ({ stem, name, colour: 'Blue' })),
  ...(['ribbon', 'glass-tower'] as const).flatMap((base) =>
    colours.map(([c, label]) => ({
      stem: `${base}-${c}`,
      name: base === 'ribbon' ? 'Blue Ribbon' : 'Glass Tower',
      colour: label,
    })),
  ),
];

export const cardBackgroundUrl = (stem: string): string => `${CARD_BG_PUBLIC_BASE}${stem}.jpg`;

/** The built-in background a stored URL names, or null for an upload or nothing. */
export function cardBackgroundStem(url: string | undefined): string | null {
  if (!url || !url.startsWith(CARD_BG_PUBLIC_BASE)) return null;
  const stem = url.slice(CARD_BG_PUBLIC_BASE.length).replace(/\.jpg$/, '');
  return CARD_BACKGROUNDS.some((b) => b.stem === stem) ? stem : null;
}
