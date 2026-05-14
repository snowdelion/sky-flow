import { queryRetry } from "../queryRetry"

describe("queryRetry", () => {
  it("should return false for AbortError", () => {
    const error = new Error("Aborted")
    error.name = "AbortError"
    const domExceptionError = new DOMException("Aborted", "AbortError")

    expect(queryRetry(0, error)).toBe(false)
    expect(queryRetry(0, domExceptionError)).toBe(false)
  })

  it("should return true when failure < expectedCount", () => {
    expect(queryRetry(0, new Error(), 3))
    expect(queryRetry(1, new Error(), 3))
    expect(queryRetry(2, new Error(), 3))
  })

  it("should return false when failureCount >= expectedCount", () => {
    expect(queryRetry(2, new Error(), 2))
  })
})
