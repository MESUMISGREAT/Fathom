/**
 * Fixed-window rate limiter held in process memory. Good enough for a single
 * instance; swap for a shared store (e.g. Redis) when running several
 * instances. Keys should combine the action and the client (ip, user, email).
 */
const windows = new Map<string, { count: number; resetAt: number }>();

export interface Limit {
  max: number;
  windowMs: number;
}

export const LIMITS = {
  login: { max: 10, windowMs: 15 * 60_000 },
  loginIp: { max: 60, windowMs: 15 * 60_000 },
  signup: { max: 8, windowMs: 60 * 60_000 },
  answer: { max: 90, windowMs: 60_000 },
  write: { max: 120, windowMs: 60_000 },
} satisfies Record<string, Limit>;

export function hit(key: string, limit: Limit, now = Date.now()): { ok: boolean; retryAfterS: number } {
  const w = windows.get(key);
  if (!w || w.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + limit.windowMs });
    if (windows.size > 50_000) sweep(now);
    return { ok: true, retryAfterS: 0 };
  }
  w.count++;
  return w.count <= limit.max ? { ok: true, retryAfterS: 0 } : { ok: false, retryAfterS: Math.ceil((w.resetAt - now) / 1000) };
}

function sweep(now: number) {
  for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
}

export function resetRateLimits() {
  windows.clear();
}
