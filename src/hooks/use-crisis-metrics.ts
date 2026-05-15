"use client";

import { fetchCrisisMetrics } from "@/lib/api/services/crisis";
import { POLL_INTERVALS } from "@/lib/api/config";
import { CrisisMetrics, UseQueryResult } from "@/lib/api/types";
import { usePollingQuery } from "./use-polling-query";

/**
 * Live-polling hook for crisis monitoring metrics.
 *
 * @example
 * const { data: crisis, isLoading } = useCrisisMetrics();
 */
export function useCrisisMetrics(pollMs = POLL_INTERVALS.crisis): UseQueryResult<CrisisMetrics> {
  return usePollingQuery(fetchCrisisMetrics, { pollMs });
}
