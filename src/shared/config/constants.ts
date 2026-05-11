import type { Units } from "../types/common.types";

export const API_CONFIG = {
  GEO_BASE_URL: "https://geocoding-api.open-meteo.com",
  FORECAST_BASE_URL: "https://api.open-meteo.com",
} as const;

export const STORAGE_KEYS = {
  RECENT: "weather-recent",
  FAVORITE: "weather-favorite",
  SEARCH: "weather-search",
  SETTINGS: "weather-settings",
} as const;

export const DEFAULT_UNITS: Units = {
  temperatureUnit: "celsius",
  speedUnit: "kmh",
  precipitationUnit: "mm",
  timeUnit: "12",
} as const;
