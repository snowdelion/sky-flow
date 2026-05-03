import { handleApiError, request } from "@/shared/api";
import { AppError } from "@/shared/api";
import { DEFAULT_UNITS } from "@/shared/config/constants";
import { API_CONFIG } from "@/shared/config/constants";
import {
  type GeoItem,
  type Geo,
  isFoundCity,
  type CityData,
} from "@/shared/types";
import type { Units } from "@/shared/types";
import { mapToForecastData, mapToResultsData } from "../model/mapper";
import { WeatherDtoSchema } from "./dto/forecast.dto";
import { SearchResultsDtoSchema } from "./dto/search.dto";

export async function fetchForecastData(
  cityData: CityData,
  units: Units = DEFAULT_UNITS,
  signal?: AbortSignal,
) {
  try {
    if (!isFoundCity(cityData))
      throw new AppError(
        "FORECAST_FAILED",
        "Cannot fetch weather! City coords not found...",
      );

    const { city, lat, lon } = cityData;

    if (!city || !lat || !lon)
      throw new AppError("FORECAST_FAILED", "Invalid city data");

    const url = createForecastUrl(lat, lon, units);
    const rawData = await request(url, { signal }, "FORECAST_FAILED");

    if (!rawData)
      throw new AppError(
        "FORECAST_FAILED",
        "No data received from weather API",
      );

    const result = WeatherDtoSchema.parse(rawData);
    return mapToForecastData(result, cityData);
  } catch (error) {
    handleApiError(error);
  }
}

const createForecastUrl = (lat: number, lon: number, units: Units) => {
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

  return `${API_CONFIG.FORECAST_BASE_URL}/v1/forecast?${params}`;
};

export const fetchSearchResults = async (
  geoData: Geo,
  units: Units = DEFAULT_UNITS,
  signal?: AbortSignal,
) => {
  try {
    const onlyLats = geoData.results.map((item: GeoItem) => item.lat).join(",");
    const onlyLons = geoData.results.map((item: GeoItem) => item.lon).join(",");

    const url = createSearchUrl(onlyLats, onlyLons, units.temperatureUnit);
    const rawData = await request(url, { signal }, "SEARCH_FAILED");

    if (!rawData)
      throw new AppError("SEARCH_FAILED", "No data received from weather API");

    const normalizeData = Array.isArray(rawData) ? rawData : [rawData];
    const data = SearchResultsDtoSchema.parse(normalizeData);
    return mapToResultsData(data, geoData);
  } catch (error) {
    handleApiError(error);
  }
};

const createSearchUrl = (lats: string, lons: string, temp: string) => {
  const params = new URLSearchParams({
    latitude: lats.toString(),
    longitude: lons.toString(),

    current: "temperature_2m,weather_code",

    temperature_unit: temp,
  });

  return `${API_CONFIG.FORECAST_BASE_URL}/v1/forecast?${params}`;
};
