import { afterEach, describe, expect, it, vi } from 'vitest';
import { daysFromToday, localISODate, nextBusinessDay, slotLabel, TIME_SLOTS } from '../../src/lib/dates';

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

  it('shows visitors a plain time while sending intake the exact format it checks', () => {
    expect(slotLabel('09:00 AM - 10:00 AM CT')).toBe('9 to 10 AM CT');
    expect(slotLabel('03:30 PM - 04:30 PM CT')).toBe('3:30 to 4:30 PM CT');
    expect(slotLabel('11:00 AM - 12:00 PM CT')).toBe('11 AM to 12 PM CT');
    expect(slotLabel('To be arranged')).toBe('To be arranged');
    for (const slot of TIME_SLOTS) expect(slotLabel(slot)).not.toContain('-');
  });
});
