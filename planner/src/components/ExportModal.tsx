import React, { useState } from 'react';
import { SelectedStack, BusinessStage, BusinessModel } from '../types';
import { STACK_LAYERS, STAGE_PRESETS } from '../data/stackComponents';
import { X, Copy, Check, Download, FileText, Code2 } from 'lucide-react';
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

        <div className="p-4 overflow-auto font-mono text-xs text-slate-700 bg-white leading-relaxed whitespace-pre select-all">
          {activeContent}
        </div>
      </div>
    </div>
  );
};
