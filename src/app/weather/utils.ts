import { redirect } from "next/navigation";

import type { CityData } from "@/types/location";

import { DEFAULT_CITY_DATA } from "./constants";

export function redirectToDefaultCity(params: WeatherParams): void {
  const { city, country, lat, lon } = params;

  if (!city && !country && !lat && !lon) {
    const {
      city: defCity,
      country: defCountry,
      lat: defLat,
      lon: defLon,
    } = DEFAULT_CITY_DATA;

    const params = new URLSearchParams({
      city: defCity,
      country: defCountry,
      lat: defLat.toString(),
      lon: defLon.toString(),
    });

    redirect(`weather/?${params}`);
  }
}

export function findCityDataFromParams(params: WeatherParams): CityData {
  const {
    city = "Unknown",
    country: countryParam,
    lat: latParam,
    lon: lonParam,
  } = params;

  const hasValidParams =
    latParam !== undefined && lonParam !== undefined && countryParam;

  if (hasValidParams) {
    const lat = +latParam;
    const lon = +lonParam;

    if (!isNaN(lat) && !isNaN(lon))
      return {
        status: "found",
        city,
        country: countryParam,
        lat,
        lon,
      };
  }
  return { status: "not-found", city };
}

interface WeatherParams {
  city?: string;
  country?: string;
  lat?: string;
  lon?: string;
}
