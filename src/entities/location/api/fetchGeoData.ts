import { getBaseUrl } from "@/shared/api";
import { ERROR_CODES, request } from "@shared/api";
import { mapToGeoData } from "../model/mapper";
import { GeoResponseDtoSchema } from "./dto";

export async function fetchGeoData({
  city,
  signal,
  count = 8,
}: FetchGeoDataArgs) {
  if (!city) return { results: [] };
  const url = `${getBaseUrl()}/api/geocoding?name=${encodeURIComponent(city)}&count=${count}&language=en`;

  const response = await request({
    url,
    errorCode: ERROR_CODES.GEOCODING,
    signal,
    schema: GeoResponseDtoSchema,
  });

  return mapToGeoData(response.data);
}

type FetchGeoDataArgs = {
  city?: string;
  signal?: AbortSignal;
  count?: number;
};
