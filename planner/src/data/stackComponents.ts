import { 
  StackLayerItem, 
  DepartmentPlaybook, 
  SimulationWorkflow, 
  EnterpriseComplianceItem, 
  AgentIamPermission, 
  AuditLedgerRecord 
} from '../types';

export const STACK_LAYERS: Record<string, StackLayerItem[]> = {
  foundation: [
    {
      id: 'claude-sonnet-5',
      name: 'Claude Sonnet 5 (everyday work)',
      category: 'Foundation',
      tagline: 'The model most of the stack runs on: fast, careful, priced for volume',
      description: 'Handles the daily volume: triage, drafting, reading invoices and documents, and structured JSON for tools. Published price $2 per million input tokens and $10 per million output; a growing business typically uses 5 to 30 million tokens a month.',
      bestFor: 'Customer triage, invoice reading, drafting, routing, most agent steps.',
      tradeOffs: {
        pros: ['Follows instructions and returns structured output reliably', 'Reads documents and images natively', 'Prompt caching cuts the cost of repeated context'],
        cons: ['Send the hardest judgement calls to Opus instead']
      },
      monthlyCostRange: '$40 - $250 / mo (5M - 30M tokens, estimate)',
      latencyRating: 'Fast (<800ms)',
      autonomyReadiness: 9.4,
      standardProtocols: ['Messages API', 'Streaming', 'Tool use (JSON schema)'],
      recommendedStage: ['seed', 'growth', 'scale', 'enterprise']
    },
    {
      id: 'claude-opus-5',
      name: 'Claude Opus 5 (hard judgement)',
      category: 'Foundation',
      tagline: 'For the steps where being right matters more than being quick',
      description: 'The strongest reasoning tier: contract review, multi-step financial checks, deciding what to do with an unusual case. Published price $5 per million input tokens and $25 per million output. Used for a minority of steps, not the whole workflow.',
      bestFor: 'Escalations, exceptions, planning, anything that would otherwise go to a senior person.',
      tradeOffs: {
        pros: ['Best accuracy on complex, multi-step reasoning', 'Handles long, messy inputs well'],
        cons: ['Slower and costlier per call; route to it, do not default to it']
      },
      monthlyCostRange: '$150 - $600 / mo (estimate)',
      latencyRating: 'Standard (1-2s)',
      autonomyReadiness: 9.8,
      standardProtocols: ['Messages API', 'Adaptive thinking', 'Tool use (JSON schema)'],
      recommendedStage: ['growth', 'scale', 'enterprise']
    },
    {
      id: 'model-router',
      name: 'Model router (Haiku 4.5 → Sonnet 5 → Opus 5)',
      category: 'Foundation',
      tagline: 'Each step goes to the cheapest model that can do it well',
      description: 'A small routing layer sends simple, high-volume steps to Claude Haiku 4.5 ($1 / $5 per million tokens), ordinary work to Sonnet 5, and flagged or ambiguous cases to Opus 5. Most businesses land here once volume grows.',
      bestFor: 'Any business that wants low cost on the common path and real judgement on the rare one.',
      tradeOffs: {
        pros: ['Typically cuts blended model spend by half or more', 'Fast on the common path, strong on the hard one'],
        cons: ['One more component to watch; routing rules need occasional tuning']
      },
      monthlyCostRange: '$60 - $300 / mo (estimate)',
      latencyRating: 'Fast (<800ms)',
      autonomyReadiness: 9.6,
      standardProtocols: ['Rule + classifier routing', 'Messages API', 'Per-model budgets'],
      recommendedStage: ['growth', 'scale', 'enterprise']
    },
    {
      id: 'cloud-inference',
      name: 'Claude through your own cloud (Bedrock, Vertex AI or Foundry)',
      category: 'Foundation',
      tagline: 'The same models, billed and governed inside the cloud account the business already has',
      description: 'Runs the models through the business\'s existing AWS, Google Cloud or Azure account. Access control, billing and logging stay with the cloud team. Private networking and no-retention data terms are available on enterprise agreements; confirm them in the contract, not in this planner.',
      bestFor: 'Businesses whose IT or compliance policy requires everything to stay inside one cloud account.',
      tradeOffs: {
        pros: ['Billing and access inside the existing cloud', 'Private endpoints available', 'Enterprise data terms negotiable'],
        cons: ['Higher floor cost', 'Provisioning and commitment paperwork', 'New model versions can arrive later than on the direct API']
      },
      monthlyCostRange: '$500 - $5,000+ / mo (estimate)',
      latencyRating: 'Fast (<800ms)',
      autonomyReadiness: 9.7,
      standardProtocols: ['Cloud IAM', 'Private endpoints', 'Streaming'],
      recommendedStage: ['scale', 'enterprise'],
      enterpriseReady: true
    }
  ],
  orchestration: [
    {
      id: 'langgraph',
      name: 'LangGraph (State Graphs)',
      category: 'Orchestration',
      tagline: 'Deterministic graph workflows with cyclic loops and state persistence',
      description: 'Industry-standard orchestrator for multi-agent systems requiring state machines, rollback checkpoints, time-travel debugging, and Human-in-the-Loop gates.',
      bestFor: 'Complex multi-step processes with cyclical reviews (e.g. drafting -> review -> approval -> execute).',
      tradeOffs: {
        pros: ['Stateful persistence across interruptions', 'Native Human-in-the-Loop support', 'Active ecosystem'],
        cons: ['Steeper learning curve than simple linear chains']
      },
      monthlyCostRange: 'Open Source / Cloud: $0 - $100 / mo',
      latencyRating: 'Fast (<800ms)',
      autonomyReadiness: 9.7,
      standardProtocols: ['Checkpointers', 'State Graphs', 'PubSub'],
      recommendedStage: ['seed', 'growth', 'scale', 'enterprise']
    },
    {
      id: 'temporal-agentic',
      name: 'Temporal + Durable Agent Execution',
      category: 'Orchestration',
      tagline: 'Enterprise durable execution with guaranteed fault tolerance',
      description: 'Guarantees execution survival across pod restarts, network hiccups, and long-running human approval delays (days/weeks).',
      bestFor: 'Mission-critical billing, regulatory, and multi-day business operations.',
      tradeOffs: {
        pros: ['Zero workflow data loss', 'Indefinite wait-for-human timeouts', 'Deterministic replay'],
        cons: ['Requires workflow code determinism discipline']
      },
      monthlyCostRange: '$50 - $350 / mo',
      latencyRating: 'Fast (<800ms)',
      autonomyReadiness: 9.9,
      standardProtocols: ['gRPC', 'Durable Workflows', 'Temporal Cloud'],
      recommendedStage: ['growth', 'scale', 'enterprise']
    },
    {
      id: 'autogen-crewai',
      name: 'CrewAI / AutoGen (Role-Based Swarms)',
      category: 'Orchestration',
      tagline: 'Declarative persona-based agent swarms for rapid prototyping',
      description: 'Quickly set up specialized agents with predefined roles, backstories, and delegator hierarchies that communicate in natural language.',
      bestFor: 'Rapid validation, content production teams, and exploratory research swarms.',
      tradeOffs: {
        pros: ['Extremely fast initial setup (hours, not days)', 'Intuitive role definitions'],
        cons: ['Can generate runaway token loops if max iterations are not strictly enforced']
      },
      monthlyCostRange: 'Open Source / $0 - $40 / mo',
      latencyRating: 'Standard (1-2s)',
      autonomyReadiness: 8.4,
      standardProtocols: ['CLI', 'Sequential/Hierarchical Processes'],
      recommendedStage: ['seed', 'growth']
    },
    {
      id: 'temporal-enterprise-mesh',
      name: 'Temporal Cloud + Multi-Agent Distributed Saga Mesh',
      category: 'Orchestration',
      tagline: 'Multi-region active-active durable state execution with RPO=0',
      description: 'Mission-critical distributed state machine supporting cross-continental enterprise failover, cryptographically signed checkpoints, and multi-tenant department namespaces.',
      bestFor: 'Large-company ERP automation, payment rails, and mission-critical telemetry.',
      tradeOffs: {
        pros: ['Zero workflow data loss even during complete data center outages', 'Built-in audit replay and compensation transactions (Saga pattern)', 'Granular namespace IAM'],
        cons: ['Requires distributed systems SRE expertise']
      },
      monthlyCostRange: '$800 - $3,500 / mo',
      latencyRating: 'Fast (<800ms)',
      autonomyReadiness: 10.0,
      standardProtocols: ['gRPC mTLS', 'Distributed Saga', 'OpenTelemetry Traces'],
      recommendedStage: ['scale', 'enterprise'],
      enterpriseReady: true
    }
  ],
  memory: [
    {
      id: 'hybrid-qdrant-pg',
      name: 'Hybrid Memory (Qdrant + PostgreSQL)',
      category: 'Memory',
      tagline: 'Semantic vector search paired with structured transactional relational state',
      description: 'Stores semantic knowledge, unstructured customer tickets, and company manuals in vector space, with relational audit logs and user accounts in Postgres.',
      bestFor: 'Growing businesses needing both knowledge search and strict transactional ACID records.',
      tradeOffs: {
        pros: ['Combines high-speed cosine vector search with relational integrity', 'Cost-effective'],
        cons: ['Two database systems to manage or monitor']
      },
      monthlyCostRange: '$30 - $140 / mo',
      latencyRating: 'Fast (<800ms)',
      autonomyReadiness: 9.4,
      standardProtocols: ['gRPC', 'PostgreSQL Wire Protocol', 'HNSW Index'],
      recommendedStage: ['seed', 'growth', 'scale', 'enterprise']
    },
    {
      id: 'mem0-redis',
      name: 'Mem0 + Redis Working Context',
      category: 'Memory',
      tagline: 'Adaptive user/customer personalization memory with sub-millisecond cache',
      description: 'Dynamic long-term episodic memory extraction that remembers individual customer preferences, previous issues, and agent session context seamlessly.',
      bestFor: 'High-touch customer support, VIP sales engagement, and individualized assistant agents.',
      tradeOffs: {
        pros: ['Automatically updates user facts over time', 'Sub-millisecond memory recall via Redis'],
        cons: ['Memory extraction prompts add minor token overhead during conversation turn']
      },
      monthlyCostRange: '$45 - $180 / mo',
      latencyRating: 'Ultra-Fast (<200ms)',
      autonomyReadiness: 9.3,
      standardProtocols: ['Redis RESP', 'REST API', 'Graph Extract'],
      recommendedStage: ['growth', 'scale', 'enterprise']
    },
    {
      id: 'pgvector-standalone',
      name: 'Pure pgvector (Supabase / Cloud SQL)',
      category: 'Memory',
      tagline: 'Single unified database for relational schema, JSON, and vector embeddings',
      description: 'Consolidates all business data, user state, and agent semantic memory into a single PostgreSQL engine using the pgvector extension.',
      bestFor: 'Lean engineering teams who want zero infrastructure sprawl and standard SQL queries.',
      tradeOffs: {
        pros: ['One database for everything', 'Standard SQL joins between vector similarity and table columns'],
        cons: ['Slightly lower QPS limits at massive scale (>10M vectors) compared to dedicated vector engines']
      },
      monthlyCostRange: '$25 - $95 / mo',
      latencyRating: 'Fast (<800ms)',
      autonomyReadiness: 9.1,
      standardProtocols: ['Postgres SQL', 'IVFFlat / HNSW'],
      recommendedStage: ['seed', 'growth']
    },
    {
      id: 'enterprise-knowledge-fabric',
      name: 'Air-Gapped Hybrid Qdrant + Snowflake Cortex (RLS)',
      category: 'Memory',
      tagline: 'Multi-tenant semantic fabric with Row-Level Security and Private VPC peering',
      description: 'Combines ultra-dense vector search with enterprise relational data clouds (Snowflake / Databricks). Enforces Active Directory / Okta user-level row security (RLS) so agents never expose confidential executive data to unauthorized queries.',
      bestFor: 'Cross-department enterprise knowledge graphs, legal document vaults, and executive business intelligence.',
      tradeOffs: {
        pros: ['Zero unauthorized cross-department data exposure (RLS enforced)', 'Direct SQL + Vector hybrid retrieval', 'Private-network deployment available'],
        cons: ['Requires enterprise Snowflake/Databricks integration setup']
      },
      monthlyCostRange: '$1,200 - $4,800 / mo',
      latencyRating: 'Fast (<800ms)',
      autonomyReadiness: 10.0,
      standardProtocols: ['Snowflake SQL API', 'PrivateLink', 'Qdrant gRPC', 'JWT Claims'],
      recommendedStage: ['scale', 'enterprise'],
      enterpriseReady: true
    }
  ],
  toolsProtocol: [
    {
      id: 'mcp-gateway',
      name: 'Model Context Protocol (MCP) Gateway',
      category: 'Tools & Protocols',
      tagline: 'Open standard for secure, modular agent tool discovery and execution',
      description: 'Universal protocol supported by Anthropic, Google, and open-source tooling. Standardizes how agents read files, query databases, invoke APIs, and discover server capabilities.',
      bestFor: 'Future-proofing agent toolchains and decoupling tool code from specific agent frameworks.',
      tradeOffs: {
        pros: ['Standardized JSON-RPC protocol', 'Growing ecosystem of pre-built MCP connectors (HubSpot, GitHub, Slack, Postgres, Jira)', 'Sandboxed security boundaries'],
        cons: ['Requires running lightweight MCP server daemons']
      },
      monthlyCostRange: 'Open Source / Protocol native ($0)',
      latencyRating: 'Ultra-Fast (<200ms)',
      autonomyReadiness: 9.9,
      standardProtocols: ['MCP (JSON-RPC 2.0)', 'stdio', 'SSE'],
      recommendedStage: ['seed', 'growth', 'scale', 'enterprise']
    },
    {
      id: 'openapi-webhooks',
      name: 'Dynamic OpenAPI / Swagger Connectors',
      category: 'Tools & Protocols',
      tagline: 'Auto-generates callable agent functions directly from company Swagger/REST specs',
      description: 'Ingests internal REST API specs and creates typed agent tools with schema validation in real time.',
      bestFor: 'Businesses with existing internal REST microservices and legacy endpoints.',
      tradeOffs: {
        pros: ['Direct integration with existing backends without rewriting endpoints', 'Strict type contracts'],
        cons: ['Large OpenAPI schemas can consume excessive context tokens if not filtered']
      },
      monthlyCostRange: '$0 - $30 / mo',
      latencyRating: 'Fast (<800ms)',
      autonomyReadiness: 8.9,
      standardProtocols: ['OpenAPI 3.1', 'REST', 'Webhooks'],
      recommendedStage: ['growth', 'scale', 'enterprise']
    },
    {
      id: 'code-interpreter-sandbox',
      name: 'Sandboxed Python / Node Code Interpreter',
      category: 'Tools & Protocols',
      tagline: 'Isolated secure container execution for dynamic calculations and data transformation',
      description: 'Allows agents to write and execute Python/SQL on the fly in micro-VMs to analyze CSVs, generate charts, and reconcile ledger discrepancies without security risks.',
      bestFor: 'Finance, business intelligence, inventory forecasting, and data enrichment agents.',
      tradeOffs: {
        pros: ['Handles complex mathematical logic without LLM calculation errors', 'Processes large datasets locally'],
        cons: ['Requires secure isolated container infrastructure (e.g. E2B, Modal, Docker)']
      },
      monthlyCostRange: '$20 - $120 / mo',
      latencyRating: 'Fast (<800ms)',
      autonomyReadiness: 9.6,
      standardProtocols: ['gVisor', 'Firecracker MicroVMs', 'Docker'],
      recommendedStage: ['growth', 'scale', 'enterprise']
    },
    {
      id: 'mcp-enterprise-gateway',
      name: 'Kong / Apigee Enterprise MCP Gateway (SAP / ServiceNow)',
      category: 'Tools & Protocols',
      tagline: 'Zero-Trust tool invocation broker with mTLS, SAML, and SAP/Salesforce/Workday connectors',
      description: 'Centralized enterprise Model Context Protocol gateway. Enforces fine-grained attribute-based access control (ABAC), token bucket rate limiting per business unit, dynamic secret injection via HashiCorp Vault, and signed audit receipts.',
      bestFor: 'Connecting agents safely to core enterprise systems of record without giving raw database credentials.',
      tradeOffs: {
        pros: ['Centralized CISO killswitch for any tool or agent', 'Native SAP BAPI, ServiceNow REST, and Workday SOAP integrations', 'HashiCorp Vault credential rotation'],
        cons: ['Requires corporate API gateway configuration']
      },
      monthlyCostRange: '$600 - $2,500 / mo',
      latencyRating: 'Ultra-Fast (<200ms)',
      autonomyReadiness: 10.0,
      standardProtocols: ['MCP JSON-RPC 2.0', 'mTLS', 'OAuth2 / SAML 2.0', 'HashiCorp Vault'],
      recommendedStage: ['scale', 'enterprise'],
      enterpriseReady: true
    }
  ],
  governance: [
    {
      id: 'langfuse-opentelemetry',
      name: 'Langfuse + OpenTelemetry Evals',
      category: 'Governance & Evals',
      tagline: 'Comprehensive observability, latency tracing, token billing, and prompt versioning',
      description: 'Tracks every agent thought step, tool call, token cost, and user feedback with complete visual flamegraphs and automated CI/CD eval assertions.',
      bestFor: 'Production visibility, auditing agent failure points, and tracking unit economics.',
      tradeOffs: {
        pros: ['Open source and cloud options', 'Detailed flamegraphs of multi-agent traces', 'Automated accuracy scores'],
        cons: ['Requires wrapping agent client calls with telemetry SDK']
      },
      monthlyCostRange: 'Free Tier / Cloud $49 - $190 / mo',
      latencyRating: 'Ultra-Fast (<200ms)',
      autonomyReadiness: 9.8,
      standardProtocols: ['OTel Standard', 'REST API', 'Batch Exporter'],
      recommendedStage: ['seed', 'growth', 'scale', 'enterprise']
    },
    {
      id: 'guardrails-pii-filter',
      name: 'Guardrails AI + NeMo Guardrails',
      category: 'Governance & Evals',
      tagline: 'Deterministic safety rules, PII anonymization, and hallucination bounds',
      description: 'Enforces strict input/output structural validators. Redacts SSNs, credit cards, and addresses before LLM transmission, and prevents unapproved out-of-bounds agent actions.',
      bestFor: 'Regulated industries (FinTech, Health, Legal) and customer-facing autonomous responders.',
      tradeOffs: {
        pros: ['Guarantees zero PII leakage', 'Prevents jailbreaks and tool injection attacks', 'Strict schema enforcement'],
        cons: ['Adds 40-100ms validation check before and after inference']
      },
      monthlyCostRange: '$40 - $150 / mo',
      latencyRating: 'Fast (<800ms)',
      autonomyReadiness: 9.7,
      standardProtocols: ['Colang', 'Regex Masks', 'Structured Output Validators'],
      recommendedStage: ['growth', 'scale', 'enterprise']
    },
    {
      id: 'hitl-approval-engine',
      name: 'Human-in-the-Loop Threshold Gate',
      category: 'Governance & Evals',
      tagline: 'Autonomous execution for low-risk tasks with interactive human sign-off on critical actions',
      description: 'Allows agents to operate 100% autonomously for routine tasks, but queues Slack/Email approval cards whenever a tool action exceeds predefined safety thresholds (e.g. refund > $200, bulk email > 50 recipients).',
      bestFor: 'Growing businesses transitioning from manual human labor to trusted agent autonomy.',
      tradeOffs: {
        pros: ['Zero business risk from accidental hallucinations', 'Builds team trust incrementally'],
        cons: ['Workflow pauses until human clicks Approve (handled seamlessly via async webhooks)']
      },
      monthlyCostRange: '$0 - $50 / mo',
      latencyRating: 'Fast (<800ms)',
      autonomyReadiness: 9.9,
      standardProtocols: ['Slack BlockKit', 'Webhook Callbacks', 'JWT Action Signatures'],
      recommendedStage: ['seed', 'growth', 'scale', 'enterprise']
    },
    {
      id: 'enterprise-iam-audit-vault',
      name: 'Agent Identity (Okta / CyberArk) + Hashed Audit Vault',
      category: 'Governance & Evals',
      tagline: 'Autonomous machine identity governance, prompt injection defense, and immutable SHA-256 ledger',
      description: 'Complete enterprise compliance suite. Treats every AI agent as a distinct Non-Human Identity (NHI) with short-lived tokens, real-time prompt armor against jailbreaks, automated PII/PHI tokenization, and WORM (Write-Once-Read-Many) audit logging complying with EU AI Act Art. 14 and SOC 2 Type II.',
      bestFor: 'Large companies whose security team needs a named identity and a durable record for every agent.',
      tradeOffs: {
        pros: ['Gives a security team the identity and change records their audits ask for', 'Append-only, hashed audit log', 'Kill switch that isolates one agent at a time'],
        cons: ['Requires integration with enterprise SIEM (Splunk / Microsoft Sentinel)']
      },
      monthlyCostRange: '$1,500 - $5,000 / mo',
      latencyRating: 'Fast (<800ms)',
      autonomyReadiness: 10.0,
      standardProtocols: ['WORM Audit Vault', 'SHA-256 Signatures', 'Okta NHI', 'Splunk HEC'],
      recommendedStage: ['scale', 'enterprise'],
      enterpriseReady: true
    }
  ]
};

