"use client";

import { fetchExecutiveStatuses } from "@/lib/api/services/executives";
import { POLL_INTERVALS } from "@/lib/api/config";
import { ExecutiveState, UseQueryResult } from "@/lib/api/types";
import { usePollingQuery } from "./use-polling-query";

/**
 * Live-polling hook for AI executive status data.
 *
 * @example
 * const { data: executives, isLoading, error } = useExecutives();
 */
export function useExecutives(pollMs = POLL_INTERVALS.executives): UseQueryResult<ExecutiveState[]> {
  return usePollingQuery(fetchExecutiveStatuses, { pollMs });
}
