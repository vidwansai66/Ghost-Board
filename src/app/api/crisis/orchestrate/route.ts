/**
 * POST /api/crisis/orchestrate
 *
 * Proxy that forwards crisis payloads to the n8n webhook and returns
 * the parsed AI executive responses to the frontend.
 *
 * KEY DESIGN:
 * - Reads exact field names your n8n workflow sends (marketing_ai, cto_ai, etc.)
 * - STRIPS unresolved n8n expression strings like {{ $('Node').item.json.text }}
 * - Falls back gracefully so UI never shows raw template syntax
 *
 * n8n Webhook: http://localhost:5678/webhook/ghost-board-crisis
 * Expected response shape from n8n:
 * {
 *   "marketing_ai":    "...",
 *   "cto_ai":         "...",
 *   "hr_ai":          "...",
 *   "ceo_ai":         "...",
 *   "operations_ai":  "...",
 *   "executive_report": "..."
 * }
 */

import { NextRequest, NextResponse } from "next/server";

// Tell Next.js this route can run up to 180 seconds (agentic LLM workflows are slow)
export const maxDuration = 180;

// ─── n8n endpoint ─────────────────────────────────────────────────────────────
const N8N_WEBHOOK = process.env.N8N_CRISIS_WEBHOOK_URL
  ?? "https://primary-production-7c382.up.railway.app/webhook/ghost-board-crisis";

// ─── Response shape returned to the frontend ──────────────────────────────────
export interface OrchestrationResult {
  raw: unknown;
  executives: {
    ceo: string | null;
    cto: string | null;
    marketing: string | null;
    hr: string | null;
    operations: string | null;
    security: string | null;
  };
  report: string | null;
  completedAt: string;
  latencyMs: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// n8n Expression Sanitizer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true if a string is an UNRESOLVED n8n expression.
 * n8n sometimes sends `{{ $('NodeName').item.json.fieldName }}` as a literal
 * string when the "Respond to Webhook" node is misconfigured (expression mode off).
 * These strings must NEVER be shown in the UI.
 */
function isN8nExpression(val: string): boolean {
  return val.includes("{{") && val.includes("}}");
}

/**
 * Cleans a candidate string:
 * - Returns null if it is an unresolved n8n expression
 * - Returns null if it is empty / whitespace only
 * - Otherwise returns the trimmed string
 */
function sanitize(val: unknown): string | null {
  if (typeof val !== "string") return null;
  const trimmed = val.trim();
  if (!trimmed) return null;
  if (isN8nExpression(trimmed)) {
    console.warn("[orchestrate] Unresolved n8n expression stripped:", trimmed.slice(0, 80));
    return null;
  }
  return trimmed;
}

// ─────────────────────────────────────────────────────────────────────────────
// Field Lookup
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Exact field names your n8n workflow sends — checked in priority order.
 * The first group are the canonical names from the user's workflow.
 * Additional aliases follow for maximum compatibility.
 */
const EXEC_KEYS: Record<keyof OrchestrationResult["executives"], string[]> = {
  // ← exact names your n8n "Respond to Webhook" node sends (highest priority)
  marketing: ["marketing_ai", "marketing", "marketing_response", "growth_brand", "Marketing AI", "MARKETING_AI"],
  cto: ["cto_ai", "cto", "cto_response", "technical_ops", "CTO AI", "CTO_AI"],
  hr: ["hr_ai", "hr", "hr_response", "human_resources", "HR AI", "HR_AI"],
  ceo: ["ceo_ai", "ceo", "ceo_decision", "ceo_response", "CEO AI", "CEO_AI"],
  operations: ["operations_ai", "operations", "operations_response", "ops_ai", "Operations AI", "OPERATIONS_AI"],
  security: ["security_ai", "security", "security_response", "cyber_defense", "Security AI", "SECURITY_AI"],
};

const REPORT_KEYS = [
  "executive_report", "report", "final_report", "summary", "analysis", "output",
  "EXECUTIVE_REPORT", "REPORT",
];

/**
 * Walks the key list, reads the value from the object, sanitizes it.
 * Also handles one level of nesting: { text: "...", response: "..." }
 */
function extractField(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const val = obj[key];
    if (val === undefined || val === null) continue;

    // Direct string value
    const direct = sanitize(val);
    if (direct) return direct;

    // Nested object: { text: "...", response: "...", content: "..." }
    if (typeof val === "object" && !Array.isArray(val)) {
      const nested = val as Record<string, unknown>;
      for (const innerKey of ["text", "response", "content", "message", "output", "value"]) {
        const inner = sanitize(nested[innerKey]);
        if (inner) return inner;
      }
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Response Parser
// ─────────────────────────────────────────────────────────────────────────────

function parseN8nBody(raw: unknown): Omit<OrchestrationResult, "raw" | "completedAt" | "latencyMs"> {
  // n8n often wraps the output in an array — unwrap first element
  const body = Array.isArray(raw) ? raw[0] : raw;

  // ── Also handle n8n's nested json wrapper: { json: { marketing_ai: "..." } }
  let obj: Record<string, unknown>;
  if (body && typeof body === "object") {
    const rawObj = body as Record<string, unknown>;
    // n8n Execute Workflow / Set node wraps data under .json sometimes
    obj = (rawObj.json && typeof rawObj.json === "object")
      ? rawObj.json as Record<string, unknown>
      : rawObj;
  } else if (typeof body === "string") {
    const cleaned = sanitize(body);
    return {
      executives: { ceo: null, cto: null, marketing: null, hr: null, operations: null, security: null },
      report: cleaned,
    };
  } else {
    return {
      executives: { ceo: null, cto: null, marketing: null, hr: null, operations: null, security: null },
      report: null,
    };
  }

  // Log the raw fields received for debugging (visible in Next.js terminal)
  console.info("[orchestrate] n8n response fields:", Object.keys(obj));

  // ── Extract per-executive fields ──────────────────────────────────────────
  const executives: OrchestrationResult["executives"] = {
    marketing: extractField(obj, EXEC_KEYS.marketing),
    cto: extractField(obj, EXEC_KEYS.cto),
    hr: extractField(obj, EXEC_KEYS.hr),
    ceo: extractField(obj, EXEC_KEYS.ceo),
    operations: extractField(obj, EXEC_KEYS.operations),
    security: extractField(obj, EXEC_KEYS.security),
  };

  const report = extractField(obj, REPORT_KEYS);
  const hasAny = Object.values(executives).some(Boolean);

  // ── Fallback: if nothing matched, show all clean string values ────────────
  if (!hasAny && !report) {
    const cleanPairs = Object.entries(obj)
      .map(([k, v]) => {
        const s = sanitize(v);
        return s ? `${k}:\n${s}` : null;
      })
      .filter(Boolean);

    const fallbackReport = cleanPairs.length > 0
      ? cleanPairs.join("\n\n")
      : "n8n returned a response but no recognizable executive fields were found. Check the field names in your n8n workflow match: marketing_ai, cto_ai, hr_ai, ceo_ai, operations_ai, executive_report.";

    return { executives, report: fallbackReport };
  }

  return { executives, report };
}

// ─────────────────────────────────────────────────────────────────────────────
// Route Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const startTime = Date.now();

  console.info("[orchestrate] Sending to n8n:", N8N_WEBHOOK, payload);

  try {
    const n8nRes = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // 180-second timeout — LLM-powered agentic workflows typically take 30–120s
      signal: AbortSignal.timeout(180_000),
    });

    const latencyMs = Date.now() - startTime;

    // Parse response body (n8n can return JSON or plain text)
    let raw: unknown;
    const contentType = n8nRes.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      raw = await n8nRes.json();
    } else {
      raw = await n8nRes.text();
    }

