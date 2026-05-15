/**
 * GHOST BOARD — Workflow State Service
 * Typed fetch functions for the workflow visualization domain.
 */

import { ghostFetch, ghostPost } from "../client";
import { API_ENDPOINTS } from "../config";
import { ApiResponse, WorkflowState } from "../types";

/** Fetches the current state of all workflow nodes and connections */
export async function fetchWorkflowState(): Promise<ApiResponse<WorkflowState>> {
  return ghostFetch<WorkflowState>(API_ENDPOINTS.workflowsStatus);
}

/** Activates a specific workflow chain in n8n */
export async function activateWorkflowChain(
  chainId: string
): Promise<ApiResponse<{ activated: boolean }>> {
  return ghostPost(API_ENDPOINTS.workflowsStatus, { chainId });
}
