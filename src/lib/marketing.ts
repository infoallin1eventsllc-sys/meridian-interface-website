/**
 * The marketing approval queue — what the system wrote, waiting on the owner.
 *
 * Every draft the marketing system produces (posts, short videos, lead
 * follow-ups) stops here until Otis approves it. That is a rule the database
 * enforces: nothing becomes published or sent without `approved_by = 'owner'`
 * on it, and the actions below are the only things that set that stamp.
 *
 * Fetched from the `owner` function behind the same token as the invoices.
 */
import { getToken } from './ownerStore';

const DEFAULT_OWNER_ENDPOINT =
  'https://glzodwhyavexpuusbqjy.supabase.co/functions/v1/owner';
const OWNER_ENDPOINT: string =
  (import.meta.env.VITE_OWNER_ENDPOINT as string | undefined)?.trim() || DEFAULT_OWNER_ENDPOINT;

export interface VideoScript {
  hook: string;
  beats: string[];
  price_line: string;
  cta: string;
  caption: string;
  hashtags: string[];
}

export interface ContentMeta {
  mocked?: boolean;
  topic?: string;
  icp?: string | null;
  image_source?: string;
  error?: string;
  script?: VideoScript;
  video?: {
    state: 'rendering' | 'ready' | 'failed' | 'not_configured';
    url?: string;
    poster?: string | null;
    error?: string;
  };
  publish?: { ok: boolean; mocked: boolean; provider: string; error?: string; providerId?: string };
  publish_pending?: { provider: string; ref: string; note: string; since: string };
  approved_at?: string;
  rejected_reason?: string;
}

export type ContentStatus =
  | 'draft' | 'pending_approval' | 'approved' | 'scheduled' | 'published' | 'rejected' | 'failed';

export interface ContentItem {
  id: string;
  channel: string;
  kind: string;
  title: string | null;
  body: string | null;
  image_url: string | null;
  status: ContentStatus;
  meta: ContentMeta | null;
  created_at: string;
  published_at: string | null;
  external_id: string | null;
}

export interface OwnerMessage {
  id: string;
  contact_id: string | null;
  channel: 'email' | 'sms';
  to_addr: string | null;
  subject: string | null;
  body: string | null;
  status: 'draft' | 'queued' | 'sent' | 'delivered' | 'failed' | 'received';
  error: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
  sent_at: string | null;
  /** The contact's name, joined. Supabase returns one object for a many-to-one. */
  contacts: { full_name: string | null } | { full_name: string | null }[] | null;
}

export interface MarketingQueue {
  items: ContentItem[];
  channels: Record<string, string>; // key -> label
  messages: OwnerMessage[];
  emailConnected: boolean;
}

async function call<T>(payload: Record<string, unknown>): Promise<T> {
  const token = getToken();
  if (!token) throw new Error('not signed in');
  const res = await fetch(OWNER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.ok === false) throw new Error(body?.error || `HTTP ${res.status}`);
  return body as T;
}

export function contactName(m: OwnerMessage): string {
  const c = Array.isArray(m.contacts) ? m.contacts[0] : m.contacts;
  return c?.full_name?.trim() || m.to_addr || 'Unknown contact';
}

/** Null only when the request itself failed — an empty queue is a real answer. */
export async function fetchQueue(): Promise<MarketingQueue | null> {
  try {
    const [c, m] = await Promise.all([
      call<{ items: ContentItem[]; channels: Array<{ key: string; label: string }> }>({ action: 'content_list' }),
      call<{ messages: OwnerMessage[]; email_provider_connected: boolean }>({ action: 'message_list' }),
    ]);
    const channels: Record<string, string> = {};
    for (const ch of c.channels ?? []) channels[ch.key] = ch.label;
    return {
      items: c.items ?? [],
      channels,
      messages: m.messages ?? [],
      emailConnected: !!m.email_provider_connected,
    };
  } catch {
    return null;
  }
}

export const approveContent = (id: string) => call<{ ok: true }>({ action: 'content_approve', id });
export const rejectContent = (id: string, reason?: string) =>
  call<{ ok: true }>({ action: 'content_reject', id, reason });
export const updateContent = (id: string, patch: { title?: string; body?: string }) =>
  call<{ ok: true }>({ action: 'content_update', id, ...patch });
export const sendMessage = (id: string) => call<{ ok: true }>({ action: 'message_send', id });
export const rejectMessage = (id: string) => call<{ ok: true }>({ action: 'message_reject', id });
