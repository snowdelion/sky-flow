import { ZodError } from "zod";

import { DEFAULT_UNITS } from "@/stores/useSettingsStore";
import { WeatherDataSchema, type WeatherData } from "@/types/api/WeatherData";
import { AppError } from "@/types/errors";
import { isFoundCity, type CityData } from "@/types/location";
import type { Units } from "@/types/weather";
import { throwResponseErrors, throwZodErrors } from "@/utils/errors";

export async function fetchForecastData(
  cityData: CityData,
  units: Units = DEFAULT_UNITS,
  signal?: AbortSignal,
): Promise<WeatherData> {
  try {
    if (!isFoundCity(cityData))
      throw new AppError(
        "FORECAST_FAILED",
        "Cannot fetch weather! City coords not found...",
      );

    const { city, country, region, code, lat, lon } = cityData;

    if (!city || !lat || !lon)
      throw new AppError("FORECAST_FAILED", "Invalid city data");

    const url =
      "https://api.open-meteo.com/v1/forecast?" +
      new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),

        current:
          "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code",

        hourly: "temperature_2m,weather_code",
        daily:
          "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min",

        forecast_days: "8",
        timezone: "auto",
        temperature_unit: units.temperature,
        wind_speed_unit: units.speed,
        precipitation_unit: units.precipitation,
      });

    const forecastRes = await fetch(url, { signal });

    if (!forecastRes.ok) {
      signal?.throwIfAborted();
      throwResponseErrors(forecastRes.status, "forecast");
    }

    const forecastData = await forecastRes.json();
    const rawData = {
      current: {
        apparent_temperature: forecastData?.current?.apparent_temperature,
        precipitation: forecastData?.current?.precipitation,
        relative_humidity_2m: forecastData?.current?.relative_humidity_2m,
        temperature_2m: forecastData?.current?.temperature_2m,
        weather_code: forecastData?.current?.weather_code,
        wind_speed_10m: forecastData?.current?.wind_speed_10m,
        time: forecastData?.current?.time,
        city,
        country,
        region,
        code,
        latitude: lat,
        longitude: lon,
      },
      hourly: forecastData?.hourly,
      daily: forecastData?.daily,
      forecastUnits: {
        temperature: forecastData?.current_units?.temperature_2m,
        speed: forecastData?.current_units?.wind_speed_10m,
        precipitation: forecastData?.current_units?.precipitation,
      },
    };

    return WeatherDataSchema.parse(rawData);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    if (error instanceof ZodError) throwZodErrors(error);
    if (error instanceof AppError) throw error;
    const message =
      error instanceof Error ? error.message : "Unexpected error...";
    throw new AppError("UNKNOWN_ERROR", message);
  }
}
