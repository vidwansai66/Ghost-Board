/**
 * GET /api/workflows/status
 * Returns current workflow node and connection states.
 */

import { NextResponse } from "next/server";
import { buildN8nUrl, isLiveMode, N8N_WEBHOOKS } from "@/lib/api/config";
import { generateWorkflowMocks } from "@/lib/api/mock-data";
import { ApiResponse, WorkflowState } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<ApiResponse<WorkflowState>>> {
  const timestamp = new Date().toISOString();

  if (isLiveMode()) {
    try {
      const res = await fetch(buildN8nUrl(N8N_WEBHOOKS.workflows), { next: { revalidate: 0 } });
      if (!res.ok) throw new Error(`n8n responded ${res.status}`);
      const data: WorkflowState = await res.json();
      return NextResponse.json({ data, error: null, timestamp, source: "live" });
    } catch (err) {
      console.error("[/api/workflows/status] n8n fetch failed:", err);
    }
  }

  return NextResponse.json({ data: generateWorkflowMocks(), error: null, timestamp, source: "simulated" });
}
