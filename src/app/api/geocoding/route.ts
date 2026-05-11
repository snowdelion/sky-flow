import { NextResponse } from "next/server";
import { ERROR_CODES, request } from "@/shared/api/server";
import { API_CONFIG } from "@/shared/config/constants";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const url = `${API_CONFIG.GEO_BASE_URL}/v1/search?${searchParams.toString()}`;

  try {
    const res = await request({
      url,
      errorCode: ERROR_CODES.GEOCODING,
      signal: req.signal,
    });
    return NextResponse.json(res?.data, { status: res?.status });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError")
      return new NextResponse(null, { status: 499 });

    return NextResponse.json(
      { error: "Internal server error", code: ERROR_CODES.GEOCODING },
      { status: 500 },
    );
  }
}
