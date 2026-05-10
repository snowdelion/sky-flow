import { NextResponse } from "next/server";
import { ERROR_CODES, request } from "@/shared/api/server";
import { API_CONFIG } from "@/shared/config/constants";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = `${API_CONFIG.FORECAST_BASE_URL}/v1/forecast?${searchParams.toString()}`;

  try {
    const res = await request({ url, errorCode: ERROR_CODES.FORECAST });
    return NextResponse.json(res?.data, { status: res?.status });
  } catch {
    return NextResponse.json(
      { error: "Internal server error", code: ERROR_CODES.FORECAST },
      { status: 500 },
    );
  }
}
