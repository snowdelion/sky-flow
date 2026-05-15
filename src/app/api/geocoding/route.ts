import { NextResponse } from "next/server"
import { ERROR_CODES, cachedRequest, request } from "@/shared/api/server"
import { API_CONFIG } from "@/shared/config/constants"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = `${API_CONFIG.GEO_BASE_URL}/v1/search?${searchParams.toString()}`

  const cacheParams = new URLSearchParams(searchParams)
  cacheParams.delete("count")
  const key = `sky-flow:geocoding:${cacheParams.toString().toLowerCase()}`

  try {
    const res = await cachedRequest({
      key,
      ttl: "LONG",
      abortSignal: req.signal,
      fetcher: (signal?: AbortSignal) => request({ url, errorCode: ERROR_CODES.GEOCODING, signal }),
    })
    return NextResponse.json(res.data, { status: res.status })
  } catch (e) {
    if (e && typeof e === "object" && "name" in e && e.name === "AbortError")
      return new NextResponse(null, { status: 499 })

    return NextResponse.json(
      { error: "Internal server error", code: ERROR_CODES.GEOCODING },
      { status: 500 },
    )
  }
}
