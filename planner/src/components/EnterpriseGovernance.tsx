import React, { useState } from 'react';
import {
  ShieldCheck, Lock, KeyRound, FileCheck, AlertTriangle, CheckCircle2, ShieldAlert,
  Search, Fingerprint, Download, Copy, Check, RefreshCw, Terminal, Users, ScrollText,
} from 'lucide-react';
import { ENTERPRISE_COMPLIANCE_STANDARDS, ENTERPRISE_IAM_PERMISSIONS, INITIAL_AUDIT_LEDGER } from '../data/stackComponents';
import { AuditLedgerRecord } from '../types';
import { MERIDIAN } from '../lib/brand';

/**
 * Governance: who can do what, and the proof.
 *
 * Everything on this screen is a design pattern Meridian builds into a stack.
 * None of it is a certificate. The first version of this page said "SOC 2
 * Type II: Verified 0 Exceptions" and "Clearance 99.4%" about software nobody
 * had audited; a client's security reviewer would have caught that in a minute
 * and stopped reading. The labels now say what is true: designed in, pattern
 * available, or something the client obtains from their auditor or vendor.
 */

interface EnterpriseGovernanceProps {
  onOpenExport?: () => void;
}

type Tab = 'compliance' | 'iam' | 'ledger' | 'packet';

const STATUS_STYLE: Record<string, string> = {
  'Designed in': 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  'Pattern available': 'bg-blue-50 text-blue-800 border border-blue-200',
  'Client obtains': 'bg-amber-50 text-amber-800 border border-amber-200',
};

const FRAMEWORKS = ['All', 'EU AI Act', 'SOC 2 Type II', 'Zero Data Retention', 'CMEK', 'ISO 27001', 'HIPAA'];

