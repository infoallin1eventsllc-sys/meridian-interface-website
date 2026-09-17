/**
 * Incoming bookings, and what the client actually picked.
 *
 * A client saves products on the site and sends the list as a booking. That
 * list was reaching the CRM correctly and then going nowhere Otis could see:
 * nothing in the system emails the owner when a booking arrives, and the
 * portal had no leads screen at all. So the question that has to be answered
 * before an invoice can be written — what did they choose? — had no answer
 * short of querying the database by hand.
 *
 * This reads the `leads` function, which sits behind the same owner session
 * token as the invoices and the marketing queue. It is a separate endpoint
 * from `owner` on purpose: see the note at the top of the function.
 *
 * NO PRICES LIVE HERE, AND NONE MAY BE ADDED. What each item costs is decided
 * by Meridian Interface staff and arrives in an itemised invoice, after the
 * conversation. This screen exists to tell Otis what to price, never to tell
 * anyone what something costs.
 */
import { getToken } from './ownerStore';

const DEFAULT_LEADS_ENDPOINT =
  'https://glzodwhyavexpuusbqjy.supabase.co/functions/v1/leads';
const LEADS_ENDPOINT: string =
  (import.meta.env.VITE_LEADS_ENDPOINT as string | undefined)?.trim() || DEFAULT_LEADS_ENDPOINT;

/** One thing the client saved. `detail` is the category shown under the title. */
export interface PickedItem {
  title: string;
  detail: string | null;
}

export interface InboxLead {
  appointmentId: string | null;
  receivedAt: string | null;
  client: {
    name: string | null;
    email: string | null;
    phone: string | null;
    company: string | null;
  };
  items: PickedItem[];
  itemCount: number;
  /** Anything the client typed alongside the list. */
  saidByClient: string | null;
  /** The note exactly as sent, so nothing is lost if the parse ever misses. */
  rawNote: string | null;
  serviceTitle: string | null;
  preferredTimeSlot: string | null;
  source: string | null;
  contactId: string | null;
  deal: { id: string; title: string; stage: string } | null;
}

/**
 * Null only when the request itself failed. An empty list is a real answer —
 * "no bookings yet" and "we could not ask" must not look the same on screen.
 */
export async function fetchLeads(limit = 25): Promise<InboxLead[] | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(LEADS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: 'list', limit }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body?.ok === false) return null;
    return (body.leads ?? []) as InboxLead[];
  } catch {
    return null;
  }
}

/** A booking's items as invoice line descriptions, ready to paste or adapt. */
export function itemsAsInvoiceLines(lead: InboxLead): string[] {
  return lead.items.map((i) => (i.detail ? `${i.title} — ${i.detail}` : i.title));
}

/** "17 Sep 2026, 14:09" — short, unambiguous, no library. */
export function receivedLabel(iso: string | null): string {
  if (!iso) return 'Unknown date';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Unknown date';
  return d.toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}
