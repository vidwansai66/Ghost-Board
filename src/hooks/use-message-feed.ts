"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMessageFeed } from "@/lib/api/services/messages";
import { POLL_INTERVALS } from "@/lib/api/config";
import { FeedMessage } from "@/lib/api/types";

interface UseMessageFeedResult {
  messages: FeedMessage[];
  isLoading: boolean;
  error: string | null;
  source: "live" | "simulated" | null;
}

/**
 * Live communication feed hook.
 *
 * Uses delta polling (since-timestamp) to only fetch new messages each interval,
 * appending them to a local ring buffer. Falls back gracefully on error.
 *
 * Ready for SSE upgrade: swap the setInterval for an EventSource subscription.
 *
 * @example
 * const { messages } = useMessageFeed();
 */
export function useMessageFeed(pollMs = POLL_INTERVALS.messagesFallback): UseMessageFeedResult {
  const [messages, setMessages] = useState<FeedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [source, setSource]     = useState<"live" | "simulated" | null>(null);

  const lastTimestampRef = useRef<string | undefined>(undefined);
  const isMountedRef     = useRef(true);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetchMessageFeed(lastTimestampRef.current);
      if (!isMountedRef.current) return;

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data.length > 0) {
        setMessages(prev => {
          const combined = [...prev, ...response.data];
          // Keep only last 30 messages in the UI ring buffer
          return combined.slice(-30);
        });
        // Track the latest timestamp for delta polling
        const latest = response.data[response.data.length - 1].timestamp;
        lastTimestampRef.current = latest;
      }

      setError(null);
      setSource(response.source);
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : "Failed to fetch messages");
      }
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // Initial fetch
    fetchMessages();

    // Delta polling
    const interval = setInterval(fetchMessages, pollMs);
    return () => {
      clearInterval(interval);
      isMountedRef.current = false;
    };
  }, [fetchMessages, pollMs]);

  return { messages, isLoading, error, source };
}