export const DEPARTMENT_PLAYBOOKS: DepartmentPlaybook[] = [
  {
    id: 'sales-revops',
    title: 'Autonomous Inbound Sales & RevOps',
    department: 'Sales & RevOps',
    summary: 'Instantly enriches inbound demo requests, verifies ICP criteria, extracts executive signals from web presence, and proposes personalized meeting times with account executives.',
    businessImpact: 'Reduces lead response time from 4.2 hours to under 45 seconds; increases qualified meeting conversion by 38%.',
    roiMultiplier: '4.8x ROI',
    humanInTheLoopCheckpoint: 'Mandatory review before high-tier outbound sequence dispatch or custom enterprise quote generation.',
    sampleTrigger: 'Website form submission / inbound email from prospect',
    agents: [
      { name: 'Lead Enrichment Agent', role: 'Scrapes domain signals, LinkedIn company page, and tech stack', autonomyLevel: 'Full' },
      { name: 'ICP Scoring & Routing Agent', role: 'Calculates deal tier (Tier 1 vs Self-Serve) and assigns territory', autonomyLevel: 'Full' },
      { name: 'Meeting Negotiator Agent', role: 'Finds optimal calendar slots across AE timezones and crafts contextual invite', autonomyLevel: 'Supervised' }
    ],
    mcpTools: [
      { name: 'mcp-hubspot', description: 'Read/Write CRM contacts, deals, and lead status', protocol: 'Model Context Protocol' },
      { name: 'mcp-google-calendar', description: 'Verify AE availability and generate dynamic meet links', protocol: 'Google Workspace API / MCP' },
      { name: 'mcp-clearbit-apollo', description: 'Enrich employee count, funding, and industry vertical', protocol: 'REST / MCP' }
    ],
    guardrails: [
      'Strict email cadence limits (max 1 email / 48 hours per contact)',
      'Tone audit: Professional, consultative, zero aggressive spam tactics',
      'Data residency compliance (GDPR / CCPA consent validation)'
    ]
  },
  {
    id: 'customer-support',
    title: 'Autonomous 24/7 Tier-1 Customer Care',
    department: 'Customer Support',
    summary: 'Resolves routine customer queries, checks shipping or billing status, performs guided troubleshooting, and processes pre-approved refunds without human intervention.',
    businessImpact: 'Deflects 52% of tier-1 support tickets with a 94% CSAT rating; achieves sub-2 minute average resolution time.',
    roiMultiplier: '5.2x ROI',
    humanInTheLoopCheckpoint: 'Customer sentiment drops below -0.6 or requested refund amount exceeds $150 threshold.',
    sampleTrigger: 'Zendesk ticket created / Intercom chat message received',
    agents: [
      { name: 'Intent & Sentiment Triage Agent', role: 'Classifies issue urgency, customer tone, and account tier', autonomyLevel: 'Full' },
      { name: 'Knowledge Retrieval Agent', role: 'Queries internal docs, release notes, and FAQs with hybrid vector search', autonomyLevel: 'Full' },
      { name: 'Resolution & Action Executor', role: 'Interacts with billing systems, resets credentials, or queues replacement orders', autonomyLevel: 'Supervised' }
    ],
    mcpTools: [
      { name: 'mcp-zendesk-intercom', description: 'Read conversation history, update tags, post agent replies', protocol: 'MCP' },
      { name: 'mcp-stripe', description: 'Lookup charge history, subscription tier, and initiate refund with safety cap', protocol: 'Stripe API / MCP' },
      { name: 'mcp-vector-docs', description: 'Semantic search over knowledge base and troubleshooting SOPs', protocol: 'Qdrant / MCP' }
    ],
    guardrails: [
      'Refund cap: strictly limited to $150 without manager 1-click confirmation',
      'PII masking on all customer chat transcripts before vector indexing',
      'Automated sentiment escalation to human support manager'
    ]
  },
  {
    id: 'finance-ops',
    title: 'Autonomous Bookkeeping & Invoice Reconciliation',
    department: 'Finance & Ops',
    summary: 'Ingests incoming PDF invoices from email, parses line items with the foundation model reading the PDF directly, matches with purchase orders and bank feed lines, and drafts journal entries in QuickBooks/Xero.',
    businessImpact: 'Cuts month-end financial closing cycle from 9 business days down to 36 hours; eliminates 92% of manual data entry errors.',
    roiMultiplier: '3.9x ROI',
    humanInTheLoopCheckpoint: 'Any transaction discrepancy > $25 or new vendor setup requires 1-click CFO approval via Slack.',
    sampleTrigger: 'AP invoice received at billing@company.com or new Plaid bank transaction posted',
    agents: [
      { name: 'Multimodal OCR Ingestion Agent', role: 'Extracts tax IDs, line items, PO numbers, and payment terms from scanned PDFs', autonomyLevel: 'Full' },
      { name: 'Three-Way Match Auditor Agent', role: 'Cross-checks Invoice vs Purchase Order vs Bank Clearing Feed', autonomyLevel: 'Full' },
      { name: 'GL Posting & Reconciler Agent', role: 'Classifies expense account and drafts balanced journal entries', autonomyLevel: 'Supervised' }
    ],
    mcpTools: [
      { name: 'mcp-quickbooks-xero', description: 'Read/Write chart of accounts, vendor records, and draft bills', protocol: 'Accounting API / MCP' },
      { name: 'mcp-plaid-banking', description: 'Query real-time bank statement transactions and pending clearances', protocol: 'Plaid API / MCP' },
      { name: 'mcp-slack-approvals', description: 'Post interactive approval card with attached invoice PDF preview', protocol: 'Slack BlockKit / MCP' }
    ],
    guardrails: [
      'Zero auto-disbursement of cash: Agent only prepares draft bills for human release',
      'Duplicate invoice detector using fuzzy hash matching across past 24 months',
      'Immutable audit log tracking the exact OCR confidence score and rationale'
    ]
  },
  {
    id: 'marketing-content',
    title: 'Autonomous Growth & Content Engine',
    department: 'Marketing & Content',
    summary: 'Monitors competitor announcements, analyzes top-ranking SEO keywords, generates multi-channel editorial briefs, drafts newsletter campaigns, and schedules social distribution.',
    businessImpact: 'Increases qualified organic search traffic by 64% and accelerates content publishing cadence by 4.5x with consistent brand voice.',
    roiMultiplier: '4.1x ROI',
    humanInTheLoopCheckpoint: 'Brand voice editor reviews drafts before social scheduling or live blog publication.',
    sampleTrigger: 'Weekly editorial cadence trigger / Trending industry keyword alert',
    agents: [
      { name: 'Market Intelligence & Trend Agent', role: 'Monitors RSS, Google Search Trends, and competitor changelogs', autonomyLevel: 'Full' },
      { name: 'Content Strategist Agent', role: 'Builds comprehensive content briefs with target keywords and outlines', autonomyLevel: 'Full' },
      { name: 'Copywriter & Asset Agent', role: 'Drafts long-form post, creates platform-specific social hooks, and summarizes newsletter', autonomyLevel: 'Collaborative' }
    ],
    mcpTools: [
      { name: 'mcp-cms-wordpress-webflow', description: 'Create draft blog posts with formatted markdown and metadata', protocol: 'CMS API / MCP' },
      { name: 'mcp-seo-semrush', description: 'Retrieve keyword search volume, difficulty, and backlink targets', protocol: 'REST / MCP' },
      { name: 'mcp-social-scheduler', description: 'Stage draft social posts across LinkedIn, X, and newsletters', protocol: 'Buffer / Hootsuite / MCP' }
    ],
    guardrails: [
      'Brand guideline validator: scans for forbidden terms, competitor claims, and voice tone',
      'Plagiarism and duplicate content safety verification',
      'Mandatory human sign-off on all public posts'
    ]
  },
  {
    id: 'enterprise-security-itsm',
    title: 'Enterprise IT & SecOps Triage',
    department: 'IT & Cyber SecOps',
    summary: 'Autonomous Tier-1 incident classification, threat intelligence correlation, automated firewall micro-segmentation, and ServiceNow Change Request preparation.',
    businessImpact: 'Reduces Mean Time to Detect (MTTD) from 42 mins to 18 secs; automates 78% of routine patch validation with zero accidental production downtime.',
    roiMultiplier: '6.5x Enterprise ROI',
    humanInTheLoopCheckpoint: 'Mandatory CISO / Principal SRE 2-factor approval before applying production firewall rules or server failover.',
    sampleTrigger: 'ServiceNow Incident INC094812 / Datadog High-Risk Outlier Alert',
    agents: [
      { name: 'SecOps Telemetry Ingestion Agent', role: 'Ingests SIEM streams, correlates CVE databases, and evaluates blast radius', autonomyLevel: 'Full' },
      { name: 'Policy & Change Control Agent', role: 'Generates ISO 27001 / SOC 2 change justification ticket and impact analysis', autonomyLevel: 'Supervised' },
      { name: 'Remediation Orchestrator Agent', role: 'Executes approved zero-downtime rollback or pod isolation via Kubernetes MCP', autonomyLevel: 'Collaborative' }
    ],
    mcpTools: [
      { name: 'mcp-servicenow', description: 'Query/update change requests, configuration items (CMDB), and incident SLAs', protocol: 'ServiceNow REST / MCP' },
      { name: 'mcp-datadog-splunk', description: 'Query APM traces, error spikes, and distributed host metrics', protocol: 'Datadog API / MCP' },
      { name: 'mcp-kubernetes-vault', description: 'Read pod states, isolate compromised containers, and rotate secrets via HashiCorp Vault', protocol: 'KubeAPI / MCP' }
    ],
    guardrails: [
      'Dual-officer cryptographic sign-off required for any production cluster mutation',
      'Air-gapped VPC boundary enforcement: zero external egress during active threat containment',
      'Continuous compliance audit trail streamed directly to immutable WORM storage'
    ]
  }
];

