import { DEFAULT_UNITS } from "@/stores/useSettingsStore";
import type { CityData } from "@/types/api/CityData";
import type { WeatherData } from "@/types/api/WeatherData";
import { AppError } from "@/types/errors";
import type { Units } from "@/types/weather";

export async function fetchForecastData(
  cityData: CityData,
  units: Units = DEFAULT_UNITS,
  signal?: AbortSignal,
): Promise<WeatherData> {
  try {
    const { city, country, lat, lon } = cityData;
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
      throw new AppError(
        "FORECAST_FAILED",
        "Server is temporarily unavailable...",
      );
    }

    const forecastData = await forecastRes.json();

    return {
      current: {
        ...forecastData.current,
        city,
        country,
        latitude: lat,
        longitude: lon,
      },
      hourly: forecastData.hourly,
      daily: forecastData.daily,
      forecastUnits: {
        temperature: forecastData.current_units.apparent_temperature,
        speed: forecastData.current_units.wind_speed_10m,
        precipitation: forecastData.current_units.precipitation,
        time: "24",
      },
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    const message =
      error instanceof Error ? error.message : "Unexpected error...";
    throw new AppError("UNKNOWN_ERROR", message);
  }
}
