/**
 * GHOST BOARD — usePollingQuery
 *
 * Base hook for interval-based API polling with loading state,
 * error handling, and stale-while-revalidate behavior.
 * All domain-specific hooks build on top of this.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, ApiResponse, UseQueryResult } from "@/lib/api/types";

interface UsePollingQueryOptions {
  /** Polling interval in ms. Pass 0 or undefined to disable auto-polling. */
  pollMs?: number;
  /** If true, fires immediately on mount. Default: true. */
  immediate?: boolean;
}

export function usePollingQuery<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  options: UsePollingQueryOptions = {}
): UseQueryResult<T> {
  const { pollMs, immediate = true } = options;

  const [data, setData]           = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<ApiError | null>(null);
  const [source, setSource]       = useState<"live" | "simulated" | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isMountedRef = useRef(true);

  const execute = useCallback(async () => {
    setIsLoading(prev => (data === null ? true : prev)); // only show loader on first fetch
    try {
      const response = await fetcher();
      if (!isMountedRef.current) return;

      if (response.error) {
        setError({ code: "API_ERROR", message: response.error, retryable: true });
      } else {
        setData(response.data);
        setError(null);
        setSource(response.source);
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setError({
        code: "UNEXPECTED",
        message: err instanceof Error ? err.message : "Unknown error",
        retryable: true,
      });
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [fetcher]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isMountedRef.current = true;

    if (immediate) execute();

    if (pollMs && pollMs > 0) {
      const interval = setInterval(execute, pollMs);
      return () => { clearInterval(interval); isMountedRef.current = false; };
    }

    return () => { isMountedRef.current = false; };
  }, [pollMs, immediate]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, isLoading, error, refetch: execute, source, lastUpdated };
}
