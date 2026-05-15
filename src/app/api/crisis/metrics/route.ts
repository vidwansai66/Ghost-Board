/**
 * GET /api/crisis/metrics
 *
 * Returns the current crisis monitoring metrics.
 * - Live mode: proxies to n8n webhook
 * - Simulation mode: returns generated mock data
 */

import { NextResponse } from "next/server";
import { buildN8nUrl, isLiveMode, N8N_WEBHOOKS } from "@/lib/api/config";
import { generateCrisisMocks } from "@/lib/api/mock-data";
import { ApiResponse, CrisisMetrics } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<ApiResponse<CrisisMetrics>>> {
  const timestamp = new Date().toISOString();

  if (isLiveMode()) {
    try {
      const res = await fetch(buildN8nUrl(N8N_WEBHOOKS.crisis), {
        next: { revalidate: 0 },
      });
      if (!res.ok) throw new Error(`n8n responded ${res.status}`);
      const data: CrisisMetrics = await res.json();
      return NextResponse.json({ data, error: null, timestamp, source: "live" });
    } catch (err) {
      console.error("[/api/crisis/metrics] n8n fetch failed:", err);
    }
  }

  return NextResponse.json({ data: generateCrisisMocks(), error: null, timestamp, source: "simulated" });
}
