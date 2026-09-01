/**
 * What the business actually runs on, and which parts are switched on.
 *
 * The public Services page shows a *simulation* of the loop, because a
 * prospect needs to understand the mechanism. This is the opposite: the real
 * inventory, for the owner, with live state pulled from the system itself.
 * Nothing here is illustrative — a piece is reported as connected only when
 * something answered to say so.
 */
import { fetchHealth, type SystemHealth } from './health';

const DEFAULT_PAY_ENDPOINT =
  'https://glzodwhyavexpuusbqjy.supabase.co/functions/v1/pay';
const PAY_ENDPOINT: string =
  (import.meta.env.VITE_PAY_ENDPOINT as string | undefined)?.trim() ||
  DEFAULT_PAY_ENDPOINT;

export interface PayStatus {
  configured: boolean;
  /** `test` spends nothing real; `live` takes actual money. Worth surfacing —
      sending a client to a test checkout looks identical from both sides. */
  mode: 'test' | 'live' | 'unset';
  webhook_configured: boolean;
}

/**
 * Payment readiness. This action is deliberately reachable without an owner
 * token — it reveals only whether payments are set up, never a key — so the
 * portal can explain a missing button instead of just hiding it.
 */
export async function fetchPayStatus(): Promise<PayStatus | null> {
  try {
    const res = await fetch(PAY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status' }),
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body?.ok ? (body as PayStatus) : null;
  } catch {
    return null;
  }
}

export interface StackSnapshot {
  health: SystemHealth | null;
  pay: PayStatus | null;
}

export async function fetchStack(): Promise<StackSnapshot> {
  const [health, pay] = await Promise.all([fetchHealth(), fetchPayStatus()]);
  return { health, pay };
}
