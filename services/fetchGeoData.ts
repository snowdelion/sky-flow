import type { SearchGeoData } from "@/types/api/SearchGeoData";
import { AppError } from "@/types/errors";

export async function fetchGeoData(
  city: string,
  signal?: AbortSignal,
): Promise<SearchGeoData> {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=8&language=en`;
    const geoRes = await fetch(geoUrl, { signal });

    if (!geoRes.ok) {
      signal?.throwIfAborted();
      throw new AppError(
        "GEOCODING_FAILED",
        "Check your network connection...",
      );
    }

    const geoData: SearchGeoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new AppError("GEOCODING_FAILED", `City ${city} not found...`);
    }
    console.log(geoData);

    return geoData;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    if (error instanceof AppError) throw error;
    const message =
      error instanceof Error ? error.message : "Unexpected error...";
    throw new AppError("UNKNOWN_ERROR", message);
  }
}
