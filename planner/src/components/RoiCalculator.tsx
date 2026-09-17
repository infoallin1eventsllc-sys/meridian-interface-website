import React from 'react';
import { RoiInputs, RoiPresetKey, ROI_PRESETS, computeRoi } from '../lib/roi';
import { MERIDIAN } from '../lib/brand';
import { 
  Calculator, 
  DollarSign, 
  Clock, 
  Users, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface RoiCalculatorProps {
  inputs: RoiInputs;
  set: (patch: Partial<RoiInputs>) => void;
}

/**
 * The inputs live in App so the proposal sheet can print the same numbers the
 * client just watched move on screen. Nothing is calculated here — see lib/roi.
 */
export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ inputs, set }) => {
  const {
    teamSize, avgSalary, hoursPerWeekRepetitive,
    automationRate, realisationRate,
  } = inputs;

  const applyRoiPreset = (preset: RoiPresetKey) => set(ROI_PRESETS[preset]);

  const {
    hourlyRate, weeklyHoursFreed, annualHoursFreed, annualValue,
    headcountLeverage,
  } = computeRoi(inputs);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            Your numbers, not a quote
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            What this frees up
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Move the sliders to your own numbers. Every figure here is yours — your team, your salaries, your hours —
          and freed time only counts as money to the degree you actually use it, which is why these numbers are
          smaller than a vendor calculator will tell you. What the build and the running services cost is not on this
          page: those depend on what you actually need, so we work them out with you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Input Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-200 pb-3 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              Your numbers
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">Start from:</span>
              <button
                type="button"
                onClick={() => applyRoiPreset('small')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  teamSize === 4
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Small team (4)
              </button>
              <button
                type="button"
                onClick={() => applyRoiPreset('growing')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  teamSize === 12
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Growing (12)
              </button>
              <button
                type="button"
                onClick={() => applyRoiPreset('established')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  teamSize === 45
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Established (45)
              </button>
              <button
                type="button"
                onClick={() => applyRoiPreset('large')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  teamSize === 250
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                Large (250)
              </button>
            </div>
          </div>

          {/* Team Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-700 font-medium flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                People doing the day-to-day work
              </label>
              <span className="font-mono text-emerald-600 font-bold bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200">
                {teamSize.toLocaleString()} people
              </span>
            </div>
            <input
              id="roi-input-team-size"
              type="range"
              min="2"
              max="2500"
              step="5"
              value={teamSize}
              onChange={(e) => set({ teamSize: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>2</span>
              <span>50</span>
              <span>1,200</span>
              <span>2,500</span>
            </div>
          </div>

          {/* Average Salary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-700 font-medium flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                What one of them costs you a year
              </label>
              <span className="font-mono text-blue-600 font-bold bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200">
                ${avgSalary.toLocaleString()} / yr
              </span>
            </div>
            <input
              id="roi-input-avg-salary"
              type="range"
              min="35000"
              max="160000"
              step="5000"
              value={avgSalary}
              onChange={(e) => set({ avgSalary: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$35k</span>
              <span>$95k</span>
              <span>$160k</span>
            </div>
          </div>

          {/* Repetitive Hours */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-700 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Hours a week each spends on repeat work
              </label>
              <span className="font-mono text-blue-600 font-bold bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200">
                {hoursPerWeekRepetitive} hrs / wk
              </span>
            </div>
            <input
              id="roi-input-hours"
              type="range"
              min="4"
              max="28"
              value={hoursPerWeekRepetitive}
              onChange={(e) => set({ hoursPerWeekRepetitive: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>4 hrs</span>
              <span>16 hrs</span>
              <span>28 hrs</span>
            </div>
          </div>

          {/* Target Automation Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-700 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                The share of that the agents can take
              </label>
              <span className="font-mono text-emerald-600 font-bold bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200">
                {automationRate}%
              </span>
            </div>
            <input
              id="roi-input-automation-rate"
              type="range"
              min="20"
              max="85"
              step="5"
              value={automationRate}
              onChange={(e) => set({ automationRate: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>20% (cautious)</span>
              <span>55% (typical)</span>
              <span>85% (optimistic)</span>
            </div>
          </div>

          {/* The honest discount. Without it the model assumes every freed
              minute becomes billable, which is how you get a 10,000% return. */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-700 font-medium flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                How much of the freed time turns into money
              </label>
              <span className="font-mono text-slate-800 font-bold bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200">
                {realisationRate}%
              </span>
            </div>
            <input
              id="roi-input-realisation"
              type="range"
              min="10"
              max="100"
              step="5"
              value={realisationRate}
              onChange={(e) => set({ realisationRate: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              An hour saved is only worth money if it goes into work that earns, or into a hire you no longer make.
              Some of it will simply be a calmer day. Half is a fair starting assumption.
            </p>
          </div>
        </div>

        {/* Right: Calculated Business Metrics & Leverage Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* The three numbers that decide it. */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-blue-50 border border-blue-500 rounded-2xl p-4">
              <div className="text-xs font-mono text-blue-600 font-semibold mb-1">
                TIME FREED
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
                {weeklyHoursFreed.toLocaleString()} <span className="text-base font-semibold">hrs/wk</span>
              </div>
              <div className="text-[11px] text-blue-700 mt-1">
                {annualHoursFreed.toLocaleString()} hours a year, about {headcountLeverage} full-time people
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-400 rounded-2xl p-4">
              <div className="text-xs font-mono text-emerald-600 font-semibold mb-1">
                WHAT THAT TIME IS WORTH
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
                ${Math.round(annualValue).toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">
                A year, at your own salary figures, counting {realisationRate}% of it
              </div>
            </div>

            <a
              href={MERIDIAN.book}
              className="bg-indigo-50 border border-indigo-300 rounded-2xl p-4 block hover:bg-indigo-100 hover:border-indigo-400 transition-colors group"
            >
              <div className="text-xs font-mono text-indigo-600 font-semibold mb-1">
                WHAT IT WOULD COST
              </div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                Let us price it
                <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[11px] text-indigo-700 mt-1">
                Both the build and the monthly services depend on what you actually need. We will go through them with you.
              </div>
            </a>
          </div>

          {/* Governance value note (large teams only): named, not counted */}
          {teamSize >= 500 && (
            <div className="bg-gradient-to-r from-white to-slate-50 border border-emerald-400 rounded-2xl p-4 shadow-sm flex items-start gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-emerald-700 flex items-center gap-2">
                  What governance is worth at this size
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.2 rounded text-[10px]">
                    Not in the total
                  </span>
                </div>
                <p className="text-slate-700">
                  At this enterprise scale ({teamSize.toLocaleString()} seats), the approval log, per-agent identities and hashed audit trail also reduce audit preparation time and the exposure from unapproved actions. That value is real but depends on your auditors and contracts, so it is deliberately left out of the numbers above.
                </p>
              </div>
            </div>
          )}

          {/* Where every number came from. A client's accountant will ask. */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
              Where these numbers come from
            </h4>

            <div className="space-y-2 text-xs">
              {[
                {
                  label: 'Time spent on repeat work today',
                  detail: `${teamSize.toLocaleString()} people x ${hoursPerWeekRepetitive} hrs/week`,
                  value: `${(teamSize * hoursPerWeekRepetitive).toLocaleString()} hrs / week`,
                  tone: 'neutral' as const,
                },
                {
                  label: 'The share agents can take',
                  detail: `${automationRate}% of that time`,
                  value: `${weeklyHoursFreed.toLocaleString()} hrs / week`,
                  tone: 'neutral' as const,
                },
                {
                  label: 'What that time is worth, once it is used',
                  detail: `${annualHoursFreed.toLocaleString()} hrs x $${hourlyRate.toFixed(0)}/hr x ${realisationRate}% actually realised`,
                  value: `+ $${Math.round(annualValue).toLocaleString()} / yr`,
                  tone: 'good' as const,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-4 ${
                    row.tone === 'good' ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800">{row.label}</div>
                    <div className="text-[11px] text-slate-500">{row.detail}</div>
                  </div>
                  <div className={`text-right font-mono font-bold tabular-nums whitespace-nowrap ${
                    row.tone === 'good' ? 'text-emerald-700' : 'text-slate-700'
                  }`}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
              <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                What is not on this page: what the build costs, and what the monthly services cost. Both depend on
                what you actually need, and quoting either before we have talked would be a guess dressed up as a
                price. Also not counted above: the enquiries answered in minutes that would otherwise have gone
                elsewhere, and the mistakes that do not happen because nothing is re-typed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
