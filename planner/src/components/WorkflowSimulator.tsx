import React, { useState } from 'react';
import { WORKFLOW_PRESETS } from '../data/stackComponents';
import { SimulationWorkflow, SimulationStep } from '../types';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  ShieldCheck, 
  UserCheck, 
  Terminal, 
  Send, 
  Sparkles, 
  Clock,
  ArrowRight,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { simulateWorkflow, PlannerError } from '../lib/planner';

interface WorkflowSimulatorProps {
  /** True when the planner service has a model connected. */
  aiLive: boolean;
}

export const WorkflowSimulator: React.FC<WorkflowSimulatorProps> = ({ aiLive }) => {
  const [customError, setCustomError] = useState<string | null>(null);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(WORKFLOW_PRESETS[0].id);
  const [customGoal, setCustomGoal] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [steps, setSteps] = useState<SimulationStep[]>(WORKFLOW_PRESETS[0].defaultSteps);
  const [workflowOutcome, setWorkflowOutcome] = useState<string | null>(null);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState<boolean>(false);

  const activePreset = WORKFLOW_PRESETS.find(w => w.id === selectedWorkflowId) || WORKFLOW_PRESETS[0];

  const handleSelectPreset = (workflow: SimulationWorkflow) => {
    setSelectedWorkflowId(workflow.id);
    setIsCustomMode(false);
    setSteps(workflow.defaultSteps);
    setCurrentStepIndex(-1);
    setIsRunning(false);
    setIsWaitingForApproval(false);
    setWorkflowOutcome(null);
  };

  const handleStartSimulation = async () => {
    setIsRunning(true);
    setCurrentStepIndex(0);
    setIsWaitingForApproval(false);
    setWorkflowOutcome(null);

    // A custom goal is traced by Claude through the planner service; presets run locally.
    if (isCustomMode && customGoal.trim()) {
      setCustomError(null);
      try {
        const { steps: traced } = await simulateWorkflow(
          customGoal.trim(),
          'a growing business that wants automation with a person approving anything that matters',
        );
        setSteps(traced);
        if (traced[0]?.requiresHumanApproval) setIsWaitingForApproval(true);
        return;
      } catch (err) {
        setCustomError(err instanceof PlannerError ? err.message : 'Could not trace that goal. Showing the selected preset instead.');
        setSteps(activePreset.defaultSteps);
      }
    }

    // Check first step
    if (steps[0]?.requiresHumanApproval) {
      setIsWaitingForApproval(true);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      if (steps[nextIdx].requiresHumanApproval) {
        setIsWaitingForApproval(true);
      }
    } else {
      setIsRunning(false);
      setWorkflowOutcome("Done. Every step passed its rule, the person approved what needed approving, and the result was written to the system of record.");
    }
  };

  const handleApproveHumanGate = () => {
    setIsWaitingForApproval(false);
    handleNextStep();
  };

  const handleReset = () => {
    setCurrentStepIndex(-1);
    setIsRunning(false);
    setIsWaitingForApproval(false);
    setWorkflowOutcome(null);
  };

  return (
    <div className="space-y-6">
      {/* Simulator Header & Preset Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                Interactive · nothing here touches a real system
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Watch a workflow run, step by step
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              See how a small team of agents handles a business event: what each one reasons, which tool it calls, which rule is checked, and where it stops to ask a person.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="reset-simulation-btn"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              id="run-simulation-btn"
              onClick={handleStartSimulation}
              disabled={isRunning && currentStepIndex >= 0}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-none flex items-center gap-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{currentStepIndex >= 0 ? 'Restart Execution' : 'Execute Workflow'}</span>
            </button>
          </div>
        </div>

        {/* Workflow Presets Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {WORKFLOW_PRESETS.map((wf) => {
            const isSelected = selectedWorkflowId === wf.id && !isCustomMode;
            return (
              <div
                key={wf.id}
                id={`wf-preset-${wf.id}`}
                onClick={() => handleSelectPreset(wf)}
                className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
                  isSelected
                    ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500/30'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-blue-600">{wf.category}</span>
                  <span className="text-[11px] text-slate-500">{wf.defaultSteps.length} Agents</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{wf.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{wf.description}</p>
              </div>
            );
          })}
        </div>

        {/* Custom Goal Prompt Option */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Or describe your own goal (traced by Claude)
            </span>
          </div>
          <div className="flex gap-2">
            <input
              id="custom-goal-input"
              type="text"
              placeholder="e.g., Audit supplier freight invoices against contract rates and flag discrepancies in Slack"
              value={customGoal}
              onChange={(e) => {
                setCustomGoal(e.target.value);
                setIsCustomMode(true);
              }}
              className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              id="run-custom-goal-btn"
              onClick={() => {
                setIsCustomMode(true);
                handleStartSimulation();
              }}
              disabled={!customGoal.trim()}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-blue-700 border border-blue-200 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulate</span>
            </button>
          </div>
          {customError && (
            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{customError}</p>
          )}
          {!aiLive && (
            <p className="text-[11px] text-slate-500">The AI tracer looks offline from here; the preset workflows above run without it.</p>
          )}
        </div>
      </div>

      {/* Trigger Event Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            EVENT INGRESS
          </span>
          <span className="text-slate-700 font-mono">
            {isCustomMode && customGoal ? customGoal : activePreset.triggerEvent}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
          <Clock className="w-3.5 h-3.5" />
          <span>Status: {currentStepIndex < 0 ? 'Idle' : currentStepIndex >= steps.length ? 'Completed' : `Executing Step ${currentStepIndex + 1} of ${steps.length}`}</span>
        </div>
      </div>

      {/* Main Execution Trace Pipeline */}
      {currentStepIndex >= 0 ? (
        <div className="space-y-4">
          {/* Steps Timeline */}
          <div className="grid grid-cols-1 gap-4">
            {steps.slice(0, currentStepIndex + 1).map((step, idx) => {
              const isCurrent = idx === currentStepIndex;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl p-5 border transition-all ${
                    isCurrent
                      ? 'bg-white border-blue-500 ring-1 ring-blue-500/30 shadow-sm'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-500">
                            STEP 0{idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{step.agentName}</h4>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                            {step.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step State Badge */}
                    <div className="flex items-center gap-2">
                      {step.requiresHumanApproval && isCurrent && isWaitingForApproval ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                          <UserCheck className="w-3.5 h-3.5" />
                          Awaiting Human Approval
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Executed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Chain of Thought */}
                  <div className="mt-3.5 space-y-3">
                    <div>
                      <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Agent Chain-of-Thought (Reasoning)
                      </div>
                      <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-sans">
                        {step.thought}
                      </p>
                    </div>

                    {/* Tool Call & Tool Result Grid */}
                    {step.toolCall && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {/* Tool Invocation (MCP) */}
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                          <div className="flex items-center justify-between text-slate-500 font-mono text-[11px] mb-2">
                            <span className="flex items-center gap-1 text-emerald-600 font-bold">
                              <Wrench className="w-3.5 h-3.5" />
                              Tool Invocation (MCP)
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px]">
                              {step.toolCall.server}
                            </span>
                          </div>
                          <div className="font-mono text-blue-700 font-semibold mb-1">
                            {step.toolCall.tool}()
                          </div>
                          <pre className="text-[11px] font-mono text-slate-500 bg-white p-2 rounded border border-slate-200 overflow-x-auto">
                            {JSON.stringify(step.toolCall.args, null, 2)}
                          </pre>
                        </div>

                        {/* Tool Result */}
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                          <div className="flex items-center justify-between text-slate-500 font-mono text-[11px] mb-2">
                            <span className="flex items-center gap-1 text-sky-600 font-bold">
                              <Terminal className="w-3.5 h-3.5" />
                              API Response Received
                            </span>
                            <span className="text-[10px] text-emerald-600 font-mono">200 OK</span>
                          </div>
                          <pre className="text-[11px] font-mono text-slate-700 bg-white p-2 rounded border border-slate-200 overflow-x-auto max-h-24">
                            {JSON.stringify(step.toolResult, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Guardrail Policy Check */}
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-slate-500 font-mono text-[11px]">Guardrail Check:</span>
                        <span className="text-slate-700">{step.guardrailCheck.rule}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        PASSED
                      </span>
                    </div>

                    {/* Interactive Human-in-the-Loop Checkpoint Gate */}
                    {step.requiresHumanApproval && isCurrent && isWaitingForApproval && (
                      <motion.div
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        className="bg-gradient-to-r from-amber-50 via-amber-50 to-slate-50 border border-amber-400 rounded-xl p-4 space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-amber-100 text-amber-600 border border-amber-400">
                            <UserCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                              Human-in-the-Loop Authorization Required
                            </h5>
                            <p className="text-xs text-slate-800 mt-1">
                              {step.humanPrompt || 'This action modifies customer records or executes a financial transaction exceeding safe autonomous thresholds.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            id="hitl-approve-btn"
                            onClick={handleApproveHumanGate}
                            className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-500 text-slate-950 flex items-center gap-1.5 transition-colors shadow-md shadow-none"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve & Continue Workflow</span>
                          </button>
                          <button
                            id="hitl-adjust-btn"
                            onClick={handleApproveHumanGate}
                            className="px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                          >
                            Approve with Modified Parameters
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Stepper Navigation Footer */}
          {!isWaitingForApproval && currentStepIndex < steps.length - 1 && (
            <div className="flex justify-end pt-2">
              <button
                id="next-step-btn"
                onClick={handleNextStep}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-all shadow-md shadow-none"
              >
                <span>Advance to Step 0{currentStepIndex + 2}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Workflow Outcome Box */}
          {workflowOutcome && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-400 rounded-2xl p-5 text-emerald-700 space-y-2"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
                <span>Autonomous Workflow Successfully Completed</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {workflowOutcome}
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono text-emerald-600">
                <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  Execution Time: 1.4s
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  Token Cost: $0.0031
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  Human Oversight: 1 Gate Approved
                </span>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
            <Play className="w-6 h-6 ml-0.5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Simulator Ready</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click "Execute Workflow" above to watch the autonomous multi-agent sequence step through reasoning, tool invocation, and human sign-off in real time.
          </p>
        </div>
      )}
    </div>
  );
};
