/**
 * GHOST BOARD — Messages Service
 * Typed fetch functions for the AI communication feed.
 */

import { ghostFetch, ghostPost } from "../client";
import { API_ENDPOINTS } from "../config";
import { ApiResponse, FeedMessage } from "../types";

/**
 * Fetches recent messages from the communication feed.
 * Pass `since` as an ISO timestamp to get only new messages.
 */
export async function fetchMessageFeed(since?: string): Promise<ApiResponse<FeedMessage[]>> {
  const url = since
    ? `${API_ENDPOINTS.messagesFeed}?since=${encodeURIComponent(since)}`
    : API_ENDPOINTS.messagesFeed;
  return ghostFetch<FeedMessage[]>(url);
}

/** Posts a system notification to the communication feed */
export async function postSystemNotification(
  content: string,
  severity: "info" | "warning" | "critical" = "info"
): Promise<ApiResponse<{ inserted: boolean }>> {
  return ghostPost(API_ENDPOINTS.messagesFeed, { content, severity, source: "SYSTEM" });
}