export const EnterpriseGovernance: React.FC<EnterpriseGovernanceProps> = ({ onOpenExport }) => {
  const [activeTab, setActiveTab] = useState<Tab>('compliance');
  const [selectedFramework, setSelectedFramework] = useState<string>('All');
  const [auditFilter, setAuditFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [auditRecords, setAuditRecords] = useState<AuditLedgerRecord[]>(INITIAL_AUDIT_LEDGER);
  const [sim, setSim] = useState<{ running: boolean; result?: { message: string; hash: string } }>({ running: false });
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [copiedPacket, setCopiedPacket] = useState<boolean>(false);

  const q = searchQuery.trim().toLowerCase();

  const filteredCompliance = ENTERPRISE_COMPLIANCE_STANDARDS.filter((item) => {
    if (selectedFramework !== 'All' && item.framework !== selectedFramework) return false;
    if (!q) return true;
    return [item.title, item.mandateReference, item.implementation].some((s) => s.toLowerCase().includes(q));
  });

  const filteredAudit = auditRecords.filter((r) => {
    if (auditFilter !== 'ALL' && r.status !== auditFilter) return false;
    if (!q) return true;
    return [r.agentName, r.targetSystem, r.action, r.sha256Hash].some((s) => s.toLowerCase().includes(q));
  });

  /** A demonstration of the containment gate. Runs in the browser; touches nothing. */
  const handleSimulateEscalation = () => {
    setSim({ running: true });
    setTimeout(() => {
      const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const record: AuditLedgerRecord = {
        id: `EX-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        agentName: 'HR benefits assistant',
        action: 'ATTEMPT_WRITE_EXECUTIVE_PAY',
        targetSystem: 'HR system, compensation table',
        sha256Hash: hash,
        approver: 'Blocked by the permission gate',
        complianceRule: 'Least-privilege rule: this agent has no write access to pay',
        status: 'CONTAINED',
      };
      setAuditRecords((prev) => [record, ...prev]);
      setSim({
        running: false,
        result: {
          message: 'The gate refused the write, revoked the agent\'s token for five minutes, and wrote the attempt to the log with a hash so it cannot be edited quietly later.',
          hash,
        },
      });
    }, 1100);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const packetText = `GOVERNANCE SUMMARY FOR A SECURITY OR IT REVIEWER
Prepared with the Meridian Stack Planner — ${MERIDIAN.name}, ${MERIDIAN.siteLabel}

WHAT THIS DOCUMENT IS
A description of the governance patterns designed into an agentic tech stack
built by Meridian Interface. It is not a certification, an audit report, or an
attestation. Certifications (SOC 2, ISO 27001, HIPAA and similar) belong to the
business and its vendors; the patterns below are how a stack is built so the
evidence those audits ask for exists from day one.

1. WHO THE AGENTS ARE
- Every agent has its own identity, separate from any employee.
- Each identity has the least access it needs, per system, read or write.
- Credentials are short-lived and rotated; revoking one isolates one agent.

2. WHAT NEEDS A PERSON
- Money movement and production configuration changes stop for approval above a
  threshold the business sets. The approval, the approver and the reason are logged.
- Some actions are never allowed to an agent at all (for example, changing pay).

3. WHERE THE DATA GOES
- Personal data is masked before text reaches a model, and restored on the way back.
- Provider no-retention and no-training terms are available on business
  agreements; the business signs them with the provider.
- Encryption keys can live in the business's own cloud key store, so revoking a
  key locks everything the agents remember.

4. WHAT THE RECORD LOOKS LIKE
- Every agent action and every human approval is written to an append-only log,
  each entry hashed so later edits are detectable.
- Traces of every run can be replayed step by step.

5. WHAT THE BUSINESS STILL HAS TO DO
- Sign provider data-handling terms.
- Obtain any certification its customers require, with its own auditor.
- Set the approval thresholds and the list of never-allowed actions.

Contact: ${MERIDIAN.email} · ${MERIDIAN.phone}`;

  const handleCopyPacket = () => {
    navigator.clipboard.writeText(packetText);
    setCopiedPacket(true);
    setTimeout(() => setCopiedPacket(false), 2500);
  };

  const tabBtn = (id: Tab, label: string, Icon: React.ComponentType<{ className?: string }>) => (
    <button
      id={`tab-btn-${id}`}
      onClick={() => setActiveTab(id)}
      className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
        activeTab === id ? 'bg-[#0f172a] text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-[#0f172a]'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div id="enterprise-governance-root" className="space-y-8 animate-fadeIn">
      {/* Title card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f172a]">
              Who can do what, and the proof
            </h1>
            <p className="mt-2 text-[#475569] text-sm sm:text-base leading-relaxed">
              Agents that can act need the same discipline as employees who can act: their own identity, the least access that does the job,
              a person for the decisions that matter, and a record nobody can quietly edit. This is how Meridian builds that in.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 max-w-md leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 mb-1"><AlertTriangle className="w-3.5 h-3.5" /> What this page is not</div>
            A certification. SOC 2, ISO 27001 and HIPAA are audits of a business and its vendors, not features of software.
            Everything here is labelled as <strong>designed in</strong>, a <strong>pattern available</strong>, or something the <strong>client obtains</strong>.
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#e2e8f0] grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Users, title: 'One identity per agent', body: 'Least access, per system, read or write.' },
            { icon: FileCheck, title: 'A person for what matters', body: 'Money and configuration stop for approval.' },
            { icon: Lock, title: 'Keys the business holds', body: 'Encryption keys in your own cloud key store.' },
            { icon: ScrollText, title: 'A record that keeps', body: 'Append-only log, every entry hashed.' },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-[#f7f9fd] rounded-lg p-3 border border-[#e2e8f0]">
              <Icon className="w-4 h-4 text-[#2563eb]" />
              <div className="text-sm font-bold text-[#0f172a] mt-1.5">{title}</div>
              <div className="text-[11px] text-[#475569] mt-0.5">{body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-tabs */}
      <div id="enterprise-tabs-nav" className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e8f0] pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {tabBtn('compliance', `Frameworks (${ENTERPRISE_COMPLIANCE_STANDARDS.length})`, ShieldCheck)}
          {tabBtn('iam', `Agent permissions (${ENTERPRISE_IAM_PERMISSIONS.length})`, KeyRound)}
          {tabBtn('ledger', `Audit log (${auditRecords.length})`, Fingerprint)}
          {tabBtn('packet', 'Reviewer summary', FileCheck)}
        </div>
        <div className="relative w-48 sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search frameworks, hashes…"
            aria-label="Search"
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          />
        </div>
      </div>

      {/* Frameworks */}
      {activeTab === 'compliance' && (
        <div id="tab-content-compliance" className="space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Framework:</span>
            {FRAMEWORKS.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFramework(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedFramework === f ? 'bg-[#0f172a] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCompliance.map((item) => (
              <div key={item.id} id={`compliance-card-${item.id}`} className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 uppercase tracking-wide">{item.framework}</span>
                      <h3 className="text-base font-bold text-[#0f172a] mt-1">{item.title}</h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 whitespace-nowrap ${STATUS_STYLE[item.status]}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.status}
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="bg-[#f7f9fd] p-2.5 rounded-lg border border-[#e2e8f0]">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">The rule</div>
                      <div className="text-slate-800 mt-0.5">{item.mandateReference}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">How the stack is built for it</div>
                      <p className="text-slate-700 mt-0.5 leading-relaxed">{item.implementation}</p>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">What the evidence looks like, and who produces it</div>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{item.auditEvidence}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-slate-500">
                  <span>Design pattern, not a certificate</span>
                  <span className="font-mono text-slate-400">{item.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent permissions */}
      {activeTab === 'iam' && (
        <div id="tab-content-iam" className="space-y-6">
          <div className="bg-[#0f172a] rounded-xl p-5 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold">Try the permission gate</h3>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  A demonstration, in your browser. An HR assistant that is allowed to read benefits tries to write to executive pay. Watch what the gate does.
                </p>
              </div>
              <button
                id="btn-simulate-privilege-elevation"
                onClick={handleSimulateEscalation}
                disabled={sim.running}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#0f172a] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                {sim.running ? (<><RefreshCw className="w-3.5 h-3.5 animate-spin" />Trying the write…</>) : (<><Terminal className="w-3.5 h-3.5" />Run the demonstration</>)}
              </button>
            </div>
            {sim.result && (
              <div className="mt-4 p-4 rounded-lg bg-white/5 border border-red-400/50 flex items-start gap-3 text-xs animate-fadeIn">
                <AlertTriangle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-red-200">Blocked: the agent has no write access to pay</div>
                  <div className="text-slate-200">{sim.result.message}</div>
                  <div className="font-mono text-[11px] text-slate-400 break-all">Log entry hash: {sim.result.hash}</div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
            <div className="p-4 border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f7f9fd]">
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">Example: five agents across five systems</h3>
                <p className="text-xs text-slate-500 mt-0.5">The shape of a permission matrix. Yours would name your systems: the CRM, the accounting package, the help desk.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {[['bg-blue-100 border-blue-300', 'Read'], ['bg-amber-100 border-amber-300', 'Staged write'], ['bg-emerald-100 border-emerald-300', 'Full write'], ['bg-red-100 border-red-300', 'Denied']].map(([c, l]) => (
                  <span key={l} className="flex items-center gap-1 text-slate-600"><span className={`w-2.5 h-2.5 rounded border inline-block ${c}`} />{l}</span>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-[#e2e8f0] text-slate-600 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Agent</th>
                    <th className="py-3 px-3">ERP</th>
                    <th className="py-3 px-3">Help desk</th>
                    <th className="py-3 px-3">CRM</th>
                    <th className="py-3 px-3">Data warehouse</th>
                    <th className="py-3 px-3">HR system</th>
                    <th className="py-3 px-4">When a person signs off</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ENTERPRISE_IAM_PERMISSIONS.map((agent) => (
                    <tr key={agent.agentId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#0f172a]">{agent.agentName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono"><KeyRound className="w-3 h-3 text-slate-400" />{agent.agentId} · {agent.role}</div>
                      </td>
                      <td className="py-3 px-3"><PermissionPill permission={agent.sapPermission} /></td>
                      <td className="py-3 px-3"><PermissionPill permission={agent.serviceNowPermission} /></td>
                      <td className="py-3 px-3"><PermissionPill permission={agent.salesforcePermission} /></td>
                      <td className="py-3 px-3"><PermissionPill permission={agent.snowflakePermission} /></td>
                      <td className="py-3 px-3"><PermissionPill permission={agent.workdayPermission} /></td>
                      <td className="py-3 px-4"><div className="text-[11px] text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-medium">{agent.dualApprovalThreshold}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Audit log */}
      {activeTab === 'ledger' && (
        <div id="tab-content-ledger" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#0f172a]">The audit log, with example records</h3>
              <p className="text-xs text-slate-500 mt-0.5">Every agent action and every approval is appended with a hash, so an edited record no longer matches. The rows below are examples.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Show:</span>
              {(['ALL', 'SUCCESS', 'SUPERVISED', 'CONTAINED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setAuditFilter(status)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${auditFilter === status ? 'bg-[#0f172a] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {status === 'ALL' ? 'All' : status === 'SUCCESS' ? 'Ran' : status === 'SUPERVISED' ? 'Approved by a person' : 'Blocked'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredAudit.map((record) => (
              <div key={record.id} id={`audit-record-${record.id}`} className="bg-white rounded-xl border border-[#e2e8f0] p-4 hover:border-slate-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-[#0f172a] bg-slate-100 px-2 py-0.5 rounded">{record.id}</span>
                    <span className="text-xs text-slate-500">{record.timestamp}</span>
                    <span className="text-xs font-bold text-slate-800">· {record.agentName}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
                    record.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : record.status === 'SUPERVISED' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status === 'SUCCESS' ? 'Ran' : record.status === 'SUPERVISED' ? 'Approved' : 'Blocked'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
                  <div>
                    <span className="text-slate-400 font-medium">Action: </span><span className="font-mono font-semibold text-slate-800">{record.action}</span>
                    <span className="text-slate-400 font-medium ml-3">Target: </span><span className="font-semibold text-slate-800">{record.targetSystem}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Rule: </span><span className="text-slate-700 font-medium">{record.complianceRule}</span>
                    <span className="text-slate-400 font-medium ml-3">Approver: </span><span className="text-slate-700">{record.approver}</span>
                  </div>
                </div>
                <div className="bg-[#0f172a] text-slate-300 p-2.5 rounded-lg font-mono text-[11px] flex items-center justify-between gap-3 overflow-hidden">
                  <div className="truncate"><span className="text-slate-500">SHA-256: </span><span className="text-emerald-300">{record.sha256Hash}</span></div>
                  <button onClick={() => handleCopyHash(record.sha256Hash)} className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors shrink-0" title="Copy hash" aria-label="Copy hash">
                    {copiedHash === record.sha256Hash ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviewer summary */}
      {activeTab === 'packet' && (
        <div id="tab-content-ciso-packet" className="space-y-6">
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
              <div>
                <h3 className="text-lg font-bold text-[#0f172a]">A summary for your security or IT reviewer</h3>
                <p className="text-xs text-slate-500 mt-0.5">Plain words on how the agents are governed, and an honest list of what the business still has to do itself.</p>
              </div>
              <div className="flex items-center gap-3">
                <button id="btn-copy-ciso-packet" onClick={handleCopyPacket} className="px-3.5 py-2 bg-white hover:bg-slate-50 text-[#0f172a] border border-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2">
                  {copiedPacket ? (<><Check className="w-3.5 h-3.5 text-emerald-600" />Copied</>) : (<><Copy className="w-3.5 h-3.5" />Copy summary</>)}
                </button>
                {onOpenExport && (
                  <button onClick={onOpenExport} className="px-3.5 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2">
                    <Download className="w-3.5 h-3.5" />Export the full plan
                  </button>
                )}
              </div>
            </div>
            <pre className="mt-5 whitespace-pre-wrap font-mono text-xs text-slate-700 leading-relaxed bg-[#f7f9fd] border border-[#e2e8f0] rounded-lg p-4">{packetText}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

const PermissionPill: React.FC<{ permission: 'Read' | 'Staged Write' | 'Full Write' | 'Denied' }> = ({ permission }) => {
  const style =
    permission === 'Read' ? 'bg-blue-50 text-blue-800 border-blue-200' :
    permission === 'Staged Write' ? 'bg-amber-50 text-amber-800 border-amber-200' :
    permission === 'Full Write' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
    'bg-red-50 text-red-800 border-red-200';
  return <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-semibold whitespace-nowrap ${style}`}>{permission === 'Staged Write' ? 'Staged write' : permission === 'Full Write' ? 'Full write' : permission}</span>;
};
