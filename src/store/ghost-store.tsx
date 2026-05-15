"use client";

/**
 * GHOST BOARD — Global State Store
 *
 * React Context + useReducer store that holds the latest data for all domains.
 * Components can either use domain-specific hooks directly (preferred for isolated
 * components) OR read from this store (preferred for cross-component coordination).
 *
 * The GhostProvider should wrap the command-center layout.
 */

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { ExecutiveState, CrisisMetrics, WorkflowState, SystemMetrics, FeedMessage } from "@/lib/api/types";
import { useExecutives } from "@/hooks/use-executives";
import { useCrisisMetrics } from "@/hooks/use-crisis-metrics";
import { useWorkflowState } from "@/hooks/use-workflow-state";
import { useSystemMetrics } from "@/hooks/use-system-metrics";
import { useMessageFeed } from "@/hooks/use-message-feed";

// ─────────────────────────────────────────────────────────────────────────────
// State Shape
// ─────────────────────────────────────────────────────────────────────────────

interface GhostState {
  executives: ExecutiveState[];
  crisisMetrics: CrisisMetrics | null;
  workflowState: WorkflowState | null;
  systemMetrics: SystemMetrics | null;
  messages: FeedMessage[];
  /** "live" if connected to n8n, "simulated" if using mock data */
  dataSource: "live" | "simulated" | null;
  /** True if any domain is currently fetching its first load */
  isBootstrapping: boolean;
}

const INITIAL_STATE: GhostState = {
  executives:      [],
  crisisMetrics:   null,
  workflowState:   null,
  systemMetrics:   null,
  messages:        [],
  dataSource:      null,
  isBootstrapping: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────────────────────────────────────

type GhostAction =
  | { type: "SET_EXECUTIVES";    payload: ExecutiveState[] }
  | { type: "SET_CRISIS";        payload: CrisisMetrics }
  | { type: "SET_WORKFLOW";      payload: WorkflowState }
  | { type: "SET_METRICS";       payload: SystemMetrics }
  | { type: "SET_MESSAGES";      payload: FeedMessage[] }
  | { type: "SET_DATA_SOURCE";   payload: "live" | "simulated" }
  | { type: "SET_BOOTSTRAPPED" };

function ghostReducer(state: GhostState, action: GhostAction): GhostState {
  switch (action.type) {
    case "SET_EXECUTIVES":  return { ...state, executives:    action.payload };
    case "SET_CRISIS":      return { ...state, crisisMetrics: action.payload };
    case "SET_WORKFLOW":    return { ...state, workflowState: action.payload };
    case "SET_METRICS":     return { ...state, systemMetrics: action.payload };
    case "SET_MESSAGES":    return { ...state, messages:      action.payload };
    case "SET_DATA_SOURCE": return { ...state, dataSource:    action.payload };
    case "SET_BOOTSTRAPPED":return { ...state, isBootstrapping: false };
    default:                return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

interface GhostContextValue {
  state: GhostState;
  dispatch: React.Dispatch<GhostAction>;
}

const GhostContext = createContext<GhostContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Inner Provider (uses hooks — must be inside Provider tree)
// ─────────────────────────────────────────────────────────────────────────────

function GhostDataSync({ dispatch }: { dispatch: React.Dispatch<GhostAction> }) {
  const { data: executives, source: execSource } = useExecutives();
  const { data: crisis }                         = useCrisisMetrics();
  const { data: workflow }                       = useWorkflowState();
  const { data: metrics }                        = useSystemMetrics();
  const { messages }                             = useMessageFeed();

  useEffect(() => { if (executives?.length) { dispatch({ type: "SET_EXECUTIVES", payload: executives }); dispatch({ type: "SET_BOOTSTRAPPED" }); } }, [executives, dispatch]);
  useEffect(() => { if (crisis)    dispatch({ type: "SET_CRISIS",   payload: crisis });   }, [crisis,    dispatch]);
  useEffect(() => { if (workflow)  dispatch({ type: "SET_WORKFLOW", payload: workflow });  }, [workflow,  dispatch]);
  useEffect(() => { if (metrics)   dispatch({ type: "SET_METRICS",  payload: metrics });  }, [metrics,   dispatch]);
  useEffect(() => { if (messages.length) dispatch({ type: "SET_MESSAGES", payload: messages }); }, [messages, dispatch]);
  useEffect(() => { if (execSource) dispatch({ type: "SET_DATA_SOURCE", payload: execSource }); }, [execSource, dispatch]);

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public Provider
// ─────────────────────────────────────────────────────────────────────────────

export function GhostProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(ghostReducer, INITIAL_STATE);

  return (
    <GhostContext.Provider value={{ state, dispatch }}>
      <GhostDataSync dispatch={dispatch} />
      {children}
    </GhostContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Access the global Ghost Board state from any component.
 * Must be used inside <GhostProvider>.
 *
 * @example
 * const { state } = useGhostStore();
 * const { executives, crisisMetrics, dataSource } = state;
 */
export function useGhostStore(): GhostContextValue {
  const ctx = useContext(GhostContext);
  if (!ctx) throw new Error("useGhostStore must be used inside <GhostProvider>");
  return ctx;
}
