import { beforeEach, describe, expect, it, vi } from 'vitest';

// The module keeps its state between imports, so each test gets a fresh copy.
let heroSound: typeof import('../../src/lib/heroSound').heroSound;
beforeEach(async () => {
  vi.resetModules();
  ({ heroSound } = await import('../../src/lib/heroSound'));
});

describe('homepage film sound', () => {
  it('always starts muted', () => {
    expect(heroSound.isOn()).toBe(false);
    expect(heroSound.isAvailable()).toBe(false);
  });

  it('tells the film and the button when the visitor turns sound on', () => {
    const listener = vi.fn();
    heroSound.subscribe(listener);
    heroSound.set(true);
    expect(heroSound.isOn()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('does not notify when nothing changed', () => {
    const listener = vi.fn();
    heroSound.subscribe(listener);
    heroSound.set(false);
    expect(listener).not.toHaveBeenCalled();
  });

  it('switches sound off when the film stops being available', () => {
    heroSound.setAvailable(true);
    heroSound.set(true);
    heroSound.setAvailable(false);
    expect(heroSound.isOn()).toBe(false);
  });

  it('stops notifying after unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = heroSound.subscribe(listener);
    unsubscribe();
    heroSound.set(true);
    expect(listener).not.toHaveBeenCalled();
  });
});
