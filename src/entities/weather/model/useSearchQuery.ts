import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AppError } from "@/shared/api";
import type { Geo, Units } from "@/shared/types";
import { fetchSearchResults } from "../api/weather.api";
import type { SearchResults } from "./search-results.types";

export function useSearchQuery(
  geoData: Geo,
  units: Units,
): UseQueryResult<SearchResults, AppError> {
  return useQuery<SearchResults, AppError>({
    queryKey: [
      "search",
      geoData,
      units.temperatureUnit,
      units.speedUnit,
      units.precipitationUnit,
    ],
    queryFn: async ({ signal }) => {
      const timeoutSignal = AbortSignal.timeout(5000);
      const combinedSignal = AbortSignal.any([signal, timeoutSignal]);
      return await fetchSearchResults(geoData, units, combinedSignal);
    },

    enabled: !!geoData && !!geoData.results && geoData.results.length > 0,

    retry: (failureCount) => failureCount < 2,

    refetchOnWindowFocus: false,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
