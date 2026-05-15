/**
 * GET /api/messages/feed          — poll recent messages
 * POST /api/messages/feed         — insert a system notification
 *
 * The GET supports ?since=ISO_TIMESTAMP for delta fetching.
 */

import { NextRequest, NextResponse } from "next/server";
import { buildN8nUrl, isLiveMode, N8N_WEBHOOKS } from "@/lib/api/config";
import { generateMessageMock } from "@/lib/api/mock-data";
import { ApiResponse, FeedMessage } from "@/lib/api/types";

export const dynamic = "force-dynamic";

// In-memory ring buffer of recent messages (max 50)
// In production, replace with Redis pub/sub or a DB query
const messageBuffer: FeedMessage[] = generateMessageMock(3);

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<FeedMessage[]>>> {
  const timestamp = new Date().toISOString();
  const since = req.nextUrl.searchParams.get("since");

  if (isLiveMode()) {
    try {
      const url = since
        ? `${buildN8nUrl(N8N_WEBHOOKS.messages)}?since=${encodeURIComponent(since)}`
        : buildN8nUrl(N8N_WEBHOOKS.messages);
      const res = await fetch(url, { next: { revalidate: 0 } });
      if (!res.ok) throw new Error(`n8n responded ${res.status}`);
      const data: FeedMessage[] = await res.json();
      return NextResponse.json({ data, error: null, timestamp, source: "live" });
    } catch (err) {
      console.error("[/api/messages/feed] n8n fetch failed:", err);
    }
  }

  // Simulation: occasionally inject a new message
  if (Math.random() > 0.5) {
    const newMsgs = generateMessageMock(1);
    messageBuffer.push(...newMsgs);
    if (messageBuffer.length > 50) messageBuffer.splice(0, messageBuffer.length - 50);
  }

  const data = since
    ? messageBuffer.filter(m => m.timestamp > since)
    : messageBuffer.slice(-12);

  return NextResponse.json({ data, error: null, timestamp, source: "simulated" });
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<{ inserted: boolean }>>> {
  const timestamp = new Date().toISOString();
  const body = await req.json().catch(() => ({}));

  const notification: FeedMessage = {
    id:             `SYS-${Date.now()}`,
    agent:          "SYSTEM",
    color:          "text-gray-400",
    bg:             "bg-white/5",
    icon:           "🔔",
    content:        body.content ?? "System notification",
    timestamp,
    signalStrength: 4,
  };

  messageBuffer.push(notification);
  if (messageBuffer.length > 50) messageBuffer.splice(0, messageBuffer.length - 50);

  return NextResponse.json({ data: { inserted: true }, error: null, timestamp, source: "simulated" });
}