export const WORKFLOW_PRESETS: SimulationWorkflow[] = [
  {
    id: 'inbound-deal-booking',
    title: 'Inbound Lead Qualification & Meeting Booking',
    category: 'Sales & RevOps',
    description: 'Autonomous handling of high-value inbound enterprise lead with account research, calendar negotiation, and CRM synchronization.',
    triggerEvent: 'Inbound Webhook: Demo Request Form submission from alex@scalevelocity.com ($18M ARR SaaS)',
    defaultSteps: [
      {
        agentName: 'Inbound Triage Agent',
        role: 'Dispatcher & Context Retriever',
        thought: 'Inbound lead received: Alex Chen (VP Ops, ScaleVelocity). Enriching domain via MCP Clearbit server to check company size, funding, and tech stack fit.',
        toolCall: {
          server: 'mcp-clearbit',
          tool: 'enrich_company_profile',
          args: { domain: 'scalevelocity.com', email: 'alex@scalevelocity.com' }
        },
        toolResult: {
          company: 'ScaleVelocity Inc',
          arrTier: '$15M - $25M',
          headcount: 140,
          techStack: ['Postgres', 'AWS', 'HubSpot', 'Stripe'],
          icpFitScore: 94
        },
        guardrailCheck: {
          passed: true,
          rule: 'PII encryption verified. Domain verified non-disposable.'
        },
        requiresHumanApproval: false
      },
      {
        agentName: 'Account Intelligence Agent',
        role: 'Knowledge Retriever',
        thought: 'Lead qualifies for Tier-1 Enterprise AE handling. Querying semantic vector store for recent customer case studies with similar stack (AWS + Stripe).',
        toolCall: {
          server: 'mcp-vector-store',
          tool: 'similarity_search',
          args: { collection: 'case_studies', query: 'Fintech AWS Stripe automated reconciliation ROI' }
        },
        toolResult: {
          topMatch: 'How PayFast cut manual reconciliation hours by 85%',
          stats: 'Saved $14,000/mo within 45 days',
          relevance: 0.93
        },
        guardrailCheck: {
          passed: true,
          rule: 'Verified case study permissions and public release authorization.'
        },
        requiresHumanApproval: false
      },
      {
        agentName: 'Executive Booking Agent',
        role: 'Proposal & Calendar Negotiator',
        thought: 'Drafted tailored calendar invitation highlighting PayFast case study. Querying Lead AE (Sarah Jenkins) calendar for optimal meeting slots.',
        toolCall: {
          server: 'mcp-calendar',
          tool: 'get_free_busy_slots',
          args: { user: 'sarah.jenkins@company.com', durationMin: 30, daysAhead: 3 }
        },
        toolResult: {
          availableSlots: ['Tuesday 2:00 PM EST', 'Wednesday 11:00 AM EST', 'Thursday 3:30 PM EST']
        },
        guardrailCheck: {
          passed: true,
          rule: 'Tone verification: Non-coercive, personalized, adheres to brand voice.'
        },
        requiresHumanApproval: true,
        humanPrompt: 'Agent generated customized meeting invitation for Alex Chen (VP Ops, ScaleVelocity - $18M ARR). Approve automated email dispatch?'
      },
      {
        agentName: 'CRM Ops Agent',
        role: 'State Synchronization',
        thought: 'Human approved email dispatch. Creating Deal stage "Qualified Discovery" in CRM, logging conversation history, and notifying #sales-war-room in Slack.',
        toolCall: {
          server: 'mcp-hubspot',
          tool: 'create_deal_and_task',
          args: { dealName: 'ScaleVelocity Enterprise Ops Stack', amount: 36000, stage: 'Discovery Scheduled', owner: 'sarah.jenkins' }
        },
        toolResult: {
          dealId: 'deal_sv_99182',
          crmStatus: 'Created',
          slackNotified: true
        },
        guardrailCheck: {
          passed: true,
          rule: 'Audit log appended with human approver ID and execution timestamp.'
        },
        requiresHumanApproval: false
      }
    ]
  },
  {
    id: 'customer-dispute-resolution',
    title: 'Tier-1 Dispute & Safe Partial Refund Execution',
    category: 'Customer Support',
    description: 'Autonomous resolution of a shipping delay inquiry with proactive store credit and verified policy guardrails.',
    triggerEvent: 'Customer Ticket #48291: "Order #84920 delayed by 8 days, requesting update or cancellation."',
    defaultSteps: [
      {
        agentName: 'Support Triage Agent',
        role: 'Sentiment & Order Lookup',
        thought: 'Classifying incoming ticket. Sentiment: Frustrated (-0.45). Extracting order reference #84920 to query warehouse fulfillment status.',
        toolCall: {
          server: 'mcp-warehouse-shipstation',
          tool: 'lookup_tracking_status',
          args: { orderId: '84920' }
        },
        toolResult: {
          carrier: 'FedEx',
          status: 'Delayed in Transit due to regional blizzard',
          estimatedDelivery: 'Tomorrow by 4 PM',
          orderTotal: 128.50
        },
        guardrailCheck: {
          passed: true,
          rule: 'Customer authentication verified against account email.'
        },
        requiresHumanApproval: false
      },
      {
        agentName: 'Policy & Compensation Agent',
        role: 'Remediation Decision Maker',
        thought: 'Delay exceeds guaranteed 4-day SLA. Company policy grants $25 courtesy credit or 20% partial refund for weather delays without cancellation.',
        toolCall: {
          server: 'mcp-stripe',
          tool: 'calculate_partial_refund',
          args: { chargeId: 'ch_3N9xKl2', percentage: 20, maxLimit: 50 }
        },
        toolResult: {
          calculatedCredit: 25.70,
          currency: 'USD',
          policyCode: 'SLA_WEATHER_COURTESY'
        },
        guardrailCheck: {
          passed: true,
          rule: 'Refund amount $25.70 is below the autonomous $50 threshold gate.'
        },
        requiresHumanApproval: false
      },
      {
        agentName: 'Action Execution Agent',
        role: 'Transaction & Communication Executor',
        thought: 'Autonomous threshold allows $25.70 credit without manual manager sign-off. Processing partial credit in Stripe and dispatching empathetic resolution reply.',
        toolCall: {
          server: 'mcp-stripe',
          tool: 'issue_partial_refund',
          args: { chargeId: 'ch_3N9xKl2', amountCents: 2570, reason: 'requested_by_customer' }
        },
        toolResult: {
          refundId: 're_8839201',
          status: 'succeeded',
          newOrderTotal: 102.80
        },
        guardrailCheck: {
          passed: true,
          rule: 'Transaction receipt generated and logged in customer ledger.'
        },
        requiresHumanApproval: false
      },
      {
        agentName: 'Zendesk Resolution Agent',
        role: 'Ticket Close & Followup',
        thought: 'Updating ticket status to "Resolved with Credit", adding internal audit note, and scheduling automated check-in after tomorrow\'s FedEx delivery.',
        toolCall: {
          server: 'mcp-zendesk',
          tool: 'resolve_ticket_with_comment',
          args: { ticketId: '48291', status: 'solved', publicNote: 'Applied $25.70 courtesy credit + confirmed delivery tomorrow.' }
        },
        toolResult: {
          ticketStatus: 'solved',
          csatSurveyArmed: true
        },
        guardrailCheck: {
          passed: true,
          rule: 'Customer communication tone score: Empathetic, Clear, Action-Oriented (9.6/10).'
        },
        requiresHumanApproval: false
      }
    ]
  },
  {
    id: 'monthly-invoice-reconciliation',
    title: 'Vendor Invoice Multimodal OCR & Ledger Sync',
    category: 'Finance & Ops',
    description: 'Multimodal extraction of vendor PDF bill, cross-checking against bank feeds, and queuing 1-click accounting journal entry.',
    triggerEvent: 'Email Attachment: "Invoice_AWS_Infrastructure_Aug2026.pdf" ($4,280.00)',
    defaultSteps: [
      {
        agentName: 'Multimodal Ingestion Agent',
        role: 'Visual Document Parsing',
        thought: 'Reading the PDF attachment with the foundation model. Extracting line items, tax IDs, invoice date, and payment remit address.',
        toolCall: {
          server: 'mcp-multimodal-ocr',
          tool: 'parse_financial_document',
          args: { fileType: 'pdf', targetSchema: 'vendor_bill' }
        },
        toolResult: {
          vendor: 'Amazon Web Services Inc',
          invoiceNumber: 'INV-982310',
          amount: 4280.00,
          billingPeriod: 'Aug 1 - Aug 31, 2026',
          taxAmount: 0.00,
          lineItemsCount: 8
        },
        guardrailCheck: {
          passed: true,
          rule: 'Checksum validation matches totals across all 8 line items.'
        },
        requiresHumanApproval: false
      },
      {
        agentName: 'Three-Way Match Auditor Agent',
        role: 'Ledger & Bank Feed Auditor',
        thought: 'Querying Plaid banking feed to check if automated ACH charge has cleared, and verifying AWS purchase order limit in internal budget.',
        toolCall: {
          server: 'mcp-plaid-banking',
          tool: 'match_cleared_transaction',
          args: { vendorName: 'AWS', amount: 4280.00, dateWindowDays: 5 }
        },
        toolResult: {
          matchedBankLine: 'ACH DEBIT: AMZN WEB SERVICES $4,280.00',
          matchStatus: 'Exact Match',
          budgetVariance: '+2.1% (within monthly forecast)'
        },
        guardrailCheck: {
          passed: true,
          rule: 'No duplicate invoice detected in past 365 days.'
        },
        requiresHumanApproval: false
      },
      {
        agentName: 'GL Posting Preparer Agent',
        role: 'Accounting Classification',
        thought: 'Bill amount ($4,280.00) exceeds $1,000 threshold for automated ledger posting. Preparing draft bill in QuickBooks and queuing Slack approval card for CFO.',
        toolCall: {
          server: 'mcp-quickbooks',
          tool: 'stage_draft_bill',
          args: { vendor: 'AWS', amount: 4280.00, glAccount: '6100 - Hosting & Cloud Infrastructure' }
        },
        toolResult: {
          draftBillId: 'qb_bill_48190',
          status: 'Pending_Approval'
        },
        guardrailCheck: {
          passed: true,
          rule: 'Zero cash disbursement without multi-factor CFO approval.'
        },
        requiresHumanApproval: true,
        humanPrompt: 'Audit complete: AWS Invoice #INV-982310 ($4,280.00) matches bank ACH feed. Approve final ledger posting to Account 6100 (Cloud Hosting)?'
      },
      {
        agentName: 'Finance Audit Agent',
        role: 'Compliance & Archive',
        thought: 'CFO approved bill. Finalizing QuickBooks ledger entry, tagging receipt in Google Drive compliance vault, and updating monthly burn rate chart.',
        toolCall: {
          server: 'mcp-quickbooks',
          tool: 'finalize_bill_and_archive',
          args: { billId: 'qb_bill_48190', approver: 'cfo@company.com', archiveFolder: '/Finance/2026/Q3/AWS' }
        },
        toolResult: {
          finalStatus: 'Posted & Reconciled',
          archiveUrl: 'drive://Finance/2026/AWS_INV982310.pdf'
        },
        guardrailCheck: {
          passed: true,
          rule: 'Immutable audit log recorded with approval stamp.'
        },
        requiresHumanApproval: false
      }
    ]
  },
  {
    id: 'enterprise-it-incident',
    title: 'Severity-1 Incident Remediation & Canary Rollback',
    category: 'IT & Cyber SecOps',
    isEnterprise: true,
    description: 'Autonomous Tier-1 incident classification across Datadog metrics, ServiceNow Change Records, and dual-approved canary Kubernetes rollback.',
    triggerEvent: 'Datadog Alert: Payment Gateway Latency P99 > 3,800ms / Error Rate Spike 14.2% across EU-Central Region',
    defaultSteps: [
      {
        agentName: 'SecOps Telemetry Agent',
        role: 'Distributed APM Analysis',
        thought: 'Analyzing distributed trace flamegraphs across 48 microservices. Isolating latency bottleneck to microservice `payments-v2.14.0` deployed 12 minutes ago.',
        toolCall: {
          server: 'mcp-datadog-splunk',
          tool: 'query_apm_anomaly',
          args: { service: 'payments-service', metric: 'p99_latency', windowMinutes: 15 }
        },
        toolResult: {
          rootCauseService: 'payments-v2.14.0',
          podNamespace: 'prod-eu-central-1',
          dbConnectionPoolExhaustion: true,
          impactedCustomers: 1420
        },
        guardrailCheck: {
          passed: true,
          rule: 'PII scrubbing active: zero customer credit card or account data accessed during trace inspection.'
        },
        requiresHumanApproval: false
      },
      {
        agentName: 'Enterprise ITSM & CMDB Agent',
        role: 'ServiceNow Change Correlator',
        thought: 'Correlating with active ServiceNow Change Requests. Found CHG-008912 ("Payments Gateway Performance Hotfix") marked implemented 14 minutes ago. Preparing automated Emergency Rollback request.',
        toolCall: {
          server: 'mcp-servicenow',
          tool: 'generate_emergency_change_ticket',
          args: { incidentSeverity: 'SEV-1', relatedChange: 'CHG-008912', proposedAction: 'Automated Blue/Green Traffic Shift to v2.13.8' }
        },
        toolResult: {
          ticketId: 'INC-889410',
          emergencyApprovalGroup: 'CAB-CoreInfrastructure',
          rollbackSafeHash: 'sha256:7f8a92b3c1044de8'
        },
        guardrailCheck: {
          passed: true,
          rule: 'SOC 2 Change Control policy: Production state changes require dual-officer cryptographic approval.'
        },
        requiresHumanApproval: true,
        humanPrompt: 'SEV-1 Alert: Correlated with CHG-008912. Authorize automated zero-downtime blue/green traffic shift back to stable release v2.13.8 in EU-Central-1?'
      },
      {
        agentName: 'Remediation Mesh Orchestrator',
        role: 'Kubernetes VPC Mesh Controller',
        thought: 'Authorization verified by Principal SRE key. Executing progressive canary traffic shift (100% -> 0% to v2.14.0, 100% to v2.13.8) via Envoy Service Mesh.',
        toolCall: {
          server: 'mcp-kubernetes-vault',
          tool: 'execute_canary_traffic_shift',
          args: { targetService: 'payments-service', rollbackVersion: 'v2.13.8', meshTrafficSplit: 100 }
        },
        toolResult: {
          shiftCompletedDurationMs: 840,
          errorRateDroppingTo: '0.04%',
          p99LatencyRestoredMs: 142
        },
        guardrailCheck: {
          passed: true,
          rule: 'Health check probe verified: 3 consecutive 200 OK responses before traffic promotion.'
        },
        requiresHumanApproval: false
      },
      {
        agentName: 'Governance & Compliance Agent',
        role: 'Cryptographic Audit Recorder',
        thought: 'Incident fully mitigated in 2 minutes 48 seconds. Signing incident timeline with SHA-256 HMAC and appending immutable record to WORM audit ledger.',
        toolCall: {
          server: 'enterprise-iam-audit-vault',
          tool: 'record_immutable_audit_entry',
          args: { complianceFramework: 'SOC2-CC7.4', incidentId: 'INC-889410', mttdSeconds: 18, mttrSeconds: 168 }
        },
        toolResult: {
          auditLedgerId: 'AUD-2026-0994',
          signatureVerified: true,
          complianceStatus: 'Documented for review'
        },
        guardrailCheck: {
          passed: true,
          rule: 'EU AI Act Article 14 Human Oversight record verified.'
        },
        requiresHumanApproval: false
      }
    ]
  },
  {
    id: 'global-procurement-sap',
    title: 'Cross-Border SAP S/4HANA PO Reconciliation ($480,000 Audit)',
    category: 'Finance & Ops',
    isEnterprise: true,
    description: 'Autonomous 3-way matching across global ERP SAP S/4HANA instances, bill of lading customs verification, and Foreign Corrupt Practices Act (FCPA) sanctions screening.',
    triggerEvent: 'SAP IDoc Inbound: Foreign Vendor Siemens Industrial AG Invoice EUR 440,000 (~$480,000 USD) for Component Assembly',
    defaultSteps: [
      {
        agentName: 'SAP S/4HANA BAPI Ingestion Agent',
        role: 'Enterprise ERP Interface',
        thought: 'Reading SAP Purchase Order #4500981240 and Goods Receipt (MIGO) record. Validating line-item tax classifications across EU and US tax jurisdictions.',
        toolCall: {
          server: 'mcp-sap-s4hana',
          tool: 'query_po_goods_receipt',
          args: { poNumber: '4500981240', vendorNumber: 'V-001928' }
        },
        toolResult: {
          poAmountUSD: 480000.00,
          goodsReceiptConfirmed: true,
          warehouseSite: 'Rotterdam Distribution Center #4',
          taxVariance: '0.00%'
        },
        guardrailCheck: {
          passed: true,
          rule: 'Enterprise ABAC: Agent verified with read-only scoped SAP BAPI token.'
        },
        requiresHumanApproval: false
      },
      {
        agentName: 'Trade Compliance & Sanctions Agent',
        role: 'OFAC & Global Sanctions Screening',
        thought: 'Screening vendor beneficial ownership, shipping manifest vessel IMO, and bill of lading against US OFAC, EU Consolidated List, and BIS Entity List.',
        toolCall: {
          server: 'mcp-trade-compliance',
          tool: 'screen_global_sanctions',
          args: { entityName: 'Siemens Industrial AG', vesselIMO: 'IMO9845012', destinationPort: 'USNYC' }
        },
        toolResult: {
          ofacScreening: 'CLEARED - 0 Matches',
          bisExportControl: 'CLEARED - License Exempt',
          fcpaRiskScore: '0.02 (Low Risk)'
        },
        guardrailCheck: {
          passed: true,
          rule: 'Sanctions check updated within last 6 hours: PASSED.'
        },
        requiresHumanApproval: false
      },
      {
        agentName: 'Treasury & Disbursement Agent',
        role: 'SOX Dual-Authorization Controller',
        thought: 'Invoice amount exceeds the $250,000 dual-approval threshold the company set. Staging draft wire release in Kyriba Treasury and queuing dual-signoff card for Enterprise VP Corporate Controller.',
        toolCall: {
          server: 'mcp-kyriba-treasury',
          tool: 'stage_cross_border_wire',
          args: { currency: 'EUR', amount: 440000, valueDate: '2026-09-08' }
        },
        toolResult: {
          wireStatus: 'Pending_Dual_Signature',
          fxHedgeApplied: 'Forward contract locked @ 1.0909 USD/EUR'
        },
        guardrailCheck: {
          passed: true,
          rule: 'SOX 404 segregation of duties: AI cannot approve wire that it prepared.'
        },
        requiresHumanApproval: true,
        humanPrompt: 'SOX 404 Dual Approval Required: SAP PO #4500981240 ($480,000 USD / EUR 440,000) for Siemens AG cleared 3-way match and OFAC check. Authorize treasury wire release?'
      },
      {
        agentName: 'SAP Ledger Reconciliation Agent',
        role: 'ERP Clearing & Audit Archival',
        thought: 'VP Controller cryptographic approval verified. Clearing SAP AP sub-ledger document #5100094182 and posting automated journal voucher in SAP FI.',
        toolCall: {
          server: 'mcp-sap-s4hana',
          tool: 'post_clearing_document',
          args: { sapCompanyCode: '1000', apDocument: '5100094182', approverSSO: 'vp_controller@enterprise.com' }
        },
        toolResult: {
          clearingDocumentNumber: '1900049102',
          generalLedgerStatus: 'Cleared & Balanced'
        },
        guardrailCheck: {
          passed: true,
          rule: 'WORM audit log committed with SHA-256 seal.'
        },
        requiresHumanApproval: false
      }
    ]
  }
];

