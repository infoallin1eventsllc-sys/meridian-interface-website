export type BusinessStage = 'seed' | 'growth' | 'scale' | 'enterprise';

export type BusinessModel = 'b2b_saas' | 'ecommerce' | 'agency_services' | 'fintech_health' | 'large_enterprise';

export interface StackLayerItem {
  id: string;
  name: string;
  category: 'Foundation' | 'Orchestration' | 'Memory' | 'Tools & Protocols' | 'Governance & Evals';
  tagline: string;
  description: string;
  /** One sentence for the client-facing proposal, where the jargon above will not do. */
  plain?: string;
  bestFor: string;
  tradeOffs: {
    pros: string[];
    cons: string[];
  };
  monthlyCostRange: string;
  latencyRating: 'Ultra-Fast (<200ms)' | 'Fast (<800ms)' | 'Standard (1-2s)';
  autonomyReadiness: number; // 1-10
  standardProtocols: string[];
  recommendedStage: BusinessStage[];
  enterpriseReady?: boolean;
}

export interface SelectedStack {
  foundation: string;
  orchestration: string;
  memory: string;
  toolsProtocol: string;
  governance: string;
}

export interface DepartmentPlaybook {
  id: string;
  title: string;
  department: 'Sales & enquiries' | 'Customer support' | 'Finance & invoicing' | 'Marketing' | 'IT & security';
  summary: string;
  /** What actually changes for the business. Never an invented percentage. */
  businessImpact: string;
  /** Meridian's advice on sequencing, not a return figure. */
  whenToBuild: string;
  humanInTheLoopCheckpoint: string;
  agents: {
    name: string;
    role: string;
    autonomyLevel: 'Full' | 'Supervised' | 'Collaborative';
  }[];
  mcpTools: {
    name: string;
    description: string;
    protocol: string;
  }[];
  guardrails: string[];
  sampleTrigger: string;
}

export interface SimulationStep {
  agentName: string;
  role: string;
  thought: string;
  toolCall?: {
    server: string;
    tool: string;
    args: Record<string, any>;
  };
  toolResult?: Record<string, any>;
  guardrailCheck: {
    passed: boolean;
    rule: string;
  };
  requiresHumanApproval: boolean;
  humanPrompt?: string;
  approved?: boolean;
}

export interface SimulationWorkflow {
  id: string;
  title: string;
  category: string;
  description: string;
  triggerEvent: string;
  defaultSteps: SimulationStep[];
  isEnterprise?: boolean;
}

export interface AdvisorBlueprint {
  summary: string;
  stackLayers: {
    layer: string;
    component: string;
    role: string;
    status: string;
    estimatedCost: string;
  }[];
  phasedDeployment: {
    phase: string;
    impact: string;
    actions: string[];
  }[];
  guardrailRecommendations: string[];
  projectedMetrics: {
    monthlyHoursSaved: number;
    headcountEquivalentLeverage: string;
    projectedMonthlySavings: string;
    paybackWeeks: number;
  };
}

export interface EnterpriseComplianceItem {
  id: string;
  framework: 'EU AI Act' | 'SOC 2 Type II' | 'ISO 27001' | 'HIPAA' | 'Zero Data Retention' | 'CMEK';
  title: string;
  mandateReference: string;
  implementation: string;
  auditEvidence: string;
  /** Honest labels: a design pattern is not a certificate. */
  status: 'Designed in' | 'Pattern available' | 'Client obtains';
}

export interface AgentIamPermission {
  agentId: string;
  agentName: string;
  role: string;
  sapPermission: 'Read' | 'Staged Write' | 'Full Write' | 'Denied';
  serviceNowPermission: 'Read' | 'Staged Write' | 'Full Write' | 'Denied';
  salesforcePermission: 'Read' | 'Staged Write' | 'Full Write' | 'Denied';
  snowflakePermission: 'Read' | 'Staged Write' | 'Full Write' | 'Denied';
  workdayPermission: 'Read' | 'Staged Write' | 'Full Write' | 'Denied';
  dualApprovalThreshold: string;
}

export interface AuditLedgerRecord {
  id: string;
  timestamp: string;
  agentName: string;
  action: string;
  targetSystem: string;
  sha256Hash: string;
  approver: string;
  complianceRule: string;
  status: 'SUCCESS' | 'CONTAINED' | 'SUPERVISED';
}
