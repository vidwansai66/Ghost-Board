/**
 * GET /api/executives/status
 *
 * Returns the current status of all AI executives.
 * - Live mode: proxies to n8n webhook configured via NEXT_PUBLIC_N8N_URL
 * - Simulation mode: returns freshly generated mock data
 */

import { NextResponse } from "next/server";
import { buildN8nUrl, isLiveMode, N8N_WEBHOOKS } from "@/lib/api/config";
import { generateExecutiveMocks } from "@/lib/api/mock-data";
import { ApiResponse, ExecutiveState } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<ApiResponse<ExecutiveState[]>>> {
  const timestamp = new Date().toISOString();

  if (isLiveMode()) {
    try {
      const res = await fetch(buildN8nUrl(N8N_WEBHOOKS.executives), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 0 },
      });
      if (!res.ok) throw new Error(`n8n responded ${res.status}`);
      const data: ExecutiveState[] = await res.json();
      return NextResponse.json({ data, error: null, timestamp, source: "live" });
    } catch (err) {
      console.error("[/api/executives/status] n8n fetch failed:", err);
      // Fall through to simulation
    }
  }

  return NextResponse.json({
    data: generateExecutiveMocks(),
    error: null,
    timestamp,
    source: "simulated",
  });
}
