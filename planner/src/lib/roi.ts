/**
 * The return-on-spend model, kept out of the component so the proposal sheet
 * can show the same numbers the calculator shows.
 *
 * What it deliberately refuses to do: value every freed hour at a full salary
 * rate and ignore what the build costs. That is how a vendor calculator gets
 * to a three-day payback and a five-figure percentage return, and how it loses
 * the room. Freed time counts only to the degree it is actually redeployed,
 * and the build is a real one-off charge that payback is measured against.
 */

export interface RoiInputs {
  teamSize: number;
  avgSalary: number;
  hoursPerWeekRepetitive: number;
  /** Share of that repeat time the agents can take, as a percentage. */
  automationRate: number;
  monthlyStackCost: number;
  /** One-off design and build. Meridian's published tech stack rate is $7,500. */
  buildCost: number;
  /** Share of freed time that turns into money rather than a calmer day. */
  realisationRate: number;
}

export const ROI_DEFAULTS: RoiInputs = {
  teamSize: 12,
  avgSalary: 60000,
  hoursPerWeekRepetitive: 8,
  automationRate: 40,
  monthlyStackCost: 250,
  buildCost: 7500,
  realisationRate: 50,
};

export type RoiPresetKey = 'small' | 'growing' | 'established' | 'large';

/**
 * Presets aimed at the businesses this studio actually works with, and
 * deliberately cautious. A first screen that flatters is a first screen
 * nobody trusts twice.
 */
export const ROI_PRESETS: Record<RoiPresetKey, Omit<RoiInputs, 'realisationRate'>> = {
  small:       { teamSize: 4,   avgSalary: 52000, hoursPerWeekRepetitive: 7,  automationRate: 35, monthlyStackCost: 120,  buildCost: 4500 },
  growing:     { teamSize: 12,  avgSalary: 60000, hoursPerWeekRepetitive: 8,  automationRate: 40, monthlyStackCost: 250,  buildCost: 7500 },
  established: { teamSize: 45,  avgSalary: 75000, hoursPerWeekRepetitive: 9,  automationRate: 45, monthlyStackCost: 700,  buildCost: 15000 },
  large:       { teamSize: 250, avgSalary: 90000, hoursPerWeekRepetitive: 10, automationRate: 50, monthlyStackCost: 2500, buildCost: 35000 },
};

export interface RoiResult {
  hourlyRate: number;
  weeklyRepeatHours: number;
  weeklyHoursFreed: number;
  annualHoursFreed: number;
  annualValue: number;
  annualStackCost: number;
  firstYearNet: number;
  ongoingAnnualNet: number;
  paybackMonths: number;
  paybackLabel: string;
  headcountLeverage: string;
}

export function computeRoi(i: RoiInputs): RoiResult {
  const hourlyRate = i.avgSalary / 2080; // 52 weeks x 40 hours
  const weeklyRepeatHours = i.teamSize * i.hoursPerWeekRepetitive;
  const weeklyHoursFreed = Math.round(weeklyRepeatHours * (i.automationRate / 100));
  const annualHoursFreed = weeklyHoursFreed * 52;

  const annualValue = annualHoursFreed * hourlyRate * (i.realisationRate / 100);
  const annualStackCost = i.monthlyStackCost * 12;

  // Year one carries the build; every year after does not.
  const firstYearNet = annualValue - annualStackCost - i.buildCost;
  const ongoingAnnualNet = annualValue - annualStackCost;

  const monthlyNet = ongoingAnnualNet / 12;
  const paybackMonths = monthlyNet > 0 ? i.buildCost / monthlyNet : Infinity;
  const paybackLabel = !isFinite(paybackMonths)
    ? 'Does not pay back'
    : paybackMonths < 1
      ? 'Under a month'
      : `${paybackMonths.toFixed(paybackMonths < 10 ? 1 : 0)} months`;

  // One full-time year is about 1,800 working hours after leave and admin.
  const headcountLeverage = (annualHoursFreed / 1800).toFixed(1);

  return {
    hourlyRate, weeklyRepeatHours, weeklyHoursFreed, annualHoursFreed,
    annualValue, annualStackCost, firstYearNet, ongoingAnnualNet,
    paybackMonths, paybackLabel, headcountLeverage,
  };
}

export const money = (n: number) => `$${Math.round(n).toLocaleString()}`;
