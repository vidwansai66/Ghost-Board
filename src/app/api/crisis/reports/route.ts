/**
 * GET  /api/crisis/reports        — fetch latest completed report
 * POST /api/crisis/reports        — trigger new report generation (simulated async)
 */

import { NextResponse } from "next/server";
import { buildN8nUrl, isLiveMode, N8N_WEBHOOKS } from "@/lib/api/config";
import { generateReportMock } from "@/lib/api/mock-data";
import { ApiResponse, IntelligenceReport, ReportGenerationJob } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<ApiResponse<IntelligenceReport>>> {
  const timestamp = new Date().toISOString();

  if (isLiveMode()) {
    try {
      const res = await fetch(buildN8nUrl(N8N_WEBHOOKS.reports), { next: { revalidate: 0 } });
      if (!res.ok) throw new Error(`n8n responded ${res.status}`);
      const data: IntelligenceReport = await res.json();
      return NextResponse.json({ data, error: null, timestamp, source: "live" });
    } catch (err) {
      console.error("[/api/crisis/reports] n8n fetch failed:", err);
    }
  }

  return NextResponse.json({ data: generateReportMock(), error: null, timestamp, source: "simulated" });
}

export async function POST(): Promise<NextResponse<ApiResponse<ReportGenerationJob>>> {
  const timestamp = new Date().toISOString();
  const jobId = `JOB-${Date.now()}`;

  // In live mode, this would trigger an n8n workflow execution
  // For simulation, we return a job that completes after a realistic delay
  const job: ReportGenerationJob = {
    jobId,
    status: "scanning",
    progress: 0,
    startedAt: timestamp,
  };

  return NextResponse.json({ data: job, error: null, timestamp, source: isLiveMode() ? "live" : "simulated" });
}
