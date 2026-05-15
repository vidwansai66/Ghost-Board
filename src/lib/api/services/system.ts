/**
 * GHOST BOARD — System Metrics Service
 * Typed fetch functions for system-wide KPIs.
 */

import { ghostFetch } from "../client";
import { API_ENDPOINTS } from "../config";
import { ApiResponse, SystemMetrics } from "../types";

/** Fetches the current system-wide metrics snapshot */
export async function fetchSystemMetrics(): Promise<ApiResponse<SystemMetrics>> {
  return ghostFetch<SystemMetrics>(API_ENDPOINTS.systemMetrics);
}
