import { useQuery } from "@tanstack/react-query";
import { queryRetry } from "@/shared/api";
import type { Geo, Units } from "@/shared/types";
import { fetchSearchResults } from "../../api/fetchSearchResults";

export function useSearchQuery(geoData: Geo, units: Units) {
  const cityIds = geoData.results.map((city) => city.id).join(",") || "";

  return useQuery({
    queryKey: [
      "search",
      cityIds,
      units.temperatureUnit,
      units.speedUnit,
      units.precipitationUnit,
    ],
    queryFn: async ({ signal }) => {
      return await fetchSearchResults(geoData, units, signal);
    },

    enabled: cityIds.length > 0,

    retry: (failureCount, error) => queryRetry(failureCount, error, 2),

    refetchOnWindowFocus: false,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
