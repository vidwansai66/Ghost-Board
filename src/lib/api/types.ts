/**
 * GHOST BOARD — Shared Type Definitions
 *
 * All domain models used across API routes, services, hooks, and components.
 * These types define the contract between the backend (n8n / Next.js API)
 * and the frontend UI layer.
 */

// ─────────────────────────────────────────────────────────────────────────────
// API Response Envelope
// ─────────────────────────────────────────────────────────────────────────────

/** Wraps every API response with metadata */
export interface ApiResponse<T> {
  data: T;
  error: string | null;
  timestamp: string;   // ISO 8601
  /** "live" when data comes from n8n, "simulated" when using fallback mock data */
  source: "live" | "simulated";
  /** Request latency in ms (for debugging) */
  latencyMs?: number;
}

export interface ApiError {
  code: string;
  message: string;
  retryable: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Executive Domain
// ─────────────────────────────────────────────────────────────────────────────

export type ExecutiveStatus = "ACTIVE" | "PROCESSING" | "SYNC" | "STANDBY" | "CRISIS";

export interface ExecutiveState {
  id: string;
  name: string;
  role: string;
  color: "cyan" | "violet" | "blue" | "red" | "orange" | "green" | "white";
  image: string;
  /** 0–100 confidence score */
  confidence: number;
  /** 0–100 workflow load percentage */
  workflowLoad: number;
  /** Current active reasoning log entry */
  reasoning: string;
  /** Current operational objective */
  objective: string;
  /** 0–5 communication activity level */
  commsActivity: number;
  status: ExecutiveStatus;
  /** Whether the executive is currently performing deep reasoning */
  isThinking: boolean;
  /** Last updated timestamp */
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Crisis Monitoring Domain
// ─────────────────────────────────────────────────────────────────────────────

export type IncidentSeverity = "CRITICAL" | "HIGH" | "ELEVATED" | "WARNING" | "INFO";

export interface ActiveIncident {
  id: string;
  severity: IncidentSeverity;
  message: string;
  triggeredAt: string;
  resolvedAt?: string;
}

export interface CrisisMetrics {
  /** 0–100 customer outrage score */
  outrage: number;
  /** 0–100 infrastructure stability */
  stability: number;
  /** 0–100 operational risk level */
  risk: number;
  /** 0–100 escalation severity */
  escalation: number;
  /** 0–100 recovery progress */
  recovery: number;
  /** 0–100 workflow activity utilization */
  workflowActivity: number;
  activeIncident: ActiveIncident | null;
  /** Total active incident count */
  incidentCount: number;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Workflow Domain
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkflowNode {
  id: number;
  label: string;
  x: number;
  y: number;
  color: string;
  isActive: boolean;
}

export interface WorkflowConnection {
  from: number;
  to: number;
  isActive: boolean;
}

export interface WorkflowState {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  activeChainLabel: string;
  /** Processing throughput in TFLOPS */
  tflops: number;
  /** Synchronization latency in ms */
  syncMs: number;
  /** 0–100 overall processing load */
  processingLoad: number;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Intelligence Report Domain
// ─────────────────────────────────────────────────────────────────────────────

export type ReportGenerationStatus = "idle" | "scanning" | "compiling" | "writing" | "complete" | "error";

export type OperationalRisk = "Low" | "Elevated" | "High";
export type InfrastructureStatus = "Stable" | "Degraded" | "Critical";

export interface IntelligenceReport {
  id: string;
  summary: string;
  crisisLabel: string;
  crisisValue: string;
  operationalRisk: OperationalRisk;
  infrastructureStatus: InfrastructureStatus;
  recommendations: string[];
  generatedAt: string;
  /** Number of this report in the sequence */
  sequenceNumber: number;
}

export interface ReportGenerationJob {
  jobId: string;
  status: ReportGenerationStatus;
  progress: number;
  /** Populated when status === "complete" */
  report?: IntelligenceReport;
  startedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Communication Feed Domain
// ─────────────────────────────────────────────────────────────────────────────

export interface FeedMessage {
  id: string;
  agent: string;
  /** CSS color class e.g. "text-primary" */
  color: string;
  /** CSS background class e.g. "bg-primary/10" */
  bg: string;
  /** Emoji icon */
  icon: string;
  content: string;
  timestamp: string;
  /** 1–4 signal strength level */
  signalStrength: number;
  /** Optional n8n workflow that triggered this message */
  workflowId?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// System Metrics Domain
// ─────────────────────────────────────────────────────────────────────────────

export interface SystemMetrics {
  /** 0–100 system load percentage */
  systemLoad: number;
  /** Network latency in ms */
  netLatency: number;
  /** 0–100 security integrity score */
  secIntegrity: number;
  /** Total active workflows */
  activeWorkflows: number;
  /** AI processing load in TFLOPS */
  aiProcLoad: number;
  /** 0–100 global synchronization percentage */
  globalSync: number;
  /** Data throughput in PB/S */
  dataThroughput: number;
  /** System uptime in seconds */
  uptimeSeconds: number;
  /** Most recent system event label */
  latestSystemEvent: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// n8n Webhook Payload (incoming from n8n)
// ─────────────────────────────────────────────────────────────────────────────

export type N8nEventType =
  | "executive.status_update"
  | "crisis.metrics_update"
  | "workflow.state_update"
  | "report.generated"
  | "message.new"
  | "system.metrics_update"
  | "system.alert";

export interface N8nWebhookPayload {
  event: N8nEventType;
  workflowId: string;
  executionId: string;
  timestamp: string;
  /** The domain-specific payload — shape depends on event type */
  data: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook Return Types
// ─────────────────────────────────────────────────────────────────────────────

export interface UseQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => void;
  source: "live" | "simulated" | null;
  lastUpdated: Date | null;
}
