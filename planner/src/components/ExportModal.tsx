import React, { useState } from 'react';
import { SelectedStack, BusinessStage, BusinessModel, AdvisorBlueprint } from '../types';
import { STACK_LAYERS, STAGE_PRESETS } from '../data/stackComponents';
import { X, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { sendPlanToMeridian, PlannerError } from '../lib/planner';
import { MERIDIAN } from '../lib/brand';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStack: SelectedStack;
  businessStage: BusinessStage;
  businessModel: BusinessModel;
  onOpenProposal: () => void;
  /** The AI advisor's plan, when the visitor ran it: sent along so Meridian sees it too. */
  blueprint?: AdvisorBlueprint | null;
  companyName?: string;
}

const MODEL_LABEL: Record<BusinessModel, string> = {
  b2b_saas: 'B2B SaaS',
  ecommerce: 'E-commerce and retail',
  agency_services: 'Agency and services',
  fintech_health: 'Finance, health or other regulated work',
  large_enterprise: 'Large enterprise',
};

/**
 * Send your plan.
 *
 * The full technical plan (every tool, why, and how they connect) goes to
 * Meridian, never to the visitor's clipboard or downloads: a portable blueprint
 * is something a visitor can hand to a cheaper builder, and it is what the
 * appointment is for. The visitor sees their plan in plain words, with no tool
 * names, and sends it.
 */
