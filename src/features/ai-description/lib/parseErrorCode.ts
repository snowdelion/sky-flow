import { ERROR_CODES } from "@/shared/api"

export function parseErrorCode(error: Error) {
  const msg = error.message

  if (msg.startsWith("{"))
    try {
      const parsed = JSON.parse(msg)
      if (parsed.code === ERROR_CODES.RATE_LIMIT) return ERROR_CODES.RATE_LIMIT
      if (parsed.code === ERROR_CODES.REQUEST_DATA) return ERROR_CODES.REQUEST_DATA
    } catch {}

  if (
    msg.includes("429") ||
    msg.includes("Too many requests") ||
    msg.includes(ERROR_CODES.RATE_LIMIT)
  )
    return ERROR_CODES.RATE_LIMIT

  if (msg.includes("400") || msg.includes("Invalid data") || msg.includes(ERROR_CODES.REQUEST_DATA))
    return ERROR_CODES.REQUEST_DATA

  return ERROR_CODES.AI_DESCRIPTION
}
