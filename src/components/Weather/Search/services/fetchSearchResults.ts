import { ZodError } from "zod";

import {
  SearchDataItem,
  SearchDataSchema,
} from "@/components/Weather/Search/types/SearchData";
import { DEFAULT_UNITS } from "@/stores/useSettingsStore";
import { AppError } from "@/types/errors";
import type { Units } from "@/types/weather";
import { throwResponseErrors, throwZodErrors } from "@/utils/errors";

import { fetchGeoData } from "../../../../services/fetchGeoData";

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

    const forecastUrl =
      "https://api.open-meteo.com/v1/forecast?" +
      new URLSearchParams({
        latitude: onlyLats.toString(),
        longitude: onlyLons.toString(),

        current: "temperature_2m,weather_code",

        temperature_unit: units.temperature,
      });

    const forecastRes = await fetch(forecastUrl, { signal });

    if (!forecastRes.ok) {
      signal?.throwIfAborted();
      throwResponseErrors(forecastRes.status, "forecast");
    }

    const forecastRaw = await forecastRes.json();
    const forecastData = Array.isArray(forecastRaw)
      ? forecastRaw
      : [forecastRaw];

    const rawData = results.map((item, index) => ({
      region: item?.admin1,
      code: item?.feature_code,
      city: item.name,
      country: item?.country,
      id: item.id,
      latitude: item.latitude,
      longitude: item.longitude,
      temperature: forecastData?.[index]?.current?.temperature_2m,
      temperatureUnit: forecastData?.[index]?.current_units?.temperature_2m,
      weatherCode: forecastData?.[index]?.current?.weather_code,
    }));

    return SearchDataSchema.parse(rawData);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    if (error instanceof ZodError) throwZodErrors(error);
    if (error instanceof AppError) throw error;
    const message =
      error instanceof Error ? error.message : "Unexpected error...";
    throw new AppError("UNKNOWN_ERROR", message);
  }
};
