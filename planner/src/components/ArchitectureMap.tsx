import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Wrench, 
  Database, 
  GitFork, 
  Cpu, 
  ArrowDownUp, 
  Info, 
  Play, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  Terminal,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayerDetail {
  id: string;
  number: string;
  name: string;
  category: string;
  icon: any;
  color: string;
  borderColor: string;
  bgGlow: string;
  summary: string;
  keyComponents: string[];
  protocols: string[];
  businessImpact: string;
  whyItMatters: string;
  failureModeWithoutIt: string;
  codeSnippet: string;
}

const LAYERS: LayerDetail[] = [
  {
    id: 'layer-5',
    number: '05',
    name: 'Governance, Evals & Guardrails',
    category: 'Trust, Compliance & Safety',
    icon: ShieldCheck,
    color: 'text-amber-600',
    borderColor: 'border-amber-400',
    bgGlow: 'bg-amber-50',
    summary: 'Keeps agents inside the rules: no action above a threshold without a person, no personal data reaching a model unmasked, every step traced.',
    keyComponents: ['Human-in-the-Loop Threshold Gate', 'Langfuse / Arize Observability', 'NeMo / Guardrails AI PII Redactor', 'Budget & Rate Limiter'],
    protocols: ['OpenTelemetry (OTel)', 'JSON Schema Validators', 'Slack BlockKit Webhooks'],
    businessImpact: 'The mistakes that would cost real money stop for a person first, and the record of what happened is there when someone asks. That is what lets a team trust the agents with more over time.',
    whyItMatters: 'Growing businesses cannot afford reputation damage or financial leaks caused by unchecked agentic autonomy. Guardrails establish hard deterministic rails around non-deterministic LLMs.',
    failureModeWithoutIt: 'An agent issues a refund nobody approved, sends a confident wrong answer to a prospect, or passes card details into a prompt.',
    codeSnippet: `// Guardrail Threshold Check Before Tool Execution
if (toolCall.action === 'issue_refund' && toolCall.amount > 150) {
  return await queueHumanApprovalCard({
    channel: '#finance-ops-approvals',
    title: 'Customer Refund Request Exceeds $150 Gate',
    amount: toolCall.amount,
    reason: toolCall.justification,
    agentId: 'support-tier1-agent'
  });
}`
  },
  {
    id: 'layer-4',
    number: '04',
    name: 'Tool Execution & MCP Connectors',
    category: 'The Agent "Hands" & Actuators',
    icon: Wrench,
    color: 'text-emerald-600',
    borderColor: 'border-emerald-400',
    bgGlow: 'bg-emerald-50',
    summary: 'Standardizes how agents safely discover capabilities, read databases, execute transactions, and manipulate business software.',
    keyComponents: ['Model Context Protocol (MCP) Gateway', 'OpenAPI / Swagger Auto-Wrappers', 'Sandboxed Python / Node Container', 'Enterprise Webhooks'],
    protocols: ['MCP (JSON-RPC 2.0)', 'stdio / Server-Sent Events', 'OAuth Bearer / JWT'],
    businessImpact: 'Decouples business tooling from custom code. Add a new CRM or accounting tool in minutes without rewriting core agent logic.',
    whyItMatters: 'MCP gives agents structured, auditable APIs rather than brittle screen scraping. Every action is typed, documented, and permission-scoped.',
    failureModeWithoutIt: 'Brittle spaghetti integrations where every prompt must be rewritten whenever an external API or tool changes.',
    codeSnippet: `// Model Context Protocol (MCP) Server Tool Registration
mcpServer.tool('search_and_enrich_lead', {
  domain: z.string().describe('Target company domain'),
  enrichmentFields: z.array(z.string()).default(['arr', 'headcount', 'techStack'])
}, async ({ domain, enrichmentFields }) => {
  const result = await hubspotClient.companies.getByDomain(domain);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});`
  },
  {
    id: 'layer-3',
    number: '03',
    name: 'Memory & Context Fabric',
    category: 'Episodic, Semantic & Transactional State',
    icon: Database,
    color: 'text-blue-600',
    borderColor: 'border-blue-500',
    bgGlow: 'bg-blue-50',
    summary: 'Provides persistent recall across sessions, combining vector knowledge bases with high-speed working context.',
    keyComponents: ['Qdrant / Pinecone Vector Store', 'PostgreSQL Relational Ledger (pgvector)', 'Redis Fast Working Session Cache', 'Mem0 Adaptive Personalization'],
    protocols: ['HNSW Cosine Vector Search', 'Postgres Wire Protocol', 'Redis RESP3'],
    businessImpact: 'Transforms isolated chatbots into continuous coworkers who recall previous customer interactions, SOP manuals, and team policies.',
    whyItMatters: 'Without persistent memory, every agent interaction starts from scratch. Context fabric allows agents to accumulate institutional wisdom.',
    failureModeWithoutIt: 'Repetitive customer friction, inability to audit historical reasoning, and context window overflow crashes.',
    codeSnippet: `// Hybrid Context Retrieval (Relational + Semantic Knowledge)
const [pastOrders, companyPolicyDocs] = await Promise.all([
  postgres.query('SELECT * FROM orders WHERE customer_id = $1 ORDER BY date DESC LIMIT 5', [customerId]),
  qdrant.search('internal_sops', {
    vector: await generateEmbedding(customerQuery),
    limit: 3,
    scoreThreshold: 0.82
  })
]);`
  },
  {
    id: 'layer-2',
    number: '02',
    name: 'Agent Framework & Orchestrator',
    category: 'Coordination, State Graphs & Swarms',
    icon: GitFork,
    color: 'text-indigo-600',
    borderColor: 'border-indigo-300',
    bgGlow: 'bg-indigo-50',
    summary: 'Controls the multi-agent state machine, routing tasks between specialized roles, handling retries, and coordinating handoffs.',
    keyComponents: ['LangGraph State Graphs', 'Temporal Durable Workflows', 'CrewAI / AutoGen Role Hierarchies', 'Event-Driven Dispatchers'],
    protocols: ['State Machine Checkpoints', 'PubSub Event Bus', 'gRPC'],
    businessImpact: 'Stops runaway loops, keeps a workflow alive while it waits days for a person, and lets you replay any run step by step to see what happened.',
    whyItMatters: 'Complex business operations require multiple specialized agents (e.g. Inbound Triage -> Research -> Calendar Negotiator -> CRM Updater). The orchestrator manages their contract and handoffs.',
    failureModeWithoutIt: 'Hallucinatory loops, unpredictable infinite execution cycles, and unrecoverable network dropouts mid-transaction.',
    codeSnippet: `// LangGraph Deterministic Multi-Agent State Graph
const workflow = new StateGraph({ channels: agentChannels })
  .addNode('triage', triageAgent)
  .addNode('research', deepResearchAgent)
  .addNode('humanReview', humanApprovalGate)
  .addNode('execution', toolExecutorAgent)
  .addEdge('triage', 'research')
  .addConditionalEdges('research', shouldRequireReview, {
    needsApproval: 'humanReview',
    safeToRun: 'execution'
  });`
  },
  {
    id: 'layer-1',
    number: '01',
    name: 'Foundation Models & Inference Engine',
    category: 'The Reasoning & Multimodal Core',
    icon: Cpu,
    color: 'text-sky-600',
    borderColor: 'border-sky-200',
    bgGlow: 'bg-sky-50',
    summary: 'Powers natural language reasoning, structured schema generation, multimodal vision for invoices/receipts, and low-latency decision making.',
    keyComponents: ['Claude Sonnet 5 (everyday work)', 'Claude Opus 5 (hard judgement)', 'Claude Haiku 4.5 (high-volume simple steps)', 'Structured JSON output for tools'],
    protocols: ['Messages API', 'Streaming', 'Tool use (JSON schema)'],
    businessImpact: 'Quick answers for customer-facing agents, documents and invoices read without a separate OCR product, and prompt caching so repeated context is not paid for twice.',
    whyItMatters: 'The foundation model is the part that reads, reasons and writes. Choosing the right tier per step, not one model for everything, is where most of the cost and quality difference comes from.',
    failureModeWithoutIt: 'A single expensive model on every step, or a cheap one on the steps that needed judgement. Either way the bill or the mistakes surprise you.',
    codeSnippet: `// One model call, structured output for the next tool (Anthropic SDK)
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic();

const msg = await client.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 1024,
  system: 'Extract the invoice fields. Answer with JSON only.',
  messages: [{ role: 'user', content: invoiceText }],
});`
  }
];

