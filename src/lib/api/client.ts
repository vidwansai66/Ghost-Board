/**
 * GHOST BOARD — Base API Client
 *
 * Type-safe fetch utility with timeout, retry with exponential backoff,
 * and consistent error handling. All service functions use this client.
 */

import { ApiError, ApiResponse } from "./types";
import { FETCH_CONFIG } from "./config";

// ─────────────────────────────────────────────────────────────────────────────
// Internal Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Creates a fetch request that rejects after `timeoutMs` milliseconds */
function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

/** Exponential backoff delay */
function backoffDelay(attempt: number, baseMs: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, baseMs * Math.pow(2, attempt)));
}

/** Normalizes any thrown error into an `ApiError` shape */
function normalizeError(err: unknown, retryable: boolean = true): ApiError {
  if (err instanceof Error) {
    if (err.name === "AbortError") {
      return { code: "TIMEOUT", message: "Request timed out", retryable: true };
    }
    return { code: "NETWORK_ERROR", message: err.message, retryable };
  }
  return { code: "UNKNOWN", message: String(err), retryable };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API Client
// ─────────────────────────────────────────────────────────────────────────────

export interface GhostFetchOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  retryBaseDelayMs?: number;
}

/**
 * Core typed fetch function for all Ghost Board API calls.
 *
 * Wraps fetch with:
 * - Configurable timeout
 * - Exponential backoff retries
 * - Typed `ApiResponse<T>` return
 * - Consistent error handling
 *
 * @example
 * const result = await ghostFetch<SystemMetrics>("/api/system/metrics");
 * if (result.error) handleError(result.error);
 */
export async function ghostFetch<T>(
  url: string,
  options: GhostFetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    timeoutMs = FETCH_CONFIG.timeoutMs,
    retries = FETCH_CONFIG.maxRetries,
    retryBaseDelayMs = FETCH_CONFIG.retryBaseDelayMs,
    ...fetchOptions
  } = options;

  const startTime = Date.now();
  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        await backoffDelay(attempt - 1, retryBaseDelayMs);
      }

      const response = await fetchWithTimeout(url, {
        headers: { "Content-Type": "application/json", ...fetchOptions.headers },
        ...fetchOptions,
      }, timeoutMs);

      const latencyMs = Date.now() - startTime;

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const error: ApiError = {
          code: `HTTP_${response.status}`,
          message: body?.error ?? `HTTP ${response.status} ${response.statusText}`,
          retryable: response.status >= 500,
        };

        // Don't retry 4xx errors
        if (response.status < 500) {
          return { data: null as unknown as T, error: error.message, timestamp: new Date().toISOString(), source: "simulated", latencyMs };
        }

        lastError = error;
        if (attempt < retries && error.retryable) continue;

        return { data: null as unknown as T, error: error.message, timestamp: new Date().toISOString(), source: "simulated", latencyMs };
      }

      const json: ApiResponse<T> = await response.json();
      return { ...json, latencyMs };

    } catch (err) {
      lastError = normalizeError(err, true);
      if (attempt < retries && lastError.retryable) continue;
    }
  }

  return {
    data: null as unknown as T,
    error: lastError?.message ?? "Unknown error",
    timestamp: new Date().toISOString(),
    source: "simulated",
    latencyMs: Date.now() - startTime,
  };
}

/**
 * Convenience POST wrapper — used for triggering n8n workflow actions.
 */
export async function ghostPost<TBody, TResponse>(
  url: string,
  body: TBody,
  options: GhostFetchOptions = {}
): Promise<ApiResponse<TResponse>> {
  return ghostFetch<TResponse>(url, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });
}
