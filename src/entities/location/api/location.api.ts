import { handleApiError, request } from "@shared/api";
import { API_CONFIG } from "@shared/config/constants";
import { mapToGeoData } from "../model/mapper";
import { GeoResponseDtoSchema } from "./dto";

export async function fetchGeoData(city?: string, signal?: AbortSignal) {
  try {
    if (!city) return { results: [] };
    const geoUrl = `${API_CONFIG.GEO_BASE_URL}/v1/search?name=${encodeURIComponent(city)}&count=8&language=en`;
    const data = await request(geoUrl, { signal }, "GEOCODING_FAILED", true);

    if (!data || !data.results) return { results: [] };

    const result = GeoResponseDtoSchema.parse(data);
    return mapToGeoData(result);
  } catch (error) {
    handleApiError(error);
  }
}
