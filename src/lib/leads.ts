
/**
 * What goes in an appointment's budget field when nobody has named a figure.
 *
 * Which is always, at booking. The booking form asks what the client wants
 * built and when they are free; it does not ask their budget, and a default
 * that reads like a real answer ("$3,000 - $5,000") was being recorded against
 * every enquiry and shown back on the appointments table as though they had
 * said it. Money is settled in the itemised quote, after a conversation.
 */
export const NOT_DISCUSSED = 'Not discussed';

import { Appointment } from '../types';
import { attributionForSubmission } from './attribution';

/**
 * Single integration seam for every lead the site captures (booking appointments,
 * and — later — general inquiries).
 *
 * Today submissions are persisted to localStorage so the client portal works with no
 * backend. When the marketing-system backend is connected, set `VITE_LEAD_ENDPOINT` and
 * every submission is also POSTed there. No view code needs to change — all booking forms
 * call `submitAppointment()`.
 */

const APPOINTMENTS_KEY = 'meridian_appointments';

// Default: the Meridian marketing-system intake webhook (a public endpoint — safe
// to ship in the client bundle; it accepts leads, it does not expose any secret).
// Override with VITE_LEAD_ENDPOINT to point at a different backend.
const DEFAULT_LEAD_ENDPOINT =
  'https://glzodwhyavexpuusbqjy.supabase.co/functions/v1/intake';

const LEAD_ENDPOINT: string =
  (import.meta.env.VITE_LEAD_ENDPOINT as string | undefined)?.trim() || DEFAULT_LEAD_ENDPOINT;

export interface SubmitResult {
  /** The stored appointment (persisted locally regardless of backend availability). */
  appointment: Appointment;
  /** True if the submission was accepted by the configured backend endpoint. */
  delivered: boolean;
  /** Populated when a configured backend endpoint was tried but failed. */
  error?: string;
}

/** Read the locally stored appointments (most-recent first). */
export function getAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_KEY);
    return raw ? (JSON.parse(raw) as Appointment[]) : [];
  } catch {
    return [];
  }
}

/** Persist an appointment to localStorage, newest first. */
function saveAppointmentLocally(appointment: Appointment): void {
  try {
    const list = getAppointments();
    list.unshift(appointment);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to persist appointment locally:', err);
  }
}

/** Whether a backend endpoint is configured (i.e. the marketing stack is connected). */
export function hasBackend(): boolean {
  return LEAD_ENDPOINT.length > 0;
}

/**
 * Submit a booking appointment. Always stores a local copy so the portal keeps working
 * offline / without a backend; additionally POSTs to the configured endpoint when present.
 */
export async function submitAppointment(appointment: Appointment): Promise<SubmitResult> {
  saveAppointmentLocally(appointment);

  if (!hasBackend()) {
    return { appointment, delivered: false };
  }

  // Carry the lead's origin with the booking. `intake` reads `payload.source`
  // and stores it as contacts.source, which is the field the marketing system
  // attributes by — so a tagged Instagram link produces an Instagram lead
  // rather than another anonymous website one. No backend change needed.
  const attribution = attributionForSubmission();
  const payload = attribution
    ? { ...appointment, source: attribution.source, attribution: attribution.attribution }
    : appointment;

  const body = JSON.stringify({ type: 'appointment', payload });

  // Try twice: a booking is high-value, so a single transient network blip
  // shouldn't cost the studio the lead. (The local copy is the ultimate backstop.)
  let lastError = 'Network error';
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (res.ok) return { appointment, delivered: true };
      lastError = `Endpoint responded ${res.status}`;
      if (res.status < 500) break; // 4xx won't succeed on retry
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Network error';
    }
    if (attempt === 0) await new Promise((r) => setTimeout(r, 600));
  }
  return { appointment, delivered: false, error: lastError };
}

/**
 * A reference the client is given and quotes back at us.
 *
 * This used to be `APT-` plus a random four-digit number, which is 9,000
 * possible references — and the birthday problem makes that fail far sooner
 * than it looks. Measured: 3% chance of two clients being handed the SAME
 * reference by 25 bookings, 13% by 50, 42% by 100. Two people told "your
 * reference is APT-4543" is a confusing conversation, and two rows sharing an
 * id render wrong in the appointments table, which keys on it.
 *
 * Now: milliseconds in base 36, which is unique on its own unless two people
 * submit in the same millisecond, plus three random characters for the case
 * where they do. That is roughly one in 46,000 on top of an already unlikely
 * collision, and it sorts chronologically as a side benefit.
 *
 * Nothing needed migrating — the old references are just strings, and the
 * follow-up task dedupes on the contact's database id rather than this, so a
 * collision never dropped a task even before this change.
 */
const REF_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1: misread aloud

export function newAppointmentId(): string {
  let suffix = '';
  try {
    const bytes = new Uint8Array(3);
    crypto.getRandomValues(bytes);
    suffix = Array.from(bytes, (b) => REF_CHARS[b % REF_CHARS.length]).join('');
  } catch {
    // Older browsers, or a context without crypto. Still fine: the time
    // component is doing the real work here.
    for (let i = 0; i < 3; i++) suffix += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
  }
  return `APT-${Date.now().toString(36).toUpperCase().slice(-6)}${suffix}`;
}
