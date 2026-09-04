import React from 'react';
import { Layers, Cpu, PlayCircle, Briefcase, Calculator, Sparkles, Download, ShieldCheck, CalendarCheck } from 'lucide-react';
import { MeridianLogo } from './MeridianLogo';
import { MERIDIAN } from '../lib/brand';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenExport: () => void;
  /** True when the planner service has a model connected. */
  aiLive: boolean;
}

export const NAV_ITEMS = [
  { id: 'architecture', label: 'The five layers', icon: Layers },
  { id: 'builder', label: 'Build your stack', icon: Cpu },
  { id: 'simulator', label: 'Watch a workflow run', icon: PlayCircle },
  { id: 'departments', label: 'Department playbooks', icon: Briefcase },
  { id: 'roi', label: 'Return on the spend', icon: Calculator },
  { id: 'enterprise', label: 'Governance', icon: ShieldCheck },
  { id: 'advisor', label: 'AI advisor', icon: Sparkles },
] as const;

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenExport, aiLive }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e2e8f0] bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand: Otis's mark beside live text, then the product name. */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <a href={MERIDIAN.site} className="shrink-0" title="Meridian Interface">
              <MeridianLogo size={34} />
            </a>
            <span className="hidden sm:block w-px h-8 bg-[#e2e8f0]" aria-hidden="true" />
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-extrabold tracking-tight text-[#0f172a] leading-tight whitespace-nowrap" style={{ fontFamily: 'var(--font-display)' }}>
                Stack Planner
              </h1>
              <p className="text-[11px] text-[#475569] hidden sm:block leading-tight">
                An agentic tech stack for a growing business, planned before it is built.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                aiLive ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
              title={aiLive ? 'The AI advisor is connected and answering' : 'The AI advisor is offline; everything else on this page still works'}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${aiLive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span>{aiLive ? 'AI advisor live' : 'AI advisor offline'}</span>
            </div>

            <button
              id="export-blueprint-btn"
              onClick={onOpenExport}
              aria-label="Export plan"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-[#0f172a] border border-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export plan</span>
            </button>

            <a
              id="book-call-btn"
              href={MERIDIAN.book}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white transition-colors"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Book<span className="hidden sm:inline"> a call</span></span>
            </a>
          </div>
        </div>

        <nav className="flex gap-1 sm:gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs font-medium border-t border-[#e2e8f0]/70 pt-2" aria-label="Sections">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#0f172a] text-white border-[#0f172a] font-semibold'
                    : 'text-[#475569] hover:text-[#0f172a] hover:bg-slate-100 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
