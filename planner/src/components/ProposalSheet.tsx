import React, { useEffect, useState } from 'react';
import { X, Printer } from 'lucide-react';
import { SelectedStack, BusinessStage, BusinessModel, AdvisorBlueprint } from '../types';
import { STACK_LAYERS, STAGE_PRESETS } from '../data/stackComponents';
import { RoiInputs, computeRoi, money } from '../lib/roi';
import { MERIDIAN } from '../lib/brand';

/**
 * The leave-behind.
 *
 * A client who has just spent twenty minutes moving sliders needs to walk out
 * with something their partner or their accountant can read — and Markdown and
 * JSON are not that. This is the same plan set as a one-page document on
 * Meridian letterhead: what they said, what is proposed, what it frees up,
 * what it costs, and when it pays back. It prints to PDF from the browser and
 * reads fine on screen in a meeting.
 *
 * Everything on it is derived from what the client set. Nothing is invented
 * here that is not on the screens behind it.
 */

interface ProposalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStack: SelectedStack;
  businessStage: BusinessStage;
  businessModel: BusinessModel;
  roi: RoiInputs;
  /** Present only when the client ran the AI advisor. */
  blueprint: AdvisorBlueprint | null;
  /** The name the advisor's plan was written for, used to prefill the header. */
  companyName: string;
}

const MODEL_LABEL: Record<BusinessModel, string> = {
  b2b_saas: 'B2B software',
  ecommerce: 'E-commerce and retail',
  agency_services: 'Agency and services',
  fintech_health: 'Finance, health or other regulated work',
  large_enterprise: 'Large enterprise',
};

const LAYER_TITLE: Record<keyof SelectedStack, string> = {
  foundation: 'Foundation model',
  orchestration: 'Orchestration',
  memory: 'Memory and context',
  toolsProtocol: 'Tools and connections',
  governance: 'Governance and guardrails',
};

