import { describe, it, expect, vi, beforeEach } from "vitest"
import { cachedRequest, request } from "@/shared/api/server"
import { GET } from "./route"

// --- 1. types ---
interface MockResponseInstance {
  status: number
}
interface MockNextResponseConstructor {
  new (body: unknown, init?: { status: number }): MockResponseInstance
  json: MockJsonFn
}
type MockJsonFn = ReturnType<
  typeof vi.fn<(data: unknown, init?: { status?: number }) => { data: unknown; status: number }>
>

// --- 2. mocks ---
const { mockJson, NextResponse } = vi.hoisted(() => {
  const mockJson = vi.fn((data: unknown, init?: { status?: number }) => ({
    data,
    status: init?.status ?? 200,
  }))

  const NextResponse = vi.fn(function (
    this: MockResponseInstance,
    _body: unknown,
    init?: { status?: number },
  ) {
    return {
      status: init?.status ?? 200,
    }
  }) as unknown as MockNextResponseConstructor

  NextResponse.json = mockJson

  return { mockJson, NextResponse }
})

vi.mock("next/server", () => ({ NextResponse }))

vi.mock("@/shared/api/server", () => ({
  ERROR_CODES: { GEOCODING: "GEOCODING_ERROR" },
  cachedRequest: vi.fn(),
  request: vi.fn(),
}))

vi.mock("@/shared/config/constants", () => ({
  API_CONFIG: { GEO_BASE_URL: "https://geo.com" },
}))

const mockcachedRequest = vi.mocked(cachedRequest)

const makeRequest = (search: string, signal?: AbortSignal) =>
  ({
    url: `https://geo.com/api/geocoding${search}`,
    signal: signal ?? null,
  }) as Request

beforeEach(() => vi.clearAllMocks())

// --- 3. tests ---
describe("GET /api/geocoding", () => {
  describe("successful responses", () => {
    it("returns JSON data with status from cache result", async () => {
      mockcachedRequest.mockResolvedValue({ data: [{ name: "Berlin" }], status: 200 })

      await GET(makeRequest("?name=Berlin&count=5"))

      expect(mockJson).toHaveBeenCalledWith([{ name: "Berlin" }], { status: 200 })
    })

    it("builds the upstream URL using GEO_BASE_URL and all search params", async () => {
      mockcachedRequest.mockResolvedValue({ data: [], status: 200 })

      await GET(makeRequest("?name=Berlin&count=3"))

      const { fetcher } = mockcachedRequest.mock.calls[0][0]
      const mockRequest = vi.mocked(request)
      mockRequest.mockResolvedValue({ data: [], status: 200 })
      await fetcher(undefined)

      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://geo.com/v1/search?name=Berlin&count=3",
          errorCode: "GEOCODING_ERROR",
        }),
      )
    })

    it("uses cache key without the 'count' param, lowercased", async () => {
      mockcachedRequest.mockResolvedValue({ data: [], status: 200 })

      await GET(makeRequest("?name=Berlin&count=10&lang=EN"))

      expect(mockcachedRequest.mock.calls[0][0].key).toBe("sky-flow:geocoding:name=berlin&lang=en")
    })

    it("sets cache TTL to LONG", async () => {
      mockcachedRequest.mockResolvedValue({ data: [], status: 200 })

      await GET(makeRequest("?name=Berlin"))

      expect(mockcachedRequest.mock.calls[0][0].ttl).toBe("LONG")
    })

    it("passes the request signal to cachedRequest", async () => {
      mockcachedRequest.mockResolvedValue({ data: [], status: 200 })
      const controller = new AbortController()

      await GET(makeRequest("?name=Berlin", controller.signal))

      expect(mockcachedRequest.mock.calls[0][0].abortSignal).toBe(controller.signal)
    })

    it("forwards non-200 status codes from the upstream response", async () => {
      mockcachedRequest.mockResolvedValue({ data: { message: "Not Found" }, status: 404 })

      await GET(makeRequest("?name=Unknown"))

      expect(mockJson).toHaveBeenCalledWith({ message: "Not Found" }, { status: 404 })
    })
  })

  describe("cache key normalisation", () => {
    it("removes 'count' but keeps all other params in the key", async () => {
      mockcachedRequest.mockResolvedValue({ data: [], status: 200 })

      await GET(makeRequest("?count=5&name=Berlin&lang=de"))

      const { key } = mockcachedRequest.mock.calls[0][0]
      expect(key).not.toContain("count")
      expect(key).toContain("name=berlin")
      expect(key).toContain("lang=de")
    })

    it("produces the same key regardless of 'count' value", async () => {
      mockcachedRequest.mockResolvedValue({ data: [], status: 200 })
      await GET(makeRequest("?name=Berlin&count=1"))
      const key1 = mockcachedRequest.mock.calls[0][0].key

      vi.clearAllMocks()
      NextResponse.json = mockJson
      mockcachedRequest.mockResolvedValue({ data: [], status: 200 })
      await GET(makeRequest("?name=Berlin&count=99"))
      const key2 = mockcachedRequest.mock.calls[0][0].key

      expect(key1).toBe(key2)
    })
  })

  describe("error handling", () => {
    it("returns 499 when the request is aborted (Error with name AbortError)", async () => {
      const abortError = new Error("Aborted")
      abortError.name = "AbortError"
      mockcachedRequest.mockRejectedValue(abortError)

      const result = await GET(makeRequest("?name=Unknown"))

      expect(NextResponse).toHaveBeenCalledWith(null, { status: 499 })
      expect(result).toMatchObject({ status: 499 })
    })

    it("returns 499 when the request is aborted (DOMException AbortError)", async () => {
      mockcachedRequest.mockRejectedValue(new DOMException("Aborted", "AbortError"))

      const result = await GET(makeRequest("?name=Unknown"))

      expect(NextResponse).toHaveBeenCalledWith(null, { status: 499 })
      expect(result).toMatchObject({ status: 499 })
    })

    it("returns 500 with error payload for unexpected errors", async () => {
      mockcachedRequest.mockRejectedValue(new Error("Something went wrong"))

      await GET(makeRequest("?name=Unknown"))

      expect(mockJson).toHaveBeenCalledWith(
        { error: "Internal server error", code: "GEOCODING_ERROR" },
        { status: 500 },
      )
    })

    it("returns 500 for non-Error thrown values", async () => {
      mockcachedRequest.mockRejectedValue("string error")

      await GET(makeRequest("?name=Unknown"))

      expect(mockJson).toHaveBeenCalledWith(
        { error: "Internal server error", code: "GEOCODING_ERROR" },
        { status: 500 },
      )
    })

    it("does NOT treat a generic Error as an AbortError", async () => {
      mockcachedRequest.mockRejectedValue(new Error("network failure"))

      await GET(makeRequest("?name=Unknown"))

      expect(NextResponse).not.toHaveBeenCalledWith(null, { status: 499 })
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Internal server error" }),
        { status: 500 },
      )
    })
  })
})
