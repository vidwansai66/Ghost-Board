"use client";

import { fetchSystemMetrics } from "@/lib/api/services/system";
import { POLL_INTERVALS } from "@/lib/api/config";
import { SystemMetrics, UseQueryResult } from "@/lib/api/types";
import { usePollingQuery } from "./use-polling-query";

/**
 * Live-polling hook for system-wide KPI metrics.
 * Used by the Command Center header.
 *
 * @example
 * const { data: metrics } = useSystemMetrics();
 */
export function useSystemMetrics(pollMs = POLL_INTERVALS.systemMetrics): UseQueryResult<SystemMetrics> {
  return usePollingQuery(fetchSystemMetrics, { pollMs });
}