export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, selectedStack, businessStage, businessModel, onOpenProposal, blueprint, companyName }) => {

  // Sending the plan to Meridian: the whole reason a client fills this in.
  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const pick = (layer: keyof typeof STACK_LAYERS, id: string) =>
    STACK_LAYERS[layer].find((i) => i.id === id) || STACK_LAYERS[layer][0];
  const fItem = pick('foundation', selectedStack.foundation);
  const oItem = pick('orchestration', selectedStack.orchestration);
  const mItem = pick('memory', selectedStack.memory);
  const tItem = pick('toolsProtocol', selectedStack.toolsProtocol);
  const gItem = pick('governance', selectedStack.governance);
  const stageInfo = STAGE_PRESETS[businessStage];
  const today = new Date().toISOString().split('T')[0];

  const layerMd = (n: number, title: string, item: typeof fItem) => `### Layer ${n}: ${title}
- **Choice:** ${item.name}
- **Response speed:** ${item.latencyRating}
- **Standards used:** ${item.standardProtocols.join(', ')}
- **Why:** ${item.description}`;

  const markdownContent = `# Agentic tech stack plan
Prepared with the Meridian Stack Planner on ${today}.
Built by ${MERIDIAN.name} — ${MERIDIAN.siteLabel} · ${MERIDIAN.email} · ${MERIDIAN.phone}

## Business profile
- **Stage:** ${stageInfo.title} (${stageInfo.revenue})
- **Kind of business:** ${MODEL_LABEL[businessModel]}
- **Typical build time:** ${stageInfo.implementationTime}
- **How much could run unattended (our judgement, not a measurement):** ${stageInfo.readinessScore} / 10

---

## The five layers

${layerMd(1, 'Foundation model', fItem)}

${layerMd(2, 'Orchestration', oItem)}

${layerMd(3, 'Memory and context', mItem)}

${layerMd(4, 'Tools and protocols', tItem)}

${layerMd(5, 'Governance, observability and guardrails', gItem)}

---

## How the parts talk to each other
- **Model calls:** HTTPS with streaming; structured JSON output where a tool needs it.
- **Tools:** Model Context Protocol (MCP) servers, one per system the agents touch.
- **Tracing:** OpenTelemetry traces so every step of every run can be replayed.
- **Safety:** a person approves anything over an agreed threshold; personal data is masked before it reaches a model.

## Governance design notes
- Each agent gets its own identity with the least access it needs.
- Money and configuration changes stop for approval; the approval and its reason are logged.
- Model providers' no-retention and no-training terms are available on business agreements; the business signs them.
- Encryption keys can live in the business's own cloud key store.
- Certifications such as SOC 2, ISO 27001 or HIPAA belong to the business and its vendors. This plan is designed so the evidence they need exists; it does not claim them.

## Next step
Bring this plan to a call with ${MERIDIAN.name}: ${MERIDIAN.book}
Figures above are planning estimates, not a quote.
`;

  // The advisor's rollout, when the visitor ran it, travels with the plan.
  const advisorMd = blueprint
    ? `\n## AI advisor plan${companyName ? ` for ${companyName}` : ''}\n${blueprint.summary}\n\n` +
      blueprint.phasedDeployment.map(p => `### ${p.phase}\n*Impact:* ${p.impact}\n${p.actions.map(x => `- ${x}`).join('\n')}`).join('\n\n') +
      `\n\n### Rules the agents run under\n${blueprint.guardrailRecommendations.map(g => `- ${g}`).join('\n')}\n`
    : '';

  const summary: { title: string; item: typeof fItem }[] = [
    { title: 'Foundation model', item: fItem },
    { title: 'Orchestration', item: oItem },
    { title: 'Memory and context', item: mItem },
    { title: 'Tools and connections', item: tItem },
    { title: 'Governance and guardrails', item: gItem },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="export-title">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl w-full max-w-3xl shadow-xl overflow-y-auto sm:overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-[#2563eb]" />
            <h3 id="export-title" className="text-base font-bold text-[#0f172a]">Send your plan to Meridian</h3>
          </div>
          <button id="close-export-modal-btn" onClick={onClose} aria-label="Close" className="p-1 rounded-lg text-slate-500 hover:text-[#0f172a] hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 sm:overflow-auto sm:flex-1 space-y-4">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              ['Stage', `${stageInfo.title} (${stageInfo.revenue})`],
              ['Kind of business', MODEL_LABEL[businessModel]],
              ['Typical build time', stageInfo.implementationTime],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-[#e2e8f0] bg-[#f7f9fd] px-3 py-2">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-[#475569]">{k}</dt>
                <dd className="text-xs font-semibold text-[#0f172a] mt-0.5">{v}</dd>
              </div>
            ))}
          </dl>

          <div>
            <h4 className="text-xs font-bold text-[#0f172a]">What your system does</h4>
            <ol className="mt-2 space-y-1.5">
              {summary.map(({ title, item }, i) => (
                <li key={title} className="flex gap-3 text-xs leading-relaxed">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#0f172a] text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                  <span><span className="font-semibold text-[#0f172a]">{title}.</span> <span className="text-[#475569]">{item.plain ?? ''}</span></span>
                </li>
              ))}
            </ol>
          </div>

          <p className="text-xs text-[#475569] leading-relaxed bg-[#f7f9fd] border border-[#e2e8f0] rounded-lg px-3 py-2.5">
            Send it and we prepare your <span className="font-semibold text-[#0f172a]">full build plan</span>: the specific
            tools for each step, how they connect to what you already use, and the order we would build it in. We go through
            it with you at your appointment.
            {' '}<button type="button" id="open-proposal-from-export-btn" onClick={onOpenProposal} className="font-semibold text-[#2563eb] hover:underline">See the proposal outline</button>
          </p>
        </div>

        {/* Send it to Meridian: the next step, and the only way the full plan leaves the page. */}
        <div className="border-t border-[#e2e8f0] bg-[#f7f9fd] px-4 py-3">
          {sent ? (
            <div className="flex items-start gap-2.5 text-sm text-emerald-800">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <div className="font-semibold">Sent. A Meridian Interface agent has your plan.</div>
                <div className="text-xs text-emerald-900/80 mt-0.5">
                  You will hear back within one business day, and we bring your full build plan to the appointment.
                </div>
              </div>
            </div>
          ) : (
            <form
              className="space-y-2.5"
              onSubmit={async (e) => {
                e.preventDefault();
                setSending(true);
                setSendError(null);
                try {
                  await sendPlanToMeridian({
                    name, email, phone, company, note,
                    stage: `${stageInfo.title} · ${MODEL_LABEL[businessModel]}`,
                    plan: markdownContent + advisorMd,
                  });
                  setSent(true);
                } catch (err) {
                  setSendError(err instanceof PlannerError ? err.message : 'Something went wrong. Try again, or email the plan to otis@meridianinterface.com.');
                } finally {
                  setSending(false);
                }
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label className="text-[11px] font-semibold text-[#475569]">
                  Your name
                  <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name"
                    className="mt-1 w-full px-3 py-2 text-xs rounded-lg bg-white border border-slate-300 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2563eb]" />
                </label>
                <label className="text-[11px] font-semibold text-[#475569]">
                  Business
                  <input value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization"
                    className="mt-1 w-full px-3 py-2 text-xs rounded-lg bg-white border border-slate-300 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2563eb]" />
                </label>
                <label className="text-[11px] font-semibold text-[#475569]">
                  Email
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email"
                    className="mt-1 w-full px-3 py-2 text-xs rounded-lg bg-white border border-slate-300 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2563eb]" />
                </label>
                <label className="text-[11px] font-semibold text-[#475569]">
                  Phone
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" autoComplete="tel"
                    className="mt-1 w-full px-3 py-2 text-xs rounded-lg bg-white border border-slate-300 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2563eb]" />
                </label>
              </div>
              <label className="block text-[11px] font-semibold text-[#475569]">
                Anything you want us to know (optional)
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
                  className="mt-1 w-full px-3 py-2 text-xs rounded-lg bg-white border border-slate-300 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2563eb] resize-none" />
              </label>

              {sendError && (
                <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{sendError}</p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[11px] text-slate-500">
                  An email address or a phone number, so we can reply. Your plan goes with it.
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    id="send-plan-btn"
                    type="submit"
                    disabled={sending || (!email.trim() && !phone.trim())}
                    className="px-3.5 py-2.5 sm:py-2 rounded-lg text-xs font-semibold bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    {sending ? 'Sending…' : 'Send my plan'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
