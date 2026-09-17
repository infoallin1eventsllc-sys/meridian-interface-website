/**
 * What the work frees up, kept out of the component so the proposal sheet can
 * show the same numbers the calculator shows.
 *
 * This model deliberately refuses to value every freed hour at a full salary
 * rate. That is how a vendor calculator gets to a five-figure percentage
 * return and loses the room. Freed time counts only to the degree it is
 * actually redeployed, and the discount is applied on purpose and shown.
 *
 * NO PRICES LIVE HERE, AND NONE MAY BE ADDED.
 * ==========================================================================
 * This file used to carry `buildCost` (defaulting to Meridian's real $7,500
 * rate) and `monthlyStackCost`, and computed payback against them. Both are
 * gone, on Otis's instruction of 17 Sep: what the studio charges, and what the
 * underlying services cost, are settled in conversation with a client, not
 * published on a page a stranger can open and print.
 *
 * The reason is not modesty. A quote on a public page is a quote given before
 * anyone has described the job — a client needing fifteen thousand dollars of
 * work has already read seven and a half, and that is a hard number to walk
 * back from. Every figure below is the CLIENT's own: their team, their
 * salaries, their hours. Nothing here says what anything costs.
 *
 * If a cost or a price is ever wanted in this tool again, it belongs behind
 * the consultation, not in the bundle that ships to a browser.
 */

export interface RoiInputs {
  teamSize: number;
  avgSalary: number;
  hoursPerWeekRepetitive: number;
  /** Share of that repeat time the agents can take, as a percentage. */
  automationRate: number;
  /** Share of freed time that turns into money rather than a calmer day. */
  realisationRate: number;
}

export const ROI_DEFAULTS: RoiInputs = {
  teamSize: 12,
  avgSalary: 60000,
  hoursPerWeekRepetitive: 8,
  automationRate: 40,
  realisationRate: 50,
};

export type RoiPresetKey = 'small' | 'growing' | 'established' | 'large';

/**
 * Presets aimed at the businesses this studio actually works with, and
 * deliberately cautious. A first screen that flatters is a first screen
 * nobody trusts twice.
 */
export const ROI_PRESETS: Record<RoiPresetKey, Omit<RoiInputs, 'realisationRate'>> = {
  small:       { teamSize: 4,   avgSalary: 52000, hoursPerWeekRepetitive: 7,  automationRate: 35 },
  growing:     { teamSize: 12,  avgSalary: 60000, hoursPerWeekRepetitive: 8,  automationRate: 40 },
  established: { teamSize: 45,  avgSalary: 75000, hoursPerWeekRepetitive: 9,  automationRate: 45 },
  large:       { teamSize: 250, avgSalary: 90000, hoursPerWeekRepetitive: 10, automationRate: 50 },
};

export interface RoiResult {
  hourlyRate: number;
  weeklyRepeatHours: number;
  weeklyHoursFreed: number;
  annualHoursFreed: number;
  /** The worth of the freed time, at the client's own salary figures. This is
      the one money number in the tool, and it is the client's money, not a
      price: it says what their time is worth, never what the work costs. */
  annualValue: number;
  headcountLeverage: string;
}

export function computeRoi(i: RoiInputs): RoiResult {
  const hourlyRate = i.avgSalary / 2080; // 52 weeks x 40 hours
  const weeklyRepeatHours = i.teamSize * i.hoursPerWeekRepetitive;
  const weeklyHoursFreed = Math.round(weeklyRepeatHours * (i.automationRate / 100));
  const annualHoursFreed = weeklyHoursFreed * 52;

  const annualValue = annualHoursFreed * hourlyRate * (i.realisationRate / 100);

  // One full-time year is about 1,800 working hours after leave and admin.
  const headcountLeverage = (annualHoursFreed / 1800).toFixed(1);

  return {
    hourlyRate, weeklyRepeatHours, weeklyHoursFreed, annualHoursFreed,
    annualValue, headcountLeverage,
  };
}

export const money = (n: number) => `$${Math.round(n).toLocaleString()}`;
