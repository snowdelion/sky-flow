import { SearchDataItem } from "@/components/SearchSection/types/SearchData";
import { DEFAULT_UNITS } from "@/stores/useSettingsStore";
import { AppError } from "@/types/errors";
import type { Units } from "@/types/weather";
import { throwResponseErrors } from "@/utils/throwResponseErrors";

import { fetchGeoData } from "../../../services/fetchGeoData";

export const fetchSearchResults = async (
  searchResult: string,
  units: Units = DEFAULT_UNITS,
  signal?: AbortSignal,
): Promise<SearchDataItem[]> => {
  try {
    const geoData = await fetchGeoData(searchResult, signal);
    const results = geoData?.results;
    if (!results) return [];

    const onlyLats = results.map((item) => item.latitude).join(",");
    const onlyLons = results.map((item) => item.longitude).join(",");
    const onlyTimezones = results.map((item) => item.timezone).join(",");

    const forecastUrl =
      "https://api.open-meteo.com/v1/forecast?" +
      new URLSearchParams({
        latitude: onlyLats.toString(),
        longitude: onlyLons.toString(),

        current: "temperature_2m,weather_code",

        timezone: onlyTimezones.toString(),
        temperature_unit: units.temperature,
      });

    const forecastRes = await fetch(forecastUrl, { signal });

    if (!forecastRes.ok) {
      signal?.throwIfAborted();
      throwResponseErrors(forecastRes.status, "forecast");
    }

    const forecastData: ForecastResponse[] = await forecastRes.json();

    return results.map((item, index) => ({
      city: item.name,
      country: item.country,
      id: item.id,
      latitude: item.latitude,
      longitude: item.longitude,
      temperature: forecastData[index].current.temperature_2m,
      temperatureUnit: forecastData[index].current_units.temperature_2m,
      weatherCode: forecastData[index].current.weather_code,
    }));
  } catch (error) {
    if (error instanceof AppError) throw error;
    const message =
      error instanceof Error ? error.message : "Unexpected error...";
    throw new AppError("UNKNOWN_ERROR", message);
  }
};

interface ForecastResponse {
  current: {
    interval: number;
    temperature_2m: number;
    time: string;
    weather_code: number;
  };
  current_units: {
    interval: string;
    temperature_2m: string;
    time: string;
  };
  elevation: number;
  generationtime_ms: number;
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}
