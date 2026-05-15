/**
 * GHOST BOARD — Crisis Monitoring Service
 * Typed fetch functions for the crisis monitoring domain.
 */

import { ghostFetch, ghostPost } from "../client";
import { API_ENDPOINTS } from "../config";
import { ApiResponse, CrisisMetrics } from "../types";

/** Fetches the current crisis metrics snapshot */
export async function fetchCrisisMetrics(): Promise<ApiResponse<CrisisMetrics>> {
  return ghostFetch<CrisisMetrics>(API_ENDPOINTS.crisisMetrics);
}

/** Activates a crisis protocol via n8n (e.g., "alpha-7", "beta-2") */
export async function triggerCrisisProtocol(
  protocolId: string
): Promise<ApiResponse<{ activated: boolean; protocolId: string }>> {
  return ghostPost(API_ENDPOINTS.crisisMetrics, { protocolId });
}
