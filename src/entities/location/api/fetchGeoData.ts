import { getBaseUrl } from "@/shared/lib";
import { ERROR_CODES, handleApiError, request } from "@shared/api";
import { mapToGeoData } from "../model/mapper";
import { GeoResponseDtoSchema } from "./dto";

export async function fetchGeoData(city?: string, signal?: AbortSignal) {
  try {
    if (!city) return { results: [] };
    const url = `${getBaseUrl()}/api/geocoding?name=${encodeURIComponent(city)}&count=8&language=en`;
    const res = await request({
      url,
      errorCode: ERROR_CODES.GEOCODING,
      signal,
    });

    if (!res?.data || !res.data?.results) return { results: [] };

    const result = GeoResponseDtoSchema.parse(res?.data);
    return mapToGeoData(result);
  } catch (error) {
    handleApiError(error, ERROR_CODES.GEOCODING);
  }
}
