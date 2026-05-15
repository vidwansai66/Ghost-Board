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
import { parseN8nResponse } from "@/lib/api/n8n-parser";

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
  
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setShowSuccessToast(false);
    setState({ phase: "idle", responses: [], report: null, latencyMs: null, error: null, raw: null, startedAt: null });
  }, []);

  const orchestrate = useCallback(async (payload: CrisisPayload) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setShowSuccessToast(false);

    const startedAt = Date.now();
    const endpoint = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "/api/crisis/orchestrate";
    const isDirect = endpoint.startsWith("http");

    setState({ phase: "connecting", responses: [], report: null, latencyMs: null, error: null, raw: null, startedAt });

    await new Promise(r => setTimeout(r, 400));
    setState(s => ({ ...s, phase: "waiting_n8n" }));

    try {
      console.info(`[orchestration] Initializing POST request to: ${endpoint}`);
      
      const res = await fetch(endpoint, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
        signal:  abortRef.current.signal,
      });

      // Log status and body as requested
      const rawBody = await res.text();
      console.log(`[orchestration] Response Status: ${res.status}`);
      
      try {
        const parsedBody = JSON.parse(rawBody);
        console.log("[orchestration] Response Body:", parsedBody);
        
        if (!res.ok) {
          const errorMsg = parsedBody.error || parsedBody.message || `HTTP ${res.status}`;
          throw new Error(errorMsg);
        }

        let result: OrchestrationResult;

        if (isDirect) {
          // Parse raw n8n response in frontend
          const parsed = parseN8nResponse(parsedBody);
          result = {
            ...parsed,
            raw: parsedBody,
            completedAt: new Date().toISOString(),
            latencyMs: Date.now() - startedAt,
          } as OrchestrationResult;
        } else {
          // Response comes from our proxy which already parsed it
          result = parsedBody.data;
        }

        if (!result) throw new Error("No data returned from orchestration engine.");

        setShowSuccessToast(true);

        const execOrder: (keyof OrchestrationResult["executives"])[] = [
          "marketing", "cto", "operations", "hr", "security", "ceo",
        ];

        const validResponses: ExecutiveResponse[] = execOrder
          .filter(key => Boolean(result.executives[key]))
          .map((key, idx) => ({
            id:        key,
            name:      EXECUTIVE_META[key].name,
            role:      EXECUTIVE_META[key].role,
            icon:      EXECUTIVE_META[key].icon,
            color:     EXECUTIVE_META[key].colorClass,
            content:   result.executives[key]!,
            arrivedAt: Date.now() + idx * STREAM_STAGGER_MS,
          }));

        if (validResponses.length === 0 && result.report) {
          validResponses.push({
            id:        "ceo",
            name:      "GHOST BOARD AI",
            role:      "Orchestration Output",
            icon:      "🤖",
            color:     "text-primary",
            content:   result.report,
            arrivedAt: Date.now(),
          });
        }

        if (validResponses.length === 0) {
          throw new Error("n8n responded but no valid AI executive content was found. Check your workflow field names.");
        }

        setState(s => ({
          ...s,
          phase:     "streaming_responses",
          raw:       result.raw,
          latencyMs: result.latencyMs,
          report:    result.report,
        }));

        for (let i = 0; i < validResponses.length; i++) {
          await new Promise(r => setTimeout(r, i === 0 ? 200 : STREAM_STAGGER_MS));
          if (abortRef.current?.signal.aborted) return;
          setState(s => ({ ...s, responses: [...s.responses, validResponses[i]] }));
        }

        await new Promise(r => setTimeout(r, 300));
        setState(s => ({ ...s, phase: "complete" }));

      } catch (parseErr) {
        if (parseErr instanceof Error) throw parseErr;
        throw new Error("Failed to parse orchestration response.");
      }

    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const message = err instanceof Error ? err.message : String(err);
      console.error("[orchestration] Error:", message);
      
      setState(s => ({
        ...s,
        phase: "error",
        error: message,
        latencyMs: Date.now() - startedAt,
      }));
    }
  }, []);

  return { state, orchestrate, reset, showSuccessToast, setShowSuccessToast };
}