export const STAGE_PRESETS = {
  seed: {
    title: 'Seed / Early-Stage (2-10 Team)',
    revenue: '< $1M ARR',
    description: 'Lean footprint maximizing speed and ROI with low overhead and minimal ops maintenance.',
    recommendedSelection: {
      foundation: 'claude-sonnet-5',
      orchestration: 'langgraph',
      memory: 'pgvector-standalone',
      toolsProtocol: 'mcp-gateway',
      governance: 'hitl-approval-engine'
    },
    avgMonthlyCost: '$80 - $220 / mo',
    readinessScore: 8.8,
    implementationTime: '1 - 2 weeks'
  },
  growth: {
    title: 'Growth SMB (10-50 Team)',
    revenue: '$1M - $10M ARR',
    description: 'Robust multi-agent collaboration with dedicated vector memory, latency routing, and structured evals.',
    recommendedSelection: {
      foundation: 'model-router',
      orchestration: 'langgraph',
      memory: 'hybrid-qdrant-pg',
      toolsProtocol: 'mcp-gateway',
      governance: 'langfuse-opentelemetry'
    },
    avgMonthlyCost: '$250 - $650 / mo',
    readinessScore: 9.6,
    implementationTime: '2 - 4 weeks'
  },
  scale: {
    title: 'Scaling Mid-Market (50-250 Team)',
    revenue: '$10M - $50M ARR',
    description: 'Enterprise-grade durable state machines, rigorous PII guardrails, and automated unit-cost tracking.',
    recommendedSelection: {
      foundation: 'model-router',
      orchestration: 'temporal-agentic',
      memory: 'mem0-redis',
      toolsProtocol: 'code-interpreter-sandbox',
      governance: 'guardrails-pii-filter'
    },
    avgMonthlyCost: '$750 - $2,200 / mo',
    readinessScore: 9.9,
    implementationTime: '4 - 8 weeks'
  },
  enterprise: {
    title: 'Large Enterprise (1,000+ Team)',
    revenue: '$500M+ ARR',
    description: 'Models run inside the business\'s own cloud account, provider data terms signed, keys held by the business, a durable workflow engine, and an audit log an auditor can work from.',
    recommendedSelection: {
      foundation: 'cloud-inference',
      orchestration: 'temporal-enterprise-mesh',
      memory: 'enterprise-knowledge-fabric',
      toolsProtocol: 'mcp-enterprise-gateway',
      governance: 'enterprise-iam-audit-vault'
    },
    avgMonthlyCost: '$7,600 - $25,000 / mo',
    readinessScore: 10.0,
    implementationTime: '6 - 12 weeks'
  }
};

