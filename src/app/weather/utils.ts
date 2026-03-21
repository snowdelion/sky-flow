import { redirect } from "next/navigation";

import { fetchGeoData } from "@/services/fetchGeoData";
import type { GeoDataItem } from "@/types/api/GeoData";
import {
  type FoundCity,
  FoundCitySchema,
  type CityData,
} from "@/types/location";

import { DEFAULT_CITY_DATA } from "./constants";

export interface WeatherParams {
  city?: string;
  region?: string;
  country?: string;
  code?: string;
  lat?: string;
  lon?: string;
}

export async function verifyAndGetCityData(
  params: WeatherParams,
): Promise<CityData> {
  if (!params.city) {
    const defaultParams = createSearchParams(DEFAULT_CITY_DATA);
    redirect(`/weather/?${defaultParams.toString()}`);
  }

  const { city, lat, lon, region, country } = params;
  const geoData = await fetchGeoData(city);

  if (!geoData?.results?.length)
    return {
      status: "not-found",
      city,
    };

  const match = findMatch(geoData.results, { lat, lon, region, country });
  const { success, data } = FoundCitySchema.safeParse(match);

  if (!success) return { status: "not-found", city };

  const needsRedirect = needsRedirectCheck(params, data);
  if (needsRedirect) {
    const params = createSearchParams(data);
    redirect(`/weather/?${params.toString()}`);
  }

  return data;
}

const createSearchParams = (data: FoundCity): URLSearchParams => {
  const { city, region, country, code, lat, lon } = data;
  const params = new URLSearchParams();

  params.set("city", city);
  if (region) params.set("region", region);
  if (country) params.set("country", country);
  if (code) params.set("code", code);
  params.set("lat", lat.toString());
  params.set("lon", lon.toString());
  return params;
};

const findMatch = (
  results: GeoDataItem[],
  query: { lat?: string; lon?: string; region?: string; country?: string },
): CityData => {
  if (query.lat && query.lon) {
    const latNum = Number(query.lat);
    const lonNum = Number(query.lon);
    const isValid =
      !isNaN(latNum) &&
      !isNaN(lonNum) &&
      latNum >= -90 &&
      latNum <= 90 &&
      lonNum >= -180 &&
      lonNum <= 180;

    if (isValid) {
      const match = results.find(
        (item) => item.latitude === latNum && item.longitude === lonNum,
      );

      if (match) return createCityData(match);
    }
  }

  if (query.region || query.country) {
    const match = results.find((item) => {
      const matchRegion =
        query.region &&
        item.admin1?.toLowerCase().includes(query.region.toLowerCase());
      const matchCountry =
        query.country &&
        item.country?.toLowerCase().includes(query.country.toLowerCase());
      return matchRegion || matchCountry;
    });
    if (match) return createCityData(match);
  }

  return createCityData(results[0]);
};

const needsRedirectCheck = (
  params: WeatherParams,
  data: FoundCity,
): boolean => {
  const hasExtraParams = Object.keys(params).some(
    (key) => !["city", "region", "country", "code", "lat", "lon"].includes(key),
  );

  if (hasExtraParams) return true;

  return (
    Number(params.lat) !== data?.lat ||
    Number(params.lon) !== data?.lon ||
    params.region !== data?.region ||
    params.country !== data?.country ||
    params.code !== data?.code
  );
};

const createCityData = (data: GeoDataItem): CityData => ({
  status: "found",
  city: data.name,
  region: data.admin1,
  country: data.country,
  code: data.feature_code,
  lat: data.latitude,
  lon: data.longitude,
});
