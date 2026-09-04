import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ArchitectureMap } from './components/ArchitectureMap';
import { StackBuilder } from './components/StackBuilder';
import { WorkflowSimulator } from './components/WorkflowSimulator';
import { DepartmentPlaybooks } from './components/DepartmentPlaybooks';
import { RoiCalculator } from './components/RoiCalculator';
import { AiAdvisor } from './components/AiAdvisor';
import { EnterpriseGovernance } from './components/EnterpriseGovernance';
import { ExportModal } from './components/ExportModal';
import { ProposalSheet } from './components/ProposalSheet';
import { BuiltBy } from './components/BuiltBy';
import { SelectedStack, BusinessStage, BusinessModel, AdvisorBlueprint } from './types';
import { STAGE_PRESETS } from './data/stackComponents';
import { fetchStatus } from './lib/planner';
import { RoiInputs, ROI_DEFAULTS } from './lib/roi';
import { motion, AnimatePresence } from 'motion/react';

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.18 },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('architecture');
  const [businessStage, setBusinessStage] = useState<BusinessStage>('growth');
  const [businessModel, setBusinessModel] = useState<BusinessModel>('b2b_saas');
  const [selectedStack, setSelectedStack] = useState<SelectedStack>(STAGE_PRESETS.growth.recommendedSelection);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isProposalOpen, setIsProposalOpen] = useState<boolean>(false);
  // The ROI inputs live here so the proposal sheet can print the same numbers
  // the client just watched move on the calculator.
  const [roi, setRoi] = useState<RoiInputs>(ROI_DEFAULTS);
  // The advisor's plan and who it was written for, so the proposal can carry both.
  const [blueprint, setBlueprint] = useState<AdvisorBlueprint | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const setRoiPart = (patch: Partial<RoiInputs>) => setRoi((prev) => ({ ...prev, ...patch }));
  const [aiLive, setAiLive] = useState<boolean>(false);

  // Is a model connected? Decides whether the advisor promises an answer.
  useEffect(() => {
    let cancelled = false;
    fetchStatus().then((s) => { if (!cancelled) setAiLive(s.ai); });
    return () => { cancelled = true; };
  }, []);

  // Tab changes scroll to the top so a section always opens at its title.
  useEffect(() => { window.scrollTo({ top: 0 }); }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#f7f9fd] text-[#191c1f] flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenProposal={() => setIsProposalOpen(true)}
        aiLive={aiLive}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        <AnimatePresence mode="wait">
          {activeTab === 'architecture' && (
            <motion.div key="architecture" {...fade}><ArchitectureMap /></motion.div>
          )}
          {activeTab === 'builder' && (
            <motion.div key="builder" {...fade}>
              <StackBuilder
                selectedStack={selectedStack}
                setSelectedStack={setSelectedStack}
                businessStage={businessStage}
                setBusinessStage={setBusinessStage}
                businessModel={businessModel}
                setBusinessModel={setBusinessModel}
              />
            </motion.div>
          )}
          {activeTab === 'simulator' && (
            <motion.div key="simulator" {...fade}><WorkflowSimulator aiLive={aiLive} /></motion.div>
          )}
          {activeTab === 'departments' && (
            <motion.div key="departments" {...fade}><DepartmentPlaybooks /></motion.div>
          )}
          {activeTab === 'roi' && (
            <motion.div key="roi" {...fade}><RoiCalculator inputs={roi} set={setRoiPart} /></motion.div>
          )}
          {activeTab === 'enterprise' && (
            <motion.div key="enterprise" {...fade}><EnterpriseGovernance onOpenExport={() => setIsExportOpen(true)} /></motion.div>
          )}
          {activeTab === 'advisor' && (
            <motion.div key="advisor" {...fade}><AiAdvisor aiLive={aiLive} blueprint={blueprint} setBlueprint={setBlueprint} onCompanyName={setCompanyName} /></motion.div>
          )}
        </AnimatePresence>

        <BuiltBy />
      </main>

      <BuiltBy variant="footer" />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        selectedStack={selectedStack}
        businessStage={businessStage}
        businessModel={businessModel}
        onOpenProposal={() => { setIsExportOpen(false); setIsProposalOpen(true); }}
      />

      <ProposalSheet
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        selectedStack={selectedStack}
        businessStage={businessStage}
        businessModel={businessModel}
        roi={roi}
        blueprint={blueprint}
        companyName={companyName}
      />
    </div>
  );
}
