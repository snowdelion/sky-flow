import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const cache = new Map();
const multipliers = {
  shortTerm: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 s"),
    prefix: "sky-flow:ai:10s",
    ephemeralCache: cache,
  }),
  mediumTerm: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    prefix: "sky-flow:ai:1m",
    ephemeralCache: cache,
  }),
  longTerm: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, "24 h"),
    prefix: "sky-flow:ai:24h",
    ephemeralCache: cache,
  }),
};

export async function checkRatelimit(identifier: string) {
  const results = [
    await multipliers.shortTerm.limit(identifier),
    await multipliers.mediumTerm.limit(identifier),
    await multipliers.longTerm.limit(identifier),
  ];

  const blocked = results.find((item) => !item.success);

  if (blocked)
    return {
      success: false,
      limit: blocked.limit,
      remaining: blocked.remaining,
      reset: blocked.reset,
    };

  return results[results.length - 1];
}
