import { useQuery } from "@tanstack/react-query";
import { AppError } from "@/shared/api";
import { isFoundCity, type Units, type CityData } from "@/shared/types";
import { fetchForecastData } from "../../api/weather.api";

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
          "FORECAST_FAILED",
          "Cannot fetch weather! City coords not found...",
        );

      const timeoutSignal = AbortSignal.timeout(5000);
      const combinedSignal = AbortSignal.any([signal, timeoutSignal]);

      const data = await fetchForecastData(cityData, units, combinedSignal);
      return data;
    },

    enabled: isEnabled,

    retry: (failureCount) => failureCount < 3,

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

    refetchOnWindowFocus: false,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
