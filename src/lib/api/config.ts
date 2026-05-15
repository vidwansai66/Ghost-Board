/**
 * GHOST BOARD — Centralized API Configuration
 *
 * All endpoint URLs, n8n webhook paths, polling intervals, and
 * feature flags are defined here. Update this file to point the
 * system at your live n8n instance.
 */

// ─────────────────────────────────────────────────────────────────────────────
// n8n Integration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Base URL for your n8n instance.
 * Set NEXT_PUBLIC_N8N_URL in .env.local to enable live mode.
 *
 * Example: https://your-n8n-instance.app.n8n.cloud
 */
export const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_URL ?? "";

/**
 * n8n webhook paths. Each maps to a specific n8n workflow trigger.
 * Format: <N8N_BASE_URL>/webhook/<path>
 */
export const N8N_WEBHOOKS = {
  executives: process.env.N8N_WEBHOOK_EXECUTIVES ?? "/webhook/ghost/executives",
  crisis:     process.env.N8N_WEBHOOK_CRISIS     ?? "/webhook/ghost/crisis",
  workflows:  process.env.N8N_WEBHOOK_WORKFLOWS  ?? "/webhook/ghost/workflows",
  reports:    process.env.N8N_WEBHOOK_REPORTS    ?? "/webhook/ghost/reports",
  messages:   process.env.N8N_WEBHOOK_MESSAGES   ?? "/webhook/ghost/messages",
  system:     process.env.N8N_WEBHOOK_SYSTEM     ?? "/webhook/ghost/system",
} as const;

/**
 * Returns true if a live n8n instance URL is configured.
 * When false, all API routes return simulated mock data.
 */
export function isLiveMode(): boolean {
  return Boolean(N8N_BASE_URL && N8N_BASE_URL.trim() !== "");
}

/**
 * Constructs the full n8n webhook URL for a given domain path.
 */
export function buildN8nUrl(webhookPath: string): string {
  return `${N8N_BASE_URL}${webhookPath}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Local API Endpoints
// ─────────────────────────────────────────────────────────────────────────────

/** All local Next.js API route paths — the single source of truth for URLs */
export const API_ENDPOINTS = {
  // Executive domain
  executivesStatus: "/api/executives/status",

  // Crisis domain
  crisisMetrics:         "/api/crisis/metrics",
  crisisReports:         "/api/crisis/reports",
  crisisReportsGenerate: "/api/crisis/reports/generate",

  // Workflow domain
  workflowsStatus: "/api/workflows/status",

  // System domain
  systemMetrics: "/api/system/metrics",

  // Messages domain
  messagesFeed:   "/api/messages/feed",
  messagesStream: "/api/messages/stream",

  // Incoming n8n webhook receiver
  webhookN8n: "/api/webhooks/n8n",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Polling Intervals (milliseconds)
// ─────────────────────────────────────────────────────────────────────────────

export const POLL_INTERVALS = {
  /** Executive states — updated every 4 seconds */
  executives:     4_000,
  /** Crisis metrics — updated every 3 seconds */
  crisis:         3_000,
  /** Workflow node states — updated every 2.5 seconds */
  workflows:      2_500,
  /** System metrics — updated every 3 seconds */
  systemMetrics:  3_000,
  /** Message feed polling fallback — updated every 5 seconds */
  messagesFallback: 5_000,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Fetch Configuration
// ─────────────────────────────────────────────────────────────────────────────

export const FETCH_CONFIG = {
  /** Request timeout in ms */
  timeoutMs: 8_000,
  /** Number of retry attempts on failure */
  maxRetries: 2,
  /** Base delay for exponential backoff (ms) */
  retryBaseDelayMs: 500,
} as const;
