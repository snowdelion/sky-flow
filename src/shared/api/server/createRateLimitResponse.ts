import "server-only"
import { NextResponse } from "next/server"
import { ERROR_CODES } from "../config/error-codes"

type LimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export function createRateLimitResponse(limitResult: LimitResult) {
  const { limit, remaining, reset } = limitResult

  return NextResponse.json(
    { error: "Too many requests", code: ERROR_CODES.RATE_LIMIT },
    {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    },
  )
}
