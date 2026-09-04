import React, { useState } from 'react';
import { SelectedStack, BusinessStage, BusinessModel } from '../types';
import { STACK_LAYERS, STAGE_PRESETS } from '../data/stackComponents';
import { X, Copy, Check, Download, FileText, Code2, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { sendPlanToMeridian, PlannerError } from '../lib/planner';
import { MERIDIAN } from '../lib/brand';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStack: SelectedStack;
  businessStage: BusinessStage;
  businessModel: BusinessModel;
}

const MODEL_LABEL: Record<BusinessModel, string> = {
  b2b_saas: 'B2B SaaS',
  ecommerce: 'E-commerce and retail',
  agency_services: 'Agency and services',
  fintech_health: 'Finance, health or other regulated work',
  large_enterprise: 'Large enterprise',
};

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, selectedStack, businessStage, businessModel }) => {
  const [format, setFormat] = useState<'markdown' | 'json'>('markdown');
  const [copied, setCopied] = useState<boolean>(false);

  // Sending the plan to Meridian: the whole reason a client fills this in.
  const [sendOpen, setSendOpen] = useState<boolean>(false);
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
- **Monthly cost (estimate):** ${item.monthlyCostRange}
- **Response speed:** ${item.latencyRating}
- **Standards used:** ${item.standardProtocols.join(', ')}
- **Why:** ${item.description}`;

  const markdownContent = `# Agentic tech stack plan
Prepared with the Meridian Stack Planner on ${today}.
Built by ${MERIDIAN.name} — ${MERIDIAN.siteLabel} · ${MERIDIAN.email} · ${MERIDIAN.phone}

## Business profile
- **Stage:** ${stageInfo.title} (${stageInfo.revenue})
- **Kind of business:** ${MODEL_LABEL[businessModel]}
- **Estimated running cost:** ${stageInfo.avgMonthlyCost}
- **Typical build time:** ${stageInfo.implementationTime}
- **Fit for autonomy (planning score):** ${stageInfo.readinessScore} / 10

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

  const jsonContent = JSON.stringify(
    {
      preparedBy: { name: MERIDIAN.name, site: MERIDIAN.site, email: MERIDIAN.email, phone: MERIDIAN.phone, tool: 'Meridian Stack Planner' },
      timestamp: new Date().toISOString(),
      businessProfile: {
        stage: businessStage,
        stageTitle: stageInfo.title,
        revenueTier: stageInfo.revenue,
        businessModel,
        estimatedMonthlyCost: stageInfo.avgMonthlyCost,
        typicalBuildTime: stageInfo.implementationTime,
        autonomyFitScore: stageInfo.readinessScore,
      },
      layers: { foundation: fItem, orchestration: oItem, memory: mItem, toolsProtocol: tItem, governance: gItem },
      governanceDesign: {
        approvalGates: 'A person approves money movement and configuration changes above an agreed threshold; approvals are logged with a reason.',
        agentIdentity: 'One identity per agent, least access, short-lived credentials.',
        dataHandling: 'Provider no-retention and no-training terms are signed by the business; personal data is masked before reaching a model.',
        encryption: 'Keys can be held in the business\'s own cloud key store.',
        certifications: 'None claimed by this plan. SOC 2, ISO 27001 and HIPAA belong to the business and its vendors.',
      },
      note: 'Figures are planning estimates, not a quote.',
    },
    null,
    2,
  );

  const activeContent = format === 'markdown' ? markdownContent : jsonContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeContent], { type: format === 'markdown' ? 'text/markdown' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meridian-stack-plan-${businessStage}.${format === 'markdown' ? 'md' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tab = (active: boolean) =>
    `px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
      active ? 'bg-[#0f172a] text-white' : 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="export-title">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2563eb]" />
            <h3 id="export-title" className="text-base font-bold text-[#0f172a]">Export your plan</h3>
          </div>
          <button id="close-export-modal-btn" onClick={onClose} aria-label="Close" className="p-1 rounded-lg text-slate-500 hover:text-[#0f172a] hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#f7f9fd] border-b border-[#e2e8f0] text-xs">
          <div className="flex items-center gap-2">
            <button id="export-format-md-btn" onClick={() => setFormat('markdown')} className={tab(format === 'markdown')}>
              <FileText className="w-3.5 h-3.5" /><span>Markdown (.md)</span>
            </button>
            <button id="export-format-json-btn" onClick={() => setFormat('json')} className={tab(format === 'json')}>
              <Code2 className="w-3.5 h-3.5" /><span>JSON (.json)</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button id="copy-export-content-btn" onClick={handleCopy} className="px-3 py-1 rounded-lg font-semibold bg-white hover:bg-slate-50 text-[#0f172a] border border-slate-300 flex items-center gap-1.5 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button id="download-export-file-btn" onClick={handleDownload} className="px-3 py-1 rounded-lg font-semibold bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center gap-1.5 transition-colors">
              <Download className="w-3.5 h-3.5" /><span>Download</span>
            </button>
          </div>
        </div>

        <div className="p-4 overflow-auto font-mono text-xs text-slate-700 bg-white leading-relaxed whitespace-pre select-all flex-1">
          {activeContent}
        </div>

        {/* Send it to Meridian. Downloading a file is not a next step; this is. */}
        <div className="border-t border-[#e2e8f0] bg-[#f7f9fd] px-4 py-3">
          {sent ? (
            <div className="flex items-start gap-2.5 text-sm text-emerald-800">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <div className="font-semibold">Sent. Otis has your plan.</div>
                <div className="text-xs text-emerald-900/80 mt-0.5">
                  You will hear back within one business day. Keep your copy — download or copy it above.
                </div>
              </div>
            </div>
          ) : !sendOpen ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-[#475569] leading-relaxed max-w-lg">
                Send this plan to Meridian and we will read it before we talk, so the call starts with your stack rather than with questions you have already answered.
              </p>
              <button
                id="open-send-plan-btn"
                onClick={() => setSendOpen(true)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#0f172a] hover:bg-slate-800 text-white flex items-center gap-2 whitespace-nowrap transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Send this plan to Meridian
              </button>
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
                    plan: markdownContent,
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

              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] text-slate-500">
                  An email address or a phone number, so we can reply. Your plan goes with it.
                </p>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setSendOpen(false)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-[#475569] hover:bg-slate-100 transition-colors">
                    Cancel
                  </button>
                  <button
                    id="send-plan-btn"
                    type="submit"
                    disabled={sending || (!email.trim() && !phone.trim())}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
