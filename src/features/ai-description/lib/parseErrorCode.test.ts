import { ERROR_CODES } from "@/shared/api"
import { parseErrorCode } from "./parseErrorCode"

const createJsonError = (code: string) => new Error(JSON.stringify({ code }))

describe("parseErrorCode", () => {
  describe("JSON messages", () => {
    it("should return RATE_LIMIT_EXCEEDED for JSON with code RATE_LIMIT_EXCEEDED", () => {
      const error = createJsonError("RATE_LIMIT_EXCEEDED")
      expect(parseErrorCode(error)).toBe(ERROR_CODES.RATE_LIMIT)
    })

    it("should return INVALID_REQUEST_DATA for JSON with code INVALID_REQUEST_DATA", () => {
      const error = createJsonError("INVALID_REQUEST_DATA")
      expect(parseErrorCode(error)).toBe(ERROR_CODES.REQUEST_DATA)
    })

    it("should return SERVICE_UNAVAILABLE for JSON unknown code", () => {
      const error = createJsonError("UNKNOWN_CODE")
      expect(parseErrorCode(error)).toBe(ERROR_CODES.AI_DESCRIPTION)
    })

    it("should fall through to string checks when JSON is transformed", () => {
      const error = new Error("{ invalid json with 429 }")
      expect(parseErrorCode(error)).toBe(ERROR_CODES.RATE_LIMIT)
    })
  })

  describe("string messages: rate limit", () => {
    const cases = ["429", "Error 429: rate limit", "Too many requests", ERROR_CODES.RATE_LIMIT]
    test.each(cases)('should return RATE_LIMIT_EXCEEDED for "%s"', (msg) => {
      expect(parseErrorCode(new Error(msg))).toBe(ERROR_CODES.RATE_LIMIT)
    })
  })

  describe("string messages: invalid data", () => {
    const cases = ["400", "Error 400: bad request", "Invalid data", ERROR_CODES.REQUEST_DATA]
    test.each(cases)('should return INVALID_REQUEST_DATA for "%s"', (msg) => {
      expect(parseErrorCode(new Error(msg))).toBe(ERROR_CODES.REQUEST_DATA)
    })
  })

  describe("fallback", () => {
    const cases = ["Internal server error", "Network error", "Something went wrong", ""]
    test.each(cases)('should return SERVICE_UNAVAILABLE for "%s"', (msg) => {
      expect(parseErrorCode(new Error(msg))).toBe(ERROR_CODES.AI_DESCRIPTION)
    })
  })
})
