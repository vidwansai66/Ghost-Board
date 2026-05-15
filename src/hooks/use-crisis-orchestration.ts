"use client";

/**
 * GHOST BOARD — useCrisisOrchestration
 *
 * Hook that manages the full lifecycle of an n8n crisis orchestration call:
 *   idle → submitting → streaming_responses → complete | error
 *
 * The "streaming" effect is simulated by staggering executive responses
 * from the batch n8n reply — creating the feel of live AI coordination.
 */

import { useCallback, useRef, useState } from "react";
import type { OrchestrationResult } from "@/app/api/crisis/orchestrate/route";

// ─── Public Types ─────────────────────────────────────────────────────────────

export type OrchestrationPhase =
  | "idle"
  | "connecting"
  | "waiting_n8n"
  | "streaming_responses"
  | "complete"
  | "error";

export interface CrisisPayload {
  crisis_type:        string;
  severity:           string;
  customer_sentiment: string;
  system_status:      string;
  /** Optional action mode sent as context */
  action_mode?:       string;
}

export interface ExecutiveResponse {
  id:      string;
  name:    string;
  role:    string;
  icon:    string;
  color:   string;
  content: string;
  /** When this response appeared in the stream */
  arrivedAt: number;
}

export interface OrchestrationState {
  phase:       OrchestrationPhase;
  responses:   ExecutiveResponse[];
  report:      string | null;
  latencyMs:   number | null;
  error:       string | null;
  raw:         unknown;
  startedAt:   number | null;
}

// ─── Executive display metadata ────────────────────────────────────────────────

const EXECUTIVE_META: Record<
  keyof OrchestrationResult["executives"],
  { name: string; role: string; icon: string; color: string; colorClass: string }
> = {
  ceo:        { name: "CEO AI",        role: "Chief Executive",  icon: "👁️", color: "#ffffff",  colorClass: "text-white" },
  cto:        { name: "CTO AI",        role: "Technical Ops",    icon: "⚙️", color: "#00f2ff",  colorClass: "text-primary" },
  marketing:  { name: "Marketing AI",  role: "Growth & Brand",   icon: "📊", color: "#7000ff",  colorClass: "text-secondary" },
  hr:         { name: "HR AI",         role: "Resource MGMT",    icon: "🧠", color: "#10b981",  colorClass: "text-emerald-500" },
  operations: { name: "Operations AI", role: "Supply Chain",     icon: "🔄", color: "#f59e0b",  colorClass: "text-orange-500" },
  security:   { name: "Security AI",   role: "Cyber Defense",    icon: "🔐", color: "#ef4444",  colorClass: "text-destructive" },
};

/** Delay between each executive's response appearing (ms) */
const STREAM_STAGGER_MS = 600;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCrisisOrchestration() {
  const [state, setState] = useState<OrchestrationState>({
    phase:     "idle",
    responses: [],
    report:    null,
    latencyMs: null,
    error:     null,
    raw:       null,
    startedAt: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ phase: "idle", responses: [], report: null, latencyMs: null, error: null, raw: null, startedAt: null });
  }, []);

  const orchestrate = useCallback(async (payload: CrisisPayload) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const startedAt = Date.now();

    setState({ phase: "connecting", responses: [], report: null, latencyMs: null, error: null, raw: null, startedAt });

    // Brief "connecting" phase for dramatic effect
    await new Promise(r => setTimeout(r, 400));

    setState(s => ({ ...s, phase: "waiting_n8n" }));

    try {
      const res = await fetch("/api/crisis/orchestrate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
        signal:  abortRef.current.signal,
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        setState(s => ({
          ...s,
          phase: "error",
          error: json.error ?? `HTTP ${res.status}`,
          latencyMs: json.latencyMs ?? (Date.now() - startedAt),
        }));
        return;
      }

      const result: OrchestrationResult = json.data;

      // ── Client-side expression guard ─────────────────────────────────────
      // The proxy already strips these, but as a defence-in-depth measure,
      // catch any unresolved n8n expressions that may have slipped through.
      const isN8nExpression = (s: string) => s.includes("{{") && s.includes("}}");

      const safeExec = (val: string | null): string | null => {
        if (!val) return null;
        if (isN8nExpression(val)) {
          console.warn("[useCrisisOrchestration] Stripped unresolved n8n expression from executive response");
          return null;
        }
        return val;
      };

      const cleanedExecutives = {
        ceo:        safeExec(result.executives.ceo),
        cto:        safeExec(result.executives.cto),
        marketing:  safeExec(result.executives.marketing),
        hr:         safeExec(result.executives.hr),
        operations: safeExec(result.executives.operations),
        security:   safeExec(result.executives.security),
      };

      const cleanedReport = result.report && !isN8nExpression(result.report)
        ? result.report
        : null;

      // Build ordered response list — marketing first, CEO last (dramatic effect)
      const execOrder: (keyof OrchestrationResult["executives"])[] = [
        "marketing", "cto", "operations", "hr", "security", "ceo",
      ];

      const validResponses: ExecutiveResponse[] = execOrder
        .filter(key => Boolean(cleanedExecutives[key]))
        .map((key, idx) => ({
          id:        key,
          name:      EXECUTIVE_META[key].name,
          role:      EXECUTIVE_META[key].role,
          icon:      EXECUTIVE_META[key].icon,
          color:     EXECUTIVE_META[key].colorClass,
          content:   cleanedExecutives[key]!,
          arrivedAt: Date.now() + idx * STREAM_STAGGER_MS,
        }));

      // If no per-executive data but there's a clean report, show it as a single output
      if (validResponses.length === 0 && cleanedReport) {
        validResponses.push({
          id:        "ceo",
          name:      "GHOST BOARD AI",
          role:      "Orchestration Output",
          icon:      "🤖",
          color:     "text-primary",
          content:   cleanedReport,
          arrivedAt: Date.now(),
        });
      }

      // If still nothing — no valid data came back at all
      if (validResponses.length === 0 && !cleanedReport) {
        setState(s => ({
          ...s,
          phase: "error",
          error: "n8n responded but all fields contained unresolved expressions ({{ }}). Open your n8n workflow → select the Respond to Webhook node → enable Expression mode on each field value.",
          latencyMs: result.latencyMs,
          raw: result.raw,
        }));
        return;
      }

      setState(s => ({
        ...s,
        phase:     "streaming_responses",
        raw:       result.raw,
        latencyMs: result.latencyMs,
        report:    cleanedReport,
      }));

      // Stream responses in with stagger delay
      for (let i = 0; i < validResponses.length; i++) {
        await new Promise(r => setTimeout(r, i === 0 ? 200 : STREAM_STAGGER_MS));
        if (abortRef.current?.signal.aborted) return;
        setState(s => ({ ...s, responses: [...s.responses, validResponses[i]] }));
      }

      // Small delay before marking complete
      await new Promise(r => setTimeout(r, 300));
      setState(s => ({ ...s, phase: "complete" }));

    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setState(s => ({
        ...s,
        phase: "error",
        error: err instanceof Error ? err.message : "Unknown orchestration error",
        latencyMs: Date.now() - startedAt,
      }));
    }
  }, []);

  return { state, orchestrate, reset };
}
