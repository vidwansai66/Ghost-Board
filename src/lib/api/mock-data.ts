/**
 * GHOST BOARD — Mock Data Generators
 *
 * Shared simulation data used by all API routes when n8n is not connected.
 * These are the canonical mock shapes — they match the TypeScript types exactly.
 */

import {
  ExecutiveState,
  CrisisMetrics,
  WorkflowState,
  IntelligenceReport,
  FeedMessage,
  SystemMetrics,
  ActiveIncident,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
const rndInt = (min: number, max: number) => Math.floor(rnd(min, max + 1));
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const now = () => new Date().toISOString();

// ─────────────────────────────────────────────────────────────────────────────
// Executive Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const EXEC_REASONING: Record<string, string[]> = {
  "CEO AI":        ["EVALUATING_STRATEGIC_POSTURE","AUTHORIZING_EXPANSION_PROTOCOL","RISK_REWARD_CALIBRATION","SYNTHESIZING_BOARD_DIRECTIVES","PROJECTING_Q3_FISCAL_TRAJECTORY","CRISIS_PROTOCOL_ASSESSMENT"],
  "CTO AI":        ["PROFILING_CLUSTER_LATENCY","NEURAL_FABRIC_DIAGNOSTICS","SCALING_EDGE_NODES","OPTIMIZING_MESH_TOPOLOGY","REROUTING_TRAFFIC_FLOWS","HARDENING_EMEA_INFRASTRUCTURE"],
  "Marketing AI":  ["ANALYZING_SENTIMENT_VECTORS","DEPLOYING_HOLOGRAPHIC_ASSETS","CALIBRATING_ENGAGEMENT_MODEL","RUNNING_A/B_NEURAL_TEST","APAC_RECOVERY_CAMPAIGN_LIVE","MEASURING_BRAND_RESONANCE"],
  "HR AI":         ["REBALANCING_COMPUTE_AGENTS","NEURAL_CALIBRATION_IN_PROGRESS","ONBOARDING_SUB_AGENTS","WORKLOAD_DISTRIBUTION_ANALYSIS","AGENT_PERFORMANCE_SCORING","OPTIMIZING_CYCLE_EFFICIENCY"],
  "Operations AI": ["REROUTING_SUPPLY_CHAINS","DRONE_LOGISTICS_SYNC","VENDOR_CONTRACT_RENEGOTIATION","EXECUTING_RECOVERY_WORKFLOW","DEMAND_FORECAST_CALIBRATION","AUTONOMOUS_LOGISTICS_ACTIVE"],
  "Security AI":   ["ZERO_TRUST_SWEEP_ACTIVE","QUANTUM_KEY_ROTATION","THREAT_SIGNATURE_INTEGRATION","BEHAVIORAL_ANALYTICS_RUNNING","PERIMETER_DEFENSE_UPGRADED","ANOMALY_DETECTION_TIER_2"],
};

const EXEC_OBJECTIVES: Record<string, string[]> = {
  "CEO AI":        ["Maximize long-term enterprise value through autonomous orchestration.","Authorize crisis Alpha-7 containment — all divisions on standby.","Projecting record Q3 throughput — expansion protocol active.","Synthesizing board directives with real-time operational data."],
  "CTO AI":        ["Scaling neural infrastructure across multi-cloud edge nodes.","Tokyo cluster recovery at 82% — full SLA restoration imminent.","Rerouting APAC traffic to Singapore. Latency trending down.","Pre-emptive EMEA scaling — 200 new nodes provisioned."],
  "Marketing AI":  ["Optimizing global sentiment through holographic engagement.","APAC recovery campaign live — trust score climbing +11pts.","Q3 neural campaign assets deploying — 34% conversion uplift.","Behavioral targeting model retrained on 3.2B interactions."],
  "HR AI":         ["Balancing agent performance and neural load distribution.","Reallocating 38% compute to crisis cluster — efficiency peak.","Onboarding 3 sub-agents to Ops division — calibration active.","Crisis efficiency delta: +14.2% — logging to neural memory."],
  "Operations AI": ["Synchronizing autonomous logistics with real-time demand.","Recovery workflows deployed — Singapore overflow managed.","Vendor renegotiation complete — $2.4M savings projected.","Supply chain fully autonomous — 9 distribution hubs live."],
  "Security AI":   ["Maintaining absolute zero-trust integrity across all sectors.","Zero-trust sweep complete — no breach indicators detected.","47 new threat signatures integrated — perimeter hardened.","Quantum key rotation complete — all channels re-encrypted."],
};

