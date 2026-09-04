/**
 * The planner's one server call.
 *
 * Everything in this app runs in the browser except two things that need a
 * model: the advisor's blueprint and the custom workflow trace. Those go to
 * Meridian's `planner` function, which holds the Claude key, rate-limits by
 * address, and returns JSON. Nothing about the caller is stored beyond a
 * hashed address for the hourly allowance.
 */
import type { AdvisorBlueprint, SimulationStep } from '../types';

const DEFAULT_ENDPOINT = 'https://glzodwhyavexpuusbqjy.supabase.co/functions/v1/planner';
export const PLANNER_ENDPOINT: string =
  (import.meta.env.VITE_PLANNER_ENDPOINT as string | undefined)?.trim() || DEFAULT_ENDPOINT;

export interface PlannerStatus {
  ok: boolean;
  /** True when a model is connected. False means the advisor cannot answer right now. */
  ai: boolean;
  model?: string;
}

export interface AdvisorProfile {
  companyName: string;
  industry: string;
  stage: string;
  teamSize: string;
  monthlyBudget: string;
  currentTools: string;
  painPoints: string;
  targetAutonomyGoal: string;
}

export class PlannerError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

async function call<T>(payload: Record<string, unknown>, timeoutMs = 120_000): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(PLANNER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    const body = await res.json().catch(() => ({}));
    if (res.status === 429) {
      throw new PlannerError(
        "You've used this planner's AI allowance for the hour. Try again later, or book a call and we'll run it with you.",
        429,
      );
    }
    if (!res.ok || body?.ok === false) {
      throw new PlannerError(body?.error || `The planner service answered ${res.status}.`, res.status);
    }
    return body as T;
  } catch (err) {
    if (err instanceof PlannerError) throw err;
    if ((err as Error)?.name === 'AbortError') {
      throw new PlannerError('That took too long. Try again in a moment.', 0);
    }
    throw new PlannerError('Could not reach the planner service. Check your connection and try again.', 0);
  } finally {
    clearTimeout(timer);
  }
}

/** Never throws: an unreachable service reads as "AI offline". */
export async function fetchStatus(): Promise<PlannerStatus> {
  try {
    const r = await call<PlannerStatus>({ action: 'status' }, 8_000);
    return { ok: !!r.ok, ai: !!r.ai, model: r.model };
  } catch {
    return { ok: false, ai: false };
  }
}

export async function generateBlueprint(profile: AdvisorProfile): Promise<{ blueprint: AdvisorBlueprint; model: string }> {
  const r = await call<{ ok: true; blueprint: AdvisorBlueprint; model: string }>({ action: 'advisor', ...profile });
  return { blueprint: r.blueprint, model: r.model };
}

export async function simulateWorkflow(goal: string, companyContext: string): Promise<{ steps: SimulationStep[]; model: string }> {
  const r = await call<{ ok: true; steps: SimulationStep[]; model: string }>({ action: 'simulate', goal, companyContext });
  return { steps: r.steps, model: r.model };
}

export interface PlanSubmission {
  name: string;
  email: string;
  phone: string;
  company: string;
  note: string;
  stage: string;
  /** The exported plan itself, as Markdown. */
  plan: string;
}

/**
 * Send the finished plan to Meridian.
 *
 * The server forwards it to the same intake webhook the booking form uses, so
 * it lands as a contact with the plan attached and a follow-up queued. Throws
 * a PlannerError with a sentence worth showing when it does not.
 */
export async function sendPlanToMeridian(sub: PlanSubmission): Promise<void> {
  await call<{ ok: true }>({ action: 'send_plan', ...sub }, 30_000);
}
