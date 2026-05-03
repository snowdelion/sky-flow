import type { AiErrorCode } from "./types";

export function parseErrorCode(error: Error): AiErrorCode {
  const msg = error.message;

  if (msg.startsWith("{"))
    try {
      const parsed = JSON.parse(msg);
      if (parsed.code === "RATE_LIMIT_EXCEEDED") return "RATE_LIMIT_EXCEEDED";
      if (parsed.code === "INVALID_REQUEST_DATA") return "INVALID_REQUEST_DATA";
    } catch {}

  if (
    msg.includes("429") ||
    msg.includes("Too many requests") ||
    msg.includes("RATE_LIMIT_EXCEEDED")
  )
    return "RATE_LIMIT_EXCEEDED";

  if (
    msg.includes("400") ||
    msg.includes("Invalid data") ||
    msg.includes("INVALID_REQUEST_DATA")
  )
    return "INVALID_REQUEST_DATA";

  return "SERVICE_UNAVAILABLE";
}
