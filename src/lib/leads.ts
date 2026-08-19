import { Appointment } from '../types';

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

  const body = JSON.stringify({ type: 'appointment', payload: appointment });

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

/** Generate a fresh appointment id (APT-XXXX). */
export function newAppointmentId(): string {
  return `APT-${Math.floor(1000 + Math.random() * 9000)}`;
}
