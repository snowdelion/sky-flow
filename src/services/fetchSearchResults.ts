import { DEFAULT_UNITS } from "@/stores/useSettingsStore";
import { ForecastResponse } from "@/types/api/ForecastResponse";
import { SearchDataItem } from "@/types/api/SearchData";
import { AppError } from "@/types/errors";
import type { Units } from "@/types/weather";

import { fetchGeoData } from "./fetchGeoData";

export const fetchSearchResults = async (
  searchResult: string,
  units: Units = DEFAULT_UNITS,
  signal?: AbortSignal,
): Promise<SearchDataItem[]> => {
  try {
    const geoData = await fetchGeoData(searchResult, signal);
    const results = geoData.results;

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
      throw new AppError(
        "FORECAST_FAILED",
        "Server is temporarily unavailable...",
      );
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
