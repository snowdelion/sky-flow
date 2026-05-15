import { cachedRequest, redis } from "../cachedRequest"

// --- 1. mocks ---
vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: vi.fn(() => ({
      get: vi.fn(),
      set: vi.fn(),
    })),
  },
}))

vi.mock("@/entities/location", () => ({
  fetchGeoData: vi.fn(),
}))

const mockRedis = redis as unknown as {
  get: ReturnType<typeof vi.fn>
  set: ReturnType<typeof vi.fn>
}

beforeEach(() => {
  vi.clearAllMocks()
})

// --- 2. tests ---
describe("cachedRequest", () => {
  describe("successful cache", () => {
    it("should return cached value and skip fetcher when cache hit", async () => {
      mockRedis.get.mockResolvedValueOnce({ result: "cached" })
      const fetcher = vi.fn()

      const result = await cachedRequest({ key: "some-key", fetcher, ttl: "LONG" })

      expect(result).toEqual({ result: "cached" })
      expect(fetcher).not.toHaveBeenCalled()
      expect(mockRedis.set).not.toHaveBeenCalled()
    })

    it("should call fetcher and store result when cache miss (null)", async () => {
      mockRedis.get.mockResolvedValueOnce(null)
      mockRedis.set.mockResolvedValueOnce("OK")
      const fetcher = vi.fn().mockResolvedValueOnce({ result: "fresh" })

      const result = await cachedRequest({ key: "test-key", fetcher, ttl: "LONG" })

      expect(result).toEqual({ result: "fresh" })
      expect(fetcher).toHaveBeenCalledOnce()
      expect(mockRedis.set).toHaveBeenCalledWith("test-key", { result: "fresh" }, { ex: 86400 })
    })

    describe("TTL", () => {
      const cases = [
        {
          name: "SHORT TTL (60s)",
          ttl: "SHORT",
          expectedEx: { ex: 60 },
        },
        {
          name: "MEDIUM TTL (3600s)",
          ttl: "MEDIUM",
          expectedEx: { ex: 3600 },
        },
        {
          name: "WEEK TTL (604800s)",
          ttl: "WEEK",
          expectedEx: { ex: 604800 },
        },
      ] as const

      test.each(cases)("should use $name when writting to cache", async ({ ttl, expectedEx }) => {
        mockRedis.get.mockResolvedValueOnce(null)
        mockRedis.set.mockResolvedValueOnce("OK")
        const fetcher = vi.fn().mockResolvedValueOnce("data")

        await cachedRequest({ key: "key", fetcher, ttl })

        expect(mockRedis.set).toHaveBeenCalledWith("key", "data", expectedEx)
      })
    })
  })

  describe("error handling", () => {
    it("should still return fetcher data when redis.get throws", async () => {
      mockRedis.get.mockRejectedValueOnce(new Error("Redis down"))
      mockRedis.set.mockResolvedValueOnce("OK")
      const fetcher = vi.fn().mockResolvedValueOnce("fallback")

      const result = await cachedRequest({ key: "key", fetcher, ttl: "LONG" })

      expect(result).toBe("fallback")
      expect(fetcher).toHaveBeenCalledOnce()
    })

    it("should still return fetcher data when redis.set throws", async () => {
      mockRedis.get.mockResolvedValueOnce(null)
      mockRedis.set.mockRejectedValueOnce(new Error("Redis write error"))
      const fetcher = vi.fn().mockResolvedValueOnce("data")

      const result = await cachedRequest({ key: "key", fetcher, ttl: "LONG" })

      expect(result).toBe("data")
    })

    it("should propagate fetcher error", async () => {
      mockRedis.get.mockResolvedValueOnce(null)
      const fetcher = vi.fn().mockRejectedValueOnce(new Error("Fetch failed"))

      await expect(cachedRequest({ key: "key", fetcher, ttl: "LONG" })).rejects.toThrow(
        "Fetch failed",
      )
    })
  })

  describe("AbortSignal handling", () => {
    it("should pass abortSignal to fetcher", async () => {
      mockRedis.get.mockResolvedValueOnce(null)
      mockRedis.set.mockResolvedValueOnce("OK")
      const fetcher = vi.fn().mockResolvedValueOnce("data")
      const controller = new AbortController()

      await cachedRequest({ key: "key", fetcher, ttl: "LONG", abortSignal: controller.signal })

      expect(fetcher).toHaveBeenCalledWith(controller.signal)
    })

    it("should throw AbortError immediately when signal is already aborted", async () => {
      const controller = new AbortController()
      controller.abort()
      const fetcher = vi.fn()

      await expect(
        cachedRequest({ key: "key", fetcher, ttl: "LONG", abortSignal: controller.signal }),
      ).rejects.toThrow("Aborted")

      expect(fetcher).not.toHaveBeenCalled()
      expect(mockRedis.get).not.toHaveBeenCalled()
    })

    it("should throw AbortError when signal is aborted after cache miss before fetcher", async () => {
      const controller = new AbortController()

      mockRedis.get.mockImplementationOnce(async () => {
        controller.abort()
        return null
      })
      const fetcher = vi.fn()

      await expect(
        cachedRequest({ key: "key", fetcher, ttl: "LONG", abortSignal: controller.signal }),
      ).rejects.toThrow("Aborted")

      expect(fetcher).not.toHaveBeenCalled()
    })

    it("should not write to cache when signal is aborted after fetcher resolves", async () => {
      const controller = new AbortController()

      mockRedis.get.mockResolvedValueOnce(null)
      const fetcher = vi.fn().mockImplementationOnce(async () => {
        controller.abort()
        return "data"
      })

      await expect(
        cachedRequest({ key: "key", fetcher, ttl: "LONG", abortSignal: controller.signal }),
      ).rejects.toThrow("Aborted")

      expect(mockRedis.set).not.toHaveBeenCalled()
    })

    it("should rethrow AbortError that originates from redis.get", async () => {
      mockRedis.get.mockRejectedValueOnce(new DOMException("Aborted", "AbortError"))
      const fetcher = vi.fn()

      await expect(cachedRequest({ key: "key", fetcher, ttl: "LONG" })).rejects.toThrow("Aborted")

      expect(fetcher).not.toHaveBeenCalled()
    })
  })
})