export const ArchitectureMap: React.FC = () => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-5');
  const [isSimulatingFlow, setIsSimulatingFlow] = useState<boolean>(false);
  const [flowStep, setFlowStep] = useState<number>(-1);

  const selectedLayer = LAYERS.find(l => l.id === selectedLayerId) || LAYERS[0];

  const handleSimulatePulse = () => {
    if (isSimulatingFlow) return;
    setIsSimulatingFlow(true);
    setFlowStep(0);

    const interval = setInterval(() => {
      setFlowStep((prev) => {
        if (prev >= LAYERS.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSimulatingFlow(false);
            setFlowStep(-1);
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with description & interactive simulation pulse */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                How it fits together
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                The 5-Layer Agentic Architecture
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
              A chatbot answers questions. An agentic stack does work: it reads what comes in, decides, uses your tools, and stops to ask when it should. These five layers are how Meridian builds one. Click a layer to see what it does, what it uses, and what goes wrong without it.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="simulate-flow-pulse-btn"
              onClick={handleSimulatePulse}
              disabled={isSimulatingFlow}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-md ${
                isSimulatingFlow
                  ? 'bg-blue-50 text-blue-700 border border-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-none'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${isSimulatingFlow ? 'animate-spin' : ''}`} />
              <span>{isSimulatingFlow ? 'Simulating Control Flow...' : 'Simulate Request Flow'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Visual Stack, Right Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stack Layers (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-500">
            <span>HIGH-LEVEL GOVERNANCE & TOOLS (NORTHBOUND)</span>
            <span>DATA INGRESS & COMPUTE (SOUTHBOUND)</span>
          </div>

          {LAYERS.map((layer, index) => {
            const Icon = layer.icon;
            const isSelected = selectedLayerId === layer.id;
            const isPulsing = isSimulatingFlow && flowStep === index;

            return (
              <motion.div
                key={layer.id}
                id={`layer-card-${layer.id}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedLayerId(layer.id)}
                className={`relative cursor-pointer rounded-xl p-4 transition-all border ${
                  isSelected
                    ? `${layer.borderColor} bg-white ring-1 ring-blue-500/30 shadow-sm`
                    : 'border-slate-200 bg-white hover:bg-white'
                } ${isPulsing ? 'ring-2 ring-blue-500 bg-blue-50 shadow-none' : ''}`}
              >
                {/* Visual pulse line */}
                {isPulsing && (
                  <div className="absolute inset-0 rounded-xl bg-blue-50 pointer-events-none animate-pulse" />
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-lg ${layer.bgGlow} border ${layer.borderColor}`}>
                      <Icon className={`w-5 h-5 ${layer.color}`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          LAYER {layer.number}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">
                          {layer.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {layer.summary}
                      </p>

                      {/* Component Chips */}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {layer.keyComponents.slice(0, 3).map((comp) => (
                          <span
                            key={comp}
                            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-300"
                          >
                            {comp}
                          </span>
                        ))}
                        {layer.keyComponents.length > 3 && (
                          <span className="text-[10px] text-slate-500 self-center">
                            +{layer.keyComponents.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className={`text-xs px-2 py-0.5 rounded font-mono font-medium border ${
                    isSelected ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-300'
                  }`}>
                    {layer.category}
                  </span>
                </div>

                {/* Connection Line Indicator */}
                {index < LAYERS.length - 1 && (
                  <div className="absolute -bottom-3 left-7 w-0.5 h-3 bg-slate-100 z-10" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: Layer Inspector (5 cols) */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLayer.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm sticky top-28 space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600 px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                      Layer {selectedLayer.number} Spec
                    </span>
                    <span className="text-xs text-slate-500">{selectedLayer.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedLayer.name}
                  </h3>
                </div>
                <div className={`p-2.5 rounded-xl ${selectedLayer.bgGlow} border ${selectedLayer.borderColor}`}>
                  {React.createElement(selectedLayer.icon, { className: `w-6 h-6 ${selectedLayer.color}` })}
                </div>
              </div>

              {/* Why it Matters */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  Role in Growing Businesses
                </h4>
                <p className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedLayer.whyItMatters}
                </p>
              </div>

              {/* Business Impact & Failure Mode */}
              <div className="grid grid-cols-1 gap-2.5">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Business Impact
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {selectedLayer.businessImpact}
                  </p>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 mb-1">
                    <Lock className="w-3.5 h-3.5" />
                    Risk If Omitted
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    {selectedLayer.failureModeWithoutIt}
                  </p>
                </div>
              </div>

              {/* Standard Protocols */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Standard Protocols & Interfaces
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLayer.protocols.map((p) => (
                    <span
                      key={p}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 text-blue-700 border border-slate-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Implementation Code Snippet */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    Production Pattern
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">TypeScript / Node.js</span>
                </div>
                <pre className="text-[11px] font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 overflow-x-auto scrollbar-none leading-relaxed">
                  <code>{selectedLayer.codeSnippet}</code>
                </pre>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
