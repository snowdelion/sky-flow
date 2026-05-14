// --- api ---
export { useWeatherQuery } from "./model/queries/useWeatherQuery"
export { useSearchQuery } from "./model/queries/useSearchQuery"

// --- lib ---
export { calculateAverageTemps, groupByDay } from "./lib/weather.utils"

// --- model ---
export type { HourlyItem, DailyForecast, format } from "./model/types/types"
export type { SearchResult, SearchResults } from "./model/types/search-results.types"
export type {
  WeatherDaily,
  WeatherHourly,
  WeatherCurrent,
  Weather,
  WeatherUnits,
} from "./model/types/weather.types"

// --- ui ---
export { WeatherIcon } from "./ui/WeatherIcon"