export const ENTERPRISE_COMPLIANCE_STANDARDS: EnterpriseComplianceItem[] = [
  {
    id: 'comp-1',
    framework: 'EU AI Act',
    title: 'A person oversees automated decisions',
    mandateReference: 'Regulation (EU) 2024/1689, Article 14 (human oversight) and Article 15 (accuracy and security)',
    implementation: 'Approval gates before money moves or configuration changes, with the reason recorded. Alerts when a model starts answering differently than it used to.',
    auditEvidence: 'An approval log showing who approved what, when, and why. Produced by the stack automatically.',
    status: 'Designed in'
  },
  {
    id: 'comp-2',
    framework: 'SOC 2 Type II',
    title: 'Access control and change management',
    mandateReference: 'AICPA Trust Services Criteria CC6 (logical access) and CC7 (system operations)',
    implementation: 'Each agent has its own identity and the least access it needs; production changes need a person; sessions expire on their own.',
    auditEvidence: 'SOC 2 is an auditor\'s report on the company, not a feature of software. The stack is built so the access and change evidence an auditor asks for already exists. The report itself is the business\'s to commission.',
    status: 'Client obtains'
  },
  {
    id: 'comp-3',
    framework: 'Zero Data Retention',
    title: 'Model providers not keeping your prompts',
    mandateReference: 'The provider\'s commercial terms and data processing addendum',
    implementation: 'No-retention and no-training terms are available from the major model providers on business and enterprise agreements. Meridian configures the stack for them; the term itself lives in the contract.',
    auditEvidence: 'The signed provider agreement. The business signs it; Meridian tells you which one to ask for.',
    status: 'Client obtains'
  },
  {
    id: 'comp-4',
    framework: 'CMEK',
    title: 'Encryption keys the business controls',
    mandateReference: 'Cloud key management: AWS KMS, Google Cloud KMS or Azure Key Vault',
    implementation: 'Vector data, records and logs encrypted with keys held in the business\'s own cloud key store. Revoking a key locks everything the agents remember.',
    auditEvidence: 'Key-store access and rotation logs from the cloud provider.',
    status: 'Pattern available'
  },
  {
    id: 'comp-5',
    framework: 'ISO 27001',
    title: 'Keeping the tool servers patched',
    mandateReference: 'ISO/IEC 27001:2022, control 8.8 (management of technical vulnerabilities)',
    implementation: 'Scheduled scanning of the tool servers, dependency updates, and mutual TLS between agents and the tools they call.',
    auditEvidence: 'ISO 27001 certification is a company-level audit. This pattern gives the security team the scanning and change records that audit needs.',
    status: 'Client obtains'
  },
  {
    id: 'comp-6',
    framework: 'HIPAA',
    title: 'Protected health information kept out of the model',
    mandateReference: '45 CFR Parts 160 and 164',
    implementation: 'Names, record numbers and other identifiers are masked before any text reaches a model, and restored only on the way back.',
    auditEvidence: 'HIPAA needs a Business Associate Agreement with each vendor that touches health information. Meridian designs for it; the agreements are the business\'s to sign.',
    status: 'Client obtains'
  }
];

