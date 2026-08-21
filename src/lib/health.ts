/**
 * System health — the machinery's own report on itself.
 *
 * The weekly summary describes marketing. This describes the system that does
 * the marketing: whether the schedules are firing, whether work is failing,
 * and whether Key Router is up. Fetched from the `owner` function behind the
 * same token as everything else here.
 */
import { getToken } from './ownerStore';

const DEFAULT_OWNER_ENDPOINT =
  'https://glzodwhyavexpuusbqjy.supabase.co/functions/v1/owner';
const OWNER_ENDPOINT: string =
  (import.meta.env.VITE_OWNER_ENDPOINT as string | undefined)?.trim() || DEFAULT_OWNER_ENDPOINT;

export interface SystemAlert {
  id: string;
  code: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
  component: string;
  first_seen: string;
  last_seen: string;
  seen_count: number;
}

export interface ScheduleRow {
  job: string;
  schedule: string;
  last_run: string | null;
  last_status: string | null;
  runs_24h: number;
  failures_24h: number;
}

export interface SystemHealth {
  generated_at: string;
  alerts: SystemAlert[];
  marketing: {
    /** `live` only when real (non-mock) output actually exists — a key being
     *  configured is not the same as a key that works. */
    mode: 'live' | 'mock' | 'configured_but_still_mocking';
    key_configured: boolean;
    real_outputs: number;
    autonomy: string;
    model: string | null;
    recent_runs: Array<{
      status: string; summary: string | null; tasks_created: number | null;
      started_at: string; finished_at: string | null; error: string | null;
    }>;
    errors_24h: number;
    tasks: Record<string, number>;
    content: Record<string, number>;
    messages: Record<string, number>;
    performance: { findings?: string[]; guidance?: string[]; computed_at?: string } | null;
  };
  schedules: ScheduleRow[] | null;
  keyrouter: {
    state: 'up' | 'error' | 'unreachable' | 'not_deployed';
    ms?: number;
    status?: number;
    detail?: string;
    fleet?: Array<Record<string, unknown>>;
  };
}

export async function fetchHealth(): Promise<SystemHealth | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(OWNER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: 'health' }),
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body?.ok ? (body as SystemHealth) : null;
  } catch {
    return null;
  }
}