export const ProposalSheet: React.FC<ProposalSheetProps> = ({
  isOpen, onClose, selectedStack, businessStage, businessModel, roi, blueprint, companyName,
}) => {
  const [client, setClient] = useState('');
  // The advisor already asked who this is for; do not ask twice.
  useEffect(() => { if (companyName && !client) setClient(companyName); }, [companyName]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock the page behind the sheet. Without this a scroll inside the document
  // carries on into the app underneath, which in a meeting looks broken.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [isOpen]);

  // Escape closes it, the way a document viewer should.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const r = computeRoi(roi);
  const stage = STAGE_PRESETS[businessStage];
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Sections are numbered as they render, because the rollout section only
  // exists when the client ran the advisor.
  let section = 0;
  const n = () => ++section;

  const layers = (Object.keys(LAYER_TITLE) as (keyof SelectedStack)[]).map((key) => {
    const list = STACK_LAYERS[key];
    const item = list.find((i) => i.id === selectedStack[key]) || list[0];
    return { key, title: LAYER_TITLE[key], item };
  });

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-slate-200 print:bg-white print:static print:overflow-visible">
      {/* Controls. Never printed. */}
      <div className="sticky top-0 z-10 bg-[#0f172a] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto sm:flex-1 order-last sm:order-none">
          <span className="text-xs font-semibold whitespace-nowrap">Proposal outline</span>
          <input
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Prepared for… (business name)"
            aria-label="Business name"
            className="px-3 py-1.5 text-xs rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 flex-1 min-w-0 sm:w-56 sm:flex-none sm:min-w-[14rem]"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            id="print-proposal-btn"
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#0f172a] hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print or save as PDF
          </button>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* The document itself. */}
      <article className="mx-auto my-6 print:my-0 bg-white text-[#191c1f] max-w-[820px] px-8 sm:px-12 py-10 shadow-lg print:shadow-none print:max-w-none">
        <header className="flex items-start justify-between gap-6 pb-6 border-b-2 border-[#0f172a]">
          <div>
            <img src="/brand/meridian-lockup.png" alt="Meridian Interface" width={885} height={550} className="h-12 w-auto" />
            <p className="text-[11px] text-[#475569] mt-2">{MERIDIAN.tagline} · {MERIDIAN.city}</p>
          </div>
          <div className="text-right text-[11px] text-[#475569] leading-relaxed">
            <div className="font-bold text-[#0f172a] text-sm">Agentic tech stack</div>
            <div>Proposal outline</div>
            <div className="mt-1">{today}</div>
          </div>
        </header>

        <h1 className="text-2xl font-extrabold text-[#0f172a] mt-7" style={{ fontFamily: 'var(--font-display)' }}>
          Prepared for {client.trim() || 'your business'}
        </h1>
        <p className="text-sm text-[#475569] mt-2 leading-relaxed max-w-[62ch]">
          This is the plan you built in the Meridian Stack Planner, written out. Every figure below comes from the numbers
          you set. They are planning estimates for a conversation, not a quote — the quote comes after we have looked at
          how your business actually runs.
        </p>

        <Section title={`${n()}. What you told us`}>
          <Grid rows={[
            ['Stage', `${stage.title} (${stage.revenue})`],
            ['Kind of business', MODEL_LABEL[businessModel]],
            ['People doing the day-to-day work', `${roi.teamSize.toLocaleString()}`],
            ['Hours a week each on repeat work', `${roi.hoursPerWeekRepetitive}`],
            ['Share of that we would automate', `${roi.automationRate}%`],
          ]} />
        </Section>

        <Section title={`${n()}. What we would build`}>
          <div className="space-y-2.5">
            {layers.map(({ key, title, item }) => (
              <div key={key} className="border border-[#e2e8f0] rounded-lg p-3.5 break-inside-avoid">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">{title}</div>
                  <div className="text-[11px] font-mono text-[#475569] sm:whitespace-nowrap">{item.monthlyCostRange}</div>
                </div>
                <div className="text-sm font-bold text-[#0f172a] mt-0.5">{item.name}</div>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">{item.plain ?? item.description}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#475569] mt-3 leading-relaxed">
            Typical build time at this stage: {stage.implementationTime}.
          </p>
        </Section>

        {blueprint && blueprint.phasedDeployment?.length > 0 && (
          <Section title={`${n()}. How we would roll it out`}>
            <p className="text-xs text-[#475569] mb-3 leading-relaxed max-w-[62ch]">{blueprint.summary}</p>
            <div className="space-y-2.5">
              {blueprint.phasedDeployment.map((phase, i) => (
                <div key={i} className="border border-[#e2e8f0] rounded-lg p-3.5 break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-4">
                    <div className="text-sm font-bold text-[#0f172a]">{phase.phase}</div>
                    <div className="text-[11px] text-[#475569] sm:text-right">{phase.impact}</div>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {phase.actions.map((a, k) => (
                      <li key={k} className="flex gap-2.5 text-xs text-[#475569] leading-relaxed">
                        <span className="text-[#2563eb] font-bold shrink-0">·</span><span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#475569] mt-3 leading-relaxed">
              Drafted by Claude from what you described, and reviewed by us before any of it is quoted.
            </p>
          </Section>
        )}

        <Section title={`${n()}. What it frees up`}>
          <Grid rows={[
            ['Time spent on repeat work today', `${r.weeklyRepeatHours.toLocaleString()} hours a week`],
            ['Time the agents would take on', `${r.weeklyHoursFreed.toLocaleString()} hours a week`],
            ['Over a year', `${r.annualHoursFreed.toLocaleString()} hours, about ${r.headcountLeverage} full-time people`],
            [`What that is worth, counting ${roi.realisationRate}% of it as money`, `${money(r.annualValue)} a year`],
          ]} />
          <p className="text-[11px] text-[#475569] mt-3 leading-relaxed">
            An hour saved is only worth money if it goes into work that earns, or a hire you no longer make. The
            {' '}{roi.realisationRate}% above is that discount, applied on purpose. Not counted at all: the enquiries
            answered in minutes that would otherwise have gone elsewhere, and the mistakes that do not happen because
            nothing is re-typed.
          </p>
        </Section>

        <Section title={`${n()}. What it costs, and when it pays for itself`}>
          <Grid rows={[
            ['Design and build (one-off)', money(roi.buildCost)],
            ['Running it', `${money(roi.monthlyStackCost)} a month · ${money(r.annualStackCost)} a year`],
            ['First year, everything counted', `${r.firstYearNet >= 0 ? '+' : '−'}${money(Math.abs(r.firstYearNet))}`],
            ['Every year after that', `${r.ongoingAnnualNet >= 0 ? '+' : '−'}${money(Math.abs(r.ongoingAnnualNet))}`],
            ['Pays the build back in', r.paybackLabel],
          ]} emphasiseLast />
          <p className="text-[11px] text-[#475569] mt-3 leading-relaxed">
            You own the setup. There is no per-seat fee that grows every time you hire.
          </p>
        </Section>

        <Section title={`${n()}. How it runs, day to day`}>
          <ul className="space-y-1.5 text-sm text-[#191c1f]">
            {Array.from(new Set([
              // What the advisor recommended for this business, first, then the
              // rules that hold on every build regardless.
              ...(blueprint?.guardrailRecommendations ?? []).slice(0, 3),
              'Each agent has its own login with the least access it needs — never yours.',
              'Nothing reaches a customer, and no money moves, without a person approving it.',
              'Personal details are masked before any text reaches a model.',
              'Every action and every approval is written to a log that cannot be quietly edited.',
              'Certifications such as SOC 2 or HIPAA belong to your business and your vendors. The stack is built so the evidence those audits ask for already exists.',
            ])).map((line) => (
              <li key={line} className="flex gap-2.5 leading-relaxed">
                <span className="text-[#2563eb] font-bold shrink-0">·</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={`${n()}. Next step`}>
          <p className="text-sm leading-relaxed max-w-[62ch]">
            A call to walk through how work actually moves through your business. We map that first, then confirm the
            numbers above against what we find, then quote. Nothing is built before you have seen the quote.
          </p>
        </Section>

        <footer className="mt-8 pt-5 border-t-2 border-[#0f172a] flex flex-wrap items-end justify-between gap-4 text-[11px] text-[#475569]">
          <div>
            <div className="font-bold text-[#0f172a] text-sm">{MERIDIAN.name}</div>
            <div className="mt-0.5">{MERIDIAN.siteLabel} · {MERIDIAN.email} · {MERIDIAN.phone}</div>
          </div>
          <div className="text-right max-w-[46ch] leading-relaxed">
            Planning estimates, not a quote. Nothing here is a certification or a compliance attestation.
            Model prices are the providers' published rates at the time of writing.
          </div>
        </footer>
      </article>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mt-7 break-inside-avoid">
    <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#0f172a] pb-2 mb-3 border-b border-[#e2e8f0]" style={{ fontFamily: 'var(--font-display)' }}>
      {title}
    </h2>
    {children}
  </section>
);

const Grid: React.FC<{ rows: [string, string][]; emphasiseLast?: boolean }> = ({ rows, emphasiseLast }) => (
  <dl className="divide-y divide-[#e2e8f0] border-y border-[#e2e8f0]">
    {rows.map(([k, v], i) => {
      const strong = emphasiseLast && i === rows.length - 1;
      return (
        <div key={k} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-6 py-2">
          <dt className={`text-xs ${strong ? 'font-bold text-[#0f172a]' : 'text-[#475569]'}`}>{k}</dt>
          <dd className={`font-mono tabular-nums sm:text-right ${strong ? 'text-base font-bold text-[#0f172a]' : 'text-sm text-[#0f172a]'}`}>{v}</dd>
        </div>
      );
    })}
  </dl>
);