export const ENTERPRISE_IAM_PERMISSIONS: AgentIamPermission[] = [
  {
    agentId: 'agent-secops-01',
    agentName: 'SecOps Telemetry Agent',
    role: 'Cyber Incident Response',
    sapPermission: 'Denied',
    serviceNowPermission: 'Staged Write',
    salesforcePermission: 'Denied',
    snowflakePermission: 'Read',
    workdayPermission: 'Denied',
    dualApprovalThreshold: 'Automatic on SEV-3 / Dual Sign-off on SEV-1'
  },
  {
    agentId: 'agent-finance-02',
    agentName: 'SAP AP Reconciliation Agent',
    role: 'Enterprise Financial Automation',
    sapPermission: 'Staged Write',
    serviceNowPermission: 'Denied',
    salesforcePermission: 'Read',
    snowflakePermission: 'Read',
    workdayPermission: 'Denied',
    dualApprovalThreshold: '$10,000+ USD requires VP Controller Approval'
  },
  {
    agentId: 'agent-revops-03',
    agentName: 'Global Inbound RevOps Agent',
    role: 'Enterprise Deal Routing & SLA',
    sapPermission: 'Read',
    serviceNowPermission: 'Denied',
    salesforcePermission: 'Full Write',
    snowflakePermission: 'Read',
    workdayPermission: 'Denied',
    dualApprovalThreshold: 'Deals > $250k require CRO notification'
  },
  {
    agentId: 'agent-support-04',
    agentName: 'VIP Tier-3 Support Specialist',
    role: 'SLA Escalation & Customer Care',
    sapPermission: 'Denied',
    serviceNowPermission: 'Read',
    salesforcePermission: 'Staged Write',
    snowflakePermission: 'Denied',
    workdayPermission: 'Denied',
    dualApprovalThreshold: 'Refunds > $500 require Director Sign-off'
  },
  {
    agentId: 'agent-people-05',
    agentName: 'HR Benefits Assistant',
    role: 'Internal Employee Operations',
    sapPermission: 'Denied',
    serviceNowPermission: 'Read',
    salesforcePermission: 'Denied',
    snowflakePermission: 'Denied',
    workdayPermission: 'Staged Write',
    dualApprovalThreshold: 'Compensation changes strictly Forbidden'
  }
];

