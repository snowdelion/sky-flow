import { useQuery } from "@tanstack/react-query";
import { AppError, ERROR_CODES } from "@/shared/api";
import { queryRetry } from "@/shared/api";
import { isFoundCity, type Units, type CityData } from "@/shared/types";
import { fetchForecastData } from "../../api/fetchForecastData";

export function useWeatherQuery(cityData: CityData, units: Units) {
  const isEnabled = isFoundCity(cityData);

  return useQuery({
    queryKey: [
      "weather",
      isEnabled ? cityData.lat : "no-coords",
      isEnabled ? cityData.lon : "no-coords",
      units.temperatureUnit,
      units.speedUnit,
      units.precipitationUnit,
    ],

    queryFn: async ({ signal }) => {
      if (!isFoundCity(cityData))
        throw new AppError(
          ERROR_CODES.FORECAST,
          "Cannot fetch weather! City coords not found...",
        );

      return await fetchForecastData({ cityData, units, signal });
    },

    enabled: isEnabled,

    retry: (failureCount, error) => queryRetry(failureCount, error, 2),

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

    refetchOnWindowFocus: false,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
