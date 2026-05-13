import z from "zod"
import { AppError } from "../../config/app-error"
import { ERROR_CODES, type ErrorCode } from "../../config/error-codes"
import { handleApiError, throwResponseErrors } from "../error-handler"

describe("throwResponseErrors", () => {
  const cases: TestCase[] = [
    {
      status: 400,
      code: ERROR_CODES.GEOCODING,
      message: "Invalid search query...",
    },
    {
      status: 403,
      code: ERROR_CODES.GEOCODING,
      message: "API authentication failed. Try again later...",
    },
    {
      status: 429,
      code: ERROR_CODES.GEOCODING,
      message: "Too many requests. Wait a moment and try again...",
    },
    {
      status: 500,
      code: ERROR_CODES.GEOCODING,
      message: "Service is temporarily unavailable. Try again later...",
    },
    {
      status: 1000,
      code: ERROR_CODES.GEOCODING,
      message: "Failed to fetch data (status: 1000).",
    },

    {
      status: 400,
      code: ERROR_CODES.FORECAST,
      message: "Invalid search query...",
    },
    {
      status: 403,
      code: ERROR_CODES.FORECAST,
      message: "API authentication failed. Try again later...",
    },
    {
      status: 429,
      code: ERROR_CODES.FORECAST,
      message: "Too many requests. Wait a moment and try again...",
    },
    {
      status: 500,
      code: ERROR_CODES.FORECAST,
      message: "Service is temporarily unavailable. Try again later...",
    },
    {
      status: 1000,
      code: ERROR_CODES.FORECAST,
      message: "Failed to fetch data (status: 1000).",
    },
  ]

  test.each(cases)("should throw correct errors", ({ status, code, message }) => {
    expect.assertions(3)

    try {
      throwResponseErrors(status, code)
    } catch (error) {
      expect(error).toBeInstanceOf(AppError)
      expect((error as AppError).message).toBe(message)
      expect((error as AppError).code).toBe(code)
    }
  })
})

describe("handleApiError", () => {
  it("should rethrow on external abort signal", () => {
    const error = new DOMException("Aborted", "AbortError")

    expect(() => handleApiError(error, ERROR_CODES.UNKNOWN, { isExternalSignal: true })).toThrow(
      error,
    )
  })

  it("should throw timeout on TimeoutError", () => {
    const error = new DOMException("Timeout", "TimeoutError")

    expect(() => handleApiError(error)).toThrow(
      expect.objectContaining({ code: ERROR_CODES.TIMEOUT }),
    )
  })

  it("should throw timeout on AbortError without external signal", () => {
    const error = new DOMException("Aborted", "AbortError")

    expect(() => handleApiError(error, ERROR_CODES.UNKNOWN)).toThrow(
      expect.objectContaining({ code: ERROR_CODES.TIMEOUT }),
    )
  })

  it("should throw network on network error message", () => {
    const error1 = new Error("Check your network connection")
    const error2 = new Error("Failed to fetch")
    const error3 = new Error("Load failed")

    expect(() => handleApiError(error1)).toThrow(
      expect.objectContaining({ code: ERROR_CODES.NETWORK }),
    )
    expect(() => handleApiError(error2)).toThrow(
      expect.objectContaining({ code: ERROR_CODES.NETWORK }),
    )
    expect(() => handleApiError(error3)).toThrow(
      expect.objectContaining({ code: ERROR_CODES.NETWORK }),
    )
  })

  it("should throw AppError inside isError block", () => {
    const appError = new AppError(ERROR_CODES.GEOCODING, "geo error")

    expect(() => handleApiError(appError)).toThrow(appError)
  })

  it("should throw validation on ZodError", () => {
    let zodError: z.ZodError

    try {
      z.string().parse(1)
    } catch (error) {
      zodError = error as z.ZodError
    }

    expect(() => handleApiError(zodError)).toThrow(
      expect.objectContaining({ code: ERROR_CODES.VALIDATION }),
    )
  })

  it("should wrap generic Error with provided errorCode", () => {
    const error = new Error("generic error")

    expect(() => handleApiError(error, ERROR_CODES.FORECAST)).toThrow(
      expect.objectContaining({
        code: ERROR_CODES.FORECAST,
        message: "generic error",
      }),
    )
  })

  it("should throw unknown for non-Error values", () => {
    expect(() => handleApiError("unknown error")).toThrow(
      expect.objectContaining({ code: ERROR_CODES.UNKNOWN }),
    )
  })
})

interface TestCase {
  status: number
  code: ErrorCode
  message: string
}
