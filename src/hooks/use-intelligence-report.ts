"use client";

import { useCallback, useRef, useState } from "react";
import { requestReportGeneration, pollReportJob } from "@/lib/api/services/reports";
import { IntelligenceReport, ReportGenerationJob, ReportGenerationStatus } from "@/lib/api/types";

interface UseIntelligenceReportResult {
  report: IntelligenceReport | null;
  generationJob: ReportGenerationJob | null;
  phase: ReportGenerationStatus;
  progress: number;
  generationCount: number;
  /** Triggers a new async report generation cycle */
  generateReport: () => Promise<void>;
}

const POLL_INTERVAL_MS = 400; // poll job status every 400ms

/**
 * Hook for async intelligence report generation.
 *
 * Manages the full generate → poll → complete lifecycle.
 * Works with both simulation and live n8n modes.
 *
 * @example
 * const { report, phase, progress, generateReport } = useIntelligenceReport();
 */
export function useIntelligenceReport(): UseIntelligenceReportResult {
  const [report, setReport]       = useState<IntelligenceReport | null>(null);
  const [job, setJob]             = useState<ReportGenerationJob | null>(null);
  const [phase, setPhase]         = useState<ReportGenerationStatus>("idle");
  const [progress, setProgress]   = useState(0);
  const [count, setCount]         = useState(0);

  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const pollJob = useCallback(async (jobId: string) => {
    const response = await pollReportJob(jobId);
    if (!isMountedRef.current) return;

    const jobData = response.data;
    if (!jobData) return;

    setPhase(jobData.status);
    setProgress(jobData.progress);
    setJob(jobData);

    if (jobData.status === "complete" && jobData.report) {
      setReport(jobData.report);
      setCount(c => c + 1);
      stopPolling();
    } else if (jobData.status === "error") {
      stopPolling();
    }
  }, [stopPolling]);

  const generateReport = useCallback(async () => {
    stopPolling();
    setPhase("scanning");
    setProgress(0);

    const response = await requestReportGeneration();
    if (!isMountedRef.current) return;

    if (response.error || !response.data) {
      setPhase("error");
      return;
    }

    const { jobId } = response.data;
    setJob(response.data);

    // Start polling job status
    pollTimerRef.current = setInterval(() => pollJob(jobId), POLL_INTERVAL_MS);
  }, [pollJob, stopPolling]);

  return {
    report,
    generationJob: job,
    phase,
    progress,
    generationCount: count,
    generateReport,
  };
}
