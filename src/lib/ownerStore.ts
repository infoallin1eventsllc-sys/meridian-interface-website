import { OwnerInvoice } from '../types';

/**
 * The owner portal's single integration seam.
 *
 * The portal used to check its passcode in client JavaScript and keep invoices
 * in localStorage. Vite inlines any VITE_-prefixed value into the shipped
 * bundle, so that passcode was readable by anyone who opened the site's source,
 * and the records lived on exactly one device with no backup.
 *
 * Now the passcode is verified by the `owner` edge function against a secret
 * that never leaves the server, and invoices live in Postgres behind
 * deny-by-default RLS. The browser only ever holds a short-lived signed session
 * token, in sessionStorage, so it dies with the tab.
 *
 * The local path is kept as a fallback for one reason: if the backend is
 * unreachable the portal should degrade, not disappear. `migrateLocalInvoices`
 * lifts anything still stranded in a browser on the first successful login.
 */

const TOKEN_KEY = 'meridian_owner_token';
const LOCAL_INVOICES_KEY = 'meridian_owner_invoices';

const DEFAULT_OWNER_ENDPOINT =
  'https://glzodwhyavexpuusbqjy.supabase.co/functions/v1/owner';

const OWNER_ENDPOINT: string =
  (import.meta.env.VITE_OWNER_ENDPOINT as string | undefined)?.trim() || DEFAULT_OWNER_ENDPOINT;

export type LoginResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'throttled' | 'not_configured' | 'offline'; message: string };

/** The session token lives in sessionStorage — never localStorage, never a cookie. */
export function getToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token: string | null): void {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private browsing — the session simply won't persist across reloads */
  }
}

export function isSignedIn(): boolean {
  return !!getToken();
}

export function signOut(): void {
  setToken(null);
}

async function call<T>(payload: Record<string, unknown>): Promise<T> {
  const token = getToken();
  const res = await fetch(OWNER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (res.status === 401 && payload.action !== 'login') {
    // The session expired or was revoked; make the UI show the gate again
    // rather than silently returning empty lists.
    setToken(null);
  }
  if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`);
  return body as T;
}

/* -------------------------------------------------------------- local ---- */

function readLocal(): OwnerInvoice[] {
  try {
    const raw = localStorage.getItem(LOCAL_INVOICES_KEY);
    return raw ? (JSON.parse(raw) as OwnerInvoice[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(list: OwnerInvoice[]): void {
  try {
    localStorage.setItem(LOCAL_INVOICES_KEY, JSON.stringify(list));
  } catch {
    /* quota or private mode — the server copy is the real one anyway */
  }
}

/* --------------------------------------------------------------- api ----- */

/** Is a server-side passcode configured? Decides which gate screen to show. */
export async function backendConfigured(): Promise<boolean> {
  try {
    const r = await call<{ configured: boolean }>({ action: 'status' });
    return !!r.configured;
  } catch {
    return false;
  }
}

export async function login(passcode: string): Promise<LoginResult> {
  try {
    const res = await fetch(OWNER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', passcode }),
    });
    const body = await res.json().catch(() => ({}));

    if (res.ok && body?.token) {
      setToken(body.token as string);
      await migrateLocalInvoices();
      return { ok: true };
    }
    if (res.status === 429) {
      return {
        ok: false,
        reason: 'throttled',
        message: `Too many attempts. Try again in about ${body?.retryAfterMinutes ?? 15} minutes.`,
      };
    }
    if (res.status === 503 || body?.error === 'not_configured') {
      return {
        ok: false,
        reason: 'not_configured',
        message: 'No passcode is set on the server yet.',
      };
    }
    return {
      ok: false,
      reason: 'invalid',
      message:
        typeof body?.remaining === 'number' && body.remaining >= 0 && body.remaining <= 3
          ? `Incorrect passcode. ${body.remaining} attempt${body.remaining === 1 ? '' : 's'} left.`
          : 'Incorrect passcode.',
    };
  } catch {
    return {
      ok: false,
      reason: 'offline',
      message: 'Could not reach the server. Check your connection and try again.',
    };
  }
}

/** Lift anything still stranded in this browser. Server copies always win. */
export async function migrateLocalInvoices(): Promise<number> {
  const local = readLocal();
  if (!local.length) return 0;
  try {
    const r = await call<{ imported: number }>({ action: 'import', invoices: local });
    // Clear only after the server confirms — a failed import must not lose data.
    if (typeof r.imported === 'number') writeLocal([]);
    return r.imported ?? 0;
  } catch {
    return 0;
  }
}

export async function listInvoices(): Promise<{ invoices: OwnerInvoice[]; offline: boolean }> {
  try {
    const r = await call<{ invoices: OwnerInvoice[] }>({ action: 'list' });
    return { invoices: r.invoices ?? [], offline: false };
  } catch {
    return { invoices: readLocal(), offline: true };
  }
}

export async function saveInvoice(invoice: OwnerInvoice): Promise<{ offline: boolean }> {
  try {
    await call({ action: 'save', invoice });
    return { offline: false };
  } catch {
    const list = readLocal().filter((i) => i.id !== invoice.id);
    writeLocal([invoice, ...list]);
    return { offline: true };
  }
}

export async function deleteInvoice(id: string): Promise<{ offline: boolean }> {
  try {
    await call({ action: 'delete', id });
    return { offline: false };
  } catch {
    writeLocal(readLocal().filter((i) => i.id !== id));
    return { offline: true };
  }
}
