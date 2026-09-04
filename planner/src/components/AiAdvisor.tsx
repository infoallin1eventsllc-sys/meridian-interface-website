import React, { useState } from 'react';
import { AdvisorBlueprint } from '../types';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Clock, 
  DollarSign, 
  Copy, 
  Check, 
  FileText,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { motion } from 'motion/react';
import { generateBlueprint, PlannerError } from '../lib/planner';
import { MERIDIAN } from '../lib/brand';

interface AiAdvisorProps {
  /** True when the planner service has a model connected. */
  aiLive: boolean;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ aiLive }) => {
  const [companyName, setCompanyName] = useState<string>('Apex Logistics');
  const [industry, setIndustry] = useState<string>('B2B Freight & Supply Chain SaaS');
  const [stage, setStage] = useState<string>('Growth ($1M - $10M ARR)');
  const [teamSize, setTeamSize] = useState<string>('32 team members');
  const [monthlyBudget, setMonthlyBudget] = useState<string>('$300 - $1,200 / month');
  const [currentTools, setCurrentTools] = useState<string>('HubSpot, Slack, Google Workspace, Stripe, Zendesk, QuickBooks');
  const [painPoints, setPainPoints] = useState<string>('Lead response delay of 6+ hours, manual PDF invoice OCR and reconciliation taking 15 hours/week, tier-1 repetitive support tickets.');
  const [targetAutonomyGoal, setTargetAutonomyGoal] = useState<string>('Autonomous department workflows with Human-in-the-Loop oversight on transactions > $200');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [blueprint, setBlueprint] = useState<AdvisorBlueprint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerateBlueprint = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { blueprint: bp } = await generateBlueprint({
        companyName, industry, stage, teamSize, monthlyBudget, currentTools, painPoints, targetAutonomyGoal,
      });
      setBlueprint(bp);
    } catch (err) {
      setError(err instanceof PlannerError ? err.message : 'Something went wrong. Try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!blueprint) return;
    const md = `# Agentic tech stack plan for ${companyName}\nPrepared with the Meridian Stack Planner (${MERIDIAN.siteLabel}). Figures are estimates, not a quote.
## Where to start
${blueprint.summary}

## The five layers
${blueprint.stackLayers.map(l => `### ${l.layer}\n- **Component:** ${l.component}\n- **Role:** ${l.role}\n- **Cost:** ${l.estimatedCost}\n- **Status:** ${l.status}`).join('\n\n')}

## Rollout in phases
${blueprint.phasedDeployment.map(p => `### ${p.phase}\n*Impact:* ${p.impact}\n${p.actions.map(a => `- ${a}`).join('\n')}`).join('\n\n')}

## Rules the agents run under
${blueprint.guardrailRecommendations.map(g => `- ${g}`).join('\n')}

## Estimated impact
- Monthly Hours Reclaimed: ${blueprint.projectedMetrics.monthlyHoursSaved} hours
- Team Headcount Leverage: ${blueprint.projectedMetrics.headcountEquivalentLeverage}
- Monthly Savings: ${blueprint.projectedMetrics.projectedMonthlySavings}
- Payback Timeline: ${blueprint.projectedMetrics.paybackWeeks} weeks
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            AI advisor
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            A stack plan for your business
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Describe the business, the tools it already uses and what slows it down. Claude drafts a five-layer plan with costs, phases and the rules the agents would run under. It is a starting point for a conversation with Meridian, not a quote.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-200 pb-3">
            About the business
          </h3>

          <form onSubmit={handleGenerateBlueprint} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Company Name</label>
              <input
                id="advisor-company-name"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Industry</label>
                <input
                  id="advisor-industry"
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Growth Stage</label>
                <input
                  id="advisor-stage"
                  type="text"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Team Size</label>
                <input
                  id="advisor-team-size"
                  type="text"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Monthly AI budget</label>
                <input
                  id="advisor-budget"
                  type="text"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tools already in use</label>
              <input
                id="advisor-current-tools"
                type="text"
                value={currentTools}
                onChange={(e) => setCurrentTools(e.target.value)}
                placeholder="e.g. HubSpot, Slack, Stripe, QuickBooks"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">What slows the business down</label>
              <textarea
                id="advisor-pain-points"
                rows={3}
                value={painPoints}
                onChange={(e) => setPainPoints(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 resize-none font-sans"
              />
            </div>

            <button
              id="generate-architecture-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-none disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Drafting the plan…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Draft my stack plan</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}
          {!aiLive && !error && (
            <p className="text-[11px] text-slate-500 leading-relaxed">
              The AI advisor looks offline from here. You can still try; if it does not answer, <a href={MERIDIAN.book} className="underline">book a call</a> and Meridian will draft the plan with you.
            </p>
          )}
        </div>

        {/* Blueprint Output Display (7 cols) */}
        <div className="lg:col-span-7">
          {blueprint ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5"
            >
              {/* Top Action Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Drafted by Claude · estimates
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    Stack plan for {companyName}
                  </h4>
                </div>

                <button
                  id="copy-blueprint-markdown-btn"
                  onClick={handleCopyMarkdown}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy plan'}</span>
                </button>
              </div>

              {/* Executive Summary */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                <span className="font-bold text-blue-700">Where to start: </span>
                {blueprint.summary}
              </div>

              {/* Projected Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500">SAVINGS / MO</div>
                  <div className="text-sm font-bold text-emerald-600 mt-0.5">{blueprint.projectedMetrics.projectedMonthlySavings}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500">HOURS SAVED</div>
                  <div className="text-sm font-bold text-blue-600 mt-0.5">{blueprint.projectedMetrics.monthlyHoursSaved} hrs/mo</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500">LEVERAGE</div>
                  <div className="text-sm font-bold text-indigo-600 mt-0.5">{blueprint.projectedMetrics.headcountEquivalentLeverage}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500">PAYBACK</div>
                  <div className="text-sm font-bold text-amber-600 mt-0.5">{blueprint.projectedMetrics.paybackWeeks} weeks</div>
                </div>
              </div>

              {/* 5-Layer Recommended Stack */}
              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  The five layers
                </h5>
                <div className="space-y-2 text-xs">
                  {blueprint.stackLayers.map((layer, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-blue-700 font-bold">{layer.layer}</span>
                        <span className="font-mono text-emerald-600 text-[11px]">{layer.estimatedCost}</span>
                      </div>
                      <div className="text-slate-900 font-semibold mt-0.5">{layer.component}</div>
                      <p className="text-slate-500 text-[11px] mt-1">{layer.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phased Roadmap */}
              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  Rollout in phases
                </h5>
                <div className="space-y-2.5 text-xs">
                  {blueprint.phasedDeployment.map((phase, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{phase.phase}</span>
                        <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {phase.impact}
                        </span>
                      </div>
                      <ul className="mt-2 space-y-1 text-slate-700 text-[11px]">
                        {phase.actions.map((act, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-blue-600">&bull;</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guardrails Recommendations */}
              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Rules the agents run under
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {blueprint.guardrailRecommendations.map((guard, i) => (
                    <li key={i} className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{guard}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">No plan yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Fill in the business on the left, or try it with the sample profile to see what a plan looks like.
              </p>
              <button
                id="quick-start-advisor-btn"
                onClick={() => handleGenerateBlueprint()}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-blue-700 border border-blue-200 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Try the sample profile</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
