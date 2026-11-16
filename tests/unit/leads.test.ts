import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAppointments, newAppointmentId, submitAppointment } from '../../src/lib/leads';
import type { Appointment } from '../../src/types';

const booking = (): Appointment => ({
  id: newAppointmentId(),
  clientName: 'Test Visitor',
  clientEmail: 'visitor@example.com',
  clientPhone: '2815550100',
  serviceType: 'web_design',
  serviceTitle: 'Website Design',
  preferredDate: '2026-12-01',
  preferredTimeSlot: '09:00 AM - 10:00 AM CT',
  budgetRange: 'Not discussed',
  notes: '',
  status: 'Scheduled',
  createdAt: new Date().toISOString(),
});

const respond = (status: number) => new Response('{}', { status });

beforeEach(() => localStorage.clear());

describe('booking references', () => {
  it('are readable aloud: no I, O, 0 or 1 in the random part', () => {
    for (let i = 0; i < 200; i++) expect(newAppointmentId()).toMatch(/^APT-[0-9A-Z]{6}[A-HJ-NP-Z2-9]{3}$/);
  });

  it('do not repeat from one booking to the next', () => {
    vi.useFakeTimers({ now: new Date(2026, 10, 16, 12) });
    const ids = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      ids.add(newAppointmentId());
      vi.advanceTimersByTime(1);
    }
    vi.useRealTimers();
    expect(ids.size).toBe(1000);
  });

  it('sort in the order they were made', () => {
    vi.useFakeTimers({ now: new Date(2026, 10, 16, 12) });
    const first = newAppointmentId();
    vi.advanceTimersByTime(60_000);
    const later = newAppointmentId();
    vi.useRealTimers();
    expect(first.slice(0, 10) < later.slice(0, 10)).toBe(true);
  });
});

describe('sending a booking', () => {
  it('keeps a copy on the device and posts it to the intake endpoint', async () => {
    const fetch = vi.fn().mockResolvedValue(respond(200));
    vi.stubGlobal('fetch', fetch);
    const appt = booking();
    const result = await submitAppointment(appt);

    expect(result.delivered).toBe(true);
    expect(getAppointments()[0].id).toBe(appt.id);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toMatch(/\/functions\/v1\/intake$/);
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({ type: 'appointment', payload: { id: appt.id } });
  });

  it('tries once more when the server has a passing fault', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(respond(503)).mockResolvedValueOnce(respond(200));
    vi.stubGlobal('fetch', fetch);
    const result = await submitAppointment(booking());
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result.delivered).toBe(true);
  });

  it('does not retry a request the server rejected, and keeps the local copy', async () => {
    const fetch = vi.fn().mockResolvedValue(respond(400));
    vi.stubGlobal('fetch', fetch);
    const result = await submitAppointment(booking());
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({ delivered: false, error: 'Endpoint responded 400' });
    expect(getAppointments()).toHaveLength(1);
  });

  it('reports a network failure instead of throwing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const result = await submitAppointment(booking());
    expect(result).toMatchObject({ delivered: false, error: 'Failed to fetch' });
  });

  it('carries where the visitor came from', async () => {
    localStorage.setItem('meridian_attr_first', JSON.stringify({ channel: 'instagram', captured_at: '' }));
    const fetch = vi.fn().mockResolvedValue(respond(200));
    vi.stubGlobal('fetch', fetch);
    await submitAppointment(booking());
    expect(JSON.parse(fetch.mock.calls[0][1].body).payload.source).toBe('instagram');
  });
});
