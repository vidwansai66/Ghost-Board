/**
 * POST /api/webhooks/n8n
 *
 * Incoming webhook receiver for n8n push events.
 * n8n workflows call this endpoint to push real-time updates
 * to the Ghost Board frontend.
 *
 * Setup in n8n:
 *   1. Add a "HTTP Request" node at the end of your workflow
 *   2. Set method: POST, URL: https://your-ghost-board.app/api/webhooks/n8n
 *   3. Set body: { "event": "crisis.metrics_update", "data": { ... }, "workflowId": "...", "executionId": "..." }
 *
 * Supported event types:
 *   - executive.status_update
 *   - crisis.metrics_update
 *   - workflow.state_update
 *   - report.generated
 *   - message.new
 *   - system.metrics_update
 *   - system.alert
 */

import { NextRequest, NextResponse } from "next/server";
import { N8nWebhookPayload } from "@/lib/api/types";

// ─────────────────────────────────────────────────────────────────────────────
// In-Memory Event Bus
// ─────────────────────────────────────────────────────────────────────────────

// Stores the latest payload per event type for SSE clients to consume
// In production, replace with Redis pub/sub
const latestEvents = new Map<string, N8nWebhookPayload>();

/** Returns the latest payload for a given event type (used by SSE routes) */
export function getLatestEvent(eventType: string): N8nWebhookPayload | undefined {
  return latestEvents.get(eventType);
}

/** Returns all recent events (used by SSE stream to initialize client) */
export function getAllLatestEvents(): N8nWebhookPayload[] {
  return Array.from(latestEvents.values());
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Receiver
// ─────────────────────────────────────────────────────────────────────────────

const VALID_EVENTS = new Set([
  "executive.status_update",
  "crisis.metrics_update",
  "workflow.state_update",
  "report.generated",
  "message.new",
  "system.metrics_update",
  "system.alert",
]);

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Optional: validate a shared secret header
  const secret = req.headers.get("x-ghost-webhook-secret");
  const expectedSecret = process.env.GHOST_WEBHOOK_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: N8nWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!payload.event || !VALID_EVENTS.has(payload.event)) {
    return NextResponse.json(
      { error: `Unknown event type: ${payload.event}. Valid: ${Array.from(VALID_EVENTS).join(", ")}` },
      { status: 400 }
    );
  }

  // Store in event bus
  latestEvents.set(payload.event, {
    ...payload,
    timestamp: payload.timestamp ?? new Date().toISOString(),
  });

  console.info(`[n8n webhook] Received: ${payload.event} from workflow ${payload.workflowId}`);

  return NextResponse.json({
    acknowledged: true,
    event: payload.event,
    receivedAt: new Date().toISOString(),
  });
}
