/**
 * GHOST BOARD — Intelligence Report Service
 * Typed fetch functions for async executive report generation.
 */

import { ghostFetch, ghostPost } from "../client";
import { API_ENDPOINTS } from "../config";
import { ApiResponse, IntelligenceReport, ReportGenerationJob } from "../types";

/** Fetches the latest completed intelligence report */
export async function fetchLatestReport(): Promise<ApiResponse<IntelligenceReport>> {
  return ghostFetch<IntelligenceReport>(API_ENDPOINTS.crisisReports);
}

/** Triggers async report generation — returns a job ID to poll */
export async function requestReportGeneration(): Promise<ApiResponse<ReportGenerationJob>> {
  return ghostPost<Record<string, never>, ReportGenerationJob>(
    API_ENDPOINTS.crisisReportsGenerate,
    {}
  );
}

/**
 * Polls a report generation job until completion or error.
 * Used by the IntelligenceReport component to track generation progress.
 */
export async function pollReportJob(jobId: string): Promise<ApiResponse<ReportGenerationJob>> {
  return ghostFetch<ReportGenerationJob>(`${API_ENDPOINTS.crisisReportsGenerate}?jobId=${jobId}`);
}
