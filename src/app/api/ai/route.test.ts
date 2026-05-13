import { NextRequest } from "next/server"
import { ERROR_CODES } from "@/shared/api"
import type { POST as PostType } from "./route"

// --- 1. mocks ---
const checkRatelimit = vi.hoisted(() => vi.fn())
vi.mock("@/shared/api/server/checkRatelimit", () => ({
  checkRatelimit,
}))

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow = vi.fn()
    limit = vi.fn()
  },
}))

vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: vi.fn().mockReturnValue({}),
  },
}))

vi.mock("@ai-sdk/groq", () => ({ groq: vi.fn() }))

vi.mock("server-only", () => ({}))

vi.mock("next/headers", () => ({
  headers: async () => new Map([["x-forwarded-for", "1.2.3.4"]]),
}))

vi.mock("ai", () => ({
  streamText: vi.fn().mockReturnValue({
    toUIMessageStreamResponse: () => new Response("mock-stream", { status: 200 }),
  }),
}))

// --- 2. setup ---
let POST: typeof PostType
const VALID_WEATHER = {
  option: "weather" as const,
  city: "Warsaw",
  country: "Poland",
  region: "Masovian",
  lat: 52.2,
  lon: 21.2,
  temperature: 10,
  condition: "sunny",
}
const VALID_LOCATION = { ...VALID_WEATHER, option: "location" as const }

const createRequest = (body: unknown, ip = "1.2.3.4") =>
  new NextRequest("http://localhost:3000/api/ai", {
    method: "POST",
    body: JSON.stringify(body),
    headers: new Headers({
      "x-forwarded-for": ip,
      "content-type": "application/json",
    }),
  })

const ratelimitPass = (limit: number = 10, remaining: number = 9) =>
  checkRatelimit.mockResolvedValue({
    success: true,
    limit,
    remaining,
    reset: Date.now() + 10_100,
  })

const ratelimitFail = (limit: number = 5, remaining: number = 0) =>
  checkRatelimit.mockResolvedValue({
    success: false,
    limit,
    remaining,
    reset: Date.now() + 10_100,
  })

// --- 3. tests ---
beforeAll(async () => {
  const actual = await import("./route")
  POST = actual.POST
})

beforeEach(() => {
  vi.clearAllMocks()
  ratelimitPass()
})

describe("validation", () => {
  it("should return 400 when body is missing required fields", async () => {
    const res = await POST(createRequest({ country: "Poland" }))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({
      error: "Invalid data",
      code: ERROR_CODES.REQUEST_DATA,
    })
  })

  it("should return 400 when option is invalid", async () => {
    const res = await POST(createRequest({ ...VALID_WEATHER, option: "unknown" }))
    expect(res.status).toBe(400)
  })

  it("should return 400 when lat is out of range", async () => {
    const res = await POST(createRequest({ ...VALID_WEATHER, lat: 1000 }))
    expect(res.status).toBe(400)
  })
})

describe("success", () => {
  it("should return 200 for weather option", async () => {
    const res = await POST(createRequest(VALID_WEATHER))
    expect(res.status).toBe(200)
    expect(await res.text()).toBe("mock-stream")
  })

  it("should return 200 for location option", async () => {
    const res = await POST(createRequest(VALID_LOCATION))
    expect(res.status).toBe(200)
  })
})

describe("error", () => {
  it("should return 500 when body is invalid", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const req = new NextRequest("http://localhost:3000/api/ai", {
      method: "post",
      body: "invalid",
      headers: new Headers({ "content-type": "application/json" }),
    })
    const res = await POST(req)
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({
      error: "Internal server error",
      code: ERROR_CODES.AI_DESCRIPTION,
    })
  })
})

describe("rate limit", () => {
  it("should return 429 when limit exceeded", async () => {
    ratelimitFail(5, 0)
    const res = await POST(createRequest(VALID_WEATHER))
    expect(res.status).toBe(429)
    expect(await res.json()).toEqual({
      error: "Too many requests",
      code: ERROR_CODES.RATE_LIMIT,
    })
  })

  it("should set correct rate limit headers on 429", async () => {
    const reset = Date.now() + 10_000
    checkRatelimit.mockResolvedValue({
      success: false,
      limit: 5,
      remaining: 0,
      reset,
    })
    const res = await POST(createRequest(VALID_WEATHER))
    expect(res.headers.get("X-RateLimit-Limit")).toBe("5")
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("0")
    expect(res.headers.get("X-RateLimit-Reset")).toBe(reset.toString())
  })

  it("should pass through when limit is not exceeded", async () => {
    ratelimitPass(10, 7)
    const res = await POST(createRequest(VALID_WEATHER))
    expect(res.status).toBe(200)
  })

  it("should block one IP but allow another", async () => {
    checkRatelimit
      .mockResolvedValueOnce({
        success: false,
        limit: 5,
        remaining: 0,
        reset: Date.now() + 10_000,
      })
      .mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 10_000,
      })

    const blocked = await POST(createRequest(VALID_WEATHER, "1.1.1.1"))
    const allowed = await POST(createRequest(VALID_WEATHER, "2.2.2.2"))

    expect(blocked.status).toBe(429)
    expect(allowed.status).toBe(200)
  })
})
