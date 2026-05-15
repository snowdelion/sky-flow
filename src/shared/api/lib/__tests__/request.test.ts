import type { NextResponse } from "next/server"
import z from "zod"
import { AppError } from "../../config/app-error"
import { ERROR_CODES } from "../../server"
import { request } from "../request"

describe("request", () => {
  beforeEach(() => vi.clearAllMocks())

  describe("successful responses", () => {
    it("should parse response data through schema when schema is provided", async () => {
      const schema = z.object({ id: z.number() })

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 42 }),
      } as NextResponse)

      const result = await request({ url: "/fetch", schema })

      expect(result.data).toEqual({ id: 42 })
      expect(result.status).toBe(200)
    })
  })

  describe("zod validation", () => {
    it("should throw when schema validation fails", async () => {
      const schema = z.object({ id: z.number() })

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: "not-a-number" }),
      } as NextResponse)

      await expect(request({ url: "/fetch", schema })).rejects.toThrow()
    })
  })

  describe("error handling: API", () => {
    it("should throw when response is not ok and status is not 499", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as NextResponse)

      await expect(request({ url: "/fetch" })).rejects.toThrow()
    })

    it("should throw AppError with errorCode when response fails with known status", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as NextResponse)

      await expect(request({ url: "/fetch", errorCode: "UNKNOWN_ERROR" })).rejects.toBeInstanceOf(
        AppError,
      )
    })
  })

  describe("aborts and timeouts", () => {
    it("should show original AbortError when response is 499 and signal is aborted", async () => {
      const controller = new AbortController()
      controller.abort()

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 499,
      } as NextResponse)

      await expect(request({ url: "/fetch", signal: controller.signal })).rejects.toThrow(
        DOMException,
      )
    })

    it("should throw AppError timeout when fetch times out and no external signal", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(
        Object.assign(new Error("Timeout"), { name: "TimeoutError" }),
      )

      await expect(request({ url: "/fetch" })).rejects.toBeInstanceOf(AppError)

      vi.spyOn(global, "fetch").mockRejectedValueOnce(
        Object.assign(new Error("Timeout"), { name: "TimeoutError" }),
      )

      await expect(request({ url: "/fetch", timeout: 8000 })).rejects.toMatchObject({
        code: ERROR_CODES.TIMEOUT,
      })
    })

    it("should throw AppError timeout when AbortError without external signal", async () => {
      vi.spyOn(AbortSignal, "timeout").mockReturnValue({
        aborted: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as unknown as AbortSignal)

      const timeoutAbortError = new DOMException("Aborted", "AbortError")
      vi.spyOn(global, "fetch").mockRejectedValueOnce(timeoutAbortError)
      await expect(request({ url: "/fetch" })).rejects.toBeInstanceOf(AppError)

      vi.spyOn(global, "fetch").mockRejectedValueOnce(timeoutAbortError)
      await expect(request({ url: "/fetch" })).rejects.toMatchObject({
        code: ERROR_CODES.TIMEOUT,
      })
    })

    it("should throw TimeoutError when internal timeout aborts and no external signal", async () => {
      vi.useFakeTimers()

      vi.spyOn(global, "fetch").mockImplementationOnce(
        (_url, init) =>
          new Promise((_, reject) => {
            init?.signal?.addEventListener("abort", () => {
              reject(new DOMException("Aborted", "AbortError"))
            })
          }),
      )

      const promise = request({ url: "/fetch", timeout: 100 })
      const settled = promise.catch((e) => e)

      await vi.advanceTimersByTimeAsync(200)

      const error = await settled
      expect(error).toMatchObject({ name: "TimeoutError" })

      vi.useRealTimers()
    })

    it("should throw TimeoutError when internal timeout aborts but external signal is not aborted", async () => {
      vi.useFakeTimers()

      const controller = new AbortController()

      vi.spyOn(global, "fetch").mockImplementationOnce(
        (_url, init) =>
          new Promise((_, reject) => {
            init?.signal?.addEventListener("abort", () => {
              reject(new DOMException("Aborted", "AbortError"))
            })
          }),
      )

      const promise = request({ url: "/fetch", timeout: 100, signal: controller.signal })
      const settled = promise.catch((e) => e)

      await vi.advanceTimersByTimeAsync(200)

      const error = await settled
      expect(error).toMatchObject({ name: "TimeoutError" })

      vi.useRealTimers()
    })
  })
})
