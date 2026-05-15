"use client";

import { fetchWorkflowState } from "@/lib/api/services/workflows";
import { POLL_INTERVALS } from "@/lib/api/config";
import { WorkflowState, UseQueryResult } from "@/lib/api/types";
import { usePollingQuery } from "./use-polling-query";

/**
 * Live-polling hook for workflow node and connection states.
 *
 * @example
 * const { data: workflow } = useWorkflowState();
 */
export function useWorkflowState(pollMs = POLL_INTERVALS.workflows): UseQueryResult<WorkflowState> {
  return usePollingQuery(fetchWorkflowState, { pollMs });
}
