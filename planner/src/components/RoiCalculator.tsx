import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  Clock, 
  Users, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const RoiCalculator: React.FC = () => {
  const [teamSize, setTeamSize] = useState<number>(12);
  const [avgSalary, setAvgSalary] = useState<number>(60000);
  const [hoursPerWeekRepetitive, setHoursPerWeekRepetitive] = useState<number>(8);
  const [automationRate, setAutomationRate] = useState<number>(40); // percentage
  const [monthlyStackCost, setMonthlyStackCost] = useState<number>(250); // running cost, USD/month
  // The two inputs the original calculator left out, which is why it produced
  // a three-day payback: what it costs to build, and how much of the freed
  // time actually turns into money rather than just disappearing into the day.
  const [buildCost, setBuildCost] = useState<number>(7500);
  const [realisationRate, setRealisationRate] = useState<number>(50); // percentage

  /*
   * Presets aimed at the businesses this studio actually works with, and
   * deliberately cautious. The version this replaces opened on 35 people
   * losing 14 hours a week each with 60% of it automatable — assumptions that
   * do most of the work in the answer, unannounced. A first screen that
   * flatters is a first screen nobody trusts twice.
   */
  const applyRoiPreset = (preset: 'small' | 'growing' | 'established' | 'large') => {
    if (preset === 'small') {
      setTeamSize(4);
      setAvgSalary(52000);
      setHoursPerWeekRepetitive(7);
      setAutomationRate(35);
      setMonthlyStackCost(120);
      setBuildCost(4500);
    } else if (preset === 'growing') {
      setTeamSize(12);
      setAvgSalary(60000);
      setHoursPerWeekRepetitive(8);
      setAutomationRate(40);
      setMonthlyStackCost(250);
      setBuildCost(7500);
    } else if (preset === 'established') {
      setTeamSize(45);
      setAvgSalary(75000);
      setHoursPerWeekRepetitive(9);
      setAutomationRate(45);
      setMonthlyStackCost(700);
      setBuildCost(15000);
    } else {
      setTeamSize(250);
      setAvgSalary(90000);
      setHoursPerWeekRepetitive(10);
      setAutomationRate(50);
      setMonthlyStackCost(2500);
      setBuildCost(35000);
    }
  };

  /*
   * The maths, and what it deliberately does not do.
   *
   * The version this replaces multiplied every freed hour by a full salary
   * rate, ignored what the build costs, and reported a three-day payback and a
   * five-figure percentage return. Nobody with money to spend believes that,
   * and once they stop believing this screen they stop believing the rest.
   *
   * Two corrections. Freed time is only worth money to the degree it gets
   * used for something that earns or replaces a hire — that is the realisation
   * rate, and half is a fair default. And the build is a real one-off cost, so
   * payback is measured against it in months, not against the software bill in
   * days.
   */
  const hourlyRate = avgSalary / 2080; // 52 weeks x 40 hours

  const weeklyHoursFreed = Math.round(teamSize * hoursPerWeekRepetitive * (automationRate / 100));
  const annualHoursFreed = weeklyHoursFreed * 52;

  // What that time is worth once it is actually redeployed.
  const annualValue = annualHoursFreed * hourlyRate * (realisationRate / 100);
  const annualStackCost = monthlyStackCost * 12;

  // Year one carries the build; every year after does not.
  const firstYearNet = annualValue - annualStackCost - buildCost;
  const ongoingAnnualNet = annualValue - annualStackCost;

  // Months to earn the build back, once running costs are paid.
  const monthlyNet = (annualValue - annualStackCost) / 12;
  const paybackMonths = monthlyNet > 0 ? buildCost / monthlyNet : Infinity;
  const paybackLabel = !isFinite(paybackMonths)
    ? 'Does not pay back'
    : paybackMonths < 1
      ? 'Under a month'
      : `${paybackMonths.toFixed(paybackMonths < 10 ? 1 : 0)} months`;

  // One full-time year is about 1,800 working hours after leave and admin.
  const headcountLeverage = (annualHoursFreed / 1800).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            Estimate, not a quote
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            What it costs, and when it pays for itself
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Move the sliders to your own numbers. This counts the build as a real one-off cost and only counts freed time
          as money to the degree you actually use it — which is why the payback here is months rather than the days a
          vendor calculator will tell you. Everything is an estimate for a conversation.
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
              onChange={(e) => setTeamSize(Number(e.target.value))}
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
              onChange={(e) => setAvgSalary(Number(e.target.value))}
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
              onChange={(e) => setHoursPerWeekRepetitive(Number(e.target.value))}
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
              onChange={(e) => setAutomationRate(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>20% (cautious)</span>
              <span>55% (typical)</span>
              <span>85% (optimistic)</span>
            </div>
          </div>

          {/* Monthly Agentic Stack Infra Budget */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-700 font-medium flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                Running cost of the stack
              </label>
              <span className="font-mono text-slate-800 font-bold bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200">
                ${monthlyStackCost} / mo
              </span>
            </div>
            <input
              id="roi-input-stack-cost"
              type="range"
              min="80"
              max="30000"
              step="50"
              value={monthlyStackCost}
              onChange={(e) => setMonthlyStackCost(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$80</span>
              <span>$500</span>
              <span>$2,500</span>
              <span>$30k</span>
            </div>
          </div>

          {/* One-off build cost. Meridian's published tech stack rate is $7,500,
              range $4,500 - $15,000, so the default is the real number. */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-700 font-medium flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                One-off cost to design and build it
              </label>
              <span className="font-mono text-slate-800 font-bold bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200">
                ${buildCost.toLocaleString()}
              </span>
            </div>
            <input
              id="roi-input-build-cost"
              type="range"
              min="2000"
              max="40000"
              step="500"
              value={buildCost}
              onChange={(e) => setBuildCost(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$2k</span>
              <span>$7.5k (Meridian)</span>
              <span>$20k</span>
              <span>$40k</span>
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
              onChange={(e) => setRealisationRate(Number(e.target.value))}
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

            <div className={`rounded-2xl p-4 border ${ongoingAnnualNet > 0 ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-300'}`}>
              <div className={`text-xs font-mono font-semibold mb-1 ${ongoingAnnualNet > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                WORTH PER YEAR, AFTER RUNNING COSTS
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
                ${Math.round(ongoingAnnualNet).toLocaleString()}
              </div>
              <div className={`text-[11px] mt-1 ${ongoingAnnualNet > 0 ? 'text-emerald-700' : 'text-slate-500'}`}>
                Year one is ${Math.round(firstYearNet).toLocaleString()} after the build
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-300 rounded-2xl p-4">
              <div className="text-xs font-mono text-indigo-600 font-semibold mb-1">
                PAYS THE BUILD BACK IN
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
                {paybackLabel}
              </div>
              <div className="text-[11px] text-indigo-700 mt-1">
                {isFinite(paybackMonths)
                  ? 'Then it is the running cost only'
                  : 'At these numbers the running cost is more than the time is worth'}
              </div>
            </div>
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
                {
                  label: 'Running the stack',
                  detail: 'Model usage, vector database, orchestration, MCP tools',
                  value: `- $${annualStackCost.toLocaleString()} / yr`,
                  tone: 'cost' as const,
                },
                {
                  label: 'Designing and building it',
                  detail: 'One-off. Not repeated in later years.',
                  value: `- $${buildCost.toLocaleString()} once`,
                  tone: 'cost' as const,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-4 ${
                    row.tone === 'good' ? 'bg-emerald-50 border-emerald-200'
                      : row.tone === 'cost' ? 'bg-rose-50 border-rose-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800">{row.label}</div>
                    <div className="text-[11px] text-slate-500">{row.detail}</div>
                  </div>
                  <div className={`text-right font-mono font-bold tabular-nums whitespace-nowrap ${
                    row.tone === 'good' ? 'text-emerald-700' : row.tone === 'cost' ? 'text-rose-700' : 'text-slate-700'
                  }`}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-800">First year, everything counted</span>
                <span className={`font-mono font-bold tabular-nums ${firstYearNet >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {firstYearNet >= 0 ? '+' : '-'}${Math.abs(Math.round(firstYearNet)).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-800">Every year after that</span>
                <span className={`font-mono font-bold tabular-nums ${ongoingAnnualNet >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {ongoingAnnualNet >= 0 ? '+' : '-'}${Math.abs(Math.round(ongoingAnnualNet)).toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                Not counted here: the enquiries answered in minutes that would otherwise have gone elsewhere, and the
                mistakes that do not happen because nothing is re-typed. Both are real and neither is safe to put a
                number on before we know your business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
