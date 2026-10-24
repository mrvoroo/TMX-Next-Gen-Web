import 'server-only';

/**
 * Simple in-memory sliding-window rate limit.
 *
 * Good enough for demo mode. It is per server instance and resets on every
 * restart / cold start, so on serverless hosting it is NOT a real limit.
 * TODO before live mode goes public: replace with a durable store
 * (e.g. Upstash Redis / Vercel KV) so the AI budget cannot be drained.
 *
 * Keys are kept only in memory, for the length of the window.
 */
const hits = new Map<string, number[]>();
let lastSweep = 0;

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (now - lastSweep > windowMs) {
    for (const [k, list] of hits) if (list.every((t) => now - t > windowMs)) hits.delete(k);
    lastSweep = now;
  }
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (list.length >= limit) {
    hits.set(key, list);
    return false;
  }
  list.push(now);
  hits.set(key, list);
  return true;
}
