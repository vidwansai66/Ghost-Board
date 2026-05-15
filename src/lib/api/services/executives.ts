/**
 * GHOST BOARD — Executive Status Service
 * Typed fetch functions for the executive domain.
 */

import { ghostFetch, ghostPost } from "../client";
import { API_ENDPOINTS } from "../config";
import { ApiResponse, ExecutiveState } from "../types";

/** Fetches the live status of all AI executives */
export async function fetchExecutiveStatuses(): Promise<ApiResponse<ExecutiveState[]>> {
  return ghostFetch<ExecutiveState[]>(API_ENDPOINTS.executivesStatus);
}

/** Triggers an action on a specific executive via n8n workflow */
export async function triggerExecutiveAction(
  executiveId: string,
  action: "override" | "escalate" | "standby"
): Promise<ApiResponse<{ acknowledged: boolean }>> {
  return ghostPost(API_ENDPOINTS.executivesStatus, { executiveId, action });
}
