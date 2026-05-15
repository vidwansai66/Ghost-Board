import { OrchestrationResult } from "@/app/api/crisis/orchestrate/route";

// ─────────────────────────────────────────────────────────────────────────────
// n8n Expression Sanitizer
// ─────────────────────────────────────────────────────────────────────────────

function isN8nExpression(val: string): boolean {
  return val.includes("{{") && val.includes("}}");
}

function sanitize(val: unknown): string | null {
  if (typeof val !== "string") return null;
  const trimmed = val.trim();
  if (!trimmed) return null;
  if (isN8nExpression(trimmed)) return null;
  return trimmed;
}

// ─────────────────────────────────────────────────────────────────────────────
// Field Lookup
// ─────────────────────────────────────────────────────────────────────────────

const EXEC_KEYS = {
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

function extractField(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const val = obj[key];
    if (val === undefined || val === null) continue;

    const direct = sanitize(val);
    if (direct) return direct;

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
// Main Parser
// ─────────────────────────────────────────────────────────────────────────────

export function parseN8nResponse(raw: unknown): Omit<OrchestrationResult, "raw" | "completedAt" | "latencyMs"> {
  const body = Array.isArray(raw) ? raw[0] : raw;

  let obj: Record<string, unknown>;
  if (body && typeof body === "object") {
    const rawObj = body as Record<string, unknown>;
    obj = (rawObj.json && typeof rawObj.json === "object")
      ? rawObj.json as Record<string, unknown>
      : rawObj;
  } else if (typeof body === "string") {
    return {
      executives: { ceo: null, cto: null, marketing: null, hr: null, operations: null, security: null },
      report: sanitize(body),
    };
  } else {
    return {
      executives: { ceo: null, cto: null, marketing: null, hr: null, operations: null, security: null },
      report: null,
    };
  }

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

  if (!hasAny && !report) {
    const cleanPairs = Object.entries(obj)
      .map(([k, v]) => {
        const s = sanitize(v);
        return s ? `${k}:\n${s}` : null;
      })
      .filter(Boolean);

    const fallbackReport = cleanPairs.length > 0
      ? cleanPairs.join("\n\n")
      : null;

    return { executives, report: fallbackReport };
  }

  return { executives, report };
}
