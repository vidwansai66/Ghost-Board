/**
 * GET  /api/crisis/reports/generate?jobId=JOB-xxx  — poll generation job status
 * POST /api/crisis/reports/generate                 — start new generation job
 */

import { NextRequest, NextResponse } from "next/server";
import { generateReportMock } from "@/lib/api/mock-data";
import { ApiResponse, ReportGenerationJob } from "@/lib/api/types";
import { isLiveMode } from "@/lib/api/config";

export const dynamic = "force-dynamic";

// In-memory job store (replace with Redis/DB in production)
const jobStore = new Map<string, { startedAt: number; report?: ReturnType<typeof generateReportMock> }>();

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<ReportGenerationJob>>> {
  const jobId = req.nextUrl.searchParams.get("jobId");
  const timestamp = new Date().toISOString();

  if (!jobId) {
    return NextResponse.json({ data: null as any, error: "Missing jobId parameter", timestamp, source: "simulated" }, { status: 400 });
  }

  const job = jobStore.get(jobId);
  if (!job) {
    return NextResponse.json({ data: null as any, error: "Job not found", timestamp, source: "simulated" }, { status: 404 });
  }

  const elapsed = Date.now() - job.startedAt;

  // Simulate 4-phase report generation over ~3.5 seconds
  let status: ReportGenerationJob["status"] = "scanning";
  let progress = 0;

  if (elapsed < 900) {
    status = "scanning"; progress = Math.min(28, Math.floor((elapsed / 900) * 28));
  } else if (elapsed < 1900) {
    status = "compiling"; progress = 28 + Math.min(37, Math.floor(((elapsed - 900) / 1000) * 37));
  } else if (elapsed < 3200) {
    status = "writing"; progress = 65 + Math.min(34, Math.floor(((elapsed - 1900) / 1300) * 34));
  } else {
    status = "complete";
    progress = 100;
    if (!job.report) {
      job.report = generateReportMock();
      jobStore.set(jobId, job);
    }
  }

  const result: ReportGenerationJob = {
    jobId,
    status,
    progress,
    startedAt: new Date(job.startedAt).toISOString(),
    ...(status === "complete" && job.report ? { report: job.report } : {}),
  };

  return NextResponse.json({ data: result, error: null, timestamp, source: isLiveMode() ? "live" : "simulated" });
}

export async function POST(): Promise<NextResponse<ApiResponse<ReportGenerationJob>>> {
  const timestamp = new Date().toISOString();
  const jobId = `JOB-${Date.now()}`;

  jobStore.set(jobId, { startedAt: Date.now() });

  // Clean up old jobs (keep last 20)
  if (jobStore.size > 20) {
    const oldest = Array.from(jobStore.keys())[0];
    jobStore.delete(oldest);
  }

  const job: ReportGenerationJob = {
    jobId,
    status: "scanning",
    progress: 0,
    startedAt: timestamp,
  };

  return NextResponse.json({ data: job, error: null, timestamp, source: isLiveMode() ? "live" : "simulated" });
}
