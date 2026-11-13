/**
 * Whether the homepage hero film's sound is on, shared between the film
 * (HeroLaptopFilm, which sits in a layer that takes no clicks) and its button
 * (HeroSoundButton, which sits above it).
 *
 * Sound always starts off. Browsers refuse to start audio a visitor did not
 * ask for, and a homepage that talks first is rude anyway, so the film plays
 * silently until someone taps the button. Nothing is remembered between
 * visits: every page load would need a fresh tap regardless.
 */

type Listener = () => void;

let on = false;       // the visitor has asked for sound
let available = false; // a film is actually playing (not the still frame)
const listeners = new Set<Listener>();
const tell = () => listeners.forEach((l) => l());

export const heroSound = {
  isOn: () => on,
  isAvailable: () => available,
  set(next: boolean) { if (next !== on) { on = next; tell(); } },
  setAvailable(next: boolean) {
    if (next === available) return;
    available = next;
    if (!next) on = false;
    tell();
  },
  subscribe(l: Listener) { listeners.add(l); return () => { listeners.delete(l); }; },
};
