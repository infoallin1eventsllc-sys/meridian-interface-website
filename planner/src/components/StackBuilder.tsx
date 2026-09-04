import React, { useState } from 'react';
import { 
  STACK_LAYERS, 
  STAGE_PRESETS 
} from '../data/stackComponents';
import { 
  SelectedStack, 
  BusinessStage, 
  BusinessModel, 
  StackLayerItem 
} from '../types';
import { 
  Sliders, 
  Check, 
  DollarSign, 
  Clock, 
  Gauge, 
  ShieldAlert, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';

interface StackBuilderProps {
  selectedStack: SelectedStack;
  setSelectedStack: React.Dispatch<React.SetStateAction<SelectedStack>>;
  businessStage: BusinessStage;
  setBusinessStage: (stage: BusinessStage) => void;
  businessModel: BusinessModel;
  setBusinessModel: (model: BusinessModel) => void;
}

export const StackBuilder: React.FC<StackBuilderProps> = ({
  selectedStack,
  setSelectedStack,
  businessStage,
  setBusinessStage,
  businessModel,
  setBusinessModel,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('foundation');

  // Load a stage preset
  const handleApplyStagePreset = (stage: BusinessStage) => {
    setBusinessStage(stage);
    setSelectedStack(STAGE_PRESETS[stage].recommendedSelection);
  };

  // Find currently selected item for each layer
  const currentFoundation = STACK_LAYERS.foundation.find(i => i.id === selectedStack.foundation) || STACK_LAYERS.foundation[0];
  const currentOrchestration = STACK_LAYERS.orchestration.find(i => i.id === selectedStack.orchestration) || STACK_LAYERS.orchestration[0];
  const currentMemory = STACK_LAYERS.memory.find(i => i.id === selectedStack.memory) || STACK_LAYERS.memory[0];
  const currentTools = STACK_LAYERS.toolsProtocol.find(i => i.id === selectedStack.toolsProtocol) || STACK_LAYERS.toolsProtocol[0];
  const currentGovernance = STACK_LAYERS.governance.find(i => i.id === selectedStack.governance) || STACK_LAYERS.governance[0];

  const selectedItems: StackLayerItem[] = [
    currentFoundation,
    currentOrchestration,
    currentMemory,
    currentTools,
    currentGovernance
  ];

  // Aggregate stats
  const avgReadiness = (selectedItems.reduce((acc, item) => acc + item.autonomyReadiness, 0) / selectedItems.length).toFixed(1);
  
  // Cost estimation heuristic
  const calculateCostEstimate = () => {
    if (businessStage === 'seed') return '$90 - $240 / month';
    if (businessStage === 'growth') return '$280 - $620 / month';
    if (businessStage === 'scale') return '$750 - $1,800 / month';
    return '$7,600 - $25,000 / month (Dedicated PTUs)';
  };

  const layersNav = [
    { key: 'foundation', label: '1. Foundation Model', current: currentFoundation.name },
    { key: 'orchestration', label: '2. Orchestrator', current: currentOrchestration.name },
    { key: 'memory', label: '3. Memory Fabric', current: currentMemory.name },
    { key: 'toolsProtocol', label: '4. Tools & Protocol', current: currentTools.name },
    { key: 'governance', label: '5. Governance & Evals', current: currentGovernance.name },
  ];

  const businessModelOptions: { id: BusinessModel; label: string; desc: string }[] = [
    { id: 'b2b_saas', label: 'B2B SaaS', desc: 'Focus on inbound lead conversion, churn defense, product telemetry' },
    { id: 'ecommerce', label: 'E-Commerce & Retail', desc: 'High volume ticket deflection, inventory sync, supplier logistics' },
    { id: 'agency_services', label: 'Agency / Services', desc: 'Client onboarding, proposal generation, multi-project workflows' },
    { id: 'fintech_health', label: 'FinTech / Regulated', desc: 'Strict PII isolation, automated audit trails, human approval gates' },
    { id: 'large_enterprise', label: 'Large enterprise', desc: 'Models inside your own cloud account, ERP and ITSM integrations, provider data terms, two-person sign-off' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Configurator: Business Stage & Model Archetype */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-600" />
              Stack Configurator & Unit Cost Modeler
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your company growth stage and business model to auto-tune the optimal 5-layer agent stack.
            </p>
          </div>

          {/* Reset to Recommended Preset */}
          <button
            id="apply-recommended-preset-btn"
            onClick={() => handleApplyStagePreset(businessStage)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Apply {STAGE_PRESETS[businessStage].title.split(' ')[0]} Preset</span>
          </button>
        </div>

        {/* Stage Selector Pills */}
        <div>
          <label className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Company Growth Stage
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(['seed', 'growth', 'scale', 'enterprise'] as BusinessStage[]).map((st) => {
              const info = STAGE_PRESETS[st];
              const isSelected = businessStage === st;
              return (
                <div
                  key={st}
                  id={`stage-card-${st}`}
                  onClick={() => handleApplyStagePreset(st)}
                  className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300 shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{info.title.split(' ')[0]}</span>
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {info.revenue}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {info.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Business Model Archetype */}
        <div>
          <label className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Business Model Archetype
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {businessModelOptions.map((opt) => (
              <button
                key={opt.id}
                id={`model-btn-${opt.id}`}
                onClick={() => setBusinessModel(opt.id)}
                className={`text-left p-3 rounded-xl border text-xs transition-all ${
                  businessModel === opt.id
                    ? 'bg-slate-100 border-blue-500 text-slate-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-800">{opt.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Metrics Dashboard Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Estimated Monthly Infra</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 font-mono">
            {calculateCostEstimate()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Tokens, vector DB & orchestration</div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Gauge className="w-4 h-4 text-blue-600" />
            <span>Autonomy Score</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-blue-700 font-mono">
            {avgReadiness} / 10.0
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5">High production readiness</div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Setup Timeline</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 font-mono">
            {STAGE_PRESETS[businessStage].implementationTime}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Sprint to initial agent deployment</div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>Human-in-the-Loop Gate</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-amber-700 font-mono">
            Active Guard
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Zero unapproved financial actions</div>
        </div>
      </div>

      {/* Layer-by-Layer Customizer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
        {/* Layer Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
          {layersNav.map((layer) => {
            const isActive = activeCategory === layer.key;
            return (
              <button
                key={layer.key}
                id={`layer-selector-tab-${layer.key}`}
                onClick={() => setActiveCategory(layer.key)}
                className={`px-3 py-2 rounded-xl text-left whitespace-nowrap transition-all text-xs ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-bold border border-blue-500 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="font-semibold">{layer.label}</div>
                <div className="text-[10px] text-blue-600 font-mono mt-0.5">{layer.current}</div>
              </button>
            );
          })}
        </div>

        {/* Options for Active Layer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STACK_LAYERS[activeCategory].map((option) => {
            const isSelected = selectedStack[activeCategory as keyof SelectedStack] === option.id;
            return (
              <div
                key={option.id}
                id={`option-card-${option.id}`}
                onClick={() => {
                  setSelectedStack(prev => ({
                    ...prev,
                    [activeCategory]: option.id
                  }));
                }}
                className={`cursor-pointer rounded-xl p-4 border flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500/30 shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{option.name}</h3>
                      {option.enterpriseReady && (
                        <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Enterprise option
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-emerald-500 text-slate-950">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-blue-700 font-medium mt-1">
                    {option.tagline}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {option.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-500 font-mono">Cost:</span>
                      <span className="font-mono text-emerald-600 text-[11px]">{option.monthlyCostRange}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-500 font-mono">Latency:</span>
                      <span className="font-mono text-slate-700 text-[11px]">{option.latencyRating}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-500 font-mono">Readiness:</span>
                      <span className="font-mono text-blue-600 text-[11px]">{option.autonomyReadiness} / 10</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1">Key Advantages:</div>
                  <ul className="text-[11px] text-slate-700 space-y-1">
                    {option.tradeOffs.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-emerald-600">&bull;</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