    console.info("[orchestrate] n8n responded in", latencyMs, "ms, status:", n8nRes.status);

    if (!n8nRes.ok) {
      console.error("[orchestrate] n8n error response:", raw);
      return NextResponse.json(
        { error: `n8n workflow responded with ${n8nRes.status}`, details: raw },
        { status: 502 }
      );
    }

    const parsed = parseN8nBody(raw);
    const result: OrchestrationResult = {
      ...parsed,
      raw,
      completedAt: new Date().toISOString(),
      latencyMs,
    };

    // Log what was extracted to help debugging
    const extracted = Object.entries(result.executives)
      .filter(([, v]) => v)
      .map(([k]) => k);
    console.info("[orchestrate] Extracted executives:", extracted, "| Report:", Boolean(result.report));

    return NextResponse.json({ data: result, error: null });

  } catch (err) {
    const latencyMs = Date.now() - startTime;
    const message = err instanceof Error ? err.message : String(err);
    const isTimeout = message.includes("timeout") || message.includes("abort") || message.includes("TimeoutError");
    const isRefused = message.includes("ECONNREFUSED") || message.includes("fetch failed");

    console.error("[orchestrate] n8n request failed:", message);

    return NextResponse.json(
      {
        error: isRefused
          ? "Cannot connect to n8n. Make sure n8n is running on localhost:5678."
          : isTimeout
            ? "n8n workflow timed out after 3 minutes. The workflow may still be running — check the n8n canvas."
            : `Orchestration failed: ${message}`,
        latencyMs,
      },
      { status: 503 }
    );
  }
}
