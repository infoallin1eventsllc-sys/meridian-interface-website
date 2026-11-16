import { afterEach, describe, expect, it, vi } from 'vitest';
import { daysFromToday, localISODate, nextBusinessDay, TIME_SLOTS } from '../../src/lib/dates';

afterEach(() => vi.useRealTimers());

describe('booking dates', () => {
  it('reads the date in local time, not UTC', () => {
    // 9 PM on 3 Nov local time is already 4 Nov in UTC for Houston.
    expect(localISODate(new Date(2026, 10, 3, 21, 30))).toBe('2026-11-03');
  });

  it('pads single-digit months and days', () => {
    expect(localISODate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('skips the weekend when suggesting the next business day', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 13, 10)); // Friday
    expect(nextBusinessDay()).toBe('2026-11-16'); // Monday
    vi.setSystemTime(new Date(2026, 10, 14, 10)); // Saturday
    expect(nextBusinessDay()).toBe('2026-11-16');
    vi.setSystemTime(new Date(2026, 10, 16, 10)); // Monday
    expect(nextBusinessDay()).toBe('2026-11-17');
  });

  it('counts days forward across a month end', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 25, 10));
    expect(daysFromToday(14)).toBe('2026-12-09');
  });

  it('offers appointment times labelled in Central Time', () => {
    expect(TIME_SLOTS.length).toBeGreaterThan(0);
    for (const slot of TIME_SLOTS) expect(slot).toMatch(/^\d{2}:\d{2} (AM|PM) - \d{2}:\d{2} (AM|PM) CT$/);
  });
});