export const INITIAL_AUDIT_LEDGER: AuditLedgerRecord[] = [
  {
    id: 'AUD-8921-01',
    timestamp: '2026-09-04 14:32:08 UTC',
    agentName: 'SAP AP Reconciliation Agent',
    action: 'POST_STAGED_JOURNAL_ENTRY',
    targetSystem: 'SAP S/4HANA (FI-AP)',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    approver: 'controller (second sign-off)',
    complianceRule: 'Two people approve journal entries over the threshold',
    status: 'SUPERVISED'
  },
  {
    id: 'AUD-8921-02',
    timestamp: '2026-09-04 14:35:12 UTC',
    agentName: 'SecOps Telemetry Agent',
    action: 'SERVICE_MESH_CANARY_ROLLBACK',
    targetSystem: 'Kubernetes VPC Mesh EU-Central-1',
    sha256Hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    approver: 'lead engineer',
    complianceRule: 'Production changes need a person',
    status: 'SUPERVISED'
  },
  {
    id: 'AUD-8921-03',
    timestamp: '2026-09-04 14:38:45 UTC',
    agentName: 'Global Inbound RevOps Agent',
    action: 'SALESFORCE_OPPORTUNITY_ENRICH',
    targetSystem: 'Salesforce Enterprise CRM',
    sha256Hash: 'f4d3c2b1a09876543210fedcba9876543210fedcba9876543210fedcba987654',
    approver: 'Automated Policy Check (Low Risk)',
    complianceRule: 'Low-risk read and enrich: no approval needed',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-8921-04',
    timestamp: '2026-09-04 14:41:19 UTC',
    agentName: 'HR Benefits Assistant',
    action: 'ATTEMPT_ELEVATION_EXECUTIVE_SALARY',
    targetSystem: 'HR system, compensation table',
    sha256Hash: 'c7be89304a918fde293817498237419827349182374981273948172938471928',
    approver: 'Blocked by the permission gate',
    complianceRule: 'Least privilege: this agent may not write to pay',
    status: 'CONTAINED'
  }
];
