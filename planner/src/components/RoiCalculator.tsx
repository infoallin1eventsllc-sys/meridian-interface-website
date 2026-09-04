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
  const [teamSize, setTeamSize] = useState<number>(35);
  const [avgSalary, setAvgSalary] = useState<number>(85000);
  const [hoursPerWeekRepetitive, setHoursPerWeekRepetitive] = useState<number>(14);
  const [automationRate, setAutomationRate] = useState<number>(60); // percentage
  const [monthlyStackCost, setMonthlyStackCost] = useState<number>(480); // in USD

  const applyRoiPreset = (preset: 'seed' | 'growth' | 'scale' | 'enterprise') => {
    if (preset === 'seed') {
      setTeamSize(8);
      setAvgSalary(70000);
      setHoursPerWeekRepetitive(12);
      setAutomationRate(50);
      setMonthlyStackCost(150);
    } else if (preset === 'growth') {
      setTeamSize(35);
      setAvgSalary(85000);
      setHoursPerWeekRepetitive(14);
      setAutomationRate(60);
      setMonthlyStackCost(480);
    } else if (preset === 'scale') {
      setTeamSize(150);
      setAvgSalary(100000);
      setHoursPerWeekRepetitive(16);
      setAutomationRate(65);
      setMonthlyStackCost(1500);
    } else {
      // Large enterprise
      setTeamSize(1200);
      setAvgSalary(115000);
      setHoursPerWeekRepetitive(18);
      setAutomationRate(70);
      setMonthlyStackCost(12500);
    }
  };

  // Math:
  // Hourly rate per employee = avgSalary / (52 weeks * 40 hours) = avgSalary / 2080
  const hourlyRate = avgSalary / 2080;
  
  // Weekly hours reclaimed across the team
  const totalWeeklyRepetitiveHours = teamSize * hoursPerWeekRepetitive;
  const weeklyHoursReclaimed = Math.round(totalWeeklyRepetitiveHours * (automationRate / 100));
  const annualHoursReclaimed = weeklyHoursReclaimed * 52;

  // Annual gross dollar savings
  const annualGrossSavings = annualHoursReclaimed * hourlyRate;
  
  // Annual Agentic Stack cost
  const annualStackCost = monthlyStackCost * 12;

  // Net annual savings
  const annualNetSavings = Math.max(0, annualGrossSavings - annualStackCost);

  // Equivalent headcount leverage
  // 1 full-time worker = 2,080 hours/year, or typically ~1,500 effective working hours
  const headcountLeverage = (annualHoursReclaimed / 1800).toFixed(1);

  // Payback period in days
  const dailyGrossSavings = annualGrossSavings / 365;
  const paybackDays = dailyGrossSavings > 0 ? Math.max(1, Math.round(annualStackCost / dailyGrossSavings)) : 0;

  // ROI %
  const roiPercentage = annualStackCost > 0 ? Math.round((annualNetSavings / annualStackCost) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            Financial Modeler
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            ROI & Team Capacity Leverage Calculator
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Quantify the concrete economic impact of deploying an agentic tech stack versus hiring traditional manual headcount as your business scales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Input Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-200 pb-3 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              Company Operational Inputs
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">Scale Preset:</span>
              <button
                type="button"
                onClick={() => applyRoiPreset('seed')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  teamSize === 8
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Seed (8)
              </button>
              <button
                type="button"
                onClick={() => applyRoiPreset('growth')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  teamSize === 35
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Growth (35)
              </button>
              <button
                type="button"
                onClick={() => applyRoiPreset('scale')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  teamSize === 150
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Scale (150)
              </button>
              <button
                type="button"
                onClick={() => applyRoiPreset('enterprise')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  teamSize === 1200
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                Large enterprise (1.2k)
              </button>
            </div>
          </div>

          {/* Team Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-700 font-medium flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                Team Size in Operational Roles
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
              <span>2 (Seed)</span>
              <span>150 (Mid)</span>
              <span>1,200 (Enterprise)</span>
              <span>2,500 (Global)</span>
            </div>
          </div>

          {/* Average Salary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-700 font-medium flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                Avg Loaded Annual Salary
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
                Manual Task Hours / Person / Week
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
                Agent Deflection / Automation Rate
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
              <span>20% (Conservative)</span>
              <span>55% (Standard)</span>
              <span>85% (Aggressive)</span>
            </div>
          </div>

          {/* Monthly Agentic Stack Infra Budget */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-700 font-medium flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                Est. Monthly Agentic Stack Cost
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
              <span>$80 (Seed)</span>
              <span>$500 (Growth)</span>
              <span>$2,500 (Scale)</span>
              <span>$30k (Enterprise)</span>
            </div>
          </div>
        </div>

        {/* Right: Calculated Business Metrics & Leverage Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Hero Numbers Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-50 border border-emerald-400 rounded-2xl p-4">
              <div className="text-xs font-mono text-emerald-600 font-semibold mb-1">
                NET ANNUAL SAVINGS
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
                ${Math.round(annualNetSavings).toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1 font-mono">
                {roiPercentage.toLocaleString()}% Annual ROI
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-500 rounded-2xl p-4">
              <div className="text-xs font-mono text-blue-600 font-semibold mb-1">
                HEADCOUNT LEVERAGE
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
                {headcountLeverage}x
              </div>
              <div className="text-[11px] text-blue-700 mt-1 font-mono">
                Equivalent full-time capacity
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-300 rounded-2xl p-4">
              <div className="text-xs font-mono text-indigo-600 font-semibold mb-1">
                PAYBACK TIMELINE
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
                {paybackDays} Days
              </div>
              <div className="text-[11px] text-indigo-700 mt-1 font-mono">
                Break-even on software cost
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

          {/* Detailed Reclaimed Capacity Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
              Operational Time Reclaimed for Growth
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-slate-500">Weekly Team Hours Reclaimed</div>
                <div className="text-lg font-bold text-blue-700 font-mono mt-1">
                  {weeklyHoursReclaimed} hours / week
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Shifted from busywork to sales & strategy
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-slate-500">Annual Hours Reclaimed</div>
                <div className="text-lg font-bold text-blue-700 font-mono mt-1">
                  {annualHoursReclaimed.toLocaleString()} hours / year
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Eliminates burn-out and turnover friction
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="border-t border-slate-200 pt-4">
              <h5 className="text-xs font-bold text-slate-700 mb-3">
                Economic Comparison: Hiring vs. Agentic Tech Stack
              </h5>
              <div className="space-y-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-700">
                      Traditional Route: Hiring {headcountLeverage} New Employees
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Salary, recruiting fees, equipment, benefits, onboarding lag
                    </div>
                  </div>
                  <div className="text-right font-mono font-bold text-rose-600">
                    ${Math.round(parseFloat(headcountLeverage) * avgSalary).toLocaleString()} / yr
                  </div>
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-emerald-700">
                      Agentic Tech Stack Route
                    </div>
                    <div className="text-[11px] text-emerald-600">
                      Model usage, vector database, orchestration, MCP tools
                    </div>
                  </div>
                  <div className="text-right font-mono font-bold text-emerald-700">
                    ${annualStackCost.toLocaleString()} / yr
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
