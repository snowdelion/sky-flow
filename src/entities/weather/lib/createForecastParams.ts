import type { Units } from "@/shared/types";

export const createForecastParams = (
  lat: number,
  lon: number,
  units: Units,
) => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),

    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code",

    hourly: "temperature_2m,weather_code",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min",

    forecast_days: "8",
    timezone: "auto",
    temperature_unit: units.temperatureUnit,
    wind_speed_unit: units.speedUnit,
    precipitation_unit: units.precipitationUnit,
  });

  return params.toString();
};
