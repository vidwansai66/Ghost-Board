/**
 * GET /api/system/metrics
 * Returns system-wide KPI snapshot.
 */

import { NextResponse } from "next/server";
import { buildN8nUrl, isLiveMode, N8N_WEBHOOKS } from "@/lib/api/config";
import { generateSystemMetricsMocks } from "@/lib/api/mock-data";
import { ApiResponse, SystemMetrics } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<ApiResponse<SystemMetrics>>> {
  const timestamp = new Date().toISOString();

  if (isLiveMode()) {
    try {
      const res = await fetch(buildN8nUrl(N8N_WEBHOOKS.system), { next: { revalidate: 0 } });
      if (!res.ok) throw new Error(`n8n responded ${res.status}`);
      const data: SystemMetrics = await res.json();
      return NextResponse.json({ data, error: null, timestamp, source: "live" });
    } catch (err) {
      console.error("[/api/system/metrics] n8n fetch failed:", err);
    }
  }

  return NextResponse.json({ data: generateSystemMetricsMocks(), error: null, timestamp, source: "simulated" });
}
