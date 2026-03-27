import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { fetchSearchResults } from "@/components/Weather/Search/services/fetchSearchResults";
import type { SearchDataItem } from "@/components/Weather/Search/types/SearchData";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { AppError } from "@/types/errors";

export function useSearchQuery(
  searchResult: string,
): UseQueryResult<SearchDataItem[], AppError> {
  const units = useSettingsStore((state) => state.units);
  const queryValue = searchResult.trim().toLowerCase();

  return useQuery<SearchDataItem[], AppError>({
    queryKey: [
      "search",
      queryValue,
      units.temperature,
      units.speed,
      units.precipitation,
    ],
    queryFn: async ({ signal }) => {
      const timeoutSignal = AbortSignal.timeout(5000);
      const combinedSignal = AbortSignal.any([signal, timeoutSignal]);
      return await fetchSearchResults(queryValue, units, combinedSignal);
    },

    enabled: !!queryValue && queryValue.trim().length >= 2,

    retry: (failureCount) => failureCount < 2,

    refetchOnWindowFocus: false,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
