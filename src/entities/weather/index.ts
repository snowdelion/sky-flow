// --- api ---
export { useWeatherQuery } from "./model/useWeatherQuery";
export { useSearchQuery } from "./model/useSearchQuery";

// --- lib ---
export { getWeatherIcon } from "./model/icons";
export { calculateAverageTemps, groupByDay } from "./model/weather.utils";

// --- model ---
export type { HourlyItem, DailyForecast, format } from "./model/types";
export type { SearchResult, SearchResults } from "./model/search-results.types";
export type {
  WeatherDaily,
  WeatherHourly,
  WeatherCurrent,
  Weather,
  WeatherUnits,
} from "./model/weather.types";
