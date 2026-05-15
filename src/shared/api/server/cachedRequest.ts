import "server-only"
import { Redis } from "@upstash/redis"

export const redis = Redis.fromEnv()

const TTL = {
  SHORT: 60,
  MEDIUM: 60 * 60,
  LONG: 60 * 60 * 24,
  WEEK: 60 * 60 * 24 * 7,
} as const

export async function cachedRequest<T>({
  key,
  fetcher,
  ttl = "LONG",
  abortSignal,
}: CachedRequestArgs<T>) {
  if (abortSignal?.aborted) throw new DOMException("Aborted", "AbortError")

  try {
    const cached = await redis.get<T>(key)
    if (cached) {
      if (abortSignal?.aborted) throw new DOMException("Aborted", "AbortError")
      return cached
    }
  } catch (e) {
    if (e && typeof e === "object" && "name" in e && e.name === "AbortError") throw e
  }

  if (abortSignal?.aborted) throw new DOMException("Aborted", "AbortError")
  const freshData = await fetcher(abortSignal)

  if (abortSignal?.aborted) throw new DOMException("Aborted", "AbortError")
  try {
    await redis.set(key, freshData, { ex: TTL[ttl] })
  } catch {}

  return freshData
}

type CachedRequestArgs<T> = {
  key: string
  fetcher: (signal?: AbortSignal) => Promise<T>
  ttl: keyof typeof TTL
  abortSignal?: AbortSignal
}
