import type { RequestHandler } from "express";

type Bucket = { count: number; resetAt: number };

export function createRateLimit(options: { windowMs: number; limit: number; now?: () => number }): RequestHandler {
  const buckets = new Map<string, Bucket>();
  const now = options.now ?? Date.now;
  return (request, response, next) => {
    const key = request.ip || request.socket.remoteAddress || "unknown";
    const timestamp = now();
    const current = buckets.get(key);
    const bucket = !current || current.resetAt <= timestamp ? { count: 0, resetAt: timestamp + options.windowMs } : current;
    bucket.count += 1;
    buckets.set(key, bucket);
    response.setHeader("ratelimit-limit", String(options.limit));
    response.setHeader("ratelimit-remaining", String(Math.max(0, options.limit - bucket.count)));
    response.setHeader("ratelimit-reset", String(Math.ceil(bucket.resetAt / 1000)));
    if (bucket.count > options.limit) {
      response.status(429).json({ error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests. Please try again later.", correlationId: response.locals.correlationId } });
      return;
    }
    next();
  };
}
