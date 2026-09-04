import React, { useState } from 'react';
import { DEPARTMENT_PLAYBOOKS } from '../data/stackComponents';
import { DepartmentPlaybook } from '../types';
import { 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  Wrench, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight,
  Bot,
  Zap,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';

export const DepartmentPlaybooks: React.FC = () => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(DEPARTMENT_PLAYBOOKS[0].id);

  const activePlaybook = DEPARTMENT_PLAYBOOKS.find(d => d.id === selectedDeptId) || DEPARTMENT_PLAYBOOKS[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
            Autonomous Department Blueprints
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            High-Leverage Agentic Playbooks
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Where does an autonomous agent stack drive immediate cash flow and operational leverage? Explore real-world squad blueprints for the 4 core departments in growing companies.
        </p>
      </div>

      {/* Department Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DEPARTMENT_PLAYBOOKS.map((playbook) => {
          const isSelected = selectedDeptId === playbook.id;
          return (
            <button
              key={playbook.id}
              id={`playbook-tab-${playbook.id}`}
              onClick={() => setSelectedDeptId(playbook.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-100 border-blue-500 text-slate-900 ring-1 ring-blue-500/30 shadow-md'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-600">
                  {playbook.department}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-emerald-600 border border-slate-200">
                  {playbook.roiMultiplier}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1.5 truncate">
                {playbook.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Selected Playbook Blueprint Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
        {/* Top Info Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                {activePlaybook.department}
              </span>
              <span className="text-xs text-emerald-600 font-mono font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {activePlaybook.roiMultiplier}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1.5">
              {activePlaybook.title}
            </h3>
            <p className="text-xs text-slate-700 mt-1 max-w-3xl leading-relaxed">
              {activePlaybook.summary}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl min-w-[240px]">
            <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">
              Event Trigger Ingress
            </div>
            <div className="text-xs font-mono text-blue-700 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="line-clamp-2">{activePlaybook.sampleTrigger}</span>
            </div>
          </div>
        </div>

        {/* Business Impact Card */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <Target className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Quantified Business Impact & Headcount Leverage
            </h5>
            <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
              {activePlaybook.businessImpact}
            </p>
          </div>
        </div>

        {/* The Agent Squad */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
              Autonomous Agent Squad (Role Breakdown)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activePlaybook.agents.map((agent, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">AGENT 0{i + 1}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      agent.autonomyLevel === 'Full'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : agent.autonomyLevel === 'Supervised'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {agent.autonomyLevel} Autonomy
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">{agent.name}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{agent.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Two-Column Grid: Tools (MCP) & Governance Guardrails */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Connected Tools & MCP Servers */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
              <Wrench className="w-4 h-4 text-emerald-600" />
              Connected Tools (MCP Protocol)
            </div>
            <div className="space-y-2">
              {activePlaybook.mcpTools.map((tool, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 p-2.5 rounded-lg flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-mono font-bold text-blue-700">{tool.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{tool.description}</div>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-200 shrink-0">
                    {tool.protocol}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Guardrails & Human-in-the-Loop Checkpoint */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Hard Guardrails & HITL Threshold Gate
            </div>

            {/* HITL Gate Specifics */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 mb-1">
                <UserCheck className="w-3.5 h-3.5" />
                Human Approval Gate Trigger
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {activePlaybook.humanInTheLoopCheckpoint}
              </p>
            </div>

            {/* List of guardrails */}
            <ul className="space-y-1.5 text-xs text-slate-700">
              {activePlaybook.guardrails.map((g, i) => (
                <li key={i} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