const EXEC_BASE = [
  { id: "ceo",  name: "CEO AI",        role: "Chief Executive", color: "white"  as const, image: "/ceo_ai.png" },
  { id: "cto",  name: "CTO AI",        role: "Technical Ops",   color: "cyan"   as const, image: "/cto_ai.png" },
  { id: "mkt",  name: "Marketing AI",  role: "Growth & Brand",  color: "violet" as const, image: "/marketing_ai.png" },
  { id: "hr",   name: "HR AI",         role: "Resource MGMT",   color: "green"  as const, image: "/hr_ai.png" },
  { id: "ops",  name: "Operations AI", role: "Supply Chain",    color: "orange" as const, image: "/operations_ai.png" },
  { id: "sec",  name: "Security AI",   role: "Cyber Defense",   color: "red"    as const, image: "/security_ai.png" },
];

export function generateExecutiveMocks(): ExecutiveState[] {
  return EXEC_BASE.map(e => ({
    ...e,
    confidence:     rnd(87, 100),
    workflowLoad:   rnd(15, 95),
    reasoning:      pick(EXEC_REASONING[e.name]),
    objective:      pick(EXEC_OBJECTIVES[e.name]),
    commsActivity:  rndInt(0, 5),
    status:         pick(["ACTIVE", "PROCESSING", "SYNC"]) as ExecutiveState["status"],
    isThinking:     Math.random() > 0.4,
    updatedAt:      now(),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Crisis Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const INCIDENTS: Omit<ActiveIncident, "id" | "triggeredAt">[] = [
  { severity: "INFO",     message: "Recovery chain at 82%. All systems trending stable." },
  { severity: "INFO",     message: "Quantum key rotation complete. All channels re-encrypted." },
  { severity: "ELEVATED", message: "Neural fabric degradation at 23% — rerouting initiated." },
  { severity: "HIGH",     message: "Tokyo cluster latency breach — 4x SLA threshold exceeded." },
  { severity: "HIGH",     message: "Treasury volatility spike — mitigation workflow X-9 active." },
  { severity: "WARNING",  message: "Anomalous login probe — Frankfurt subnet quarantined." },
  { severity: "CRITICAL", message: "APAC sentiment collapse detected — 18pt drop in 4 minutes." },
  { severity: "CRITICAL", message: "Unauthorized API flood — 4,200 req/s from rogue node." },
];

export function generateCrisisMocks(): CrisisMetrics {
  const incident = pick(INCIDENTS);
  return {
    outrage:          rnd(4, 35),
    stability:        rnd(88, 100),
    risk:             rnd(2, 30),
    escalation:       rnd(2, 25),
    recovery:         rnd(70, 100),
    workflowActivity: rnd(40, 95),
    activeIncident: {
      id:          `INC-${Date.now()}`,
      triggeredAt: now(),
      ...incident,
    },
    incidentCount: rndInt(0, 3),
    updatedAt:     now(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Workflow Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const CHAIN_LABELS = [
  "CRISIS_RECOVERY_CHAIN", "SENTIMENT_ROUTING", "SECURITY_SWEEP",
  "SUPPLY_CHAIN_SYNC", "EXPANSION_PROTOCOL",
];

const BASE_NODES = [
  { id: 1, label: "DATA_INGEST",   x: 15, y: 50, color: "#00f2ff" },
  { id: 2, label: "NEURAL_PROC",   x: 42, y: 22, color: "#7000ff" },
  { id: 3, label: "RISK_ANALYSIS", x: 42, y: 78, color: "#ff6b35" },
  { id: 4, label: "EXEC_DECISION", x: 70, y: 50, color: "#00f2ff" },
  { id: 5, label: "RECOVERY_OPS",  x: 90, y: 30, color: "#10b981" },
  { id: 6, label: "DEPLOY_CHAIN",  x: 90, y: 70, color: "#f59e0b" },
];

const BASE_CONNECTIONS = [
  { from: 1, to: 2 }, { from: 1, to: 3 },
  { from: 2, to: 4 }, { from: 3, to: 4 },
  { from: 4, to: 5 }, { from: 4, to: 6 },
];

export function generateWorkflowMocks(): WorkflowState {
  const activeNodeIds = new Set<number>();
  while (activeNodeIds.size < rndInt(2, 5)) {
    activeNodeIds.add(rndInt(1, 6));
  }

  const activeConnIndices = new Set<number>();
  while (activeConnIndices.size < rndInt(2, 4)) {
    activeConnIndices.add(rndInt(0, 5));
  }

  return {
    nodes: BASE_NODES.map(n => ({ ...n, isActive: activeNodeIds.has(n.id) })),
    connections: BASE_CONNECTIONS.map((c, i) => ({ ...c, isActive: activeConnIndices.has(i) })),
    activeChainLabel: pick(CHAIN_LABELS),
    tflops:          rnd(10, 90),
    syncMs:          rnd(4, 40),
    processingLoad:  rnd(20, 95),
    updatedAt:       now(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Intelligence Report Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const SUMMARIES = [
  "Neural node clusters in EMEA region exhibiting +14% efficiency after autonomous rerouting protocol. Sentiment recovery confirmed in APAC.",
  "Tokyo cluster fully restored. Crisis Alpha-7 archived. Cross-division coordination logged as record-breaking. Neural memory updated.",
  "Treasury volatility stabilized. Mitigation workflow X-9 deactivated. Fiscal efficiency index: 94.2%. Q3 on track.",
  "Global sentiment index: 89.4 and climbing. APAC trust score recovered +11pts. Q3 campaign neural assets deployed.",
  "EMEA scaling complete — 200 nodes live. Pre-emptive surge capacity allocated. Mesh latency reduced 12ms across all zones.",
];

const CRISIS_INSIGHTS = [
  { label: "Primary Threat",    value: "APAC Sentiment Erosion" },
  { label: "Active Mitigation", value: "Recovery Campaign Alpha" },
  { label: "System Posture",    value: "Crisis Alpha-7 Engaged" },
  { label: "Primary Threat",    value: "Unauthorized API Probe" },
  { label: "Active Mitigation", value: "Zero-Trust Sweep Live" },
];

const RECOMMENDATIONS_SETS = [
  ["Maintain crisis posture until stability exceeds 97.5%.", "Resume Q3 expansion on confirmed stabilization.", "Rotate quantum keys on 6-hour cycle post-incident."],
  ["Reallocate compute to Marketing and CTO divisions.", "Defer Cycle-8 HR optimization until nominal state.", "Log coordination performance to neural long-term memory."],
  ["Scale EMEA cluster by additional 100 nodes proactively.", "Re-run behavioral analytics on Frankfurt subnet.", "Upgrade APAC perimeter defense — Tier-3 escalation."],
];

let reportSequence = 0;

export function generateReportMock(): IntelligenceReport {
  const insight = pick(CRISIS_INSIGHTS);
  reportSequence += 1;
  return {
    id:                  `RPT-${Date.now()}`,
    summary:             pick(SUMMARIES),
    crisisLabel:         insight.label,
    crisisValue:         insight.value,
    operationalRisk:     pick(["Low", "Elevated", "High"]),
    infrastructureStatus: pick(["Stable", "Degraded", "Critical"]),
    recommendations:     pick(RECOMMENDATIONS_SETS),
    generatedAt:         now(),
    sequenceNumber:      reportSequence,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Feed Message Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const MESSAGE_POOL: Omit<FeedMessage, "id" | "timestamp" | "signalStrength">[] = [
  { agent: "Marketing AI",  color: "text-secondary",   bg: "bg-secondary/10",  icon: "📊", content: "Customer outrage escalating — APAC sentiment index dropped 18pts. Real-time trust erosion confirmed. Initiating emergency engagement protocol." },
  { agent: "CTO AI",        color: "text-primary",     bg: "bg-primary/10",    icon: "⚙️", content: "Infrastructure instability confirmed. Tokyo cluster latency at 1,240ms. Neural fabric degradation at 23%. Rerouting initiated." },
  { agent: "Operations AI", color: "text-orange-500",  bg: "bg-orange-500/10", icon: "🔄", content: "Recovery workflows deployed. Singapore cluster absorbing 40% overflow. Autonomous logistics chain unaffected. ETA stabilization: 6 minutes." },
  { agent: "CEO AI",        color: "text-white",       bg: "bg-white/5",       icon: "👁️", content: "Prioritize operational stabilization. Expansion protocols suspended. Crisis Alpha-7 engaged. All divisions: maximum resource allocation." },
  { agent: "Security AI",   color: "text-destructive", bg: "bg-destructive/10",icon: "🔐", content: "No breach indicators detected. Zero-trust sweep complete. System integrity at 99.97%. Anomaly watch escalated to Tier-2." },
  { agent: "HR AI",         color: "text-emerald-500", bg: "bg-emerald-500/10",icon: "🧠", content: "Compute rebalanced — 38% reallocated from dormant agents to crisis cluster. Neural coordination index: peak performance." },
  { agent: "CTO AI",        color: "text-primary",     bg: "bg-primary/10",    icon: "⚙️", content: "Tokyo node recovery at 68%. Latency trending down to 340ms. Full SLA restoration projected in 3 minutes 45 seconds." },
  { agent: "CEO AI",        color: "text-white",       bg: "bg-white/5",       icon: "👁️", content: "Recovery trajectory nominal. Maintain crisis posture until global stability index exceeds 97.5%. Authorized Phase-2 reactivation." },
  { agent: "Marketing AI",  color: "text-secondary",   bg: "bg-secondary/10",  icon: "📊", content: "Sentiment fully recovered. APAC trust score +11 points. Brand resonance index climbing. Q3 forecast upgraded by 8%." },
  { agent: "Security AI",   color: "text-destructive", bg: "bg-destructive/10",icon: "🔐", content: "Scheduled quantum key rotation complete. All 6 executive channels re-encrypted. New entropy seed applied. Security posture: OPTIMAL." },
];

export function generateMessageMock(count = 1): FeedMessage[] {
  return Array.from({ length: count }, (_, i) => {
    const base = pick(MESSAGE_POOL);
    return {
      ...base,
      id:             `MSG-${Date.now()}-${i}`,
      timestamp:      now(),
      signalStrength: rndInt(2, 4),
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// System Metrics Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_EVENTS = [
  "NEURAL_SYNC_COMPLETE", "CLUSTER_REBALANCED", "THREAT_NEUTRALIZED",
  "PROTOCOL_ALPHA7_ENGAGED", "QUANTUM_KEY_ROTATED", "EXPANSION_AUTHORIZED",
  "RECOVERY_CHAIN_ACTIVE", "SENTIMENT_RECOVERY_LIVE", "FISCAL_REPORT_GENERATED",
  "PERIMETER_HARDENED",
];

let baseUptime = 1482 * 3600 + 12 * 60 + 4;

export function generateSystemMetricsMocks(): SystemMetrics {
  baseUptime += rndInt(3, 6);
  return {
    systemLoad:        rnd(10, 80),
    netLatency:        rnd(4, 60),
    secIntegrity:      rnd(98, 100),
    activeWorkflows:   rndInt(900, 1600),
    aiProcLoad:        rnd(40, 98),
    globalSync:        rnd(97, 100),
    dataThroughput:    rnd(0.8, 2.4),
    uptimeSeconds:     baseUptime,
    latestSystemEvent: pick(SYSTEM_EVENTS),
    updatedAt:         now(),
  };
}
