import { redirect } from "next/navigation";

import { FoundCitySchema, type CityData } from "@/types/location";

import { DEFAULT_CITY_DATA } from "./constants";

export function redirectToDefaultCity(params: WeatherParams): void {
  const { city, country, lat, lon, region, code } = params;

  if (!city && !country && !lat && !lon && !region && !code) {
    const {
      city: defCity,
      country: defCountry,
      region,
      code,
      lat: defLat,
      lon: defLon,
    } = DEFAULT_CITY_DATA;

    const params = new URLSearchParams();
    params.set("city", defCity);
    if (region) params.set("region", region);
    if (defCountry) params.set("country", defCountry);
    if (code) params.set("code", code);
    params.set("lat", defLat.toString());
    params.set("lon", defLon.toString());

    redirect(`/weather/?${params.toString()}`);
  }
}

export function findCityDataFromParams(params: WeatherParams): CityData {
  const {
    city = "Unknown",
    country,
    code,
    region,
    lat: latParam,
    lon: lonParam,
  } = params;

  const cityData = {
    status: "found" as const,
    city,
    country,
    region,
    code,
    lat: Number(latParam),
    lon: Number(lonParam),
  };

  if (region && country) {
    const { success, data } = FoundCitySchema.safeParse(cityData);

    if (success) return data;
  }

  const { success, data } = FoundCitySchema.safeParse(cityData);

  if (success) return data;
  return { status: "not-found", city };
}

interface WeatherParams {
  city?: string;
  region?: string;
  country?: string;
  code?: string;
  lat?: string;
  lon?: string;
}
