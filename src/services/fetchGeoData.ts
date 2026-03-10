import type { GeoData } from "@/types/api/GeoData";
import { AppError } from "@/types/errors";
import { throwResponseErrors } from "@/utils/throwResponseErrors";

export async function fetchGeoData(
  city: string,
  signal?: AbortSignal,
): Promise<GeoData> {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=8&language=en`;
    const geoRes = await fetch(geoUrl, { signal });

    if (!geoRes.ok) {
      signal?.throwIfAborted();

      if (geoRes.status === 404) return { results: [] };
      throwResponseErrors(geoRes.status, "geocoding");
    }

    const geoData: GeoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0)
      return { results: [] };

    return geoData;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    if (error instanceof AppError) throw error;
    const message =
      error instanceof Error ? error.message : "Unexpected error...";
    throw new AppError("UNKNOWN_ERROR", message);
  }
}
